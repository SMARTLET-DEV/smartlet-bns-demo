import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

interface BlogCardProps {
    src: string;
    title: string;
    date: string;
    duration: string;
    href?: string;
    description?: string;
    variant?: "default" | "large";
}

/**
 * 1) Removes newlines, extra spaces
 * 2) Normalizes any ellipsis char (…) into ...
 * 3) Collapses any "...." or "......" into "..."
 */
const normalizeText = (text: string) => {
    return (text || "")
        // convert Windows newlines to \n then replace all newlines with spaces
        .replace(/\r\n/g, "\n")
        .replace(/\n+/g, " ")
        // normalize ellipsis character to three dots
        .replace(/\u2026/g, "...")
        // collapse multiple dots (4+ dots) down to exactly three
        .replace(/\.{4,}/g, "...")
        // collapse excessive whitespace
        .replace(/\s+/g, " ")
        .trim();
};

/**
 * Truncates and ALWAYS ends with exactly "..." (only when truncation happens).
 * Also avoids ending the cut on dots/ellipsis/spaces before adding "...".
 */
const truncateWithThreeDots = (text: string, maxChars: number) => {
    const t = normalizeText(text);

    if (t.length <= maxChars) return t;

    let cut = t.slice(0, maxChars).trim();

    // remove trailing dots / ellipsis / spaces so we don't get "...."
    cut = cut.replace(/[.\u2026…\s]+$/g, "");

    return `${cut}...`;
};

export const BlogCard: React.FC<BlogCardProps> = ({
    src,
    title,
    date,
    duration,
    href = "#",
    description = "",
    variant = "default",
}) => {
    // tweak these numbers if you want longer/shorter previews
    const MAX_DESC_CHARS = variant === "large" ? 240 : 170;

    const previewDescription = truncateWithThreeDots(description, MAX_DESC_CHARS);

    return (
        <div className="w-[350px] sm:w-[390px] flex flex-col rounded-t-2xl overflow-hidden bg-transparent h-full">
            <Link
                href={href}
                tabIndex={-1}
                className="w-full h-[220px] block rounded-2xl overflow-hidden"
                style={{ outline: "none", boxShadow: "none" }}
            >
                <img src={src} alt={title} className="w-full h-full object-cover rounded-2xl" />
            </Link>

            <div className="pt-4 pr-4 pb-4 flex flex-col flex-1 space-y-2">
                <p className="text-base text-left font-light text-muted flex items-center gap-2">
                    <span>{date}</span>
                    <span>—</span>
                    <span>{duration}</span>
                </p>

                <h2 className="text-lg sm:text-xl md:text-2xl text-left font-light text-secondary leading-snug line-clamp-2 break-words overflow-hidden max-w-full">
                    <Link href={href} className="hover:underline focus:underline outline-none">
                        {title}
                    </Link>
                </h2>

                {/* IMPORTANT:
            - NO line-clamp here (so the browser can't append ellipsis)
            - fixed height keeps the layout uniform
            - overflow-hidden ensures it doesn't grow
        */}
                <p className="text-base text-muted leading-relaxed break-words overflow-hidden max-w-full text-justify h-[52px]">
                    {previewDescription}
                </p>

                <Button
                    asChild
                    variant="link"
                    className="p-0 h-auto font-light underline justify-start mt-1"
                >
                    <Link href={href} className="text-left w-full block">
                        Read More
                    </Link>
                </Button>
            </div>
        </div>
    );
};
