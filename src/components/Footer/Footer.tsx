import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Footer } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import SocialIcon from "../Social/Icons";

export async function Footer() {
    const footerData: Footer = (await getCachedGlobal("footer", 1)()) as Footer;

    return (
        <footer className="container mx-auto my-20">
            <div className="flex flex-col text-sl-beige tems-baseline">
                <div className="text-8xl font-sl-bebas">{footerData.title}</div>

                <p>{footerData.description}</p>

                <div className="border-b-4 border-sl-beige w-[50px] mt-2"></div>
            </div>

            <div className="flex flex-col justify-center items-center w-full gap-10 mt-20">
                {footerData.footerLogo && (
                    <Media
                        fill
                        className="relative w-[200px] h-[50px]"
                        resource={footerData.footerLogo}
                    />
                )}

                {footerData.contactText && (
                    <RichText
                        className="flex flex-col gap-1 items-center font-montserrat"
                        data={footerData.contactText}
                        enableProse={false}
                    />
                )}

                <div className="flex flex-row gap-4 items-center text-sl-beige">
                    {footerData.socialMediaLinks?.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 fill-sl-beige hover:fill-sl-beige-dark transition-colors"
                        >
                            {link.platform && (
                                <SocialIcon platform={link.platform} />
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
