"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroHeading({
    title,
    taglines,
}: {
    title: string;
    taglines: string[];
}) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const currentWord = taglines[currentWordIndex];

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isTyping) {
            // Typing animation
            if (displayedText.length < currentWord.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentWord.slice(0, displayedText.length + 1));
                }, 60); // Typing speed - smoother
            } else {
                // Finished typing, wait before starting to delete
                timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2000); // Pause after typing - longer pause
            }
        } else {
            // Deleting animation
            if (displayedText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 30); // Deleting speed - faster and smoother
            } else {
                // Finished deleting, move to next word
                setCurrentWordIndex((prev) => (prev + 1) % taglines.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isTyping, currentWord, taglines.length]);

    return (
        <div className="text-center w-[100%]">
            <div className="relative inline-block">
                {/* Invisible spacer to reserve space for the longest tagline */}
                <div className="invisible text-4xl sm:text-4xl lg:text-5xl font-light leading-tight">
                    {title} {taglines.reduce((longest, current) => current.length > longest.length ? current : longest, "")}
                </div>
                {/* Visible content positioned absolutely */}
                <div className="absolute top-0 left-0 w-full text-4xl sm:text-4xl lg:text-5xl font-light leading-tight text-primary-foreground">
                    {/* Center the title and position tagline absolutely */}
                    <div className="flex justify-start">
                        <div className="relative">
                            <span className="whitespace-nowrap">{title}</span>
                            <span className="absolute left-full ml-3 top-0 whitespace-nowrap">
                                <span className="inline-block text-[#e8566f]">
                                    {displayedText}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
