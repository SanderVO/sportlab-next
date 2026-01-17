import { CMSLink } from "@/components/Link";

import type { CallToActionBlock as CallToActionBlockProps } from "@/payload-types";

export const CallToActionBlock: React.FC<CallToActionBlockProps> = (props) => {
    const { link } = props;

    return <CMSLink {...link} />;
};
