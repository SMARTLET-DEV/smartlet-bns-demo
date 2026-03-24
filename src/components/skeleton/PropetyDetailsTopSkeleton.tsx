import React from "react";
import  ListingcardcontainerSkeleton  from "./ListingCardContainerSkeleton";
import PropertyInfoCardSkeleton from "./PropertyInfoCardSkeleton";

const PropertyDetailsTopSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row w-full container mx-auto sm:px-9 xl:px-5 gap-4 mt-6">
            {/* Listingcardcontainer Skeleton */}
            <ListingcardcontainerSkeleton />

            {/* PropertyInfoCard Skeleton */}
            <PropertyInfoCardSkeleton />
        </div>
    );
};

export default PropertyDetailsTopSkeleton;
