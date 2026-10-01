import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { postgresAdapter, sql } from "@payloadcms/db-postgres";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import {
    mkdir,
    mkdtemp,
    open,
    readFile,
    rename,
    rm,
    writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { CollectionConfig, Field, Payload } from "payload";

const { loadEnvConfig } = createRequire(import.meta.url)(
    "@next/env",
) as typeof import("@next/env");
loadEnvConfig(process.cwd());

type Document = Record<string, unknown> & {
    id: number | string;
    email?: string;
    _status?: string;
    url?: string;
    filename?: string;
    mimeType?: string;
};

type StateRecord = {
    hash: string;
    createdUser?: boolean;
    userEmail?: string;
    passwordResetSent?: boolean;
    passwordExported?: boolean;
    passwordExportPath?: string;
    relationshipsFinalized?: boolean;
};

type ImportState = {
    version: 1;
    source: string;
    records: Record<string, StateRecord>;
};

type ImportItem = {
    collection: CollectionConfig;
    doc: Document;
    hash: string;
    key: string;
    deferredRelationships: boolean;
    stateRecord?: StateRecord;
};

type RelationshipField = Extract<Field, { type: "relationship" | "upload" }>;

let r2Client: S3Client | undefined;

const statePath = path.resolve(
    process.env.PAYLOAD_IMPORT_STATE || ".cache/d1-payload-import-state.json",
);
const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const payloadSystemCollectionSlugs = new Set([
    "payload-locked-documents",
    "payload-migrations",
    "payload-preferences",
    "payload-query-presets",
]);
const passwordFileIndex = process.argv.indexOf("--password-file");
const passwordFileArg =
    passwordFileIndex >= 0 ? process.argv[passwordFileIndex + 1] : undefined;
const passwordFilePath =
    passwordFileArg && !passwordFileArg.startsWith("--")
        ? path.resolve(".cache", path.basename(passwordFileArg))
        : undefined;
const sourceIdentity = "wrangler:D1:production";
const sourceSQLIndex = process.argv.indexOf("--source-sql");
const sourceSQLPath =
    sourceSQLIndex >= 0 && process.argv[sourceSQLIndex + 1]
        ? path.resolve(process.argv[sourceSQLIndex + 1])
        : undefined;

const ignoredHashKeys = new Set([
    "createdAt",
    "hash",
    "loginAttempts",
    "lockUntil",
    "password",
    "resetPasswordExpiration",
    "resetPasswordToken",
    "salt",
    "sessions",
    "updatedAt",
]);

function printHelp() {
    console.info(`
Import current documents from the production D1 database into this Postgres database.

Required environment:
  DATABASE_URL          Postgres connection for the destination

The source is exported by Wrangler from the configured D1 binding "D1" using
the production environment. Wrangler must be authenticated for the target account.

Options:
--apply                    Write changes (default is a dry run)
--password-file PATH       Export passwords for new accounts and accounts awaiting reset
--source-sql PATH          Read an existing Wrangler SQL export instead of exporting

Optional environment:
  PAYLOAD_IMPORT_STATE       Checkpoint path (default: .cache/d1-payload-import-state.json)
`);
}

function canonicalJSON(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map(canonicalJSON).join(",")}]`;
    }

    if (value && typeof value === "object") {
        const entries = Object.entries(value)
            .filter(([key]) => !ignoredHashKeys.has(key))
            .sort(([left], [right]) => left.localeCompare(right));
        return `{${entries
            .map(
                ([key, item]) =>
                    `${JSON.stringify(key)}:${canonicalJSON(item)}`,
            )
            .join(",")}}`;
    }

    return JSON.stringify(value) ?? "null";
}

function contentHash(doc: Document): string {
    return createHash("sha256").update(canonicalJSON(doc)).digest("hex");
}

function stateKey(kind: "collection" | "global", slug: string, id: unknown) {
    return `${kind}:${slug}:${id ?? "singleton"}`;
}

function visitFields(fields: Field[], visitor: (field: Field) => void) {
    for (const field of fields) {
        visitor(field);

        if (field.type === "tabs") {
            for (const tab of field.tabs) visitFields(tab.fields, visitor);
        } else if (field.type === "blocks") {
            for (const block of field.blocks)
                visitFields(block.fields, visitor);
        } else if ("fields" in field && Array.isArray(field.fields)) {
            visitFields(field.fields, visitor);
        }
    }
}

function collectionImportOrder(
    collections: CollectionConfig[],
): CollectionConfig[] {
    const bySlug = new Map(
        collections.map((collection) => [collection.slug, collection]),
    );
    const dependencies = new Map<string, Set<string>>();

    for (const collection of collections) {
        const required = new Set<string>();
        visitFields(collection.fields, (field) => {
            if (
                (field.type === "relationship" || field.type === "upload") &&
                field.required
            ) {
                const targets = Array.isArray(field.relationTo)
                    ? field.relationTo
                    : [field.relationTo];
                for (const target of targets) {
                    if (target !== collection.slug && bySlug.has(target)) {
                        required.add(target);
                    }
                }
            }
        });
        dependencies.set(collection.slug, required);
    }

    const sorted: CollectionConfig[] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();

    function visit(slug: string) {
        if (visited.has(slug)) return;
        if (visiting.has(slug)) {
            throw new Error(
                `Required relationship cycle in Payload collections at "${slug}".`,
            );
        }

        visiting.add(slug);
        for (const dependency of dependencies.get(slug) ?? [])
            visit(dependency);
        visiting.delete(slug);
        visited.add(slug);
        sorted.push(bySlug.get(slug)!);
    }

    if (bySlug.has("forms")) visit("forms");
    for (const collection of collections) visit(collection.slug);
    return sorted;
}

function relationReferencesPending(
    field: RelationshipField,
    value: unknown,
    pending: Map<string, Set<string>>,
): boolean {
    if (Array.isArray(value)) {
        return value.some((item) =>
            relationReferencesPending(field, item, pending),
        );
    }
    if (value === null || value === undefined) return false;

    const isPolymorphic = Array.isArray(field.relationTo);
    const relation = value as Record<string, unknown>;
    const target = isPolymorphic
        ? String(relation.relationTo ?? "")
        : String(field.relationTo);
    const relatedValue = isPolymorphic ? relation.value : value;
    const relatedID =
        relatedValue && typeof relatedValue === "object"
            ? (relatedValue as Record<string, unknown>).id
            : relatedValue;

    return pending.get(target)?.has(String(relatedID)) ?? false;
}

function deferPendingInternalLinks(
    data: Document,
    pending: Map<string, Set<string>>,
): boolean {
    let deferred = false;

    function walk(value: unknown) {
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; ) {
                const node = value[index];
                if (!node || typeof node !== "object") {
                    index += 1;
                    continue;
                }

                const lexicalNode = node as Record<string, unknown>;
                const fields = lexicalNode.fields as
                    | Record<string, unknown>
                    | undefined;
                const linkedDoc = fields?.doc as
                    | Record<string, unknown>
                    | undefined;
                const linkedValue = linkedDoc?.value;
                const linkedID =
                    linkedValue && typeof linkedValue === "object"
                        ? (linkedValue as Record<string, unknown>).id
                        : linkedValue;
                const target = String(linkedDoc?.relationTo ?? "");
                const hasPendingTarget =
                    lexicalNode.type === "link" &&
                    fields?.linkType === "internal" &&
                    linkedID !== undefined &&
                    linkedID !== null &&
                    (pending.get(target)?.has(String(linkedID)) ?? false);

                if (hasPendingTarget) {
                    const children = Array.isArray(lexicalNode.children)
                        ? lexicalNode.children
                        : [];
                    value.splice(index, 1, ...children);
                    deferred = true;
                    walk(children);
                    index += children.length;
                } else {
                    walk(node);
                    index += 1;
                }
            }
            return;
        }

        if (!value || typeof value !== "object") return;
        for (const [key, child] of Object.entries(value)) {
            if (key !== "text") walk(child);
        }
    }

    walk(data);
    return deferred;
}

function hasRequiredRelationshipField(fields: Field[]): boolean {
    for (const field of fields) {
        if (field.type === "tabs") {
            for (const tab of field.tabs) {
                if (hasRequiredRelationshipField(tab.fields)) return true;
            }
            continue;
        }

        if (
            (field.type === "relationship" || field.type === "upload") &&
            field.required
        ) {
            return true;
        }

        if (field.type === "blocks") {
            if (
                field.blocks.some((block) =>
                    hasRequiredRelationshipField(block.fields),
                )
            ) {
                return true;
            }
        } else if ("fields" in field && Array.isArray(field.fields)) {
            if (hasRequiredRelationshipField(field.fields)) return true;
        }
    }

    return false;
}

function deferPendingOptionalRelationships(
    input: Document,
    fields: Field[],
    pending: Map<string, Set<string>>,
): { data: Document; deferred: boolean } {
    const data = structuredClone(input);
    let deferred = false;

    function walk(target: Record<string, unknown>, nestedFields: Field[]) {
        for (const field of nestedFields) {
            if (field.type === "tabs") {
                for (const tab of field.tabs) {
                    if ("name" in tab && tab.name) {
                        const tabValue = target[tab.name];
                        if (tabValue && typeof tabValue === "object") {
                            walk(
                                tabValue as Record<string, unknown>,
                                tab.fields,
                            );
                        }
                    } else {
                        walk(target, tab.fields);
                    }
                }
                continue;
            }

            if (!("name" in field) || typeof field.name !== "string") continue;
            const value = target[field.name];

            if (
                field.type === "group" &&
                !field.required &&
                value &&
                typeof value === "object" &&
                "fields" in field &&
                hasRequiredRelationshipField(field.fields)
            ) {
                delete target[field.name];
                deferred = true;
                continue;
            }

            if (field.type === "relationship" || field.type === "upload") {
                if (
                    !field.required &&
                    relationReferencesPending(field, value, pending)
                ) {
                    delete target[field.name];
                    deferred = true;
                }
                continue;
            }

            if (
                field.type === "array" &&
                Array.isArray(value) &&
                "fields" in field
            ) {
                for (const item of value) {
                    if (item && typeof item === "object") {
                        walk(item as Record<string, unknown>, field.fields);
                    }
                }
            } else if (
                field.type === "blocks" &&
                Array.isArray(value) &&
                "blocks" in field
            ) {
                const blocks = new Map(
                    field.blocks.map((block) => [block.slug, block]),
                );
                for (const item of value) {
                    if (!item || typeof item !== "object") continue;
                    const block = blocks.get(
                        String((item as Record<string, unknown>).blockType),
                    );
                    if (block)
                        walk(item as Record<string, unknown>, block.fields);
                }
            } else if (
                "fields" in field &&
                Array.isArray(field.fields) &&
                value &&
                typeof value === "object"
            ) {
                walk(value as Record<string, unknown>, field.fields);
            }
        }
    }

    walk(data, fields);
    deferred = deferPendingInternalLinks(data, pending) || deferred;
    return { data, deferred };
}

async function saveState(state: ImportState) {
    await mkdir(path.dirname(statePath), { recursive: true });
    const temporaryPath = `${statePath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {
        mode: 0o600,
    });
    await rename(temporaryPath, statePath);
}

