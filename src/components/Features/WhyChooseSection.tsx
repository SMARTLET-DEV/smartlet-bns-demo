import {
    DocumentVerificationIcon,
    MinimalChargesIcon,
    PersonalizedServiceIcon,
    VirtualTourIcon,
} from "@/assets/icons";
import { FeatureCard } from "./FeatureCard";

export const WhyChooseSection = () => {
    const features = [
        {
            logo: <VirtualTourIcon className="w-full h-full" />,
            title: "Virtual Tour",
            description:
        "Explore properties through immersive 360° views and interactive walkthroughs, reducing the need for multiple physical visits.",
            href: "/smart-view",
        },
        {
            logo: <DocumentVerificationIcon className="w-full h-full" />,
            title: "Document Verification",
            description:
        "We ensure secure rentals by verifying renter documents, protecting homeowners from risks and providing a smoother approval process.",
            href: "/document-verification",
        },
        {
            logo: <MinimalChargesIcon className="w-full h-full" />,
            title: "Minimal Charges",
            description:
        "We maintain low, transparent costs for renters and homeowners, with no hidden fees for a straightforward and affordable process.",
            href: "/plans",
        },
        {
            logo: <PersonalizedServiceIcon className="w-full h-full" />,
            title: "Personalized Service",
            description:
        "Our team provides tailored guidance for renters and homeowners, ensuring a smooth, customized, and hassle-free rental experience.",
            href: "/personalized-service",
        },
    ];

    return (
        <section className="w-full py-10 bg-white">
            <h2 className="container mx-auto px-5 text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10">
        Why Choose OPENDOOR
            </h2>
            <div className="container mx-auto px-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-7xl">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
};
