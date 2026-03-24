import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type FloorPlanImageItem = {
  src: string;
  title: string;
};

type FloorPlanCarouselProps = {
  images: FloorPlanImageItem[];
};

export function FloorPlanCarousel({ images }: FloorPlanCarouselProps) {
    return (
        <Carousel className="w-full m-auto carouselContainer">
            <CarouselContent>
                {images.map((data, index) => (
                    <CarouselItem key={index}>
                        <div className="max-w-full w-[83%] mx-auto">
                            {/* Use img instead of background */}
                            <Image
                                src={data.src}
                                alt={data.title}
                                width={800}
                                height={550}
                                className="w-full max-h-[550px] object-contain mx-auto"
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                            />
                            <div className="text-center font-normal mt-2">{data.title}</div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="floorCarouselPrevBtn" />
            <CarouselNext className="floorCarouselNextBtn" />
        </Carousel>
    );
}
