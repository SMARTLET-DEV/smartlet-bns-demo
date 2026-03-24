"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const whyWorkWithUsData = [
    {
        id: "the-people",
        label: "The People",
        image: "/careers/The People (1).png",
        description:
      "We're collaborative to the core - ideas can come from anyone, and everyone's encouraged to lead and grow together. Here, you'll find one of the best teams to work with in any space - it's not just the idea, it's the obsessed team behind it that's relentless. And we'll have your back when you need it the most.",
    },
    {
        id: "work-environment",
        label: "Work Environment",
        image: "/careers/Work Environment (1).png",
        description:
      "Fast-moving yet structured, we work with purpose, improve every day, and enjoy achieving goals as one team - Together!",
    },
    {
        id: "growth-opportunity",
        label: "Growth Opportunity",
        image: "/careers/Growth Opportunity (1).png",
        description:
      "We reward initiative with leadership roles and uncapped growth - everyone has the space to own and lead.",
    },
    {
        id: "rewards",
        label: "Rewards",
        image: "/careers/Rewards (1).png",
        description:
      "We value performance fairly, offering competitive pay and even equity for those who truly make a mark.",
    },
    {
        id: "purpose",
        label: "Purpose",
        image: "/careers/Purpose (1).png",
        description:
      "We're transforming lifestyle property market and you'll get to see your work truly change thousands of lives across nations.",
    },
];

export function WhyWorkWithUs() {
    const [activeTab, setActiveTab] = useState("the-people");
    const [resetKey, setResetKey] = useState(0);
    const activeContent = whyWorkWithUsData.find((item) => item.id === activeTab);

    // Auto-slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((currentTab) => {
                const currentIndex = whyWorkWithUsData.findIndex(
                    (item) => item.id === currentTab
                );
                const nextIndex = (currentIndex + 1) % whyWorkWithUsData.length;
                return whyWorkWithUsData[nextIndex].id;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [resetKey]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setResetKey((prev) => prev + 1); // Reset the timer
    };

    return (
        <section className="w-full bg-white pt-12 pb-16 sm:pb-20 lg:pb-24">
            <div className="container mx-auto px-5">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center text-gray-900 mb-12">
          Why Work With Us
                </h2>

                {/* Tabs with underline */}
                <div className="w-full">
                    {/* Desktop horizontal layout */}
                    <div className="hidden lg:flex justify-center">
                        <div className="inline-block">
                            <div className="flex gap-9 mb-0">
                                {whyWorkWithUsData.map((item) => {
                                    const isSelected = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleTabClick(item.id)}
                                            className={`relative px-4 py-3 transition-all duration-200 text-base whitespace-nowrap cursor-pointer group ${
                                                isSelected
                                                    ? "text-primary font-medium"
                                                    : "text-gray-800 hover:text-gray-900 font-regular"
                                            }`}
                                        >
                                            {item.label}
                                            {/* Sliding underline effect */}
                                            <div
                                                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
                                                    isSelected ? "w-full" : "w-0 group-hover:w-full"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Gray underline matching menu width */}
                            <div className="w-full h-[1px] bg-black mb-10"></div>
                        </div>
                    </div>

                    {/* Tablet and Mobile horizontal scrollable layout */}
                    <div className="lg:hidden px-6">
                        <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar">
                            <div className="inline-block min-w-full">
                                <div className="flex justify-start min-w-max gap-9 pb-0">
                                    {whyWorkWithUsData.map((item) => {
                                        const isSelected = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleTabClick(item.id)}
                                                className={`relative px-4 py-3 transition-all duration-200 text-base whitespace-nowrap cursor-pointer group ${
                                                    isSelected
                                                        ? "text-primary font-medium"
                                                        : "text-gray-800 hover:text-gray-900 font-regular"
                                                }`}
                                            >
                                                {item.label}
                                                {/* Sliding underline effect */}
                                                <div
                                                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
                                                        isSelected ? "w-full" : "w-0 group-hover:w-full"
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Full width gray underline matching tabs width */}
                                <div className="w-full h-[1px] bg-black mb-10"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="max-w-6xl mx-auto bg-[#ffeded] rounded-2xl p-8 sm:p-12">
                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <div className="relative w-[200px] h-[200px] xs:w-[240px] xs:h-[240px] sm:w-[380px] sm:h-[380px]">
                                {/* Preload all images, show only active one */}
                                {whyWorkWithUsData.map((item) => (
                                    <Image
                                        key={item.id}
                                        src={item.image}
                                        alt={item.label}
                                        fill
                                        className={`object-contain transition-opacity duration-500 ${
                                            activeTab === item.id ? "opacity-100" : "opacity-0"
                                        }`}
                                        sizes="(max-width: 640px) 240px, 380px"
                                        priority
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            {activeContent && (
                                <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                                    {activeContent.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
