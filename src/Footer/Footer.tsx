import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Footer } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";

export async function Footer() {
    const footerData: Footer = (await getCachedGlobal("footer", 1)()) as Footer;

    return (
        <footer className="container mx-auto my-20">
            <div className="flex flex-col text-sl-beige tems-baseline">
                <div className="text-8xl font-sl-bebas">{footerData.title}</div>

                <p>{footerData.description}</p>

                <div className="border-b-4 border-sl-beige w-[50px] mt-2"></div>
            </div>

            <div className="flex flex-col justify-center items-center w-full gap-20 mt-20">
                {footerData.footerLogo && (
                    <Media
                        fill
                        className="relative w-[200px] h-[50px]"
                        resource={footerData.footerLogo}
                    />
                )}

                {footerData.contactText && (
                    <RichText
                        className="flex flex-col gap-1 items-center text-gray-500 font-montserrat"
                        data={footerData.contactText}
                        enableProse={false}
                    />
                )}
            </div>
        </footer>
    );
}
