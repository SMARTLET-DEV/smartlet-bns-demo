"use client";

import { ListingCard } from "@/components/ListingCard/ListingCard";
import { useGetAllFavoritesQuery } from "@/redux/reducers/favorites/favoritesApi";

const serverURL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

const FavoritesList = () => {
    const { data, isLoading } = useGetAllFavoritesQuery();
    console.log("📦 Favorites List:", data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (data?.favoriteListings.length === 0) {
        return (
            <p className="text-center text-xl text-muted">
                No favorites found!
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {data?.favoriteListings.map((property: any) => (
                <ListingCard
                    key={property.id}
                    id={property.propertyId}
                    thumbnail={
                      property?.property?.thumbnail ||
                      "https://static.vecteezy.com/system/resources/previews/057/133/157/non_2x/cozy-living-room-with-modern-furniture-in-a-flat-design-style-featuring-soft-colors-and-minimalistic-decor-in-art-vector.jpg"
                    }
                    images={property?.property?.media}
                    label="smartVIEW"
                    title={property?.property?.title}
                    location={`${property?.property?.area}, ${property?.property?.city}`}
                    bed={property?.property?.bedrooms}
                    bath={property?.property?.bathrooms}
                    floorsqft={property?.property?.size || 0}
                    rent={property?.property?.price}
                    virtualTour={property?.virtualTour}
                    propertyType={property?.property?.propertyType}
                    spaceType={property?.property?.spaceType}
                />
            ))}
        </div>
    );
};

export default FavoritesList;
