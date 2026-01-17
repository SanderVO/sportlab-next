type EnvShape = {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
    NEXT_PUBLIC_SERVER_URL?: string;
    GTM_ID?: string;
    PREVIEW_SECRET?: string;
    NODE_ENV?: string;
    R2_BUCKET?: string;
    R2_IMAGES_PREFIX?: string;
    R2_DOCUMENTS_PREFIX?: string;
    R2_PUBLIC_URL?: string;
    R2_ENDPOINT?: string;
    R2_ACCESS_KEY_ID?: string;
    R2_SECRET_ACCESS_KEY?: string;
    CLOUDFLARE_ENV?: string;
};

export function getEnv(): EnvShape {
    if (
        typeof (globalThis as unknown as { WebSocketPair?: unknown })
            .WebSocketPair !== "undefined"
    ) {
        return (
            (globalThis as unknown as { process?: { env?: EnvShape } }).process
                ?.env ?? {}
        );
    }

    return process.env;
}
