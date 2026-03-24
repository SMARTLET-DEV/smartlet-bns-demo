"use client";
import {
    BalconyIcon,
    BathIcon,
    BedIcon,
    ElevatorIcon,
    FacingIcon,
    FileIcon,
    FloorLevelIcon,
    GasCylinderIcon,
    GymIcon,
    HelpingHandIcon,
    ParkingIcon,
    PetFriendly,
    PoolIcon,
    SizeIcon,
    SofaIcon,
    UnitsIcon,
} from "@/assets/icons";
import { useMemo } from "react";

function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDecimalValue(value: string | number | null | undefined) {
    if (value == null) return null;
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

interface AboutPropertyCardProps {
  area?: number;
  features?: string[]; // e.g., ["Pet Friendly", "Furnished"]
  isIndividualOwner?: boolean;
  property: any;
}

export default function AboutPropertyCard({
    features = [],
    property,
}: AboutPropertyCardProps) {
    const isCommercial = property?.propertyType?.toUpperCase() === "COMMERCIAL";

    // Normalize space type from backend format (ENCLOSED_SPACE/OPEN_SPACE) to display format
    const normalizedSpaceType = property?.spaceType?.toUpperCase();
    const isEnclosed =
    normalizedSpaceType === "ENCLOSED" ||
    normalizedSpaceType === "ENCLOSED_SPACE";
    const isOpen =
    normalizedSpaceType === "OPEN" || normalizedSpaceType === "OPEN_SPACE";

    const allFeatures = useMemo(() => {
        const list: string[] = [...features];
        if (property?.gym) list.push("Gym");
        if (property?.swimmingPool) list.push("Swimming Pool");
        if (property?.petFriendly) list.push("Pet Friendly");
        if (property?.helpingHand) list.push("Helping Hand");
        if (property?.gas) list.push("Titas Gas");
        if (property?.Individual) list.push("Individual");
        return list;
    }, [features, property]);

    const furnishingStatus = useMemo(() => {
        if (property?.semiFurnished) return "Semi-furnished";
        if (property?.furnished) return "Furnished";
        return "Unfurnished";
    }, [property?.furnished, property?.semiFurnished]);

    const unitsDecimalValue = useMemo(() => {
        return formatDecimalValue(property?.units);
    }, [property?.units]);

    //console.log("All derived features:", allFeatures);
    return (
        <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="bg-white border border-gray-200 text-muted font-light p-5 rounded-2xl flex flex-col gap-6 w-full sm:max-w-[816px]">
                <p className="text-xl sm:text-2xl font-light text-secondary">
          About this Property
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {isCommercial && property?.spaceType && (isEnclosed || isOpen) && (
                        <div className="flex items-center gap-2">
                            {isEnclosed ? (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                    <line
                                        x1="12"
                                        y1="3"
                                        x2="12"
                                        y2="21"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1="3"
                                        y1="12"
                                        x2="21"
                                        y2="12"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </svg>
                            )}
                            <p>
                                <span className="font-normal text-secondary">
                                    {isEnclosed ? "Enclosed" : "Open"}
                                </span>{" "}
                Space
                            </p>
                        </div>
                    )}
                    {!(isCommercial && isOpen) && (
                        <div className="flex items-center gap-2">
                            <BedIcon className="w-5 h-5" />
                            <p>
                                <span className="font-normal text-secondary">
                                    {property?.bedrooms}
                                </span>{" "}
                                {!isCommercial
                                    ? property?.bedrooms === 1
                                        ? "Bedroom"
                                        : "Bedrooms"
                                    : property?.bedrooms === 1
                                        ? "Room"
                                        : "Rooms"}
                            </p>
                        </div>
                    )}
                    {property?.bathrooms != null && Number(property?.bathrooms) > 0 && (
                        <div className="flex items-center gap-2">
                            <BathIcon className="w-5 h-5" />
                            <p>
                                <span className="font-normal text-secondary">
                                    {property?.bathrooms}
                                </span>{" "}
                                {!isCommercial
                                    ? property?.bathrooms === 1
                                        ? "Bathroom"
                                        : "Bathrooms"
                                    : property?.bathrooms === 1
                                        ? "Washroom"
                                        : "Washrooms"}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <SizeIcon className="w-5 h-5" />
                        <p>
                            <span className="font-normal text-secondary">
                                {property?.size}
                            </span>{" "}
              sqft
                        </p>
                    </div>
                    {unitsDecimalValue && (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <UnitsIcon className="w-5 h-5" />
                                <p>
                                    {Number(property?.units) === 1 ? (
                                        <>
                                            <span className="font-normal text-secondary">Single</span>{" "}
                      Unit
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-semibold text-secondary">
                                                {unitsDecimalValue}
                                            </span>{" "}
                      Units
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                    {property?.balcony != null && Number(property?.balcony) > 0 && (
                        <div className="flex items-center gap-2">
                            <BalconyIcon className="w-5 h-5" />
                            <p>
                                <span className="font-normal text-secondary">
                                    {property?.balcony}
                                </span>{" "}
                Balcony
                            </p>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <FacingIcon className="w-5 h-5" />
                        <p>
                            <span className="font-normal text-secondary">
                                {property?.facing}
                            </span>{" "}
              Facing
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ParkingIcon className="w-5 h-5" />
                        <p>
                            <span className="font-normal text-secondary">
                                {property?.parking ?? 0}
                            </span>{" "}
              Parking
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ElevatorIcon className="w-5 h-5" />
                        <p>
                            <span className="font-normal text-secondary">
                                {property?.elevators ?? 0}
                            </span>{" "}
                            {property?.elevators === 1 ? "Elevator" : "Elevators"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FloorLevelIcon className="w-5 h-5" />
                        <p>
                            <span className="font-normal text-secondary">
                                {property?.floor}
                            </span>{" "}
              Floor
                        </p>
                    </div>
                    {allFeatures.includes("Pet Friendly") && (
                        <div className="flex items-center gap-2">
                            <PetFriendly className="w-5 h-5" />
                            <p>Pet Friendly</p>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <SofaIcon className="w-5 h-5" />
                        <p>{furnishingStatus}</p>
                    </div>
                    {allFeatures.includes("Gym") && (
                        <div className="flex items-center gap-2">
                            <GymIcon className="w-5 h-5" />
                            <p>Gym</p>
                        </div>
                    )}
                    {allFeatures.includes("Swimming Pool") && (
                        <div className="flex items-center gap-2">
                            <PoolIcon className="w-5 h-5" />
                            <p>Swimming Pool</p>
                        </div>
                    )}
                    {allFeatures.includes("Helping Hand Room") && (
                        <div className="flex items-center gap-2">
                            <HelpingHandIcon className="w-5 h-5" />
                            <p>Helping Hand Room</p>
                        </div>
                    )}
                    {allFeatures.includes("Titas Gas") && (
                        <div className="flex items-center gap-2">
                            <GasCylinderIcon className="w-6 h-6" />
                            <p>Titas Gas</p>
                        </div>
                    )}
                    {allFeatures.includes("Individual") && (
                        <div className="flex items-center gap-2">
                            <GasCylinderIcon className="w-6 h-6" />
                            <p>Individual</p>
                        </div>
                    )}
                    {property?.letAgreed && (
                        <div className="flex items-center gap-2">
                            <FileIcon className="w-5 h-5" />
                            <p className="text-secondary">In Agreement</p>
                        </div>
                    )}
                </div>

                <p>{property?.description}</p>
            </div>
        </div>
    );
}