async function readState(): Promise<ImportState> {
    try {
        const parsed = JSON.parse(
            await readFile(statePath, "utf8"),
        ) as ImportState;
        if (parsed.version !== 1 || !parsed.records) {
            throw new Error(`Unsupported import state file: ${statePath}`);
        }
        if (parsed.source !== sourceIdentity) {
            throw new Error(
                `Import state belongs to a different source: ${parsed.source}`,
            );
        }
        return parsed;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return { version: 1, source: sourceIdentity, records: {} };
        }
        throw error;
    }
}

async function fetchCollection(
    payload: Payload,
    slug: string,
): Promise<Document[]> {
    const documents: Document[] = [];
    let page = 1;

    while (true) {
        const result = await payload.find({
            collection: slug as never,
            depth: 0,
            draft: true,
            limit: 100,
            overrideAccess: true,
            page,
            sort: "id",
        } as never);
        documents.push(...((result.docs ?? []) as unknown as Document[]));
        if (!result.hasNextPage) break;
        page += 1;
    }

    return documents;
}

async function fetchGlobal(payload: Payload, slug: string): Promise<Document> {
    return (await payload.findGlobal({
        slug: slug as never,
        depth: 0,
        draft: true,
        overrideAccess: true,
    } as never)) as unknown as Document;
}

