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
import { useGetFilteredPropertiesQuery } from "@/redux/reducers/property/propertyApi";
import { useRouter } from "next/navigation";
import { PropertyFilters } from "@/lib/urlService";

const FeaturedCommercialProperties = () => {
    const router = useRouter();

    const filters: PropertyFilters = {
        take: 10,
        takeImage: 5,
        propertyType: "commercial",
        viewStatus: "APPROVED",
        isVisible: true,
        isPaused: false,
        orderBy: "-updatedAt",
        createdAtGt: "2023-01-01T00:00:00Z"
    };

    const {
        data: propertyData,
        isLoading,
        isError,
    } = useGetFilteredPropertiesQuery(filters);

    // No need for local filtering, API returns only filtered properties
    const filteredProperties = propertyData?.properties || [];

    const handleBrowseAll = () => {
    // Navigate to commercial properties page
        router.push("/commercial/space-for-rent");
    };

    return (
        <section className="pt-8 pb-16 bg-white relative">
            {/* Heading */}
            <div className="container mx-auto px-5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-10 text-left">
          Featured Commercial Properties
                </h2>
            </div>

            {/* Carousel */}
            <div className="container mx-auto px-5">
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselPrevious className="rounded-sm hover:border-primary hover:text-primary -left-3 z-10 bg-white" />
                    <CarouselContent className="flex gap-16 sm:gap-12 py-2 -ml-2 mr-12">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <CarouselItem key={index} className="basis-[280px]">
                                    <SkeletonCard />
                                </CarouselItem>
                            ))
                        ) : isError ? (
                            <div className="text-muted text-center">
                Failed to load properties.
                            </div>
                        ) : (
                            filteredProperties.map((property: any) => (
                                <CarouselItem key={property.id} className="basis-[280px]">
                                    <ListingCard
                                        id={property.id}
                                        thumbnail={
                                            property?.thumbnail ||
                      "https://static.vecteezy.com/system/resources/previews/057/133/157/non_2x/cozy-living-room-with-modern-furniture-in-a-flat-design-style-featuring-soft-colors-and-minimalistic-decor-in-art-vector.jpg"
                                        }
                                        images={property?.media}
                                        label="smartVIEW"
                                        title={property.title}
                                        location={`${property.address}, ${property.city}`}
                                        bed={property.bedrooms}
                                        bath={property.bathrooms}
                                        floorsqft={property?.size || 0}
                                        rent={property.price}
                                        virtualTour={property?.virtualTour}
                                        propertyType={property.propertyType}
                                        spaceType={property.spaceType}
                                    />
                                </CarouselItem>
                            ))
                        )}
                    </CarouselContent>
                    <CarouselNext className="rounded-sm hover:border-primary hover:text-primary -right-3 md:-right-5 z-10 bg-white" />
                </Carousel>
            </div>

            {/* Browse All Button */}
            <div className="container mx-auto px-5 mt-10 flex justify-center">
                <Button
                    variant="default"
                    className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-10 sm:py-6 text-base"
                    size="lg"
                    onClick={handleBrowseAll}
                >
          Browse All Commercial Properties
                </Button>
            </div>
        </section>
    );
};

export default FeaturedCommercialProperties;
