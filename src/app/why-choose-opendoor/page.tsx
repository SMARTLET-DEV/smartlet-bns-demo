"use client";

import ExploreServices from "@/components/why-choose-opendoor/ExploreServices";
import OpendoorPerks from "@/components/why-choose-opendoor/OpendoorPerks";
import SubSection from "@/components/why-choose-opendoor/SubSection";
import WhyChooseSmartLET from "@/components/why-choose-opendoor/WhyChooseOpendoor";
import { useEffect } from "react";

export interface Section {
    id: number;
    sectionId: string;
    img: string;
    title: string;
    subTitle: string;
    description: string;
    details: { title: string; description: string }[];
}

const sections: Section[] = [
    {
        id: 1,
        sectionId: "digital-experience",
        img: "/why-choose-opendoor/section/Best in Class Digital Experience.png",
        title: "Best in Class Digital Experience",
        subTitle: "See Before You Step In",
        description:
            "Visualize your future home like never before. smartVIEW is our proprietary property showcase feature that provides an immersive and high-definition viewing experience of rental properties.",
        details: [
            {
                title: "High-Quality Images",
                description:
                    "Each listing is photographed professionally, capturing the lighting, space, and ambience so you know exactly what to expect.",
            },
            {
                title: "360° Virtual Tours",
                description:
                    "Move through each room as if you're physically there. Explore kitchens, balconies, living rooms, and even bathrooms from your mobile or laptop.",
            },
            {
                title: "Immersive Experience",
                description:
                    "No surprises. No guesswork. With smartVIEW, renters gain a complete, realistic perspective of their future home—enabling smarter and more confident rental decisions, especially when you're unable to physically visit a property.",
            },
        ],
    },
    {
        id: 2,
        sectionId: "verified-listings",
        img: "/why-choose-opendoor/section/Verified Properties (2).png",
        title: "Verified Properties",
        subTitle: "Real Homes, Real Details",
        description:
            "We keep it real, always. Every property listed on OPENDOOR is thoroughly verified to ensure authenticity and accuracy.",
        details: [
            {
                title: "Personally Verified by Our Field Agents",
                description:
                    "Based on your budget, location, family size, and preferences.",
            },
            {
                title: "Updated with Accurate Rental Info",
                description: "Real-time pricing and availability information",
            },
            {
                title: "Ownership Authenticity Checked",
                description:
                    "Checked for Ownership Authenticity and Rent Readiness",
            },
        ],
    },
    {
        id: 3,
        sectionId: "renter-screening",
        img: "/why-choose-opendoor/section/Tenant Verification.png",
        title: "Tenant Screening",
        subTitle: "Verified Tenants, Safer Rentals",
        description:
            "Peace of mind starts with knowing who's renting your property. At OPENDOOR, we ensure every renter meets essential trust and eligibility criteria before moving forward.",
        details: [
            {
                title: "Eligibility & Trust Criteria",
                description:
                    "We ensure every renter meets basic eligibility and trust criteria before moving forward.",
            },
            {
                title: "Identity Verification",
                description:
                    "Identity verification using official documents for renter authenticity.",
            },
            {
                title: "Financial Screening",
                description:
                    "Financial screening to confirm rental capacity and minimize default risk.",
            },
        ],
    },
    {
        id: 4,
        sectionId: "property-inspection",
        img: "/why-choose-opendoor/section/Property Inspection (1).png",
        title: "Property Inspection",
        subTitle: "For a Fairer Move-In & Move-Out, Documented with Care",
        description:
            "A fair, photo-documented inspection to protect both renters and homeowners from future disputes.",
        details: [
            {
                title: "Neutral & Professional",
                description:
                    "Inspections are conducted by trained OPENDOOR inspectors to ensure an unbiased and fair assessment of the property.",
            },
            {
                title: "Photographic Documentation",
                description:
                    "We capture detailed visual records of the property's condition at handover—serving as clear evidence in case of future disputes.",
            },
            {
                title: "Dispute Protection",
                description:
                    "Our inspection report acts as a safeguard for both renters and homeowners, helping resolve any damage or condition-related disagreements quickly and fairly.",
            },
        ],
    },
    {
        id: 5,
        sectionId: "end-to-end",
        img: "/why-choose-opendoor/section/End to End Solution (2).png",
        title: "End to End Solution",
        subTitle: "From Listing to Leasing, All in One Place",
        description:
            "We handle the full listing process for you. From capturing professional visuals and SmartView virtual tours to publishing across our platform and social channels—your property gets maximum exposure without lifting a finger.",
        details: [
            {
                title: "Simplified Process",
                description:
                    "Our streamlined process simplifies the entire rental journey for both parties.",
            },
            {
                title: "End-to-End Visibility",
                description:
                    "Property listing, smartVIEW visuals, and digital promotion — all handled by us.",
            },
            {
                title: "Effortless Communication",
                description:
                    "Seamless communication between homeowners and verified tenants.",
            },
        ],
    },
];

const Page = () => {
    useEffect(() => {
        // Handle hash navigation when page loads
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        }
    }, []);

    return (
        <div className="bg-white">
            <>
                <WhyChooseSmartLET />
                <OpendoorPerks />
                {/* <Header /> */}
                <div className="h-8 lg:h-20"></div>
                <div className="container mx-auto px-5">
                    {sections.map((section) => (
                        <SubSection key={section.id} section={section} />
                    ))}
                </div>
                {/* <Footer /> */}
                <ExploreServices />
            </>
        </div>
    );
};

export default Page;
