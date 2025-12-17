import {
    CloudflareContext,
    getCloudflareContext,
} from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import { s3Storage } from "@payloadcms/storage-s3";
import { nl as baseNl } from "@payloadcms/translations/languages/nl";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { GetPlatformProxyOptions } from "wrangler";
import { Documents } from "./collections/Documents";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { Footer } from "./components/Footer/config";
import { Header } from "./components/Header/config";
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
const smtpEnabled = process.env.SMTP_ENABLED === "true";

const cloudflare =
    process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
    !isProduction
        ? await getCloudflareContextFromWrangler()
        : await getCloudflareContext({ async: true });

const r2DevStorage = () =>
    s3Storage({
        bucket: process.env.R2_BUCKET ?? "",
        collections: {
            media: {
                disableLocalStorage: true,
                prefix: "images_dev/",
                generateFileURL: ({ filename }) =>
                    `${process.env.R2_PUBLIC_URL}/images_dev/${filename}`,
            },
            documents: {
                disableLocalStorage: true,
                prefix: "documents_dev/",
                generateFileURL: ({ filename }) =>
                    `${process.env.R2_PUBLIC_URL}/documents_dev/${filename}`,
            },
        },
        config: {
            region: "weur",
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
            },
        },
    });

const r2StoragePlugin = isProduction
    ? r2Storage({
          bucket: cloudflare.env.R2,
          collections: {
              media: {
                  disableLocalStorage: true,
                  prefix: "images/",
                  generateFileURL: ({ filename }) =>
                      `${process.env.R2_PUBLIC_URL}/images/${filename}`,
              },
              documents: {
                  disableLocalStorage: true,
                  prefix: "documents/",
                  generateFileURL: ({ filename }) =>
                      `${process.env.R2_PUBLIC_URL}/documents/${filename}`,
              },
          },
      })
    : r2DevStorage();

const emailAdapter = isProduction
    ? nodemailerAdapter({
          defaultFromAddress: "noreply@sportlabgroningen.nl",
          defaultFromName: "Sportlab Groningen",
          transportOptions: {
              host: process.env.SMTP_HOST,
              port: 465,
              secure: true,
              requireTLS: true,
              auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              },
          },
      })
    : nodemailerAdapter();

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
    },
    email: smtpEnabled ? emailAdapter : undefined,
    collections: [Users, Media, Documents, Pages, Posts],
    globals: [Header, Footer],
    cors: [getServerSideURL()].filter(Boolean),
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
    plugins: [...plugins, r2StoragePlugin],
    i18n: {
        supportedLanguages: { nl },
        fallbackLanguage: "en",
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
        } satisfies GetPlatformProxyOptions)
    );
}
