import { FormBlock } from "@/blocks/Form/FormBlock";
import { ServiceCardBlock } from "@/blocks/ServiceCard/ServiceCardBlock";
import { VirtuagymRosterBlock } from "@/blocks/VirtuagymRoster/VirtuagymRoster";
import { Size, Variant } from "@/lib/ui/variants";
import {
    ColumnsBlock,
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
import { FormBlockType } from "../../blocks/Form/FormBlock";
import { Button } from "../ui/Button";

type NodeTypes = DefaultNodeTypes;

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

    return <span style={styles}>{text}</span>;
};

const headingConverter: JSXConverter<SerializedHeadingNode> = ({
    node,
}: {
    node: SerializedHeadingNode;
}) => {
    const content = node.children.map(
        (child: SerializedLexicalNodeWithParent, index: number) => {
            const text = (child && "text" in child ? child.text : "") as string;

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
                >
                    {text}
                </span>
            );
        },
    );

    switch (node.tag) {
        case "h1":
            return (
                <h1 className={cn("font-sl-bebas text-5xl md:text-7xl")}>
                    {content}
                </h1>
            );
        case "h2":
            return (
                <h2 className={cn("font-sl-bebas text-4xl md:text-6xl")}>
                    {content}
                </h2>
            );
        case "h3":
            return (
                <h3 className={cn("font-sl-bebas text-3xl md:text-5xl")}>
                    {content}
                </h3>
            );
        case "h4":
            return (
                <h4 className={cn("font-sl-bebas text-2xl md:text-4xl")}>
                    {content}
                </h4>
            );
        default:
            return <h5>{content}</h5>;
    }
};

const linkConverter: JSXConverter<SerializedLinkNode> = ({
    node,
}: {
    node: SerializedLinkNode;
}) => {
    const { doc, linkType, newTab, url, variant, size } =
        node.fields as LinkFields;

    const label = (node.children[0] as SerializedTextNode)?.text || "";

    const href =
        linkType === "internal" &&
        typeof doc?.value === "object" &&
        doc.value.slug
            ? `${
                  doc?.relationTo !== "pages" ? `/${doc?.relationTo}` : ""
              }/${doc.value.slug}`
            : url;

    return (
        <Button
            url={href}
            newTab={newTab}
            variant={variant as Variant}
            size={size as Size}
        >
            {label as string}
        </Button>
    );
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
