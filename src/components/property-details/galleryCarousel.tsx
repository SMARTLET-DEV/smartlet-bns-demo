import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type GalleryCarouselProps = {
  images: string[];
  virtualTour?: string;
  title?: string;
  location?: string;
  onSmartViewClick?: () => void;
};

export function GalleryCarousel({
    images,
    virtualTour,
    title,
    location,
    onSmartViewClick,
}: GalleryCarouselProps) {
    return (
        <div className="relative w-full h-full">
            {/* SmartVIEW Button */}
            <Button
                disabled={!virtualTour}
                onClick={onSmartViewClick}
                className="absolute top-1.5 right-10 bg-secondary/15 backdrop-blur-xs rounded-md px-3 py-1 text-sm text-primary-foreground font-medium z-20 group-hover:text-primary group-hover:bg-background transition"
            >
        SmartVIEW
            </Button>

            <Carousel className="w-full h-full m-auto carouselContainer">
                <CarouselContent className="h-full">
                    {images.map((image: any, index: number) => (
                        <CarouselItem key={index}>
                            <div className="w-full h-full mx-auto">
                                <div
                                    style={{
                                        backgroundImage: `url(${image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                    className="w-full h-full"
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    {/* <img
                  src={data.src}
                  alt={`Property ${index + 1}`}
                  //   width={1000}
                  //   height={1000}
                  className="object-cover transition-all duration-500"
                /> */}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="floorCarouselPrevBtn" />
                <CarouselNext className="floorCarouselNextBtn" />
            </Carousel>
        </div>
    );
}
