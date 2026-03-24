import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import React from "react";

type MiniThumbnailCarouselProps = {
  images: string[];
  isVertical?: boolean;
};

export function MiniThumbnailCarousel({ images, isVertical = false }: MiniThumbnailCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isEmpty = images.length === 0;


  return (
    <Carousel
      className={cn(
        "relative group m-auto",
        isVertical ? "w-full" : "max-w-[215px]"
      )}
    >
      <CarouselContent
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {isEmpty ? (
          <CarouselItem className="shrink-0 basis-full">
            <div
              className={cn(
                "mx-auto flex items-center justify-center bg-muted text-muted-foreground text-sm",
                isVertical
                  ? "w-full h-[175px] rounded-t-xl rounded-b-none"
                  : "w-[215px] h-[175px] rounded-xl"
              )}
            >
              No Image Available
            </div>
          </CarouselItem>
        ) : (
          images.map((image, index) => (
            <CarouselItem key={index} className="shrink-0 basis-full">
              <div
                className={cn(
                  "mx-auto bg-cover bg-center bg-no-repeat",
                  isVertical
                    ? "w-full h-[175px] rounded-t-xl rounded-b-none"
                    : "w-[215px] h-[175px] rounded-xl"
                )}
                style={{ backgroundImage: `url(${image})` }}
              />
            </CarouselItem>
          ))
        )}

      </CarouselContent>

      <CarouselPrevious
        className="floorCarouselPrevBtn disabled:opacity-0 disabled:group-hover:opacity-50 opacity-0 group-hover:opacity-100 transition"
        disabled={activeIndex === 0}
        onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
      />
      <CarouselNext
        className="floorCarouselNextBtn disabled:opacity-0 disabled:group-hover:opacity-50 opacity-0 group-hover:opacity-100 transition"
        disabled={activeIndex === images.length - 1}
        onClick={() => setActiveIndex((prev) => Math.min(images.length - 1, prev + 1))}
      />

      {/* Dot Paginator */}
      <div className="absolute bottom-2 w-full flex justify-center gap-1 md:hidden z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              index === activeIndex ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}
