"use client"

import StepsGrid from "@/components/howItWorks/StepsGrid";
import StepsGridMobile from "@/components/howItWorks/StepsGridMobile";

const ownerSteps = [
    {
        id: "log-in-homeowner",
        title: "Log in as a Homeowner",
        subtitle: "Access your account",
        image: "/how-it-works/owner/image-1.png",
    },
    {
        id: "add-property",
        title: "Add a Property",
        subtitle: "Click on the button to choose type of property",
        image: "/how-it-works/owner/image-2.png",
    },
    {
        id: "choose-package",
        title: "Choose a Package",
        subtitle: "Select the service package that fits your needs",
        image: "/how-it-works/owner/image-3.png",
    },
    {
        id: "submit-details",
        title: "Submit Details & Documents",
        subtitle: "Upload all necessary property information",
        image: "/how-it-works/owner/image-4.png",
    },
    {
        id: "schedule-visit",
        title: "Schedule Visit & Go Live",
        subtitle: "Our team will visit to create your property listing. Once verified, your property goes live",
        image: "/how-it-works/owner/image-5.png",
    },
];

const ownerStepsMobile = ownerSteps.map((step, index) => ({
    number: index + 1,
    title: step.title,
    subtitle: step.subtitle,
    image: step.image,
}));

export default function StepsGridOwner() {

    return (
        <>
            <div className="lg:hidden">
                <StepsGridMobile steps={ownerStepsMobile} />
            </div>
            <div className="hidden lg:block">
                <StepsGrid steps={ownerSteps} />
            </div>
        </>
    );
}