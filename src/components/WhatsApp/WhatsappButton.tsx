import { WhatsApp } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import { WhatsappIcon } from "../Social/Icons";

export async function WhatsappButton() {
    const { phoneNumber, textPreFilled, buttonText }: WhatsApp =
        (await getCachedGlobal("whatsApp", 1)()) as WhatsApp;

    return (
        <>
            {phoneNumber && (
                <Link
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                        textPreFilled,
                    )}`}
                    className="relative transition-colors bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-2 rounded-lg z-50 ml-auto shadow-lg w-max flex flex-row gap-2 items-center fill-white"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <WhatsappIcon height={24} width={24} />

                    <span>{buttonText}</span>
                </Link>
            )}
        </>
    );
}
