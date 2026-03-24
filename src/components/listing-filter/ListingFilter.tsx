"use client";
import { X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useLazyGetSearchSuggestionsQuery } from "@/redux/reducers/search/searchSuggestApi";
import CustomSearchInput from "../searchbox/customSearchInput";
import { Button } from "../ui/button";
import BedroomFilter from "./BedroomFilter";
import MoreFiltersComponent from "./MoreFiltersComponent";
import PriceFilter from "./PriceFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import SharePropertyDialog from "../property-details/sharePropertyDialog";
import { extractLocationFromSearch, PropertyFilters } from "@/lib/urlService";
import { CheckboxItem } from "./listing-filter";
import SpaceTypeFilter from "./SpaceTypeFilter";
import { usePathname } from "next/navigation";
import { FilterFormContent, FilterConfig, FilterResult } from "../searchbox/FilterFormContent";
import { FilterIcon } from "@/assets/icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDispatch } from "react-redux";
import { setListingFilterOpen } from "@/redux/reducers/property/propertySlice";

const propertyTypes: CheckboxItem[] = [
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
];

// Base filters - Pet Friendly, Swimming Pool, and Gym will be conditionally included for residential only
const baseMoreFilters: CheckboxItem[] = [
    { id: "furnished", label: "Furnished" },
    { id: "unfurnished", label: "Unfurnished" },
    { id: "parking", label: "Parking" },
];

const residentialOnlyFilters: CheckboxItem[] = [
    { id: "unused", label: "Unused" },
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "pet-friendly", label: "Pet Friendly" },
];

// Always last filter
const lastFilters: CheckboxItem[] = [
    { id: "let-agreed", label: "Exclude Let Agreed" },
];

