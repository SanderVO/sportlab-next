import { FAQBlock } from "@/blocks/FAQ/FAQBlock";
import { FormBlock } from "@/blocks/Form/FormBlock";
import { ServiceCardBlock } from "@/blocks/ServiceCard/ServiceCardBlock";
import { VirtuagymRosterBlock } from "@/blocks/VirtuagymRoster/VirtuagymRoster";
import { Size, Variant } from "@/lib/ui/variants";
import {
    ColumnsBlock,
    FAQBlock as FAQBlockType,
    ServiceCardBlock as ServiceCardBlockType,
} from "@/payload-types";
import { textState } from "@/utilities/textState";
import { cn } from "@/utilities/ui";
import {
    DefaultNodeTypes,
    LinkFields,
    SerializedBlockNode,
    SerializedHeadingNode,
    SerializedLinkNode,
    SerializedListItemNode,
    SerializedListNode,
    SerializedTextNode,
    type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
    RichText as ConvertRichText,
    JSXConverter,
    JSXConvertersFunction,
    LinkJSXConverter,
    SerializedLexicalNodeWithParent,
} from "@payloadcms/richtext-lexical/react";
import { TextStateFeatureProps } from "node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server";
import React from "react";
import { FormBlockType } from "../../blocks/Form/FormBlock";
import { Button } from "../ui/Button";

type NodeTypes = DefaultNodeTypes;

type RichTextLinkFields = LinkFields & {
    buttonSpacing?: "none" | "sm" | "md" | "lg";
    alignment?: "left" | "center";
};

const buttonSpacingClasses: Record<
    NonNullable<RichTextLinkFields["buttonSpacing"]>,
    string
> = {
    none: "",
    sm: "mb-2 mx-1",
    md: "mb-4 mx-2",
    lg: "mb-6 mx-4",
};

const buttonSpacingClassesLeftAligned: Record<
    NonNullable<RichTextLinkFields["buttonSpacing"]>,
    string
> = {
    none: "",
    sm: "mb-2 mr-1",
    md: "mb-4 mr-2",
    lg: "mb-6 mr-4",
};

const headingSizeClasses = {
    h1: {
        sm: "text-4xl md:text-6xl",
        md: "text-5xl md:text-7xl",
        lg: "text-6xl md:text-8xl",
        xl: "text-7xl md:text-9xl",
    },
    h2: {
        sm: "text-3xl md:text-5xl",
        md: "text-4xl md:text-6xl",
        lg: "text-5xl md:text-7xl",
        xl: "text-6xl md:text-8xl",
    },
    h3: {
        sm: "text-2xl md:text-4xl",
        md: "text-3xl md:text-5xl",
        lg: "text-4xl md:text-6xl",
        xl: "text-5xl md:text-7xl",
    },
    h4: {
        sm: "text-xl md:text-3xl",
        md: "text-2xl md:text-4xl",
        lg: "text-3xl md:text-5xl",
        xl: "text-4xl md:text-6xl",
    },
};

const phoneRegex =
    /(?:\+\d{1,3}[\s\-.]?\d{1,14}(?:[\s\-.]?\d{1,4})*|(?:\+31|0)[6][\s\-.]?[\d\s\-\.\(\)]{8,})/g;

const normalizePhoneNumber = (phone: string): string => {
    return phone.replace(/[\s\-\.\(\)]/g, "");
};

const createPhoneLinkedContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    const regex = new RegExp(phoneRegex.source, phoneRegex.flags);

    while ((match = regex.exec(text)) !== null) {
        // Add text before the phone number
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const phoneNumber = match[0];
        const normalized = normalizePhoneNumber(phoneNumber);
        parts.push(
            <a
                key={`phone-${match.index}`}
                href={`tel:${normalized}`}
                className="underline decoration-current underline-offset-2"
            >
                {phoneNumber}
            </a>,
        );

        lastIndex = match.index + phoneNumber.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
};

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    const { value, relationTo } = linkNode.fields.doc!;
    if (typeof value !== "object") {
        throw new Error("Expected value to be an object");
    }
    const slug = value.slug;
    return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