function cleanDocument(doc: Document, isUser: boolean): Document {
    const data = structuredClone(doc);
    delete data.createdAt;
    delete data.updatedAt;
    delete data.hash;
    delete data.loginAttempts;
    delete data.lockUntil;
    delete data.password;
    delete data.resetPasswordExpiration;
    delete data.resetPasswordToken;
    delete data.salt;
    delete data.sessions;

    if (isUser) delete data.emailVerified;
    return data;
}

async function getUploadFile(
    doc: Document,
): Promise<{ data: Buffer; name: string; mimetype: string; size: number }> {
    if (!doc.filename) {
        throw new Error(`Upload ${doc.id} has no filename.`);
    }

    const bucket = process.env.R2_BUCKET;
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error(
            "R2_BUCKET, R2_ENDPOINT, and R2 credentials are required to transfer uploads.",
        );
    }

    let sourceObjectKey =
        typeof doc._objectkey === "string"
            ? doc._objectkey.replace(/^\/+/, "")
            : "";
    if (!sourceObjectKey) {
        if (!doc.url)
            throw new Error(
                `Upload ${doc.id} has no source object key or URL.`,
            );
        const publicStorageURL = process.env.R2_PUBLIC_URL;
        if (!publicStorageURL) {
            throw new Error(
                "R2_PUBLIC_URL is needed to resolve relative upload URLs.",
            );
        }
        const sourceURL = new URL(
            doc.url,
            `${publicStorageURL.replace(/\/$/, "")}/`,
        );
        sourceObjectKey = decodeURIComponent(sourceURL.pathname).replace(
            /^\/+/,
            "",
        );
    }

    r2Client ??= new S3Client({
        credentials: { accessKeyId, secretAccessKey },
        endpoint,
        forcePathStyle: true,
        region: "auto",
    });
    const response = await r2Client.send(
        new GetObjectCommand({ Bucket: bucket, Key: sourceObjectKey }),
    );
    if (!response.Body) {
        throw new Error(
            `R2 returned an empty object body for upload ${doc.id}.`,
        );
    }

    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(Buffer.from(chunk));
    }
    const data = Buffer.concat(chunks);
    return {
        data,
        name: path.basename(doc.filename),
        mimetype:
            doc.mimeType || response.ContentType || "application/octet-stream",
        size: data.byteLength,
    };
}

