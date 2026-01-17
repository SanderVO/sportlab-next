import RichText from "@/components/RichText";
import type { ColumnsBlock as ColumnsBlockProps } from "@/payload-types";

export const ColumnsBlock: React.FC<ColumnsBlockProps> = (props) => {
    const { columns } = props;

    return (
        <>
            {columns?.map((column) => (
                <>
                    {column.richText && (
                        <RichText
                            data={column.richText}
                            enableGutter={false}
                            enableProse={false}
                        />
                    )}
                </>
            ))}
        </>
    );
};
