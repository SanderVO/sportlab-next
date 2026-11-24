import canUseDOM from "./canUseDOM";

export const getServerSideURL = () => {
    return process.env.NEXT_PUBLIC_SERVER_URL || "https://sportlabgroningen.nl";
};

export const getClientSideURL = () => {
    if (canUseDOM) {
        const protocol = window.location.protocol;
        const domain = window.location.hostname;
        const port = window.location.port;

        return `${protocol}//${domain}${port ? `:${port}` : ""}`;
    }

    return process.env.NEXT_PUBLIC_SERVER_URL || "";
};

// Structured data (and CMS URL fields) sometimes contain "www.example.com"
// without a scheme. Make them absolute so crawlers and LLMs can resolve them.
export const toAbsoluteUrl = (value?: string | null): string | undefined => {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;

    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    return `https://${trimmed.replace(/^\/+/, "")}`;
};
