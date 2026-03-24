"use client";
import { HeartFilledIcon, HeartIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { markSmartViewClicked } from "@/redux/reducers/property/smartViewSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SmartViewModal } from "../property-details/smartViewModal";
import { ThumbnailCarousel } from "../property-details/thumbnailCarousel";

type ButtonLikeProps = ComponentProps<typeof Button>;

interface ListingcardcontainerProps {
  id?: string;
  hoveredCardId?: string | null;
  thumbnail?: string;
  images: string[];
  label: string;
  heartButtonProps?: ButtonLikeProps;
  variant?: "default" | "large";
  virtualTour?: string;
  title?: string;
  location?: string;
  propertyId: any;
  letAgreed?: boolean;
  mobileLayout?: "fixed" | "full";
}

export function Listingcardcontainer({
    id,
    hoveredCardId,
    thumbnail,
    images,
    label,
    variant = "default",
    virtualTour,
    title,
    location,
    propertyId,
    letAgreed = false,
    mobileLayout = "fixed",
}: ListingcardcontainerProps) {
    const dispatch = useDispatch();

    const hasHydrated = useHasHydrated();
    const smartViewAlreadyClicked = useSelector(
        (state: RootState) =>
            state.smartView.clickedByPropertyId[String(propertyId)] === true
    );

    const handleSmartViewClick = () => {
        setModalOpen(true);
        // mark as clicked so glow never shows again for this propertyId
        dispatch(markSmartViewClicked({ propertyId }));
    };
    // Sanitize incoming media URLs that may include whitespace or wrapping quotes/backticks
    const sanitizeUrl = (url?: string) => {
        if (!url) return "";
        const trimmed = url.trim();
        // Remove leading/trailing quotes or backticks if presentt
        return trimmed.replace(/^\s*[`'\"]+/, "").replace(/[`'\"]+\s*$/, "");
    };
    const sanitizedThumbnail = sanitizeUrl(thumbnail);
    const sanitizedImages = Array.isArray(images)
        ? images.map((u) => sanitizeUrl(u)).filter((u) => !!u)
        : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isMobile = useIsMobile();

    const [modalOpen, setModalOpen] = useState(false);
    const [galleryModalOpen, setGalleryModalOpen] = useState(false);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    };

    const containerStyles =
    variant === "large"
        ? "lg:max-w-[956px] md:h-[418px] lg:h-[496px] sm:rounded-2xl w-full h-[320px] rounded-none"
        : mobileLayout === "full"
            ? "w-full sm:w-[302px] h-[218px] rounded-2xl rounded-b-none"
            : "w-[317px] sm:w-[302px] h-[218px] rounded-2xl rounded-b-none";

    const shouldShowCarousel = variant === "large" || hoveredCardId === id;
    {
    /* Label */
    }

    const shouldShowThumbnail =
    variant === "default" && hoveredCardId !== id && sanitizedThumbnail;

    const glowClass =
    hasHydrated && !smartViewAlreadyClicked ? "glare-pulse--white" : "";

    return (
        <>
            <div
                className={cn(
                    "relative overflow-visible transition group",
                    containerStyles
                )}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* LET AGREED Button */}
                {letAgreed && (
                    <div
                        className="absolute top-3 right-[120px] bg-[#ff3b5c]/80 backdrop-blur-md rounded-md px-3 h-9 flex items-center justify-center text-sm text-white font-medium z-10 border-0 pointer-events-none tracking-wide"
                    >
            LET AGREED
                    </div>
                )}
                {virtualTour && (
                    <SmartViewModal
                        virtualTour={virtualTour}
                        title={title}
                        location={location}
                        triggerState={modalOpen}
                        setTriggerState={setModalOpen}
                        triggerNode={
                            <Button
                                disabled={!virtualTour}
                                className={cn(
                                    "absolute top-3 right-3 border border-white/70 bg-secondary/15 backdrop-blur-xs rounded-md px-3 py-1 text-sm text-primary-foreground font-medium z-10 group-hover:text-primary group-hover:bg-background transition",
                                    glowClass
                                )}
                                onClick={handleSmartViewClick}
                                aria-pressed={hasHydrated ? smartViewAlreadyClicked : undefined} // avoid mismatch
                                data-once={hasHydrated && smartViewAlreadyClicked ? "1" : "0"}
                            >
                                {label}
                            </Button>
                        }
                    />
                )}

                {/* Always render the Carousel, just toggle its visibility */}
                <div
                    className={cn(
                        shouldShowCarousel
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none",
                        "absolute inset-0 transition-opacity duration-300 z-0"
                    )}
                >
                    <ThumbnailCarousel
                        images={sanitizedImages}
                        variant={variant}
                        height={
                            variant === "large" ? "h-[320px] sm:h-[496px]" : "h-[218px]"
                        }
                        virtualTour={virtualTour}
                        title={title}
                        location={location}
                        onSmartViewClick={() => {
                            setGalleryModalOpen(false);
                            setModalOpen(true);
                        }}
                        propertyId={propertyId}
                    />
                </div>

                {/* Show thumbnail if not hovered and in default variant */}
                {shouldShowThumbnail && (
                    <div
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                            backgroundImage: `url(${sanitizedThumbnail})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                        className="w-full h-full rounded-t-2xl rounded-b-none"
                    />
                )}
            </div>
        </>
    );
}
