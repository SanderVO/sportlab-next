import { FormBlock } from "@/blocks/Form/FormBlock";
import { ServiceCardBlock } from "@/blocks/ServiceCard/ServiceCardBlock";
import { VirtuagymRosterBlock } from "@/blocks/VirtuagymRoster/VirtuagymRoster";
import {
    CallToActionBlock,
    ColumnsBlock,
    ServiceCardBlock as ServiceCardBlockType,
} from "@/payload-types";
import { cn } from "@/utilities/ui";
import {
    DefaultNodeTypes,
    SerializedBlockNode,
    SerializedLinkNode,
    type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
    RichText as ConvertRichText,
    JSXConvertersFunction,
    LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import { FormBlockType } from "../../blocks/Form/FormBlock";
import { CMSLink } from "../Link";

type NodeTypes = DefaultNodeTypes;

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    const { value, relationTo } = linkNode.fields.doc!;
    if (typeof value !== "object") {
        throw new Error("Expected value to be an object");
    }
    const slug = value.slug;
    return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
}) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node }) => {
        const Tag = node.type as "h1" | "h2" | "h3" | "h4";

        const firstChild = node.children[0];
        const text = (
            firstChild && "text" in firstChild ? firstChild.text : ""
        ) as string;

        let colorClass = "text-white";

        switch (firstChild?.$?.color) {
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

        switch (node.tag) {
            case "h1":
                return (
                    <Tag
                        className={cn(
                            "font-sl-bebas text-5xl md:text-7xl",
                            colorClass,
                        )}
                    >
                        {text}
                    </Tag>
                );
            case "h2":
                return (
                    <Tag
                        className={cn(
                            "font-sl-bebas text-4xl md:text-6xl",
                            colorClass,
                        )}
                    >
                        {text}
                    </Tag>
                );
            case "h3":
                return (
                    <Tag
                        className={cn(
                            "font-sl-bebas text-3xl md:text-5xl",
                            colorClass,
                        )}
                    >
                        {text}
                    </Tag>
                );
            case "h4":
                return (
                    <Tag
                        className={cn(
                            "font-sl-bebas text-2xl md:text-4xl",
                            colorClass,
                        )}
                    >
                        {text}
                    </Tag>
                );
            default:
                return <div>{text}</div>;
        }
    },
    paragraph: ({ node }) => {
        const firstChild = node.children[0];
        const text = (
            firstChild && "text" in firstChild ? firstChild.text : ""
        ) as string;

        const className = firstChild?.$?.className;

        let colorClass = "text-black";

        switch (firstChild?.$?.color) {
            case "white":
                colorClass = "text-white";
                break;
            case "beige":
                colorClass = "text-sl-beige";
                break;
            case "orange":
                colorClass = "text-sl-orange";
                break;
            default:
                colorClass = "text-black";
                break;
        }

        return (
            <p className={`${className ? className : ""} ${colorClass}`}>
                {text}
            </p>
        );
    },
    blocks: {
        formBlock: ({ node }: { node: SerializedBlockNode<FormBlockType> }) => (
            <FormBlock {...node.fields} />
        ),
        callToActionBlock: ({
            node,
        }: {
            node: SerializedBlockNode<CallToActionBlock>;
        }) => <CMSLink {...node.fields.link} className="w-full" />,
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
                    "mx-auto prose md:prose-md dark:prose-invert": enableProse,
                },
                className,
            )}
            {...rest}
        />
    );
}
