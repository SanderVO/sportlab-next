import { getEnv } from "@/lib/Env";
import canUseDOM from "./canUseDOM";

export const getServerSideURL = () => {
    const env = getEnv();

    return env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

export const getClientSideURL = () => {
    const env = getEnv();

    if (canUseDOM) {
        const protocol = window.location.protocol;
        const domain = window.location.hostname;
        const port = window.location.port;

        return `${protocol}//${domain}${port ? `:${port}` : ""}`;
    }

    return env.NEXT_PUBLIC_SERVER_URL || "";
};
