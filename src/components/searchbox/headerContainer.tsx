"use client";
import {
  FilterConfig,
  FilterResult,
} from "@/components/searchbox/FilterFormContent";
import { HeroHeading } from "@/components/searchbox/HeroHeading";
import { SearchBar } from "@/components/searchbox/SearchBar";
import { useLazyGetSearchSuggestionsQuery } from "@/redux/reducers/search/searchSuggestApi";
import {
  filtersToSeoUrl,
  PropertyFilters,
  extractLocationFromSearch,
} from "@/lib/urlService";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import useIsScrolling from "@/hooks/useIsScrolling";
import useScrollPast from "@/hooks/useScrollPast";
import Image from "next/image";
import HelpSection from "../request/HelpSection";
import { useEffect } from "react";

const HeaderContainer = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const [minBedroom, setMinBedroom] = useState("");
  const [maxBedroom, setMaxBedroom] = useState("");
  const [propertyType, setPropertyType] = useState("Residential");
  const [spaceType, setSpaceType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [checkboxState, setCheckboxState] = useState<
    Record<string, Set<string>>
  >({});

  const headerRef = useRef<HTMLElement | null>(null);
  const isScrolledPast70 = useScrollPast(headerRef, 50, true);

  const [
    triggerSuggest,
    {
      data: suggestions,
      isError: isSuggestError,
      error: suggestError,
      isFetching: isSuggestLoading,
    },
  ] = useLazyGetSearchSuggestionsQuery();

  if (suggestions) {
    // console.log("Search Suggestions Response:", suggestions);
  }
  if (isSuggestError) {
    console.error("Error fetching suggestions:", suggestError);
  }

  // Base options array - Swimming Pool, Gym, Pet Friendly, and Unused only for Residential
  const baseOptions = ["Furnished", "Unfurnished"];
  const allOptions =
    propertyType === "Residential"
      ? [...baseOptions, "Unused", "Swimming Pool", "Gym", "Pet Friendly"]
      : baseOptions;

  // Dynamic label for bedrooms/rooms based on property type
  const bedroomLabel = propertyType === "Commercial" ? "Rooms" : "Bedrooms";

  const filterSchema: FilterConfig[] = [
    {
      label: "Property Type",
      type: "dropdown",
      options: ["Residential", "Commercial"],
      state: propertyType,
      setState: setPropertyType,
      placeholder: "Select Type",
    },
    // Space Type filter - only show for commercial, placed before bedrooms/rooms
    ...(propertyType === "Commercial"
      ? [
        {
          label: "Space Type",
          type: "dropdown",
          options: ["Enclosed Space", "Open Space"],
          state: spaceType,
          setState: setSpaceType,
          placeholder: "Select Type",
        } as FilterConfig,
      ]
      : []),
    // Rooms/Bedrooms filter - hide when commercial + open space
    ...(!(propertyType === "Commercial" && spaceType === "Open Space")
      ? [
        {
          label: bedroomLabel,
          type: "dropdown", // Changed from range-dropdown to dropdown
          state: minBedroom, // Use minBedroom as the single state holder
          setState: setMinBedroom,
          options:
            propertyType === "Commercial" && spaceType === "Enclosed Space"
              ? ["2", "3", "4", "5+"] // Enclosed commercial spaces start from 2
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

  const handleSearch = () => {
    // Build PropertyFilters object from form data
    const filters: Partial<PropertyFilters> = {
      page: 1,
      take: 12,
      propertyType: "residential", // Default to residential
      orderBy: "-updatedAt",
    };

    // Convert search to location for URL
    if (searchValue) {
      const location = extractLocationFromSearch(searchValue);
      if (location) {
        filters.location = location;
        filters.search = searchValue; // Keep for API
      }
    }

    // Bedroom filters
    if (minBedroom) {
      const val = parseInt(minBedroom); // "5+" becomes 5
      filters.minBedroom = val;
      filters.bedrooms = val; // Set the URL path segment
    }

    // maxBedroom is no longer used for bedrooms filter in Home Page

    // Price filters
    if (minPrice) {
      filters.priceMin = parseInt(minPrice);
    }

    if (maxPrice) {
      filters.priceMax = parseInt(maxPrice);
    }

    // Property type
    if (propertyType) {
      filters.propertyType = propertyType.toLowerCase() as
        | "residential"
        | "commercial";
    }

    // Space Type (only for commercial)
    if (propertyType === "Commercial" && spaceType) {
      if (spaceType === "Enclosed Space") {
        filters.spaceType = "enclosed";
      } else if (spaceType === "Open Space") {
        filters.spaceType = "open";
      }
    }

    // Additional filters
    const optionsSet = checkboxState["Options"];
    if (optionsSet && optionsSet.size > 0) {
      const optionsArray = Array.from(optionsSet);
      optionsArray.forEach((option) => {
        if (option === "Furnished") {
          filters.furnished = true;
        } else if (option === "Unfurnished") {
          filters.furnished = false;
        } else if (option === "Swimming Pool") {
          filters.swimmingPool = true;
        } else if (option === "Gym") {
          filters.gym = true;
        } else if (option === "Parking") {
          filters.parking = true;
        } else if (option === "Pet Friendly") {
          filters.petFriendly = true;
        } else if (option === "Unused") {
          filters.unused = true;
        }
      });
    }

    // Generate SEO-friendly URL from filters
    const seoUrl = filtersToSeoUrl(filters);

    // Navigate to the SEO-friendly URL (URL is now the single source of truth)
    router.push(seoUrl);
  };

  const handleFiltersFromSearchBar = (filters: FilterResult) => {
    // This function only updates state, does NOT redirect
    // Only the Search button will redirect based on all current state
    // Handle both "Bedrooms" and "Rooms" keys (label changes based on property type)
    const bedroomValue = filters["Bedrooms"] || filters["Rooms"];
    const priceValue = filters["Price Range"];
    const propertyTypeValue =
      typeof filters["Property Type"] === "string"
        ? filters["Property Type"]
        : "";

    // Add space type handling
    const spaceTypeValue =
      typeof filters["Space Type"] === "string" ? filters["Space Type"] : "";

    const minBedroom =
      typeof bedroomValue === "string"
        ? bedroomValue
        : typeof bedroomValue === "object" && "min" in bedroomValue
          ? bedroomValue.min || ""
          : "";
    // maxBedroom is not used for this filter, but keep safe default
    const maxBedroom = "";
    const minPrice =
      typeof priceValue === "object" && "min" in priceValue
        ? priceValue.min || ""
        : "";
    const maxPrice =
      typeof priceValue === "object" && "max" in priceValue
        ? priceValue.max || ""
        : "";

    const optionsValue = filters["Options"];
    if (Array.isArray(optionsValue)) {
      const optionsSet = new Set(optionsValue);
      setCheckboxState((prev) => ({ ...prev, Options: optionsSet }));
    }

    // Clear Pet Friendly, Swimming Pool, Gym, and Unused from state if switching to Commercial
    if (propertyTypeValue === "Commercial") {
      setCheckboxState((prev) => {
        const newOptions = new Set(prev["Options"] || []);
        newOptions.delete("Pet Friendly");
        newOptions.delete("Swimming Pool");
        newOptions.delete("Gym");
        newOptions.delete("Unused");
        return { ...prev, Options: newOptions };
      });
    }

    setMinBedroom(minBedroom);
    setMaxBedroom(maxBedroom);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setPropertyType(propertyTypeValue);
    setSpaceType(spaceTypeValue);

    // Clear space type when switching to residential
    if (propertyTypeValue === "Residential") {
      setSpaceType("");
    }
  };

  const isScrolling = useIsScrolling();

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  // Clear Pet Friendly, Swimming Pool, Gym, and Unused from state when property type changes to Commercial
  useEffect(() => {
    if (propertyType === "Commercial") {
      setCheckboxState((prev) => {
        const newOptions = new Set(prev["Options"] || []);
        let hasChanges = false;
        if (newOptions.has("Pet Friendly")) {
          newOptions.delete("Pet Friendly");
          hasChanges = true;
        }
        if (newOptions.has("Swimming Pool")) {
          newOptions.delete("Swimming Pool");
          hasChanges = true;
        }
        if (newOptions.has("Gym")) {
          newOptions.delete("Gym");
          hasChanges = true;
        }
        if (newOptions.has("Unused")) {
          newOptions.delete("Unused");
          hasChanges = true;
        }
        return hasChanges ? { ...prev, Options: newOptions } : prev;
      });
    }
  }, [propertyType]);

  // Clear space type when property type changes to Residential
  useEffect(() => {
    if (propertyType === "Residential") {
      setSpaceType("");
    }
  }, [propertyType]);

  // Clear bedroom/room values when switching to commercial + open space (rooms filter is hidden)
  useEffect(() => {
    const isOpenSpaceCommercial =
      propertyType === "Commercial" && spaceType === "Open Space";

    if (isOpenSpaceCommercial) {
      // Clear bedroom values when switching to open space (rooms filter is hidden)
      setMinBedroom("");
      setMaxBedroom("");
    }
  }, [propertyType, spaceType]);

  // Clear invalid bedroom values when range changes (e.g., Commercial + Enclosed Space should not allow 1 room)
  useEffect(() => {
    const isEnclosedCommercial =
      propertyType === "Commercial" && spaceType === "Enclosed Space";

    if (isEnclosedCommercial) {
      // Check and clear min bedroom if it's 1
      const minBedroomNum = minBedroom ? parseInt(minBedroom) : 0;
      if (minBedroomNum === 1) {
        setMinBedroom("");
      }

      // Check and clear max bedroom if it's 1
      const maxBedroomNum = maxBedroom ? parseInt(maxBedroom) : 0;
      if (maxBedroomNum === 1) {
        setMaxBedroom("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyType, spaceType]);

  return (
    <>
      <section
        className="relative flex items-center justify-center fullscreen-stable overflow-hidden"
        ref={headerRef}
      >
        {/* Background images */}
        <Image
          src="/header.jpg"
          alt="Header background"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-bottom z-0 hidden sm:block"
          priority
        />
        <Image
          src="/header-mobile.jpg"
          alt="Header background"
          fill
          sizes="100vw"
          className="object-cover object-right-bottom z-0 sm:hidden block"
          priority
        />

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-5 container mx-auto">
          <div className="w-full flex flex-col items-center justify-center -translate-y-16">
            <HeroHeading
              title={"Renting Made"}
              taglines={["Easy", "Simple", "Reliable", "Smart"]}
            />
          </div>

          <div className="w-full flex flex-col items-center justify-center mt-4">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={(val) => {
                setSearchValue(val);
                if (val.length >= 3) triggerSuggest(val);
              }}
              suggestions={suggestions}
              onSuggestionClick={(val) => setSearchValue(val)}
              onSearchClick={handleSearch}
              placeholderText="Search by Area, Popular Landmarks, or Nearby Locations"
              primarybuttonLabel="Search"
              hangingbuttonLabel="Filters"
              filterConfig={filterSchema}
              primarybuttonDisabled={searchValue.trim() === ""}
              onApplyFilter={handleFiltersFromSearchBar}
              checkboxState={checkboxState}
              setCheckboxState={setCheckboxState}
            />
          </div>
        </div>

        {/* Bottom bounce text */}
        <div
          className={`absolute ${!isScrolling ? "animate-bounce" : ""
            } text-white font-normal mb-3 bottom-12 text-center`}
        >
          <h1>Explore Properties</h1>
        </div>

        {/* Fixed Help Section */}
        <div className="fixed bottom-0 w-full z-50">
          <HelpSection isScrolling={isScrolling} />
        </div>
      </section>
    </>
  );
};

export default HeaderContainer;
