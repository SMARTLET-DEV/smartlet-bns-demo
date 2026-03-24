import { BathIcon, BedIcon, GeoAltIcon, SizeIcon } from "@/assets/icons";
import { FC } from "react";

interface ListingcardBottomProps {
    title: string;
    location: string;
    bed: number;
    bath: number;
    floorsqft: number;
    rent: number;
    propertyType?: string;
    spaceType?: "enclosed" | "open" | "ENCLOSED_SPACE" | "OPEN_SPACE";
    mobileLayout?: "fixed" | "full";
}

export const ListingcardBottom: FC<ListingcardBottomProps> = ({
    title,
    location,
    bed,
    bath,
    floorsqft,
    rent,
    propertyType,
    spaceType,
    mobileLayout = "fixed",
}) => {
    const isCommercial = propertyType?.toUpperCase() === "COMMERCIAL";
    const bedLabel = isCommercial
        ? (bed === 1 ? "Room" : "Rooms")
        : (bed === 1 ? "Bed" : "Beds");

    // Normalize space type from backend format (ENCLOSED_SPACE/OPEN_SPACE) to display format
    const normalizedSpaceType = spaceType?.toUpperCase();
    const isEnclosed = normalizedSpaceType === "ENCLOSED" || normalizedSpaceType === "ENCLOSED_SPACE";
    const isOpen = normalizedSpaceType === "OPEN" || normalizedSpaceType === "OPEN_SPACE";

    return (
        <div className={`${mobileLayout === "full" ? "w-full sm:w-[302px]" : "w-[317px] sm:w-[302px]"} rounded-2xl rounded-t-none bg-background shadow-sm p-4 sm:p-2 flex flex-col justify-between transition`}>
            <div className="space-y-2 mt-1">
                <h3 className="text-xl font-normal text-secondary mt-1">
                    ৳{Number(rent).toLocaleString()}{" "}
                    <span className="font-normal text-sm text-muted">
                        per month
                    </span>
                </h3>
                <h3 className="hidden text-lg font-light text-secondary text-left truncate whitespace-nowrap overflow-hidden">
                    {title}
                </h3>

                <div className="flex items-center text-base text-muted gap-1 mt-3">
                    <GeoAltIcon className="w-4 h-4" />
                    <span className="truncate whitespace-nowrap overflow-hidden">
                        {location}
                    </span>
                </div>

                {isCommercial ? (
                    <div className="flex items-center gap-4 text-base text-muted pt-2 mb-3.5 mr-1">
                        {spaceType && (isEnclosed || isOpen) && (
                            <div className="flex items-center gap-1">
                                {isEnclosed ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1" fill="none" />
                                        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
                                        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1" fill="none" />
                                    </svg>
                                )}
                                <span>
                                    {isEnclosed ? "Enclosed" : "Open"} Space
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <SizeIcon className="w-4 h-4" />
                            <span>{floorsqft} sqft</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between text-base text-muted pt-2 mb-3.5 mr-1">
                        <div className="flex items-center gap-1">
                            <BedIcon className="w-4 h-4" />
                            <span>{bed} {bedLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BathIcon className="w-4 h-4" />
                            <span>{bath} {bath === 1 ? "Bath" : "Baths"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <SizeIcon className="w-4 h-4" />
                            <span>{floorsqft} sqft</span>
                        </div>
                    </div>
                )}
            </div>

            {/*<div className="flex justify-between items-center border-t pt-4 mt-4 text-muted">
                <span className="text-[1.1rem] font-normal text-primary">
                    ৳{rent.toLocaleString()}{" "}
                    <span className="font-normal text-sm text-muted">
                        per month
                    </span>
                </span>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent"
                >
                    <ArrowUpRightIcon className="w-5 h-5 text-primary" />
                </Button>
            </div>*/}
        </div>
    );
};
