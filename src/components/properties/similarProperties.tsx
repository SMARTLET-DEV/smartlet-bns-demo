"use client";

import { ListingCard } from "@/components/ListingCard/ListingCard";
import { SkeletonCard } from "@/components/ListingCard/SkeletonCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useParams } from "next/navigation";

type SimilarPropertiesProps = {
  similarProperties?: any[];
  currentPropertyId?: string;
};

const SimilarProperties = ({
    similarProperties = [],
    currentPropertyId,
}: SimilarPropertiesProps) => {
    const { id: paramId } = useParams();
    const excludeId = (currentPropertyId as string) || (paramId as string);

    // Filter properties to show only visible and approved ones, and exclude current property
    const filteredSimilarProperties = (similarProperties || []).filter(
        (property: any) =>
            property?.isVisible === true &&
      property?.viewStatus === "APPROVED" &&
      property?.id !== excludeId &&
      property?.isPaused === false
    );

    return (
        <>
            <section className="gap-6 bg-transparent mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-light text-secondary">
            Similar Properties
                    </h2>
                    <Button
                        variant="link"
                        size="icon"
                        className="h-6 w-6 p-0 mr-3 text-sm leading-none text-primary hover:bg-transparent"
                        asChild
                    >
                        <Link href="/residential/apartments-for-rent">See All</Link>
                    </Button>
                </div>
                <div className="relative">
                    <Carousel
                        opts={{
                            align: "center",
                        }}
                        className="w-full"
                    >
                        <CarouselPrevious className="rounded-sm hover:border-primary hover:text-primary -left-3 z-10 bg-white" />
                        <CarouselContent className="flex gap-16 sm:gap-12 p-2 mr-10">
                            {filteredSimilarProperties.length === 0 ? (
                                <div className="text-muted text-center">
                  No similar properties found.
                                </div>
                            ) : (
                                filteredSimilarProperties.map((property: any) => (
                                    <CarouselItem key={property.id} className="basis-[280px]">
                                        <ListingCard
                                            id={property.id}
                                            thumbnail={
                                                property?.thumbnail ||
                        "https://static.vecteezy.com/system/resources/previews/057/133/157/non_2x/cozy-living-room-with-modern-furniture-in-a-flat-design-style-featuring-soft-colors-and-minimalistic-decor-in-art-vector.jpg"
                                            }
                                            images={property?.media}
                                            label="smartVIEW"
                                            title={property?.title}
                                            location={`${property?.address}, ${property?.city}`}
                                            bed={property?.bedrooms}
                                            bath={property?.bathrooms}
                                            floorsqft={property?.size || 0}
                                            rent={property?.price}
                                            virtualTour={property?.virtualTour}
                                            propertyType={property?.propertyType}
                                            spaceType={property?.spaceType}
                                        />
                                    </CarouselItem>
                                ))
                            )}
                        </CarouselContent>
                        <CarouselNext className="rounded-sm hover:border-primary hover:text-primary -right-3 md:-right-5 z-10 bg-white" />
                    </Carousel>
                </div>
            </section>
        </>
    );
};

export default SimilarProperties;
