"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { ListingCard } from "@/components/ListingCard/ListingCard";
import { SkeletonCard } from "@/components/ListingCard/SkeletonCard";
import PropertyLoadError from "@/components/properties/propertyloaderror";
import {
    useGetFilteredPropertiesQuery,
    useGetAllUnlistedPropertiesQuery,
    useGetGeoListBySearchQuery,
    useGetGeoListByCityQuery,
} from "@/redux/reducers/property/propertyApi";
import MapExample from "../mapbox/MapExample";
import { Button } from "../ui/button";
import PropertiesPageTitle from "./PropertiesPageTitle";
import { useIsMobile } from "@/hooks/useIsMobile";
import useScreenHeight from "@/hooks/useScreenHeight";
import useScreenWidth from "@/hooks/useScreenWidth";
import NoPropertyFoundError from "./noPropertyFoundError";
import { parseCompleteUrl } from "@/lib/urlService";

function getPaginationRange({
    currentPage,
    totalPages,
    siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}): (number | "...")[] {
    const totalNumbers = siblingCount * 2 + 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSibling > 2;
    const shouldShowRightDots = rightSibling < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItems = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => i + 1
        );
        return [...leftItems, "...", totalPages];
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItems = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => totalPages - (3 + siblingCount * 2) + 1 + i
        );
        return [1, "...", ...rightItems];
    } else if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
            { length: siblingCount * 2 + 1 },
            (_, i) => leftSibling + i
        );
        return [1, "...", ...middleRange, "...", totalPages];
    } else return [1];
}

