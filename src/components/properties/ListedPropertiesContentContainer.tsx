"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { ListingCard } from "@/components/ListingCard/ListingCard";
import { SkeletonCard } from "@/components/ListingCard/SkeletonCard";
import PropertyLoadError from "@/components/properties/propertyloaderror";
import {
    useGetAllUnlistedPropertiesQuery,
} from "@/redux/reducers/property/propertyApi";
import { Button } from "../ui/button";
import PropertiesPageTitle from "./PropertiesPageTitle";
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

export default function ListedPropertiesContentContainer() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Parse filters from URL
    const filters = useMemo(() => {
        return parseCompleteUrl(pathname, searchParams);
    }, [pathname, searchParams]);

    const {
        data: apiData,
        isLoading,
        error,
        refetch,
    } = useGetAllUnlistedPropertiesQuery(filters);

    const properties = apiData?.properties || [];
    const pagination = apiData?.pagination || {};
    const totalPages = pagination.totalPages || 0;
    const listings = properties;
    const isError = !!error;
    const loading = isLoading;

    const onClickHandler = useCallback(
        (newPage: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (newPage === 1) {
                params.delete("page");
            } else {
                params.set("page", newPage.toString());
            }
            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
            router.push(newUrl);
        },
        [searchParams, pathname, router]
    );

    const screenWidth = useScreenWidth();
    const isSmallScreen = screenWidth < 640;

    // Determine number of columns and calculated width
    let cols = 1;
    if (screenWidth >= 2560) cols = 8;
    else if (screenWidth >= 2240) cols = 7;
    else if (screenWidth >= 1920) cols = 6;
    else if (screenWidth >= 1600) cols = 5;
    else if (screenWidth >= 1340) cols = 4;
    else if (screenWidth >= 1024) cols = 3;
    else if (screenWidth >= 700) cols = 2;

    const cardWidth = 302;
    const gap = 16;
    const contentWidth = cols * cardWidth + (cols - 1) * gap;

    return (
        <div className="flex w-full flex-col bg-[#FAFAFA] items-center">
            <div
                className="w-full transition-all duration-300 ease-in-out"
                style={{ width: isSmallScreen ? "100%" : `${contentWidth}px` }}
            >
                <div className={isSmallScreen ? "px-5" : ""}>
                    <PropertiesPageTitle
                        totalCount={pagination.totalCount || 0}
                        filters={filters}
                    />
                </div>
                <div
                    className={`pt-5 grid gap-[16px] justify-items-center ${isSmallScreen ? "px-5" : ""}`}
                    style={{
                        gridTemplateColumns: isSmallScreen
                            ? "1fr"
                            : `repeat(${cols}, minmax(0, 1fr))`
                    }}
                >
                    {loading ? (
                        Array.from({ length: 12 }).map((_, i) => (
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
        </div>
    );
}
