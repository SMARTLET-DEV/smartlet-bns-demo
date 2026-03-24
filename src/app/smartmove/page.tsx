"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/smartmove/Hero";
import LetUsHelpSection from "@/components/smartmove/LetUsHelpSection";
import PeaceOfMindSection from "@/components/smartmove/PeaceOfMind";
import ProvideQuotationSection from "@/components/smartmove/ProvideQuotation";
import RequestSmartmoveSection from "@/components/smartmove/RequestSmartmove";
import LetUseHelpSectionMobile from "@/components/smartmove/LetUseHelpSectionMobile";

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
            <PeaceOfMindSection />
            {isMobile ? <LetUseHelpSectionMobile /> : <LetUsHelpSection />}
            <ProvideQuotationSection />
            <RequestSmartmoveSection />
        </div>
    );
};

export default Page;