export default function PropertiesContentContainer() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Check if this is the listed route
    const isListedRoute = pathname.startsWith("/listed");

    // Parse filters from URL (single source of truth)
    const filters = useMemo(() => {
        return parseCompleteUrl(pathname, searchParams);
    }, [pathname, searchParams]);

    // Use different API endpoint for listed route
    // Call both hooks but skip the one we don't need
    // Pass all filters to the listed query so it can filter by bedrooms, location, price, etc.
    const listedQuery = useGetAllUnlistedPropertiesQuery(filters, {
        skip: !isListedRoute,
    });

    const filteredQuery = useGetFilteredPropertiesQuery(filters, {
        skip: isListedRoute,
    });

    // Use the appropriate query result
    const {
        data: apiData,
        isLoading,
        error,
        refetch,
    } = isListedRoute ? listedQuery : filteredQuery;

    // Use API data directly (no Redux for data)
    const properties = apiData?.properties || [];
    const pagination = apiData?.pagination || {};
    const totalPages = pagination.totalPages || 0;
    const listings = properties;
    const isError = !!error;
    const loading = isLoading;

    const searchKeyword = (filters.search || "").trim();
    const defaultCity = "Dhaka";
    const cityParam = searchParams.get("filter[city][eq]") || defaultCity;

    // Fetch geo markers independently of pagination when a search keyword exists
    const {
        data: geoList = [],
        isFetching: isGeoLoading,
        isError: isGeoError,
    } = useGetGeoListBySearchQuery(searchKeyword, {
        skip: !searchKeyword,
    });

    // Fallback: fetch geo markers by city when no search keyword
    const {
        data: geoCityList = [],
        isFetching: isGeoCityLoading,
        isError: isGeoCityError,
    } = useGetGeoListByCityQuery(cityParam, {
        skip: !!searchKeyword,
    });

    const onClickHandler = useCallback(
        (newPage: number) => {
            // Generate simple URL with just page param on current path
            const params = new URLSearchParams(searchParams.toString());
            if (newPage === 1) {
                params.delete("page");
            } else {
                params.set("page", newPage.toString());
            }
            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

            // console.log("📄 Pagination click: page", newPage, "→ URL:", newUrl);
            router.push(newUrl);
        },
        [searchParams, pathname, router]
    );

    // ✅ Dynamic card area width based on screen size
    const screenWidth = useScreenWidth();
    const mdCardAreaWidth = 24 + 302;
    const lgCardAreaWidth = 24 + 302 + 302 + 20; // 2 cards in lg (302*2 + gap/pad)
    const xlCardAreaWidth = 24 + 302 + 302 + 302 + 20 + 20; // 3 cards in xl

    // formula for calculating card area width = left padding + no of cards*302 + 12*(no of cards-1) + 4

    let cardAreaWidth = "100%";
    if (isListedRoute) {
        cardAreaWidth = "100%";
    } else if (screenWidth >= 1280) cardAreaWidth = `${xlCardAreaWidth}px`;
    else if (screenWidth >= 1024) cardAreaWidth = `${lgCardAreaWidth}px`;
    else if (screenWidth >= 768) cardAreaWidth = `${mdCardAreaWidth}px`;
    else if (screenWidth >= 640) cardAreaWidth = `${mdCardAreaWidth}px`;
    else cardAreaWidth = "100%"; // Force 100% on mobile

    const mapWidth =
    !isListedRoute && screenWidth >= 640
        ? screenWidth - parseInt(cardAreaWidth as string)
        : undefined;

    const screenHeight = useScreenHeight();
    const isMobile = useIsMobile();

    // Avoid early return before all hooks; provide a safe fallback height
    const effectiveScreenHeight = screenHeight || 600;
    const calculatedHeight = effectiveScreenHeight - 52 - 36 - 10 - 10;

    const isSmallScreen = screenWidth < 640;
    const sidePadding = isSmallScreen
        ? Math.max((screenWidth - 302) / 2, 12)
        : 24;

    // Normalize varying API response shapes and key names; build markers solely from geo-list endpoints
    const { normalizeGeo, propertyDataForMap } = useMemo(() => {
        const toArray = (payload: any): any[] => {
            if (Array.isArray(payload)) return payload;
            if (Array.isArray(payload?.data)) return payload.data;
            if (Array.isArray(payload?.properties)) return payload.properties;
            return [];
        };

        const extractLngLat = (obj: any): [number, number] | null => {
            const lon =
        obj?.longitude ??
        obj?.long ??
        obj?.lng ??
        obj?.lon ??
        obj?.geo?.lng ??
        obj?.geo?.lon;
            const lat = obj?.latitude ?? obj?.lat ?? obj?.geo?.lat;
            const lngNum = typeof lon === "string" ? parseFloat(lon) : Number(lon);
            const latNum = typeof lat === "string" ? parseFloat(lat) : Number(lat);
            if (!isNaN(lngNum) && !isNaN(latNum)) return [lngNum, latNum];
            return null;
        };

        const geoListArr = toArray(geoList);
        const geoCityListArr = toArray(geoCityList);
        const hasSearch = !!searchKeyword;

        const source = hasSearch ? geoListArr : geoCityListArr;
        const coordinates = source.map(extractLngLat).filter(Boolean) as [
      number,
      number
    ][];

        // Extract full property data for the map
        const propertyData = source
            .filter((obj: any) => extractLngLat(obj) !== null)
            .map((obj: any) => ({
                id: obj.id || "",
                latitude: obj.latitude || obj.lat || obj.geo?.lat || 0,
                longitude:
          obj.longitude || obj.long || obj.lng || obj.lon || obj.geo?.lng || 0,
                bedrooms: obj.bedrooms || 0,
                bathrooms: obj.bathrooms || 0,
                size: obj.size || "0",
                thumbnail: obj.thumbnail || "",
                title: obj.title || "",
                price: obj.price || 0,
                area: obj.area || "",
                city: obj.city || "",
            }));

        return { normalizeGeo: coordinates, propertyDataForMap: propertyData };
    }, [geoList, geoCityList, searchKeyword]);

    const markerCoordinates: [number, number][] = useMemo(() => {
        const jitter = 0.00005;
        return normalizeGeo.map((pt) => [
            pt[0] + (Math.random() - 0.5) * jitter,
            pt[1] + (Math.random() - 0.5) * jitter,
        ]);
    }, [normalizeGeo]);

    // Compute dynamic zoom center: average of all marker coordinates, fallback to default
    const defaultCenter: [number, number] = [
        90.4364773079152, 23.811174944791546,
    ];
    const zoomCenter: [number, number] = markerCoordinates.length
        ? [
            markerCoordinates.reduce((sum, c) => sum + c[0], 0) /
      markerCoordinates.length,
            markerCoordinates.reduce((sum, c) => sum + c[1], 0) /
      markerCoordinates.length,
        ]
        : defaultCenter;

    return (
        <div className="flex w-full flex-col sm:flex-row bg-[#FAFAFA] gap-0 lg:gap-[12px]">
            {/* Left: Card Grid */}
            <div className="w-full" style={{ width: cardAreaWidth }}>
                <div
                    className={
                        isListedRoute ? "px-5 sm:px-8 md:px-12 lg:px-16" : "px-5 sm:px-0"
                    }
                    style={
                        isListedRoute && isSmallScreen
                            ? {
                                marginLeft: "calc(50% - 50vw)",
                                marginRight: "calc(50% - 50vw)",
                                width: "100vw",
                            }
                            : undefined
                    }
                >
                    <PropertiesPageTitle
                        totalCount={pagination.totalCount || 0}
                        filters={filters}
                    />
                </div>
                <div
                    className={`pt-5 grid gap-[16px] justify-items-stretch sm:justify-items-center" ${isListedRoute ? "px-5 sm:px-8 md:px-12 lg:px-16" : "px-5 sm:px-0"
                    } ${listings?.length === 0 && !loading
                        ? "grid-cols-1"
                        : isListedRoute
                            ? screenWidth >= 1600
                                ? "grid-cols-5"
                                : screenWidth >= 1340
                                    ? "grid-cols-4"
                                    : screenWidth >= 1024
                                        ? "grid-cols-3"
                                        : screenWidth >= 700
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                            : screenWidth >= 1280
                                ? "grid-cols-3"
                                : screenWidth >= 1024
                                    ? "grid-cols-2"
                                    : screenWidth >= 768
                                        ? "grid-cols-1"
                                        : "grid-cols-1"
                    }`}
                >
                    {loading ? (
                        Array.from({ length: 12 /*itemsPerPage*/ }).map((_, i) => (
                            <SkeletonCard key={i} mobileLayout="full" />
                        ))
                    ) : isError ? (
                        <PropertyLoadError onRetry={refetch} />
                    ) : listings.length === 0 && !loading ? (
                        <NoPropertyFoundError onRetry={refetch} />
                    ) : (
                        listings.map((p: any) => (
                            <ListingCard
                                key={p.id}
                                id={p.id}
                                thumbnail={
                                    p.thumbnail ||
                  "https://static.vecteezy.com/system/resources/previews/057/133/157/non_2x/cozy-living-room-with-modern-furniture-in-a-flat-design-style-featuring-soft-colors-and-minimalistic-decor-in-art-vector.jpg"
                                }
                                images={p.media}
                                label="smartVIEW"
                                title={p.title}
                                location={`${p.address}, ${p.city}`}
                                bed={p.bedrooms}
                                bath={p.bathrooms}
                                floorsqft={p.size ?? 0}
                                rent={p.price}
                                from="explorer"
                                virtualTour={p?.virtualTour}
                                propertyType={p.propertyType}
                                spaceType={p.spaceType}
                                mobileLayout="full"
                            />
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {listings?.length > 0 && (
                    <div className="my-9 overflow-x-auto">
                        <div className="flex justify-center items-center gap-2 whitespace-nowrap px-2 min-w-fit">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    onClickHandler((filters.page || 1) - 1);
                                }}
                                disabled={(filters.page || 1) === 1}
                                className="shrink-0"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>

                            {getPaginationRange({
                                currentPage: filters.page || 1,
                                totalPages,
                            }).map((item, idx) => (
                                <Button
                                    key={idx}
                                    variant={(filters.page || 1) === item ? "default" : "outline"}
                                    className="w-9 px-0 text-sm shrink-0"
                                    onClick={() => {
                                        onClickHandler(parseInt(item as string, 10));
                                    }}
                                >
                                    {item}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    onClickHandler((filters.page || 1) + 1);
                                }}
                                disabled={(filters.page || 1) === totalPages}
                                className="shrink-0"
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Wrapper */}
            {/* Map Wrapper - hide on listed route */}
            {!isListedRoute && (
                <div
                    className={
                        isSmallScreen
                            ? "w-screen -mx-[50vw] left-1/2 relative mt-5"
                            : "relative"
                    }
                    style={{
                        width: isSmallScreen
                            ? "100vw"
                            : mapWidth
                                ? `${mapWidth}px`
                                : undefined,
                    }}
                >
                    <div className={isSmallScreen ? "" : "sticky top-0 h-screen"}>
                        <MapExample
                            height={isSmallScreen ? 300 : effectiveScreenHeight}
                            propertyMarkers={markerCoordinates}
                            zoomCenter={zoomCenter}
                            propertyData={propertyDataForMap}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


