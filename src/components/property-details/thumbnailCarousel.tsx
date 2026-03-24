"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shuffleKeepingIndexFirst } from "@/utils/shuffleArray";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { GalleryModal } from "./galleryModal";

type ThumbnailCarouselProps = {
  images: string[];
  height?: string;
  variant?: "default" | "large";
  virtualTour?: string;
  title?: string;
  location?: string;
  onSmartViewClick?: () => void;
  propertyId?: string;
};

export function ThumbnailCarousel({
    images,
    height = "h-[218px]",
    variant = "default",
    virtualTour,
    title,
    location,
    onSmartViewClick,
    propertyId,
}: ThumbnailCarouselProps) {
    const isLarge = variant === "large";
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const router = useRouter();
    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi?.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    // ✅ Use fallback if images is missing or empty
    const finalImages =
    images?.length > 0
        ? images
        : [
            "https://static.vecteezy.com/system/resources/previews/057/133/157/non_2x/cozy-living-room-with-modern-furniture-in-a-flat-design-style-featuring-soft-colors-and-minimalistic-decor-in-art-vector.jpg",
        ];
    const isSingleImage = finalImages.length === 1;
    return (
        <div
            className={cn(
                "w-full h-full relative overflow-hidden group",
                isLarge ? "md:rounded-2xl rounded-none" : "rounded-t-2xl rounded-b-none"
            )}
        >
            <Button
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-sm h-8 w-8 p-0 shadow-xs hover:border-primary hover:text-primary cursor-pointer"
                variant="outline"
                size="icon"
                disabled={isSingleImage}
            >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                onClick={scrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-sm h-8 w-8 p-0 shadow-xs hover:border-primary hover:text-primary cursor-pointer"
                variant="outline"
                size="icon"
                disabled={isSingleImage}
            >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
            </Button>

            {/* Carousel content */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {finalImages.map((image, index) => {
                        const shuffledImages = shuffleKeepingIndexFirst(finalImages, index);
                        return (
                            <div className="min-w-full" key={index}>
                                {isLarge ? (
                                    <GalleryModal
                                        media={shuffledImages}
                                        virtualTour={virtualTour}
                                        title={title}
                                        location={location}
                                        onSmartViewClick={onSmartViewClick}
                                    >
                                        <div
                                            className={cn("w-full", height)}
                                            onContextMenu={(e) => e.preventDefault()}
                                            style={{
                                                backgroundImage: `url(${image})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />
                                    </GalleryModal>
                                ) : (
                                    <div
                                        className={cn("w-full cursor-pointer", height)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        style={{
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                        onClick={() => {
                                            if (!propertyId) return;
                                            router.push(`/properties/${propertyId}`);
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dot Indicators (Mobile) */}
            <div className="absolute bottom-2 w-full flex justify-center gap-1 md:hidden z-10">
                {finalImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "h-2 rounded-full transition-all",
                            selectedIndex === index
                                ? "bg-primary w-5"
                                : "bg-background border border-muted w-2"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
