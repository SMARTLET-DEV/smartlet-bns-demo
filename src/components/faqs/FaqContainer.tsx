"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import FaqAccordion from "./FaqAccordion";

export default function FaqContainer() {
    const selectedCategory = useSelector(
        (state: RootState) => state.faq.selectedCategory
    );
    const faqData = useSelector(
        (state: RootState) => state.faq.faqData[selectedCategory]
    );

    return (
        <div className="w-full bg-white pt-8 pb-10">
            <div className="container mx-auto px-5 max-w-4xl">
                {/* Accordion Content */}
                <div className="w-full flex flex-col gap-y-10">
                    {faqData.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="w-full">
                            <FaqAccordion
                                title={`${subcategory.id}. ${subcategory.title}`}
                                faqData={subcategory.faqs}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
