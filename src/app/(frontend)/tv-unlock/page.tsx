import { TvStage } from "@/app/(frontend)/tv/TvStage";
import { TvPin } from "@/components/TvPin/TvPin";
import { hasTvAccess } from "@/utilities/tvAccess";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default async function TvUnlockPage() {
    if (await hasTvAccess()) {
        redirect("/tv");
    }

    return (
        <TvStage>
            <TvPin />
        </TvStage>
    );
}