class LocalD1Statement {
    private params: unknown[] = [];

    constructor(
        private readonly statement: ReturnType<DatabaseSync["prepare"]>,
    ) {}

    bind(...params: unknown[]) {
        this.params = params;
        return this;
    }

    async all() {
        return {
            success: true,
            results: this.statement.all(...(this.params as never[])),
        };
    }

    async first(columnName?: string) {
        const row = this.statement.get(...(this.params as never[])) as
            | Record<string, unknown>
            | undefined;
        return columnName && row ? row[columnName] : (row ?? null);
    }

    async raw() {
        const columns = this.statement.columns().map(({ name }) => name);
        return this.statement
            .all(...(this.params as never[]))
            .map((row) => columns.map((column) => row[column]));
    }

    async run() {
        const result = this.statement.run(...(this.params as never[]));
        const changes = Number(result.changes);
        return {
            success: true,
            meta: {
                changes,
                last_row_id: Number(result.lastInsertRowid),
                rows_read: 0,
                rows_written: changes,
            },
        };
    }
}

function createLocalD1Binding(database: DatabaseSync) {
    return {
        prepare(query: string) {
            return new LocalD1Statement(database.prepare(query));
        },
        async batch(statements: LocalD1Statement[]) {
            return Promise.all(statements.map((statement) => statement.all()));
        },
    };
}

