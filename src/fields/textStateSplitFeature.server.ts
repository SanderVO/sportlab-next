import { createServerFeature } from "@payloadcms/richtext-lexical";

type TextStateValues = {
    [stateValue: string]: {
        css: Record<string, string | undefined>;
        label: string;
    };
};

type TextStateSplitFeatureProps = {
    state: {
        [stateKey: string]: TextStateValues;
    };
};

export const TextStateSplitFeature = createServerFeature<
    TextStateSplitFeatureProps,
    TextStateSplitFeatureProps,
    TextStateSplitFeatureProps
>({
    feature: ({ props }) => {
        return {
            ClientFeature:
                "./fields/textStateSplitFeature.client#TextStateSplitFeatureClient",
            clientFeatureProps: {
                state: props?.state,
            },
        };
    },
    key: "textState",
});
