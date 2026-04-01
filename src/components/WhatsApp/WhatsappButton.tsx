import { WhatsApp } from "@/payload-types";
import Link from "next/link";
import { WhatsappIcon } from "../Social/Icons";

export async function WhatsappButton({
    phoneNumber,
    textPreFilled,
    buttonText,
}: WhatsApp) {
    return (
        <>
            {phoneNumber && (
                <Link
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                        textPreFilled,
                    )}`}
                    data-gtm="whatsapp-cta"
                    data-gtm-event="whatsapp_click"
                    data-gtm-phone={phoneNumber}
                    className="relative transition-colors bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-2 rounded-lg z-50 ml-auto shadow-lg w-max flex flex-row gap-2 items-center fill-white text-xs lg:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="hidden lg:block">
                        <WhatsappIcon height={24} width={24} />
                    </div>

                    <div className="block lg:hidden">
                        <WhatsappIcon height={20} width={20} />
                    </div>

                    <span>{buttonText}</span>
                </Link>
            )}
        </>
    );
}