function exportWithWrangler(outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.info("Exporting production D1 data with Wrangler...");
        const child = spawn(
            "pnpm",
            [
                "exec",
                "wrangler",
                "d1",
                "export",
                "D1",
                "--remote",
                "--env",
                "production",
                "--output",
                outputPath,
                "--skip-confirmation",
            ],
            { cwd: process.cwd(), stdio: "ignore" },
        );
        child.once("error", reject);
        child.once("exit", (code) => {
            if (code === 0) resolve();
            else
                reject(
                    new Error(
                        `Wrangler D1 export failed (exit ${code ?? "unknown"}).`,
                    ),
                );
        });
    });
}

// Prod D1 may lag behind the current schema; add the missing tables/columns (empty) so Payload's queries run.
function addMissingSourceSchema(database: DatabaseSync, payload: Payload) {
    const schemaTables = (
        payload.db as unknown as {
            tables: Record<
                string,
                Record<string, { name?: string; getSQLType?: () => string }>
            >;
        }
    ).tables;
    const quote = (identifier: string) =>
        `"${identifier.replaceAll('"', '""')}"`;

    for (const [tableName, table] of Object.entries(schemaTables)) {
        const columns = Object.values(table).filter(
            (column): column is { name: string; getSQLType: () => string } =>
                typeof column?.name === "string" &&
                typeof column.getSQLType === "function",
        );
        if (columns.length === 0) continue;

        const existing = new Set(
            database
                .prepare(`PRAGMA table_info(${quote(tableName)})`)
                .all()
                .map((row) => String(row.name)),
        );

        if (existing.size === 0) {
            database.exec(
                `CREATE TABLE ${quote(tableName)} (${columns
                    .map((c) => `${quote(c.name)} ${c.getSQLType()}`)
                    .join(", ")})`,
            );
            console.info(
                `Source is missing table ${tableName}; created empty.`,
            );
            continue;
        }

        for (const column of columns) {
            if (existing.has(column.name)) continue;
            database.exec(
                `ALTER TABLE ${quote(tableName)} ADD COLUMN ${quote(column.name)} ${column.getSQLType()}`,
            );
            console.info(
                `Source table ${tableName} is missing column ${column.name}; added as empty.`,
            );
        }
    }
}

async function openSourcePayload(config: unknown) {
    const temporaryDirectory = sourceSQLPath
        ? undefined
        : await mkdtemp(path.join(tmpdir(), "sportlab-d1-export-"));
    const dumpPath =
        sourceSQLPath || path.join(temporaryDirectory!, "source.sql");
    let database: DatabaseSync | undefined;
    let payload: Payload | undefined;

    try {
        if (!sourceSQLPath) await exportWithWrangler(dumpPath);

        database = new DatabaseSync(":memory:");
        database.exec("PRAGMA foreign_keys=OFF;");
        const dump = await readFile(dumpPath, "utf8");
        database.exec(
            dump
                .split("\n")
                .filter((line) => !line.includes("sqlite_sequence"))
                .join("\n"),
        );
        const tables = new Set(
            database
                .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
                .all()
                .map((row) => String(row.name)),
        );

        const { getPayload } = await import("payload");
        const sourceConfig = {
            ...(config as Record<string, unknown>),
            db: sqliteD1Adapter({
                binding: createLocalD1Binding(database) as never,
                allowIDOnCreate: true,
                push: false,
            }),
        };
        payload = await getPayload({
            config: sourceConfig as never,
            key: "sportlab-d1-import-source",
        });
        addMissingSourceSchema(database, payload);

        return {
            payload,
            tables,
            async close() {
                await payload?.destroy();
                database?.close();
                if (temporaryDirectory) {
                    await rm(temporaryDirectory, {
                        recursive: true,
                        force: true,
                    });
                }
            },
        };
    } catch (error) {
        if (payload) await payload.destroy();
        database?.close();
        if (temporaryDirectory) {
            await rm(temporaryDirectory, { recursive: true, force: true });
        }
        throw error;
    }
}

