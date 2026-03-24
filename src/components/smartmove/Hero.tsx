"use client";

import Image from "next/image";
import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div className="w-full py-12 text-center">
            {/* Header */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
        smartMOVE – A Moving Service
            </h1>
      
            {/* Paragraph */}
            <p className="mt-2 text-lg font-normal text-[#5A5A5A] mb-4 max-w-3xl mx-auto">
        From packing to settling in, we handle every step of your move with care, <br />
        so you can focus on starting fresh.
            </p>

            {/* Button */}
            <div className="flex justify-center mb-0">
                <Button
                    variant="outline"
                    className="w-fit border-primary text-primary hover:bg-primary hover:text-white duration-200 font-normal bg-transparent"
                    size="lg"
                    onClick={() => {
                        document
                            .getElementById("request-smartmove-form")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
          Get a Quote
                </Button>
            </div>

            {/* Image */}
            <Image
                src="/smartmove/hero_desktop.png"
                alt="SmartMove Hero Background"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain block"
                priority
            />
        </div>
    );
};

export default Hero;