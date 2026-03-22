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
                className="flex flex-col text-sl-beige items-baseline no-underline font-normal h-auto"
            >
                <div className="text-8xl font-sl-bebas">{footerData.title}</div>

                <p>{footerData.description}</p>

                <div className="border-b-4 border-sl-beige w-12.5 mt-2"></div>
            </CMSLink>

            <div className="flex flex-col justify-center items-center w-full gap-20 mt-20">
                <div className="flex flex-col gap-10 items-center w-full lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                    <div className="flex flex-col gap-4">
                        {footerData.footerLogo && (
                            <Media
                                imgHeight={40}
                                imgWidth={200}
                                className="relative w-full lg:w-50 h-12.5 flex justify-center"
                                resource={footerData.footerLogo}
                            />
                        )}

                        {footerData.contactText && (
                            <RichText
                                className="flex flex-col gap-1 items-center font-montserrat text-sl-beige lg:items-start"
                                data={footerData.contactText}
                                enableProse={false}
                                enableGutter={false}
                            />
                        )}

                        {footerData.socialMediaLinks &&
                            footerData.socialMediaLinks.length > 0 && (
                                <div className="flex flex-row gap-4 items-center text-sl-beige">
                                    {footerData.socialMediaLinks.map(
                                        (link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 fill-sl-beige hover:fill-sl-beige-dark transition-colors"
                                            >
                                                {link.platform && (
                                                    <SocialIcon
                                                        platform={link.platform}
                                                    />
                                                )}
                                            </a>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    {footerData.footerColumns && (
                        <div className="grid grid-cols-2 gap-12 text-center w-full lg:w-auto lg:flex lg:flex-row lg:justify-end lg:text-left lg:gap-16">
                            {footerData.footerColumns.map((column) => (
                                <div key={column.id} className="lg:w-36">
                                    <h3 className="text-neutral-400 font-bold mb-2">
                                        {column.columnTitle}
                                    </h3>

                                    {column.contentType === "richText" ? (
                                        column.richText ? (
                                            <RichText
                                                className="text-sm text-neutral-400 [&_p]:m-0 [&_a]:text-neutral-400 [&_a]:no-underline [&_a:hover]:text-white"
                                                data={column.richText}
                                                enableProse={false}
                                                enableGutter={false}
                                            />
                                        ) : null
                                    ) : (
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
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-4 items-center text-neutral-400">
                    <span>
                        &copy; {new Date().getFullYear()} Sportlab Groningen.
                    </span>
                </div>
            </div>
        </footer>
    );
}
