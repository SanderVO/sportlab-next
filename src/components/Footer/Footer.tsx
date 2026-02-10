import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Footer } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import SocialIcon from "../Social/Icons";
import { CMSLink } from "../ui/Link";

export async function Footer() {
    const footerData: Footer = (await getCachedGlobal("footer", 1)()) as Footer;

    return (
        <footer className="container mx-auto my-20">
            <CMSLink
                {...footerData.link}
                className="flex flex-col text-sl-beige items-baseline no-underline font-normal"
            >
                <div className="text-8xl font-sl-bebas">{footerData.title}</div>

                <p>{footerData.description}</p>

                <div className="border-b-4 border-sl-beige w-[50px] mt-2"></div>
            </CMSLink>

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
                        className="flex flex-col gap-1 items-center font-montserrat text-sl-beige"
                        data={footerData.contactText}
                        enableProse={false}
                    />
                )}

                {footerData.socialMediaLinks &&
                    footerData.socialMediaLinks.length > 0 && (
                        <div className="flex flex-row gap-4 items-center text-sl-beige">
                            {footerData.socialMediaLinks.map((link, index) => (
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
                    )}

                {footerData.footerColumns && (
                    <div className="flex flex-row justify-center gap-20 w-full">
                        {footerData.footerColumns.map((column) => (
                            <div key={column.id}>
                                <h3 className="text-neutral-400 font-bold mb-2">
                                    {column.columnTitle}
                                </h3>

                                <ul className="flex flex-col gap-1">
                                    {column.links?.map((linkItem) => (
                                        <li key={linkItem.id}>
                                            <CMSLink
                                                {...linkItem.link}
                                                variant="nav"
                                                className="text-sm no-underline normal-case font-normal"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-row gap-4 items-center text-neutral-400">
                    <span>
                        &copy; {new Date().getFullYear()} Sportlab Groningen.
                    </span>
                </div>
            </div>
        </footer>
    );
}
