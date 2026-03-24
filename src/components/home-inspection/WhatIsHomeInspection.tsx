"use client";

import Image from "next/image";

export default function WhatIsHomeInspectionSection() {
    const features = [
        {
            id: 1,
            title: "Independent third-party inspections",
            image:
        "/home_inspection/what_is_home_inspection/Independent Third-party Inspections (1).png",
        },
        {
            id: 2,
            title: "Unbiased reporting",
            image:
        "/home_inspection/what_is_home_inspection/Unbiased Reporting (1).png",
        },
        {
            id: 3,
            title: "Date-stamped, high-quality visual evidence",
            image:
        "/home_inspection/what_is_home_inspection/Date-stamped, High-quality Visual Evidence (1).png",
        },
        {
            id: 4,
            title: "Digital record stored in your account",
            image:
        "/home_inspection/what_is_home_inspection/Digital Record Stored in Your Account.png",
        },
    ];

    return (
        <section className="w-full bg-white py-16">
            <div className="container mx-auto px-5">
                {/* Stacked layout with left-aligned title and features below */}
                <div className="flex flex-col items-start gap-6">
                    {/* TITLE SECTION (left-aligned) */}
                    <div className="text-left w-full max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2">
              What is
                        </h2>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Home Inspection
                        </h2>
                        <p className="text-base sm:text-lg font-light text-gray-700">
              Here's how our home inspection service protects you and keeps your
              rental experience stress-free.
                        </p>
                    </div>

                    {/* FEATURES SECTION (below title, now center-aligned) */}
                    <div className="w-full flex justify-center">
                        {/* Tablet & Desktop layout (horizontal line) */}
                        <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-12 lg:gap-20">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="flex flex-col items-center text-center gap-3"
                                >
                                    <div className="w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] relative flex-shrink-0">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    <h3 className="text-base w-[130px] lg:w-[160px] font-normal text-gray-900 leading-tight">
                                        {feature.title}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        {/* Mobile layout (centered, stacked) */}
                        <div className="flex flex-col items-center space-y-8 sm:hidden mt-6">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="flex flex-col items-center text-center gap-3"
                                >
                                    <div className="w-[80px] h-[80px] relative flex-shrink-0">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="text-base font-normal text-gray-900 leading-tight max-w-[200px]">
                                        {feature.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
