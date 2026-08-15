import { WhatsApp } from "@/payload-types";
import Link from "next/link";

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
                    className="relative z-50 ml-auto inline-flex h-9 w-max items-center gap-1.5 rounded-3xl border border-charcoal/90 bg-sand px-3.5 font-sl-poppins text-[10px] font-semibold uppercase tracking-[0.08em] text-charcoal transition-colors hover:bg-warm-white lg:h-11 lg:gap-2 lg:px-5 lg:text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span
                        aria-hidden="true"
                        className="relative flex h-2.5 w-2.5"
                    >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-charcoal/50 animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-charcoal" />
                    </span>
                    <span>{buttonText}</span>
                </Link>
            )}
        </>
    );
}