function collectionHasDrafts(collection: CollectionConfig): boolean {
    return Boolean(
        collection.versions &&
        typeof collection.versions !== "boolean" &&
        collection.versions.drafts,
    );
}

function draftOption(
    collection: CollectionConfig,
    doc: Document,
    stageDraft = false,
) {
    if (!collectionHasDrafts(collection)) return {};
    return { draft: stageDraft || doc._status === "draft" };
}

function collectionTableName(collection: CollectionConfig): string {
    const configuredName = collection.dbName;
    if (typeof configuredName === "function") {
        return configuredName({ tableName: collection.slug });
    }
    return configuredName || collection.slug.replaceAll("-", "_");
}

function globalTableName(slug: string): string {
    return slug
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replaceAll("-", "_")
        .toLowerCase();
}

async function findDestinationDoc(
    payload: Payload,
    slug: string,
    id: Document["id"],
): Promise<boolean> {
    const result = await payload.find({
        collection: slug as never,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { id: { equals: id } },
    } as never);
    return result.docs.length > 0;
}

async function resetCollectionSequences(
    payload: Payload,
    collections: CollectionConfig[],
) {
    for (const collection of collections) {
        const table = collectionTableName(collection);
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
            throw new Error(`Unsafe Payload table name "${table}".`);
        }
        const tableIdentifier = sql.raw(`"public"."${table}"`);
        await payload.db.drizzle.execute(sql`
            SELECT setval(
                pg_get_serial_sequence(${`public.${table}`}, 'id'),
                COALESCE(MAX(id), 1),
                MAX(id) IS NOT NULL
            )
            FROM ${tableIdentifier}
        `);
    }
}

