import { cn } from "@/utilities/ui";
import {
    DefaultNodeTypes,
    SerializedLinkNode,
    type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
    RichText as ConvertRichText,
    JSXConvertersFunction,
    LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";

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
                className
            )}
            {...rest}
        />
    );
}
