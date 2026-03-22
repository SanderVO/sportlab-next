"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import {
    $getNodeByKey,
    $getState,
    $isRangeSelection,
    $setState,
    createState,
    TextNode,
    type BaseSelection,
    type LexicalEditor,
    type StateConfig,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@payloadcms/richtext-lexical/lexical/rich-text";
import { $forEachSelectedTextNode } from "@payloadcms/richtext-lexical/lexical/selection";
import { useEffect } from "react";

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

type StateMap = Map<
    string,
    {
        stateConfig: StateConfig<string, string | undefined>;
        stateValues: TextStateValues;
    }
>;

const registerTextStates = (state: TextStateSplitFeatureProps["state"]) => {
    const stateMap: StateMap = new Map();

    for (const stateKey in state) {
        const stateValues = state[stateKey]!;
        const stateConfig = createState(stateKey, {
            parse: (value) =>
                typeof value === "string" &&
                Object.keys(stateValues).includes(value)
                    ? value
                    : undefined,
        });

        stateMap.set(stateKey, { stateConfig, stateValues });
    }

    return stateMap;
};

const setTextState = (
    editor: LexicalEditor,
    stateMap: StateMap,
    stateKey: string,
    value: string | undefined,
) => {
    editor.update(() => {
        $forEachSelectedTextNode((textNode) => {
            const stateMapEntry = stateMap.get(stateKey);

            if (!stateMapEntry) {
                throw new Error(`State config for ${stateKey} not found`);
            }

            $setState(textNode, stateMapEntry.stateConfig, value);
        });
    });
};

const isSelectionInHeading = (selection: BaseSelection) => {
    if (!$isRangeSelection(selection)) {
        return false;
    }

    for (const node of selection.getNodes()) {
        if ($isHeadingNode(node)) {
            continue;
        }

        const parent = node.getParent();

        if ($isHeadingNode(parent)) {
            continue;
        }

        return false;
    }

    return true;
};

const StatePlugin = ({ stateMap }: { stateMap: StateMap }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerMutationListener(TextNode, (mutatedNodes) => {
            editor.getEditorState().read(() => {
                for (const [nodeKey, mutation] of mutatedNodes) {
                    if (mutation === "destroyed") {
                        continue;
                    }

                    const node = $getNodeByKey(nodeKey);
                    const dom = editor.getElementByKey(nodeKey);

                    if (!node || !dom) {
                        continue;
                    }

                    const mergedStyles: Record<string, string | undefined> =
                        Object.create(null);

                    stateMap.forEach((stateEntry, stateKey) => {
                        const stateValue = $getState(
                            node,
                            stateEntry.stateConfig,
                        );

                        if (!stateValue) {
                            delete dom.dataset[stateKey];
                            return;
                        }

                        dom.dataset[stateKey] = stateValue;

                        const css = stateEntry.stateValues[stateValue]?.css;

                        if (css) {
                            Object.assign(mergedStyles, css);
                        }
                    });

                    dom.style.cssText = "";

                    Object.entries(mergedStyles).forEach(
                        ([cssKey, cssValue]) => {
                            if (cssValue != null) {
                                dom.style.setProperty(cssKey, cssValue);
                            }
                        },
                    );
                }
            });
        });
    }, [editor, stateMap]);

    return null;
};

const groupOrderByStateKey: Record<string, number> = {
    color: 30,
    fontFamily: 31,
    headingSize: 32,
};

const groupLabelByStateKey: Record<string, string> = {
    color: "Kleur",
    fontFamily: "Font",
    headingSize: "Heading grootte",
};

const toolbarGroups = (
    props: TextStateSplitFeatureProps,
    stateMap: StateMap,
) => {
    return Object.entries(props.state).map(([stateKey, values]) => {
        const items = Object.entries(values).map(([stateValue, meta]) => ({
            key: stateValue,
            label: meta.label,
            onSelect: ({ editor }: { editor: LexicalEditor }) => {
                setTextState(editor, stateMap, stateKey, stateValue);
            },
        }));

        const clearItem = {
            key: `${stateKey}-default`,
            label: "Standaard",
            onSelect: ({ editor }: { editor: LexicalEditor }) => {
                setTextState(editor, stateMap, stateKey, undefined);
            },
            order: 1,
        };

        return {
            type: "dropdown" as const,
            key: `text-state-${stateKey}`,
            order: groupOrderByStateKey[stateKey] ?? 40,
            ChildComponent: () => (
                <span>{groupLabelByStateKey[stateKey] ?? stateKey}</span>
            ),
            isEnabled:
                stateKey === "headingSize"
                    ? ({ selection }: { selection: BaseSelection }) =>
                          isSelectionInHeading(selection)
                    : undefined,
            items: [clearItem, ...items],
        };
    });
};

export const TextStateSplitFeatureClient =
    createClientFeature<TextStateSplitFeatureProps>(({ props }) => {
        const stateMap = registerTextStates(props.state);

        return {
            plugins: [
                {
                    Component: () => StatePlugin({ stateMap }),
                    position: "normal",
                },
            ],
            toolbarFixed: {
                groups: toolbarGroups(props, stateMap),
            },
            toolbarInline: {
                groups: toolbarGroups(props, stateMap),
            },
        };
    });
