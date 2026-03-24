"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function FloatingWhatsAppButton() {
    const whatsappNumber = "+8801335445544";
    const message =
    "Hi, I need assistance with finding the best apartments in my area.";

    const isMobile = useIsMobile();
    const isHomeFilterOpen = useSelector(
        (state: RootState) => state.property.propertyModal.homeFilterOpen
    );
    const isListingFilterOpen = useSelector(
        (state: RootState) => state.property.propertyModal.listingFilterOpen
    );

    const handleClick = () => {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank");
    };

    if (isMobile && (isHomeFilterOpen || isListingFilterOpen)) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-50 cursor-pointer"
            id="whatsapp-button"
            onClick={handleClick}
        >
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300">
                <Image
                    src="/whatsapp-logo.png"
                    alt="WhatsApp"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    priority
                />
            </div>
        </div>
    );
}