async function main() {
    if (args.has("--help")) {
        printHelp();
        return;
    }

    if (args.has("--send-password-resets")) {
        throw new Error(
            "--send-password-resets is no longer supported. Use --password-file PATH instead.",
        );
    }
    if (sourceSQLIndex >= 0 && !sourceSQLPath) {
        throw new Error("Provide a file path after --source-sql.");
    }
    if (passwordFileIndex >= 0 && !passwordFilePath) {
        throw new Error("Provide a file path after --password-file.");
    }
    if (passwordFilePath && !apply) {
        throw new Error(
            "--password-file can only be used together with --apply.",
        );
    }
    if (passwordFilePath === statePath) {
        throw new Error(
            "The password file must not overwrite the import checkpoint.",
        );
    }
    if (apply && !process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is required when running with --apply.");
    }

    const { default: configPromise } = await import("../src/payload.config");
    const config = await configPromise;
    const state = await readState();
    const collectionOrder = collectionImportOrder(
        config.collections.filter(
            (collection) => !payloadSystemCollectionSlugs.has(collection.slug),
        ),
    );
    const globals = config.globals;
    const sourceCollections = new Map<string, Document[]>();
    const missingCollections: string[] = [];
    const sourceGlobals = new Map<string, Document>();
    const source = await openSourcePayload(config);

    try {
        for (const collection of collectionOrder) {
            if (!source.tables.has(collectionTableName(collection))) {
                missingCollections.push(collection.slug);
                continue;
            }
            const docs = await fetchCollection(source.payload, collection.slug);
            sourceCollections.set(collection.slug, docs);
        }

        for (const global of globals) {
            if (!source.tables.has(globalTableName(global.slug))) continue;
            sourceGlobals.set(
                global.slug,
                await fetchGlobal(source.payload, global.slug),
            );
        }
    } finally {
        await source.close();
    }

    const changed: ImportItem[] = [];
    for (const collection of collectionOrder) {
        for (const doc of sourceCollections.get(collection.slug) ?? []) {
            const hash = contentHash(doc);
            const key = stateKey("collection", collection.slug, doc.id);
            const record = state.records[key];
            const awaitingPasswordExport =
                passwordFilePath !== undefined &&
                collection.slug === "users" &&
                record?.createdUser &&
                !record.passwordResetSent &&
                (!record.passwordExported || !record.passwordExportPath);
            const awaitingRelationshipFinalization =
                (collectionHasDrafts(collection) ||
                    collection.slug === "users") &&
                record?.relationshipsFinalized !== true;
            if (
                record?.hash === hash &&
                !awaitingPasswordExport &&
                !awaitingRelationshipFinalization
            ) {
                continue;
            }
            changed.push({
                collection,
                doc,
                hash,
                key,
                deferredRelationships: false,
            });
        }
    }

    const changedGlobals = [...sourceGlobals.entries()].filter(
        ([slug, doc]) => {
            const key = stateKey("global", slug, undefined);
            return state.records[key]?.hash !== contentHash(doc);
        },
    );

    const passwordPending = Object.values(state.records).filter(
        (record) =>
            record.createdUser &&
            !record.passwordResetSent &&
            (!record.passwordExported || !record.passwordExportPath),
    );

    console.info(apply ? "Apply mode" : "Dry run");
    console.info(`Changed or new collection records: ${changed.length}`);
    console.info(`Changed globals: ${changedGlobals.length}`);
    if (missingCollections.length) {
        console.info(`Not present on source: ${missingCollections.join(", ")}`);
    }
    if (!passwordFilePath && passwordPending.length) {
        console.info(
            `User accounts awaiting password export: ${passwordPending.length} (rerun with --password-file PATH --apply).`,
        );
    }
    if (!apply) {
        console.info(
            "No destination writes performed. Pass --apply to import.",
        );
        return;
    }
    if (changed.length === 0 && changedGlobals.length === 0) {
        console.info("No changes to import.");
        return;
    }

    const { getPayload } = await import("payload");
    const destinationConfig = {
        ...config,
        db: postgresAdapter({
            allowIDOnCreate: true,
            disableCreateDatabase: true,
            migrationDir: path.resolve(
                process.cwd(),
                "src/migrations-postgres",
            ),
            pool: { connectionString: process.env.DATABASE_URL },
            push: false,
        }),
    };
    const payload = await getPayload({
        config: destinationConfig as never,
        key: "sportlab-d1-import-destination",
    });
    let passwordFile: Awaited<ReturnType<typeof open>> | undefined;
    let passwordsExported = 0;
    let created = 0;
    let updated = 0;

    try {
        if (passwordFilePath) {
            await mkdir(path.dirname(passwordFilePath), {
                recursive: true,
                mode: 0o700,
            });
            passwordFile = await open(passwordFilePath, "w", 0o600);
        }

        const pending = new Map<string, Set<string>>();
        for (const item of changed) {
            const ids = pending.get(item.collection.slug) ?? new Set<string>();
            ids.add(String(item.doc.id));
            pending.set(item.collection.slug, ids);
        }

        for (const item of changed) {
            const { collection, doc, hash, key } = item;
            const deferred = deferPendingOptionalRelationships(
                cleanDocument(doc, collection.slug === "users"),
                collection.fields,
                pending,
            );
            const hasDrafts = collectionHasDrafts(collection);
            item.deferredRelationships =
                deferred.deferred || hasDrafts || collection.slug === "users";

            const exists = await findDestinationDoc(
                payload,
                collection.slug,
                doc.id,
            );
            const data = deferred.data;
            if (!exists) data.id = doc.id;
            if (hasDrafts) data._status = "draft";
            let generatedPassword: string | undefined;
            const shouldExportPassword =
                collection.slug === "users" &&
                (!exists ||
                    (passwordFilePath !== undefined &&
                        state.records[key]?.createdUser &&
                        !state.records[key]?.passwordResetSent &&
                        (!state.records[key]?.passwordExported ||
                            !state.records[key]?.passwordExportPath)));
            if (shouldExportPassword) {
                generatedPassword = randomBytes(32).toString("base64url");
                data.password = generatedPassword;
            }

            try {
                if (generatedPassword && passwordFile) {
                    await passwordFile.writeFile(
                        `${JSON.stringify({
                            userId: doc.id,
                            email: doc.email,
                            password: generatedPassword,
                        })}\n`,
                    );
                    await passwordFile.sync();
                    passwordsExported += 1;
                }

                const file =
                    collection.upload && !exists
                        ? await getUploadFile(doc)
                        : undefined;

                if (exists) {
                    await payload.update({
                        collection: collection.slug as never,
                        id: doc.id as never,
                        data: data as never,
                        depth: 0,
                        overrideAccess: true,
                        context: {
                            skipImportSideEffects: true,
                            disableRevalidate: true,
                        },
                        ...draftOption(collection, doc, true),
                        ...(collection.upload && (doc.url || doc.filename)
                            ? {
                                  file: await getUploadFile(doc),
                                  overwriteExistingFiles: true,
                              }
                            : {}),
                    } as never);
                    updated += 1;
                } else {
                    await payload.create({
                        collection: collection.slug as never,
                        data: data as never,
                        depth: 0,
                        overrideAccess: true,
                        context: {
                            skipImportSideEffects: true,
                            disableRevalidate: true,
                        },
                        ...draftOption(collection, doc, true),
                        ...(file ? { file } : {}),
                    } as never);
                    created += 1;
                }
            } catch (error) {
                const operation = exists ? "update" : "create";
                const message =
                    error instanceof Error ? error.message : String(error);
                throw new Error(
                    `Failed to ${operation} ${collection.slug} record ${doc.id}: ${message}`,
                    { cause: error },
                );
            }

            const ids = pending.get(collection.slug);
            ids?.delete(String(doc.id));
            if (ids?.size === 0) pending.delete(collection.slug);

            const prior = state.records[key];
            const importedRecord: StateRecord = {
                hash,
                ...(prior?.createdUser ||
                (collection.slug === "users" && !exists)
                    ? {
                          createdUser: true,
                          userEmail: prior?.userEmail ?? doc.email,
                          passwordResetSent: prior?.passwordResetSent ?? false,
                          passwordExported:
                              prior?.passwordExported ||
                              Boolean(generatedPassword && passwordFile),
                          ...(generatedPassword &&
                          passwordFile &&
                          passwordFilePath
                              ? { passwordExportPath: passwordFilePath }
                              : prior?.passwordExportPath
                                ? {
                                      passwordExportPath:
                                          prior.passwordExportPath,
                                  }
                                : {}),
                      }
                    : {}),
            };
            if (item.deferredRelationships) {
                item.stateRecord = importedRecord;
            } else {
                state.records[key] = {
                    ...importedRecord,
                    relationshipsFinalized: true,
                };
                await saveState(state);
            }
        }

        for (const item of changed.filter(
            (candidate) => candidate.deferredRelationships,
        )) {
            await payload.update({
                collection: item.collection.slug as never,
                id: item.doc.id as never,
                data: cleanDocument(
                    item.doc,
                    item.collection.slug === "users",
                ) as never,
                depth: 0,
                overrideAccess: true,
                context: {
                    skipImportSideEffects: true,
                    disableRevalidate: true,
                },
                ...draftOption(item.collection, item.doc),
            } as never);
            if (!item.stateRecord) {
                throw new Error(
                    `Missing deferred checkpoint data for ${item.collection.slug} record ${item.doc.id}.`,
                );
            }
            state.records[item.key] = {
                ...item.stateRecord,
                relationshipsFinalized: true,
            };
            await saveState(state);
        }

        for (const [slug, doc] of changedGlobals) {
            await payload.updateGlobal({
                slug: slug as never,
                data: cleanDocument(doc, false) as never,
                depth: 0,
                overrideAccess: true,
                context: {
                    skipImportSideEffects: true,
                    disableRevalidate: true,
                },
            } as never);
            state.records[stateKey("global", slug, undefined)] = {
                hash: contentHash(doc),
            };
            await saveState(state);
        }

        if (created || updated) {
            await resetCollectionSequences(payload, collectionOrder);
        }

        console.info(
            `Import complete: ${created} created, ${updated} updated.`,
        );
        if (passwordFilePath) {
            console.info(
                `Password export file: ${passwordFilePath} (${passwordsExported} user passwords).`,
            );
        }
    } finally {
        try {
            await passwordFile?.close();
        } finally {
            await payload.destroy();
        }
    }
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await r2Client?.destroy();
        process.exit(process.exitCode ?? 0);
    });
