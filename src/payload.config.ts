import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { en as baseEn } from "@payloadcms/translations/languages/en";
import { nl as baseNl } from "@payloadcms/translations/languages/nl";
import path from "path";
import {
    buildConfig,
    type ClientUser,
    type CollectionConfig,
    type GlobalConfig,
} from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { isCoachOnlyAdminUser } from "./access/isCoachOnlyAdminUser";
import { Documents } from "./collections/Documents";
import { EventRegistrations } from "./collections/EventRegistrations";
import { Events } from "./collections/Events";
import { Exercises } from "./collections/Exercises";
import { LessonEnrollments } from "./collections/LessonEnrollments";
import { LessonExerciseTracking } from "./collections/LessonExerciseTracking";
import { LessonTemplates } from "./collections/LessonTemplates";
import { Lessons } from "./collections/Lessons";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { ProgramEnrollments } from "./collections/ProgramEnrollments";
import { Programs } from "./collections/Programs";
import { Users } from "./collections/Users";
import { Footer } from "./components/Footer/config";
import { Header } from "./components/Header/config";
import { Organization } from "./components/Organization/config";
import { WhatsApp } from "./components/WhatsApp/config";
import { plugins } from "./plugins";
import { getServerSideURL } from "./utilities/getURL";

const nl = {
    ...baseNl,
    translations: {
        ...baseNl.translations,
        general: {
            ...baseNl.translations.general,
            lock: "Vergrendelen",
            unlock: "Ontgrendelen",
        },
    },
};

const en = {
    ...baseEn,
    translations: {
        ...baseEn.translations,
        general: {
            ...baseEn.translations.general,
            lock: "Lock",
            unlock: "Unlock",
        },
    },
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const r2PublicURL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
const r2ImagesPrefix = process.env.R2_IMAGES_PREFIX || "images/";
const r2DocumentsPrefix = process.env.R2_DOCUMENTS_PREFIX || "documents/";
const r2Prefix = (prefix: string | undefined, filename: string) =>
    [prefix?.replace(/^\/+|\/+$/g, ""), filename].filter(Boolean).join("/");

const r2StoragePlugin = s3Storage({
    enabled: Boolean(
        process.env.R2_BUCKET &&
        process.env.R2_ENDPOINT &&
        r2PublicURL &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY,
    ),
    bucket: process.env.R2_BUCKET || "",
    config: {
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
    },
    collections: {
        media: {
            prefix: r2ImagesPrefix,
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) =>
                `${r2PublicURL}/${r2Prefix(prefix, filename)}`,
        },
        documents: {
            prefix: r2DocumentsPrefix,
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) =>
                `${r2PublicURL}/${r2Prefix(prefix, filename)}`,
        },
    },
});

const resendApiKey = process.env.RESEND_API_KEY;
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS;
const emailFromName = process.env.EMAIL_FROM_NAME;

const emailAdapter =
    resendApiKey && emailFromAddress && emailFromName
        ? resendAdapter({
              apiKey: resendApiKey,
              defaultFromAddress: emailFromAddress,
              defaultFromName: emailFromName,
          })
        : undefined;

const coachAccessibleCollections = new Set([
    "lessons",
    "exercises",
    "events",
    "programs",
]);

const withCoachCollectionVisibility = <T extends CollectionConfig>(
    collection: T,
): T => {
    const existingHidden = collection.admin?.hidden;

    return {
        ...collection,
        admin: {
            ...collection.admin,
            hidden: ({ user }: { user: ClientUser }) => {
                const alreadyHidden =
                    typeof existingHidden === "function"
                        ? existingHidden({ user })
                        : existingHidden;

                return (
                    Boolean(alreadyHidden) ||
                    (isCoachOnlyAdminUser(user) &&
                        !coachAccessibleCollections.has(collection.slug))
                );
            },
        },
    } as T;
};

const withCoachGlobalVisibility = <T extends GlobalConfig>(global: T): T => {
    return {
        ...global,
        admin: {
            ...global.admin,
            hidden: ({ user }: { user: ClientUser }) =>
                isCoachOnlyAdminUser(user),
        },
    } as T;
};

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        livePreview: {
            breakpoints: [
                {
                    label: "Mobile",
                    name: "mobile",
                    width: 375,
                    height: 667,
                },
                {
                    label: "Tablet",
                    name: "tablet",
                    width: 768,
                    height: 1024,
                },
                {
                    label: "Desktop",
                    name: "desktop",
                    width: 1440,
                    height: 900,
                },
            ],
        },
        components: {
            graphics: {
                Logo: "./components/Logo/Logo",
            },
        },
    },
    email: emailAdapter,
    collections: [
        withCoachCollectionVisibility(Users),
        withCoachCollectionVisibility(Media),
        withCoachCollectionVisibility(Documents),
        withCoachCollectionVisibility(Pages),
        withCoachCollectionVisibility(Posts),
        withCoachCollectionVisibility(Lessons),
        withCoachCollectionVisibility(LessonTemplates),
        withCoachCollectionVisibility(Events),
        withCoachCollectionVisibility(Exercises),
        withCoachCollectionVisibility(Programs),
        withCoachCollectionVisibility(LessonEnrollments),
        withCoachCollectionVisibility(LessonExerciseTracking),
        withCoachCollectionVisibility(ProgramEnrollments),
        withCoachCollectionVisibility(EventRegistrations),
    ],
    globals: [
        withCoachGlobalVisibility(Header),
        withCoachGlobalVisibility(Footer),
        withCoachGlobalVisibility(WhatsApp),
        withCoachGlobalVisibility(Organization),
    ],
    cors: [getServerSideURL()].filter(Boolean),
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "ignore",
    sharp,
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter({
        allowIDOnCreate: true,
        pool: {
            connectionString: process.env.DATABASE_URL,
        },
        migrationDir: path.resolve(dirname, "migrations-postgres"),
    }),
    plugins: [...plugins, r2StoragePlugin],
    i18n: {
        supportedLanguages: { nl, en },
        fallbackLanguage: "en",
    },
    upload: {
        limits: {
            fileSize: 5000000, // 5mb
        },
    },
});
