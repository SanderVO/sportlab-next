import RichText from "@/components/RichText";
import React from "react";

import type { FAQBlock as FAQBlockProps } from "@/payload-types";

export const FAQBlock: React.FC<FAQBlockProps> = ({ items }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
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
                    <details key={item.id ?? index} className="">
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
                            data={item.answer}
                            enableGutter={false}
                            enableProse={false}
                        />
                    </details>
                );
            })}
        </div>
    );
};