export default function ListingFilter() {
    // URL-based filters (single source of truth)
    const { filters, updateFilters, resetFilters } = useUrlFilters();
    const pathname = usePathname();
    const dispatch = useDispatch();

    // Check if this is the listed route
    const isListedRoute = pathname.startsWith("/listed");

    // Conditionally include Pet Friendly, Swimming Pool, and Gym only for residential properties
    // On listed page, show all filters (including residential-only filters) since we show all property types
    const moreFilters = useMemo(() => {
        if (isListedRoute) {
            // On listed page, show all filters including residential-only filters
            return [...baseMoreFilters, ...residentialOnlyFilters, ...lastFilters];
        }
        if (filters.propertyType === "residential") {
            return [...baseMoreFilters, ...residentialOnlyFilters, ...lastFilters];
        }
        return [...baseMoreFilters, ...lastFilters];
    }, [filters.propertyType, isListedRoute]);

    // Initialize search input value from URL location
    const initialSearchValue = filters.location
        ? filters.location
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";
    const [searchValue, setSearchValue] = useState(initialSearchValue);
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);

    // Search suggestions query
    const [triggerSuggest, { data: suggestions }] =
    useLazyGetSearchSuggestionsQuery();

    // Only trigger suggestions when user is typing (not programmatic changes)
    const handleSearchChange = (val: string) => {
        setSearchValue(val);
        if (val.length >= 3) {
            triggerSuggest(val);
            setIsSuggestionVisible(true);
        } else {
            setIsSuggestionVisible(false);
        }
    };

    // Update filters when search is explicitly clicked
    const handleSearchClick = () => {
        if (searchValue.trim()) {
            const location = extractLocationFromSearch(searchValue);
            updateFilters({ location });
        } else {
            updateFilters({ location: undefined });
        }
        setIsSuggestionVisible(false);
    };

    // When user selects a suggestion
    const handleSuggestionClick = (val: string) => {
        setSearchValue(val);
        const location = extractLocationFromSearch(val);
        if (location) {
            updateFilters({ location });
        }
        setIsSuggestionVisible(false);
    };

    // Keep searchValue synced with URL (but don't trigger suggestions)
    useEffect(() => {
        let displayValue = "";
        if (filters.location) {
            displayValue = filters.location
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }
        if (displayValue !== searchValue) {
            setSearchValue(displayValue);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.location]);

    // Clear bedroom value when switching to commercial + open space (rooms filter is hidden)
    useEffect(() => {
        const isOpenSpaceCommercial =
      filters.propertyType === "commercial" && filters.spaceType === "open";

        if (isOpenSpaceCommercial && filters.bedrooms) {
            updateFilters({ bedrooms: undefined });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.propertyType, filters.spaceType]);

    // Clear invalid bedroom value (1) when switching to Commercial + Enclosed Space
    useEffect(() => {
        const isEnclosedCommercial =
      filters.propertyType === "commercial" && filters.spaceType === "enclosed";

        if (isEnclosedCommercial && filters.bedrooms === 1) {
            updateFilters({ bedrooms: undefined });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.propertyType, filters.spaceType]);

    // Clear Swimming Pool, Gym, Pet Friendly, and Unused when switching to Commercial
    useEffect(() => {
        if (filters.propertyType === "commercial") {
            const updates: Record<string, undefined> = {};
            let hasUpdates = false;

            if (filters.swimmingPool !== undefined) {
                updates.swimmingPool = undefined;
                hasUpdates = true;
            }
            if (filters.gym !== undefined) {
                updates.gym = undefined;
                hasUpdates = true;
            }
            if (filters.petFriendly !== undefined) {
                updates.petFriendly = undefined;
                hasUpdates = true;
            }
            if (filters.unused !== undefined) {
                updates.unused = undefined;
                hasUpdates = true;
            }

            if (hasUpdates) {
                updateFilters(updates);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.propertyType]);

    // Smart sticky behavior
    const [isSticky, setIsSticky] = useState(false);
    const [isAtTop, setIsAtTop] = useState(false);
    const lastScrollY = useRef(0);
    const HEADER_OFFSET = 72;
    const SCROLL_THRESHOLD = 50;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 120) {
                setIsSticky(true);
                if (currentScrollY > lastScrollY.current) {
                    setIsAtTop(true);
                } else if (
                    currentScrollY < lastScrollY.current &&
          currentScrollY < SCROLL_THRESHOLD
                ) {
                    setIsAtTop(false);
                }
            } else {
                setIsSticky(false);
                setIsAtTop(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchClear = () => {
        setSearchValue("");
        updateFilters({ location: undefined });
        setIsSuggestionVisible(false);
    };

    // Filter drawer state for mobile
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const isMobile = useIsMobile();

    // Prevent background scroll when filter is open on mobile
    useEffect(() => {
        if (isFilterDrawerOpen && isMobile) {
            document.body.style.overflow = "hidden";
            dispatch(setListingFilterOpen(true));
        } else {
            document.body.style.overflow = "";
            dispatch(setListingFilterOpen(false));
        }
        return () => {
            document.body.style.overflow = "";
            dispatch(setListingFilterOpen(false));
        };
    }, [isFilterDrawerOpen, isMobile, dispatch]);

    // Calculate active filter count for mobile button
    const activeFilterCount = useMemo(() => {
        let count = 0;

        // Count bedrooms
        if (filters.bedrooms) count++;

        // Count space type
        if (filters.spaceType) count++;

        // Count price range (min or max)
        if (filters.priceMin || filters.priceMax) count++;

        // Count furnished/unfurnished
        if (filters.furnished !== undefined) count++;

        // Count amenities
        if (filters.parking) count++;
        if (filters.swimmingPool) count++;
        if (filters.gym) count++;
        if (filters.petFriendly) count++;
        if (filters.unused) count++;

        // Count let agreed exclusion
        if (filters.letAgreed === false) count++;

        return count;
    }, [filters]);

    // Form state for filter drawer (mirrors home page approach)
    const [formPropertyType, setFormPropertyType] = useState("Residential");
    const [formSpaceType, setFormSpaceType] = useState("");
    const [formMinBedroom, setFormMinBedroom] = useState("");
    const [formMinPrice, setFormMinPrice] = useState("");
    const [formMaxPrice, setFormMaxPrice] = useState("");
    const [formCheckboxState, setFormCheckboxState] = useState<Record<string, Set<string>>>({});
    const [formRangeState, setFormRangeState] = useState<Record<string, { min: string; max: string }>>({});

    // Sync URL filters to form state when drawer opens
    useEffect(() => {
        if (isFilterDrawerOpen) {
            // Property type
            setFormPropertyType(
                filters.propertyType === "commercial" ? "Commercial" : "Residential"
            );

            // Space type
            if (filters.spaceType === "enclosed") {
                setFormSpaceType("Enclosed Space");
            } else if (filters.spaceType === "open") {
                setFormSpaceType("Open Space");
            } else {
                setFormSpaceType("");
            }

            // Bedrooms
            setFormMinBedroom(filters.bedrooms?.toString() || "");

            // Price
            setFormMinPrice(filters.priceMin?.toString() || "");
            setFormMaxPrice(filters.priceMax?.toString() || "");

            // Amenities/Options
            const optionsSet = new Set<string>();
            if (filters.furnished === true) optionsSet.add("Furnished");
            if (filters.furnished === false) optionsSet.add("Unfurnished");
            if (filters.parking) optionsSet.add("Parking");
            if (filters.swimmingPool) optionsSet.add("Swimming Pool");
            if (filters.gym) optionsSet.add("Gym");
            if (filters.petFriendly) optionsSet.add("Pet Friendly");
            if (filters.unused) optionsSet.add("Unused");
            if (filters.letAgreed === false) optionsSet.add("Exclude Let Agreed");

            setFormCheckboxState({ Options: optionsSet });

            // Range state for price
            setFormRangeState({
                "Price Range": {
                    min: filters.priceMin?.toString() || "",
                    max: filters.priceMax?.toString() || "",
                },
            });
        }
    }, [isFilterDrawerOpen, filters]);

    // Build filter config for drawer (similar to home page)
    const bedroomLabel = formPropertyType === "Commercial" ? "Rooms" : "Bedrooms";
    // Organized filter options in 2 columns:
    // Column 1: Furnished, Unused, Pet Friendly
    // Column 2: Unfurnished, Swimming Pool, Parking, Gym, Exclude Let Agreed
    const baseOptions = ["Furnished", "Unfurnished", "Parking"];
    const allOptions =
    formPropertyType === "Residential"
        ? ["Furnished", "Unused", "Pet Friendly", "Unfurnished", "Swimming Pool", "Parking", "Gym", "Exclude Let Agreed"]
        : [...baseOptions, "Exclude Let Agreed"];

    const filterConfig: FilterConfig[] = [
        {
            label: "Property Type",
            type: "dropdown",
            options: ["Residential", "Commercial"],
            state: formPropertyType,
            setState: setFormPropertyType,
            placeholder: "Select Type",
        },
        // Space Type filter - only show for commercial
        ...(formPropertyType === "Commercial"
            ? [
        {
            label: "Space Type",
            type: "dropdown",
            options: ["Enclosed Space", "Open Space"],
            state: formSpaceType,
            setState: setFormSpaceType,
            placeholder: "Select Type",
        } as FilterConfig,
            ]
            : []),
        // Bedrooms/Rooms filter - hide when commercial + open space
        ...(!(formPropertyType === "Commercial" && formSpaceType === "Open Space")
            ? [
        {
            label: bedroomLabel,
            type: "dropdown",
            state: formMinBedroom,
            setState: setFormMinBedroom,
            options:
            formPropertyType === "Commercial" && formSpaceType === "Enclosed Space"
                ? ["2", "3", "4", "5+"]
                : ["1", "2", "3", "4", "5+"],
            placeholder: "Select",
        } as FilterConfig,
            ]
            : []),
        {
            label: "Price Range",
            type: "range",
            placeholderMin: "Min",
            placeholderMax: "Max",
        },
        {
            label: "Options",
            type: "checkbox",
            values: allOptions,
        },
    ];

    // Handle filter form apply
    const handleFilterFormApply = (formData: FilterResult) => {
        const updates: Partial<PropertyFilters> = {};

        // Property type
        const propertyTypeValue = typeof formData["Property Type"] === "string"
            ? formData["Property Type"]
            : "";
        if (propertyTypeValue) {
            updates.propertyType = propertyTypeValue.toLowerCase() as "residential" | "commercial";
        }

        // Space type
        const spaceTypeValue = typeof formData["Space Type"] === "string"
            ? formData["Space Type"]
            : "";
        if (spaceTypeValue === "Enclosed Space") {
            updates.spaceType = "enclosed";
        } else if (spaceTypeValue === "Open Space") {
            updates.spaceType = "open";
        } else {
            updates.spaceType = undefined;
        }

        // Bedrooms
        const bedroomValue = formData["Bedrooms"] || formData["Rooms"];
        if (typeof bedroomValue === "string" && bedroomValue) {
            updates.bedrooms = parseInt(bedroomValue);
        } else {
            updates.bedrooms = undefined;
        }

        // Price
        const priceValue = formData["Price Range"];
        if (typeof priceValue === "object" && "min" in priceValue) {
            updates.priceMin = priceValue.min ? parseInt(priceValue.min) : undefined;
            updates.priceMax = priceValue.max ? parseInt(priceValue.max) : undefined;
        }

        // Options/Amenities
        const optionsValue = formData["Options"];
        if (Array.isArray(optionsValue)) {
            optionsValue.forEach((option) => {
                if (option === "Furnished") {
                    updates.furnished = true;
                } else if (option === "Unfurnished") {
                    updates.furnished = false;
                } else if (option === "Swimming Pool") {
                    updates.swimmingPool = true;
                } else if (option === "Gym") {
                    updates.gym = true;
                } else if (option === "Parking") {
                    updates.parking = true;
                } else if (option === "Pet Friendly") {
                    updates.petFriendly = true;
                } else if (option === "Unused") {
                    updates.unused = true;
                } else if (option === "Exclude Let Agreed") {
                    updates.letAgreed = false;
                }
            });

            // Clear unselected amenities
            if (!optionsValue.includes("Furnished") && !optionsValue.includes("Unfurnished")) {
                updates.furnished = undefined;
            }
            if (!optionsValue.includes("Swimming Pool")) {
                updates.swimmingPool = undefined;
            }
            if (!optionsValue.includes("Gym")) {
                updates.gym = undefined;
            }
            if (!optionsValue.includes("Parking")) {
                updates.parking = undefined;
            }
            if (!optionsValue.includes("Pet Friendly")) {
                updates.petFriendly = undefined;
            }
            if (!optionsValue.includes("Unused")) {
                updates.unused = undefined;
            }
            if (!optionsValue.includes("Exclude Let Agreed")) {
                updates.letAgreed = undefined;
            }
        }

        updateFilters(updates);
        setIsFilterDrawerOpen(false);
    };

    return (
        <div
            className={`no-scrollbar w-full py-2 bg-white overflow-x-hidden lg:overflow-x-scroll z-20 transition-all duration-300 ${isSticky ? "fixed left-0 shadow-md" : "relative"
            }`}
            style={{
                top: isSticky ? (isAtTop ? 0 : HEADER_OFFSET) : "auto",
                transition: "top 0.35s cubic-bezier(.4,0,.2,1)",
            }}
        >
            <div className="px-5 lg:px-5 mx-auto flex gap-4 items-center w-full">
                <div className="lg:min-w-[770px] flex items-center justify-between w-full">
                    <div className="mx-auto flex gap-2 lg:gap-4 items-center w-full">
                        {/* Search Input */}
                        <div className="relative flex-grow lg:flex-initial lg:w-auto lg:min-w-[200px]">
                            <CustomSearchInput
                                searchValue={searchValue}
                                onSearchChange={handleSearchChange}
                                onSearchClick={handleSearchClick}
                                placeholderText="Search by Area..."
                                isSuggestionVisible={isSuggestionVisible}
                                suggestions={suggestions}
                                onSuggestionClick={handleSuggestionClick}
                                setIsSuggestionVisible={setIsSuggestionVisible}
                                containerClassName="bg-background border shadow-xs"
                            />
                            {searchValue && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-[24px] h-[24px] bg-transparent absolute top-[5px] right-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSearchClear();
                                    }}
                                >
                                    <X />
                                </Button>
                            )}
                        </div>

                        {/* Filter button - Mobile Only */}
                        <Button
                            variant={activeFilterCount > 0 ? "default" : "outline"}
                            className="flex lg:hidden items-center justify-center gap-2 h-10 px-4 cursor-pointer rounded-lg"
                            onClick={() => setIsFilterDrawerOpen(true)}
                        >
                            <FilterIcon className="w-5 h-5" />
                            <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
                        </Button>

                        {/* Desktop Filters - Hidden on Mobile */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Property Type Filter - shown on listed and unlisted routes */}
                            <PropertyTypeFilter
                                propertyTypes={propertyTypes}
                                currentType={filters.propertyType || "residential"}
                                onChange={(type) => updateFilters({ propertyType: type })}
                            />

                            {/* Space Type Filter - only show for commercial */}
                            {filters.propertyType === "commercial" && (
                                <SpaceTypeFilter
                                    value={filters.spaceType}
                                    onChange={(spaceType) => updateFilters({ spaceType })}
                                />
                            )}

                            {/* Bedroom/Rooms Filter - hide when commercial + open space */}
                            {!(
                                filters.propertyType === "commercial" &&
                filters.spaceType === "open"
                            ) && (
                                <BedroomFilter
                                    value={filters.bedrooms}
                                    onChange={(bedrooms) => updateFilters({ bedrooms })}
                                    propertyType={filters.propertyType}
                                    spaceType={filters.spaceType}
                                />
                            )}

                            <PriceFilter
                                minPrice={filters.priceMin}
                                maxPrice={filters.priceMax}
                                onChange={(min, max) =>
                                    updateFilters({ priceMin: min, priceMax: max })
                                }
                            />

                            <button
                                aria-hidden="true"
                                type="button"
                                id="reset-filters-button"
                                className="hidden"
                                onClick={resetFilters}
                            >
                Reset Filters
                            </button>

                            <MoreFiltersComponent
                                filters={filters}
                                moreFilters={moreFilters}
                                onChange={(updates) => updateFilters(updates)}
                            />
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <SharePropertyDialog />
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <div className="lg:hidden fixed inset-0 z-50 pointer-events-none">
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out ${isFilterDrawerOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0"
                    }`}
                    onClick={() => setIsFilterDrawerOpen(false)}
                />
                <div
                    className={`
            fixed inset-x-0 bottom-0
            w-full max-w-[1000px] mx-auto
            max-h-[70vh] overflow-y-auto
            bg-background rounded-t-2xl p-5
            shadow-lg border
            transform transition-transform duration-300 ease-out
            ${isFilterDrawerOpen
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full"
        }
          `}
                >
                    <FilterFormContent
                        config={filterConfig}
                        onCancel={() => setIsFilterDrawerOpen(false)}
                        onApply={handleFilterFormApply}
                        checkboxState={formCheckboxState}
                        setCheckboxState={setFormCheckboxState}
                        rangeState={formRangeState}
                        setRangeState={setFormRangeState}
                        variant="grid"
                    />
                </div>
            </div>
        </div>
    );
}
