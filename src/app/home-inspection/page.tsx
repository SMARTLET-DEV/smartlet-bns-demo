"use client";
import { useEffect, useState } from "react";
import BasicInspectionFeeSection from "@/components/home-inspection/BasicInspectionFee";
import Hero from "@/components/home-inspection/Hero";
import HowItWorksSection from "@/components/home-inspection/HowItWorks";
import HowItWorksMobile from "@/components/home-inspection/HowItWorksMobile";
import RequestHomeInspectionSection from "@/components/home-inspection/RequestHomeInspection";
import WhatIsHomeInspectionSection from "@/components/home-inspection/WhatIsHomeInspection";

const Page = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="bg-white">
            <Hero />
            <WhatIsHomeInspectionSection />

            {isMobile ? <HowItWorksMobile /> : <HowItWorksSection />}

            <BasicInspectionFeeSection />
            <RequestHomeInspectionSection />
        </div>
    );
};

export default Page;
