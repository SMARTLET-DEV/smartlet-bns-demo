"use client";

import {
    Building,
    ChatIcon,
    Grid,
    HomeSparkles,
    NotebookChecked,
} from "@/assets/icons";
import { cn } from "@/lib/utils";
import {
    FaqCategory,
    setSelectedCategory,
} from "@/redux/reducers/faq/faqSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const faqItems: {
    category: FaqCategory;
    icon: React.ReactElement;
    label: string;
}[] = [
    {
        category: "general",
        icon: <ChatIcon className="w-5 h-5" />,
        label: "Getting Started",
    },
    {
        category: "services",
        icon: <HomeSparkles className="w-5 h-5" />,
        label: "Property Listings",
    },
    {
        category: "registration",
        icon: <NotebookChecked className="w-5 h-5" />,
        label: "Tenants & Applications",
    },
    {
        category: "rental",
        icon: <Building className="w-5 h-5" />,
        label: "Homeowners & Listings",
    },
    {
        category: "webapp",
        icon: <Grid className="w-5 h-5" />,
        label: "After-Rental Services",
    },
];

export function FaqOptions() {
    return (
        <div className="w-full">
            {/* Desktop horizontal layout */}
            <div className="hidden lg:flex justify-center">
                <div className="flex">
                    <FaqButtons orientation="horizontal" />
                </div>
            </div>
            
            {/* Tablet and Mobile horizontal scrollable layout */}
            <div className="lg:hidden">
                <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar">
                    <div className="flex justify-start min-w-max px-4 pb-0">
                        <FaqButtons orientation="horizontal" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqButtons({
    orientation,
}: {
    orientation: "horizontal" | "vertical";
}) {
    const dispatch = useDispatch();
    const selectedCategory = useSelector(
        (state: RootState) => state.faq.selectedCategory
    );

    return (
        <div className={cn(
            "flex gap-9",
            orientation === "horizontal" ? "flex-row" : "flex-col"
        )}>
            {faqItems.map(({ category, icon, label }) => {
                const isSelected = selectedCategory === category;

                return (
                    <button
                        key={category}
                        onClick={() => dispatch(setSelectedCategory(category))}
                        aria-pressed={isSelected}
                        className={cn(
                            "relative flex items-center justify-center gap-2 px-4 py-3 transition-all duration-200 text-sm font-medium whitespace-nowrap rounded-t-md cursor-pointer group",
                            isSelected
                                ? "text-primary font-normal"
                                : "text-black hover:text-primary"
                        )}
                    >
                        <span className="text-base">{label}</span>
                        {/* Sliding underline effect */}
                        <div className={cn(
                            "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out",
                            isSelected
                                ? "w-full"
                                : "w-0 group-hover:w-full"
                        )} />
                    </button>
                );
            })}
        </div>
    );
}
