"use client";

import { EmailIcon, PhoneIcon, WhatsappIcon } from "@/assets/icons";

interface ContactUsHeroNewProps {
    className?: string;
}

export default function ContactUsHeroNew({
    className = "",
}: ContactUsHeroNewProps) {
    const whatsappNumber = "+8801335445544";
    const message =
        "Hi, I need assistance with finding the best apartments in my area.";

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const cards = [
        {
            icon: <PhoneIcon className="w-5 h-5 text-red-400" />,
            title: "Call us",
            description: "+88 09666 721 521",
            // no onClick for now
        },
        {
            icon: <EmailIcon className="w-5 h-5 text-red-400" />,
            title: "Email us",
            description: "info@opendoor.com.bd",
            // no onClick for now
        },
        {
            icon: <WhatsappIcon className="w-5 h-5 text-red-400" />,
            title: "Chat with us",
            description: "",
            onClick: handleWhatsAppClick,
        },
    ];

    return (
        <section 
            className={`pt-8 sm:pt-12 pb-0 text-center bg-cover sm:bg-cover bg-center bg-no-repeat ${className}`}
            style={{ 
                backgroundImage: 'url(/contact/contact_mob.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <style jsx>{`
                @media (min-width: 640px) {
                    section {
                        background-image: url(/contact/contact.jpeg) !important;
                    }
                }
            `}</style>
            <div className="py-8 sm:py-12 px-4 sm:px-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight tracking-tight">
                    Contact Us
                </h1>
                <p
                    className="mt-3 sm:mt-4 px-2 sm:px-4 md:px-0 text-sm sm:text-base md:text-lg text-black font-normal max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto text-center leading-relaxed"
                >
                    Whether you're a tenant, homeowner, or curious collaborator, our
                    team is ready to <br className="hidden sm:block" />
                    support your journey - with transparency, care, and solutions
                    that put people first.
                </p>
            </div>

            {/* Contact Cards */}
            <div className="mt-6 sm:mt-8 md:mt-16 px-4 sm:px-5 md:px-0 flex flex-col sm:flex-row sm:justify-center sm:space-x-8 md:space-x-16 space-y-3 sm:space-y-0 max-w-4xl mx-auto">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={card.onClick}
                        className={`group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                            card.onClick
                                ? "cursor-pointer hover:bg-white"
                                : "cursor-default"
                        }`}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                            {card.icon}
                        </div>
                        <div className="text-left">
                            <h3 className={`text-base sm:text-lg font-normal text-muted ${card.onClick ? 'group-hover:underline' : ''}`}>
                                {card.title}
                            </h3>
                            {card.description && (
                                <p className="text-base sm:text-lg text-black font-light">
                                    {card.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
