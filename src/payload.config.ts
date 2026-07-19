import {
    CloudflareContext,
    getCloudflareContext,
} from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import { nl as baseNl } from "@payloadcms/translations/languages/nl";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { GetPlatformProxyOptions } from "wrangler";
import { Documents } from "./collections/Documents";
import { EventRegistrations } from "./collections/EventRegistrations";
import { Events } from "./collections/Events";
import { Exercises } from "./collections/Exercises";
import { LessonEnrollments } from "./collections/LessonEnrollments";
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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const isPreviewBuild = process.env.CLOUDFLARE_ENV === "preview";

const cloudflare =
    process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
    isPreviewBuild ||
    isDevelopment
        ? await getCloudflareContextFromWrangler()
        : await getCloudflareContext({ async: true });

const r2ProductionStorage = () =>
    r2Storage({
        bucket: cloudflare.env.R2,
        collections: {
            media: {
                disableLocalStorage: true,
                prefix: cloudflare.env.R2_IMAGES_PREFIX,
                generateFileURL: ({ filename }) =>
                    `${cloudflare.env.R2_PUBLIC_URL}/${cloudflare.env.R2_IMAGES_PREFIX}${filename}`,
            },
            documents: {
                disableLocalStorage: true,
                prefix: cloudflare.env.R2_DOCUMENTS_PREFIX,
                generateFileURL: ({ filename }) =>
                    `${cloudflare.env.R2_PUBLIC_URL}/${cloudflare.env.R2_DOCUMENTS_PREFIX}${filename}`,
            },
        },
    });

const r2StoragePlugin = r2ProductionStorage();

const smtpEnabled = cloudflare.env.SMTP_ENABLED?.toString() === "true";
const smtpHost = cloudflare.env.SMTP_HOST;
const smtpUser = cloudflare.env.SMTP_USER;
const smtpPass = cloudflare.env.SMTP_PASS;
const smtpFromAddress = cloudflare.env.SMTP_FROM_ADDRESS;
const smtpFromName = cloudflare.env.SMTP_FROM_NAME;

let missingVars: string[] = [];

if (smtpEnabled) {
    missingVars = [
        ["SMTP_HOST", smtpHost],
        ["SMTP_USER", smtpUser],
        ["SMTP_PASS", smtpPass],
        ["SMTP_FROM_ADDRESS", smtpFromAddress],
        ["SMTP_FROM_NAME", smtpFromName],
    ]
        .filter(([, value]) => !value)
        .map(([key]) => key);
}

const emailAdapter =
    smtpEnabled && missingVars.length === 0
        ? nodemailerAdapter({
              defaultFromAddress: smtpFromAddress || "",
              defaultFromName: smtpFromName || "",
              transportOptions: {
                  host: smtpHost,
                  port: 465,
                  secure: true,
                  auth: {
                      user: smtpUser,
                      pass: smtpPass,
                  },
              },
          })
        : undefined;

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
        Users,
        Media,
        Documents,
        Pages,
        Posts,
        Exercises,
        Lessons,
        LessonTemplates,
        Events,
        Programs,
        LessonEnrollments,
        ProgramEnrollments,
        EventRegistrations,
    ],
    globals: [Header, Footer, WhatsApp, Organization],
    cors: [getServerSideURL()].filter(Boolean),
    editor: lexicalEditor(),
    secret: cloudflare.env.PAYLOAD_SECRET || "ignore",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
    plugins: [...plugins, r2StoragePlugin],
    i18n: {
        supportedLanguages: { nl },
        fallbackLanguage: "en",
    },
    upload: {
        limits: {
            fileSize: 5000000, // 5mb
        },
    },
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
    return import(
        /* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`
    ).then(({ getPlatformProxy }) =>
        getPlatformProxy({
            environment: process.env.CLOUDFLARE_ENV,
            remoteBindings: isProduction,
        } satisfies GetPlatformProxyOptions),
    );
}
