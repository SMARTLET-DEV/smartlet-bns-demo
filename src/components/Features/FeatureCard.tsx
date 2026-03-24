import { cn } from "@/lib/utils";
import React from "react";

interface FeatureCardProps {
    logo: React.ReactNode;
    title: string;
    description: string;
    href: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    logo,
    title,
    description,
    href,
    className = "",
}) => {
    return (
        <div
            className={cn(
                "flex flex-col px-4 py-6 rounded-xl bg-white lg:bg-transparent transition",
                className
            )}
        >
            <div className="flex flex-col items-center text-center flex-grow">
                <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full">
                    {logo}
                </div>
                <h3 className="text-xl font-light text-foreground mb-2">
                    {title}
                </h3>
                <p className="text-base text-muted mb-4 mt-3">
                    {description}
                </p>
            </div>

            {/* Always at bottom */}
            <div className="mt-auto text-center">
                <a
                    href={href}
                    className="text-sm font-medium text-primary underline"
                >
                    See More
                </a>
            </div>
        </div>
    );
};
