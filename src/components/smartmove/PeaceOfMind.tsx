"use client";

import Image from "next/image";

export default function PeaceOfMindSection() {
    const features = [
        {
            id: 1,
            title: "Professional Equipment",
            description: `Great teams build great <br> companies. We invest in people <br> before process.`,
            image: "/smartmove/peace_of_minds/Professional Equipment (1).png",
            align: "left",
        },
        {
            id: 2,
            title: "Expert Handling",
            description: `Great teams build great <br> companies. We invest in people <br> before process.`,
            image: "/smartmove/peace_of_minds/Expert Handling (1).png",
            align: "right",
        },
        {
            id: 3,
            title: "Fully Protected Transit",
            description: `All your items are secured and <br> documented for safety and <br> accountability.`,
            image: "/smartmove/peace_of_minds/Fully Protected Transit (1).png",
            align: "left",
        },
        {
            id: 4,
            title: "Real-Time Assistance",
            description: `Our movers are trained to <br> handle your belongings with <br> precision and respect.`,
            image: "/smartmove/peace_of_minds/Real-Time Assistance.png",
            align: "right",
        },
    ];

    return (
        <section className="w-full bg-white py-20">
            <div className="container mx-auto px-5">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                    {/* Left Text Section */}
                    <div className="flex-1 text-left">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2">
              Peace of Mind
                        </h2>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Guaranteed
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-base max-w-md">
              Although the items belong to you, we take full responsibility for
              their safety during the move. From packing to delivery, we make
              sure nothing is left to chance.
                        </p>
                    </div>

                    {/* Right Features Section */}
                    <div className="flex-1 relative space-y-0">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className={`flex items-start gap-4 justify-start 
                  ${
                            feature.align === "left"
                                ? "lg:justify-start"
                                : "lg:justify-end"
                            }`}
                            >
                                {/* Image */}
                                <div className="w-[120px] h-[120px] relative flex-shrink-0">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Text */}
                                <div className="max-w-xs text-left">
                                    <h3 className="text-lg font-light text-gray-900 mb-1">
                                        {feature.title}
                                    </h3>
                                    <p
                                        className="text-gray-600 text-base leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: feature.description,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
