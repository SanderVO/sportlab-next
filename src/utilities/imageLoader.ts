import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

interface CustomLoaderProps extends ImageLoaderProps {
    fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
    height?: number;
}

export default function customImageLoader({
    src,
    width,
    quality,
    fit,
    height,
}: CustomLoaderProps) {
    const params = [
        `width=${width}`,
        `format=auto`,
        `quality=${quality || 85}`,
    ];

    if (height) params.push(`height=${height}`);
    if (fit) params.push(`fit=${fit}`);

    const paramsString = params.join(",");

    return `https://sportlab.sandervanooijen.dev/cdn-cgi/image/${paramsString}/${normalizeSrc(
        src
    )}`;
}