const textConverter: JSXConverter<SerializedTextNode> = ({
    node,
}: {
    node: SerializedTextNode;
}) => {
    const text = node.text as string;

    const colorState: TextStateFeatureProps["state"] = textState;

    const styles: React.CSSProperties = {};

    if (node.$) {
        Object.keys(colorState).forEach((stateKey) => {
            const stateOptions = colorState[stateKey];

            if (node.$ && node.$[stateKey]) {
                const stateValue = node.$[stateKey];

                if (
                    typeof stateValue === "string" &&
                    stateOptions[stateValue]
                ) {
                    Object.assign(styles, stateOptions[stateValue].css);
                }
            }
        });
    }

    let content: React.ReactNode = createPhoneLinkedContent(text);

    // Handle text formatting (bold, italic, underline)
    if (node.format) {
        const format = node.format;

        // Bold (format & 1)
        if (format & 1) {
            content = <strong>{content}</strong>;
        }

        // Italic (format & 2)
        if (format & 2) {
            content = <em>{content}</em>;
        }

        // Underline (format & 8)
        if (format & 8) {
            content = <u>{content}</u>;
        }
    }

    return <span style={styles}>{content}</span>;
};

const applyTextFormat = (
    node: SerializedTextNode,
    content: React.ReactNode,
) => {
    if (!node.format) {
        return content;
    }

    let formattedContent = content;

    if (node.format & 1) {
        formattedContent = <strong>{formattedContent}</strong>;
    }

    if (node.format & 2) {
        formattedContent = <em>{formattedContent}</em>;
    }

    if (node.format & 8) {
        formattedContent = <u>{formattedContent}</u>;
    }

    return formattedContent;
};

const headingConverter: JSXConverter<SerializedHeadingNode> = ({
    node,
}: {
    node: SerializedHeadingNode;
}) => {
    const headingSize = node.children.find((child) => child?.$?.headingSize)?.$
        ?.headingSize as "sm" | "md" | "lg" | "xl" | undefined;

    const content = node.children.map(
        (child: SerializedLexicalNodeWithParent, index: number) => {
            const textNode = (
                child && "text" in child
                    ? child
                    : {
                          text: "",
                          type: "text",
                          version: 1,
                      }
            ) as SerializedTextNode;

            const text = textNode.text as string;

            const headingFont = child?.$?.fontFamily as
                | "montserrat"
                | "openSans"
                | "bebas"
                | undefined;

            let colorClass = "text-white";

            switch (child?.$?.color) {
                case "black":
                    colorClass = "text-background";
                    break;
                case "beige":
                    colorClass = "text-sl-beige";
                    break;
                case "orange":
                    colorClass = "text-sl-orange";
                    break;
                default:
                    colorClass = "text-white";
                    break;
            }

            return (
                <span
                    key={"child-" + index}
                    className={cn(colorClass, "block")}
                    style={
                        headingFont
                            ? (textState.fontFamily[headingFont]
                                  ?.css as React.CSSProperties)
                            : undefined
                    }
                >
                    {applyTextFormat(textNode, text)}
                </span>
            );
        },
    );

    switch (node.tag) {
        case "h1":
            return (
                <h1
                    className={cn(
                        "font-sl-bebas",
                        headingSizeClasses.h1[headingSize ?? "md"],
                    )}
                >
                    {content}
                </h1>
            );
        case "h2":
            return (
                <h2
                    className={cn(
                        "font-sl-bebas",
                        headingSizeClasses.h2[headingSize ?? "md"],
                    )}
                >
                    {content}
                </h2>
            );
        case "h3":
            return (
                <h3
                    className={cn(
                        "font-sl-bebas",
                        headingSizeClasses.h3[headingSize ?? "md"],
                    )}
                >
                    {content}
                </h3>
            );
        case "h4":
            return (
                <h4
                    className={cn(
                        "font-sl-bebas",
                        headingSizeClasses.h4[headingSize ?? "md"],
                    )}
                >
                    {content}
                </h4>
            );
        default:
            return <h5>{content}</h5>;
    }
};

