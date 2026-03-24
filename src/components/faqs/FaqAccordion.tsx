"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type FaqItem = {
    question: string;
    answer: string;
};

interface FaqAccordionProps {
    title?: string;
    faqData: FaqItem[];
}

export default function FaqAccordion({ title, faqData }: FaqAccordionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    const renderTitle = (title: string) => {
        const firstTwoLetters = title.slice(0, 2);
        const remaining = title.slice(2);
        return (
            <h2 className="text-xl sm:text-2xl font-light tracking-wide mb-4">
                {/* <span>{firstTwoLetters}</span> */}
                {remaining}
            </h2>
        );
    };

    return (
        <section className="w-full">
            <div className="flex flex-col gap-y-6">
                {title && renderTitle(title)}
                {faqData.map((item, index) => (
                    <FaqItemCard
                        key={index}
                        index={index}
                        isOpen={activeIndex === index}
                        item={item}
                        onToggle={toggle}
                    />
                ))}
            </div>
        </section>
    );
}

function FaqItemCard({
    item,
    index,
    isOpen,
    onToggle,
}: {
    item: FaqItem;
    index: number;
    isOpen: boolean;
    onToggle: (index: number) => void;
}) {
    return (
        <div
            className={cn(
                "w-full border rounded-md px-4 py-3 transition-all duration-300 bg-white",
                isOpen ? "border-primary " : "border-gray-300"
            )}
            style={{
                boxShadow: "8px 2px 40px 0 rgba(0, 0, 0, 0.05)",
            }}
        >
            <button
                onClick={() => onToggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left cursor-pointer"
            >
                <span
                    className={cn(
                        "text-base flex-1 text-black dark:text-white"
                    )}
                >
                    {item.question}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
            </button>

            {/* Animated answer section */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[1000px] mt-3" : "max-h-0"
                )}
            >
                <div className="text-base text-muted leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}
