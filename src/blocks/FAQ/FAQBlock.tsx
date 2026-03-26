import RichText from "@/components/RichText";
import Script from "next/script";
import React from "react";

import type { FAQBlock as FAQBlockProps } from "@/payload-types";

type LexicalNodeLike = {
    type?: string;
    text?: string;
    children?: LexicalNodeLike[];
};

const lexicalToPlainText = (nodes: LexicalNodeLike[] = []): string => {
    return nodes
        .map((node: LexicalNodeLike) => {
            const selfText = typeof node.text === "string" ? node.text : "";
            const childText = Array.isArray(node.children)
                ? lexicalToPlainText(node.children)
                : "";
            const combined = `${selfText}${childText}`.trim();

            if (!combined) {
                return "";
            }

            return node.type === "paragraph" || node.type === "heading"
                ? `${combined}\n`
                : combined;
        })
        .join(" ")
        .replace(/\s*\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

export const FAQBlock: React.FC<FAQBlockProps> = ({ id, items }) => {
    if (!items || items.length === 0) {
        return null;
    }

    const mainEntity = items
        .map((item) => {
            const question = item.question?.trim();
            const answer = lexicalToPlainText(item.answer?.root?.children);

            if (!question || !answer) {
                return null;
            }

            return {
                "@type": "Question",
                name: question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: answer,
                },
            };
        })
        .filter(
            (entity): entity is NonNullable<typeof entity> => entity !== null,
        );

    const faqJsonLd =
        mainEntity.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity,
              }
            : null;

    return (
        <>
            {faqJsonLd && (
                <Script
                    id={`faq-jsonld-${id}`}
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqJsonLd).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />
            )}

            <div className="w-full divide-y divide-white/20">
                {items.map((item, index) => {
                    const colorClass =
                        item.questionColor === "black"
                            ? "text-background"
                            : item.questionColor === "beige"
                              ? "text-sl-beige"
                              : item.questionColor === "orange"
                                ? "text-sl-orange"
                                : "text-white";

                    const iconColorClass =
                        item.iconColor === "black"
                            ? "text-background"
                            : item.iconColor === "beige"
                              ? "text-sl-beige"
                              : item.iconColor === "orange"
                                ? "text-sl-orange"
                                : "text-white";

                    return (
                        <details key={item.id ?? index} className="group">
                            <summary
                                className={`flex cursor-pointer items-center justify-between gap-4 py-4 font-sl-bebas text-2xl tracking-wide list-none ${colorClass}`}
                            >
                                {item.question}
                                <span
                                    className={`shrink-0 ${iconColorClass} transition-transform duration-200 group-open:rotate-45`}
                                    aria-hidden="true"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </span>
                            </summary>

                            <RichText
                                className="pb-4"
                                data={item.answer}
                                enableGutter={false}
                                enableProse={false}
                            />
                        </details>
                    );
                })}
            </div>
        </>
    );
};