const linkConverter: JSXConverter<SerializedLinkNode> = ({
    node,
    nodesToJSX,
}) => {
    const {
        doc,
        linkType,
        newTab,
        url,
        variant,
        size,
        buttonSpacing,
        alignment,
    } = node.fields as RichTextLinkFields;
    const label = nodesToJSX({ nodes: node.children });

    const href =
        linkType === "internal" &&
        typeof doc?.value === "object" &&
        doc.value.slug
            ? `${
                  doc?.relationTo !== "pages"
                      ? `/${doc?.relationTo === "users" ? "team" : doc?.relationTo}`
                      : ""
              }/${doc.value.slug}`
            : url;

    const isLeftAligned = alignment === "left" || !alignment;
    const spacingClasses = isLeftAligned
        ? buttonSpacingClassesLeftAligned
        : buttonSpacingClasses;
    const spacingClass =
        variant !== "inline" ? spacingClasses[buttonSpacing ?? "md"] : "";

    const button = (
        <Button
            url={href}
            newTab={newTab}
            variant={variant as Variant}
            size={size as Size}
        >
            {label}
        </Button>
    );

    if (variant === "inline") {
        return button;
    }

    return (
        <span className={cn("inline-block align-top", spacingClass)}>
            {button}
        </span>
    );
};

const listConverter: JSXConverter<SerializedListNode> = ({
    node,
    nodesToJSX,
}) => {
    const children = nodesToJSX({ nodes: node.children });

    if (node.listType === "number") {
        return <ol className="list-decimal pl-6 space-y-2">{children}</ol>;
    }

    return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
};

const listItemConverter: JSXConverter<SerializedListItemNode> = ({
    node,
    nodesToJSX,
}) => {
    const children = nodesToJSX({ nodes: node.children });
    return <li>{children}</li>;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
}) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    text: textConverter,
    heading: headingConverter,
    link: linkConverter,
    button: linkConverter,
    list: listConverter,
    listitem: listItemConverter,
    blocks: {
        formBlock: ({ node }: { node: SerializedBlockNode<FormBlockType> }) => (
            <FormBlock {...node.fields} />
        ),
        columnsBlock: ({
            node,
        }: {
            node: SerializedBlockNode<ColumnsBlock>;
        }) => {
            const columns = node.fields.columns || [];

            return (
                <div className="grid grid-cols-2 gap-4">
                    {columns.map((column, index: number) => (
                        <div key={index} className="flex flex-col gap-4">
                            <RichText data={column.richText} />
                        </div>
                    ))}
                </div>
            );
        },
        virtuagymRosterBlock: () => {
            return <VirtuagymRosterBlock />;
        },
        serviceCardBlock: ({
            node,
        }: {
            node: SerializedBlockNode<ServiceCardBlockType>;
        }) => {
            return <ServiceCardBlock {...node.fields} />;
        },
        faqBlock: ({ node }: { node: SerializedBlockNode<FAQBlockType> }) => {
            return <FAQBlock {...node.fields} />;
        },
    },
});

type Props = {
    data: DefaultTypedEditorState;
    enableGutter?: boolean;
    enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
    const {
        className,
        enableProse = true,
        enableGutter = true,
        ...rest
    } = props;

    return (
        <ConvertRichText
            converters={jsxConverters}
            className={cn(
                "payload-richtext",
                {
                    container: enableGutter,
                    "max-w-none": !enableGutter,
                    "prose md:prose-md dark:prose-invert": enableProse,
                },
                className,
            )}
            {...rest}
        />
    );
}
