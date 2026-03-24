/**
 * SEO-Friendly URL Service for Opendoor Properties
 *
 * This service handles conversion between:
 * 1. SEO-friendly URLs (e.g., /rent/residential/gulshan/3-bedroom/furnished)
 * 2. Filter objects (used in components)
 * 3. Backend API query strings (used for API calls)
 */

export interface PropertyFilters {
  // Main path segments
  listingType?: "rent" | "sale";
  propertyType?: "residential" | "commercial";
  propertySubType?: "apartment" | "house" | "office" | "shop";
  location?: string;
  bedrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  gym?: boolean;
  swimmingPool?: boolean;
  petFriendly?: boolean;
  unused?: boolean;
  spaceType?: "enclosed" | "open";
  letAgreed?: boolean;

  // Range filters (query params)
  minBedroom?: number;
  maxBedroom?: number;
  priceMin?: number;
  priceMax?: number;

  // Other params
  page?: number;
  take?: number;
  orderBy?: string;
  search?: string;

  // Image limit
  takeImage?: number;

  // Backend-specific filters
  viewStatus?: string;
  isVisible?: boolean;
  isPaused?: boolean;
  createdAtGt?: string;
  content?: boolean; // Filter if there is media or not (for unlisted route)
}

/**
 * Converts filter object to SEO-friendly URL path and query params
 * New format without "rent" prefix - uses route group (rent)
 *
 * Pattern:
 *   Residential: /[propertyType]/[base-or-location]/[bedrooms?]/[furnished?]/[gym?]/[pool?]?parking
 *   Commercial: /[propertyType]/space-for-rent/[space-type?]/[bedrooms?]/[furnished?]/[gym?]/[pool?]?parking
 *   Commercial with location: /[propertyType]/space-for-rent-in-[location]/[space-type?]/[bedrooms?]/[furnished?]/[gym?]/[pool?]?parking
 * Parking is passed as query param, gym and pool are in the path
 *
 * Examples:
 * - /residential/apartments-for-rent
 * - /residential/apartments-for-rent-in-gulshan
 * - /residential/apartments-for-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments
 * - /residential/apartments-for-rent-in-gulshan/2-bedroom-flat/unfurnished-apartments
 * - /residential/apartments-for-rent-in-gulshan/2-bedroom-flat/with-gym?parking=true
 * - /residential/apartments-for-rent-in-gulshan/studio-apartment/fully-furnished-apartments/with-gym/with-swimming-pool?parking=true
 * - /commercial/space-for-rent
 * - /commercial/space-for-rent/enclosed-space
 * - /commercial/space-for-rent/open-space
 * - /commercial/space-for-rent-in-gulshan
 * - /commercial/space-for-rent-in-gulshan/enclosed-space
 * - /commercial/space-for-rent-in-banani/open-space
 */
export function filtersToSeoUrl(filters: PropertyFilters): string {
  const pathSegments: string[] = [];
  const queryParams = new URLSearchParams();

  // Position 0: Property type ONLY (no "rent" prefix - uses route group)
  if (filters.propertyType === "residential") {
    pathSegments.push("residential");
  } else if (filters.propertyType === "commercial") {
    pathSegments.push("commercial");
  } else {
    pathSegments.push("residential"); // Default
  }

  // Position 1: Location with property-type-specific format OR base list slug (comes FIRST)
  if (filters.location) {
    const locationSlug = filters.location
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters

    if (locationSlug) {
      // Use different format based on property type
      if (filters.propertyType === "commercial") {
        // Location replaces "space-for-rent" with "space-for-rent-in-{location}"
        pathSegments.push(`space-for-rent-in-${locationSlug}`);
      } else {
        pathSegments.push(`apartments-for-rent-in-${locationSlug}`);
      }
    }
  } else {
    // Always add base suffix when no location is provided
    // Residential: "apartments-for-rent"
    // Commercial: "space-for-rent" (always, even with space type)
    if (filters.propertyType === "commercial") {
      pathSegments.push("space-for-rent");
    } else if (
      !filters.bedrooms &&
      !filters.gym &&
      !filters.swimmingPool &&
      !filters.petFriendly &&
      !filters.unused
    ) {
      // For residential, only add base suffix if no other filters
      pathSegments.push("apartments-for-rent");
    }
  }

  // Position 2: Space Type (only for commercial properties, comes AFTER base slug)
  if (filters.propertyType === "commercial" && filters.spaceType) {
    if (filters.spaceType === "enclosed") {
      pathSegments.push("enclosed-space");
    } else if (filters.spaceType === "open") {
      pathSegments.push("open-space");
    }
  }

  // Position 3: Bedrooms - special format
  const bedroomCount = filters.bedrooms;
  if (bedroomCount === 1) {
    pathSegments.push("studio-apartment");
  } else if (bedroomCount && bedroomCount > 1) {
    pathSegments.push(`${bedroomCount}-bedroom-flat`);
  }

  // Position 4: Furnished
  if (filters.furnished === true) {
    pathSegments.push("fully-furnished-apartments");
  } else if (filters.furnished === false) {
    pathSegments.push("unfurnished-apartments");
  }

  // Position 5: Gym
  if (filters.gym) {
    pathSegments.push("with-gym");
  }

  // Position 6: Swimming pool
  if (filters.swimmingPool) {
    pathSegments.push("with-swimming-pool");
  }

  // Position 7: Pet friendly
  if (filters.petFriendly) {
    pathSegments.push("pet-friendly");
  }

  // Position 8: Unused
  if (filters.unused) {
    pathSegments.push("unused");
  }

  // Build query params (price range, pagination, and parking)
  // Parking is added as query param (not path segment)
  if (filters.parking) {
    queryParams.set("parking", "true");
  }

  if (filters.letAgreed === false) {
    queryParams.set("letAgreed", "false");
  }

  if (filters.priceMin !== undefined && filters.priceMin > 0) {
    queryParams.set("priceMin", filters.priceMin.toString());
  }

  if (filters.priceMax !== undefined && filters.priceMax > 0) {
    queryParams.set("priceMax", filters.priceMax.toString());
  }

  // Add page parameter (skip if page 1, as that's the default)
  if (filters.page !== undefined && filters.page > 1) {
    queryParams.set("page", filters.page.toString());
  }

  if (filters.orderBy && filters.orderBy !== "-updatedAt") {
    queryParams.set("orderBy", filters.orderBy);
  }

  // Note: search is derived from location in URL path (e.g., apartments-for-rent-in-gulshan)
  // No separate search query parameter needed
  // take is a backend-only param, not for URLs

  // Construct final URL
  const path =
    pathSegments.length > 0
      ? `/${pathSegments.join("/")}`
      : "/residential/apartments-for-rent";

  const query = queryParams.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Parse URL pathname to PropertyFilters with new pattern recognition
 * New format:
 * - Residential: /residential/apartments-for-rent-in-{location}/{bedrooms}/{furnished}/{gym}/{pool}
 * - Commercial: /commercial/space-for-rent/{space-type?}/{bedrooms}/{furnished}/{gym}/{pool}
 * - Commercial with location: /commercial/space-for-rent-in-{location}/{space-type?}/{bedrooms}/{furnished}/{gym}/{pool}
 * Note: Parking is parsed from query params, not path
 *
 * @param pathname - URL pathname like "/residential/apartments-for-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments" or "/commercial/space-for-rent/enclosed-space"
 * @returns Partial PropertyFilters extracted from path
 */
export function parsePathToFilters(pathname: string): Partial<PropertyFilters> {
  const segments = pathname.split("/").filter(Boolean);
  const filters: Partial<PropertyFilters> = {
    listingType: "rent", // Always rent (implied by route group)
  };

  const PROPERTY_TYPES = ["residential", "commercial"];

  for (const segment of segments) {
    const lowerSegment = segment.toLowerCase();

    // Position 0: Property type
    if (PROPERTY_TYPES.includes(lowerSegment)) {
      filters.propertyType = lowerSegment as "residential" | "commercial";
    }
    // Base slug pattern: "space-for-rent" (commercial, no location)
    else if (lowerSegment === "space-for-rent") {
      // Ensure property type is set to commercial if not already set
      if (!filters.propertyType) {
        filters.propertyType = "commercial";
      }
      // This is just the base slug, no additional filter needed
    }
    // Location pattern: "space-for-rent-in-{location}" (commercial)
    else if (lowerSegment.startsWith("space-for-rent-in-")) {
      filters.location = segment.replace(/^space-for-rent-in-/i, "");
      // Ensure property type is set to commercial if not already set
      if (!filters.propertyType) {
        filters.propertyType = "commercial";
      }
    }
    // Space Type patterns (for commercial) - comes AFTER base slug/location
    else if (lowerSegment === "enclosed-space") {
      filters.spaceType = "enclosed";
    } else if (lowerSegment === "open-space") {
      filters.spaceType = "open";
    }
    // Location pattern: "apartments-for-rent-in-{location}" (residential)
    else if (lowerSegment.startsWith("apartments-for-rent-in-")) {
      filters.location = segment.replace(/^apartments-for-rent-in-/i, "");
      // Ensure property type is set to residential if not already set
      if (!filters.propertyType) {
        filters.propertyType = "residential";
      }
    }
    // Bedroom patterns
    else if (lowerSegment === "studio-apartment") {
      filters.bedrooms = 1;
    } else if (lowerSegment.match(/^\d+-bedroom-flat$/)) {
      const count = parseInt(lowerSegment.match(/^\d+/)?.[0] || "0");
      filters.bedrooms = count;
    }
    // Furnished
    else if (lowerSegment === "fully-furnished-apartments") {
      filters.furnished = true;
    }
    // Unfurnished
    else if (lowerSegment === "unfurnished-apartments") {
      filters.furnished = false;
    }
    // Gym
    else if (lowerSegment === "with-gym") {
      filters.gym = true;
    }
    // Swimming pool
    else if (lowerSegment === "with-swimming-pool") {
      filters.swimmingPool = true;
    }
    // Pet friendly
    else if (lowerSegment === "pet-friendly") {
      filters.petFriendly = true;
    }
    // Unused
    else if (lowerSegment === "unused") {
      filters.unused = true;
    }
  }

  return filters;
}

/**
 * Parses current URL search params and converts to PropertyFilters object
 * Handles both old format and new SEO format
 */
export function parseUrlToFilters(
  searchParams: URLSearchParams
): PropertyFilters {
  const filters: PropertyFilters = {};

  // Parse old format query params (for backward compatibility)
  const minBedroom =
    searchParams.get("filter[bedrooms][gte]") || searchParams.get("bedroomMin");
  if (minBedroom) filters.minBedroom = parseInt(minBedroom);

  const maxBedroom = searchParams.get("filter[bedrooms][lte]");
  if (maxBedroom) filters.maxBedroom = parseInt(maxBedroom);

  const minPrice =
    searchParams.get("filter[price][gte]") || searchParams.get("priceMin");
  if (minPrice) filters.priceMin = parseInt(minPrice);

  const maxPrice =
    searchParams.get("filter[price][lte]") || searchParams.get("priceMax");
  if (maxPrice) filters.priceMax = parseInt(maxPrice);

  const propertyType = searchParams.get("filter[propertyType][eq]");
  if (propertyType) {
    filters.propertyType = propertyType.toLowerCase() as
      | "residential"
      | "commercial";
  }

  const furnished = searchParams.get("filter[furnished][eq]");
  if (furnished === "true") {
    filters.furnished = true;
  } else if (furnished === "false") {
    filters.furnished = false;
  }

  const parking = searchParams.get("filter[parking][gt]");
  if (parking === "0") filters.parking = true;

  const gym = searchParams.get("filter[gym][eq]") || searchParams.get("gym");
  if (gym === "true") filters.gym = true;

  const pool =
    searchParams.get("filter[swimmingPool][eq]") || searchParams.get("pool");
  if (pool === "true") filters.swimmingPool = true;

  const petFriendly =
    searchParams.get("filter[petFriendly][eq]") ||
    searchParams.get("petFriendly");
  if (petFriendly === "true") filters.petFriendly = true;

  const unused =
    searchParams.get("filter[unused][eq]") || searchParams.get("unused");
  if (unused === "true") filters.unused = true;

  const letAgreed =
    searchParams.get("filter[letAgreed][eq]") || searchParams.get("letAgreed");
  if (letAgreed === "false") filters.letAgreed = false;

  // Note: search parameter removed - location is used as search term
  // Note: spaceType is now parsed from path, not query params

  const page = searchParams.get("page");
  if (page) filters.page = parseInt(page);

  const take = searchParams.get("take");
  if (take) filters.take = parseInt(take);

  const orderBy = searchParams.get("orderBy");
  if (orderBy) filters.orderBy = orderBy;

  // Note: content filter is NOT parsed for unlisted routes
  // Content filter is only used as default (true) for listing pages
  // For unlisted routes, we want all data regardless of content

  return filters;
}

/**
 * Parse complete URL (pathname + query params) into PropertyFilters
 * Combines path-based and query-based filters
 *
 * @param pathname - URL pathname
 * @param searchParams - URLSearchParams from query string
 * @returns Complete PropertyFilters object
 */
export function parseCompleteUrl(
  pathname: string,
  searchParams: URLSearchParams
): PropertyFilters {
  // Check if this is the listed route
  const isListedRoute = pathname.startsWith("/listed");

  // Start with path-based filters
  const pathFilters = parsePathToFilters(pathname);
  const filters: PropertyFilters = {
    listingType: "rent",
    // For listed routes, allow propertyType from path (e.g., /listed/residential)
    // For regular routes, use propertyType from path or default to residential
    propertyType: isListedRoute
      ? pathFilters.propertyType // Allow propertyType from path for listed routes
      : pathFilters.propertyType || "residential",
    page: 1,
    take: isListedRoute ? 16 : 12,
    takeImage: 5,
    orderBy: "-updatedAt",
    ...pathFilters,
  };

  // Then override/add with query params
  // For listed route, parse filters from query params
  if (isListedRoute) {
    // NO content filter for listed routes - we want all data regardless of content

    const location = searchParams.get("location");
    if (location) filters.location = location;

    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);

    // Don't parse spaceType for listed page
    // const spaceType = searchParams.get("spaceType");
    // if (spaceType === "enclosed" || spaceType === "open") {
    //   filters.spaceType = spaceType;
    // }

    const furnished = searchParams.get("furnished");
    if (furnished === "true") {
      filters.furnished = true;
    } else if (furnished === "false") {
      filters.furnished = false;
    }
  } else {
    // For listing pages, set default filters including createdAtGt, isVisible, isPaused
    // These are used to detect listing pages vs listed pages
    filters.createdAtGt = filters.createdAtGt || "2023-01-01T00:00:00Z";
    filters.isVisible =
      filters.isVisible !== undefined ? filters.isVisible : true;
    filters.isPaused =
      filters.isPaused !== undefined ? filters.isPaused : false;
  }

  const bedroomMin = searchParams.get("bedroomMin");
  if (bedroomMin) filters.minBedroom = parseInt(bedroomMin);

  const priceMin = searchParams.get("priceMin");
  if (priceMin) filters.priceMin = parseInt(priceMin);

  const priceMax = searchParams.get("priceMax");
  if (priceMax) filters.priceMax = parseInt(priceMax);

  const parking = searchParams.get("parking");
  if (parking === "true") filters.parking = true;

  const gym = searchParams.get("gym");
  if (gym === "true") filters.gym = true;

  const pool = searchParams.get("pool");
  if (pool === "true") filters.swimmingPool = true;

  const petFriendly = searchParams.get("petFriendly");
  if (petFriendly === "true") filters.petFriendly = true;

  const unused = searchParams.get("unused");
  if (unused === "true") filters.unused = true;

  const letAgreed = searchParams.get("letAgreed");
  if (letAgreed === "false") filters.letAgreed = false;

  // Note: spaceType is now parsed from path, not query params (except for unlisted route)

  // Search is derived from location in the path, not from query params
  // If location exists, use it as search term for the backend API
  if (filters.location) {
    // Convert location to search format: "gulshan-1" → "gulshan 1"
    filters.search = filters.location.replace(/-/g, " ");
  }

  const page = searchParams.get("page");
  if (page) filters.page = parseInt(page);

  const take = searchParams.get("take");
  if (take) filters.take = parseInt(take);

  const orderBy = searchParams.get("orderBy");
  if (orderBy) filters.orderBy = orderBy;

  return filters;
}

/**
 * Converts PropertyFilters to backend API query string format
 * This maintains compatibility with existing backend API
 */
export function filtersToApiQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();

  // Check if this is for unlisted route
  // Unlisted routes don't have createdAtGt, isVisible, isPaused set
  // Listing pages always have createdAtGt set
  const isUnlistedRoute = filters.createdAtGt === undefined;

  // Required static params
  const page = filters.page || 1;
  const take = filters.take || 12;

  params.set("page", page.toString());
  params.set("take", take.toString());
  params.set("orderBy", filters.orderBy || "-updatedAt");

  if (filters.takeImage && filters.takeImage > 0) {
    params.set("takeImage", filters.takeImage.toString());
  }

  if (isUnlistedRoute) {
    // For unlisted route, use simplified format
    // NO content filter - we want all data regardless of content
    params.set("filter[viewStatus][eq]", filters.viewStatus || "APPROVED");
  } else {
    // For regular routes (listing pages), use full filter set
    params.set(
      "filter[createdAt][gt]",
      filters.createdAtGt || "2023-01-01T00:00:00Z"
    );
    params.set("filter[viewStatus][eq]", filters.viewStatus || "APPROVED");
    params.set(
      "filter[isVisible][eq]",
      filters.isVisible !== undefined ? filters.isVisible.toString() : "true"
    );
    params.set(
      "filter[isPaused][eq]",
      filters.isPaused !== undefined ? filters.isPaused.toString() : "false"
    );
    // Always filter for properties with content (media) for listing pages (residential and commercial)
    params.set("filter[content][eq]", "true");
  }

  // Property type
  if (filters.propertyType) {
    params.set("filter[propertyType][eq]", filters.propertyType.toUpperCase());
  }

  // Bedrooms - handle both range and specific value
  // For values 1-4: use "eq" (exact match)
  // For value 5: use "gte" (5+ means 5 or more)
  if (filters.minBedroom !== undefined && filters.minBedroom > 0) {
    if (filters.minBedroom === 5) {
      params.set("filter[bedrooms][gte]", filters.minBedroom.toString());
    } else {
      params.set("filter[bedrooms][eq]", filters.minBedroom.toString());
    }
    // console.log("🔗 URLService: Set minBedroom filter:", filters.minBedroom);
  } else if (filters.bedrooms !== undefined) {
    // Use "eq" for exact match (1-4), "gte" for 5+ (5 or more)
    if (filters.bedrooms === 5) {
      params.set("filter[bedrooms][gte]", filters.bedrooms.toString());
    } else {
      params.set("filter[bedrooms][eq]", filters.bedrooms.toString());
    }
    // console.log(
    //   "🔗 URLService: Set bedrooms filter:",
    //   filters.bedrooms
    // );
  }

  // Only set maxBedroom if explicitly provided (for range filtering)
  if (filters.maxBedroom !== undefined && filters.maxBedroom > 0) {
    params.set("filter[bedrooms][lte]", filters.maxBedroom.toString());
  }
  // Removed the else if block that was setting lte to the same value as bedrooms

  // Price range
  if (filters.priceMin !== undefined && filters.priceMin > 0) {
    params.set("filter[price][gte]", filters.priceMin.toString());
  }

  if (filters.priceMax !== undefined && filters.priceMax > 0) {
    params.set("filter[price][lte]", filters.priceMax.toString());
  }

  // Furnished status
  if (filters.furnished === true) {
    // When furnished is selected, get only fully furnished properties
    params.set("filter[furnished][eq]", "true");
  } else if (filters.furnished === false) {
    // When unfurnished is selected, get properties where furnished=false
    // This includes both unfurnished (furnished=false, semiFurnished=false)
    // and semi-furnished (furnished=false, semiFurnished=true) properties
    params.set("filter[furnished][eq]", "false");
    // Removed semiFurnished filter to avoid AND condition - filtering by furnished=false
    // should return all properties that are not fully furnished (both unfurnished and semi-furnished)
  }

  // Parking
  if (filters.parking) {
    params.set("filter[parking][gt]", "0");
  }

  // Gym
  if (filters.gym) {
    params.set("filter[gym][eq]", "true");
  }

  // Swimming Pool
  if (filters.swimmingPool) {
    params.set("filter[swimmingPool][eq]", "true");
  }

  // Pet Friendly
  if (filters.petFriendly) {
    params.set("filter[petFriendly][eq]", "true");
  }

  // Unused
  if (filters.unused) {
    params.set("filter[unused][eq]", "true");
  }

  // Exclude Let Agreed
  if (filters.letAgreed === false) {
    params.set("filter[letAgreed][eq]", "false");
  }

  // Space Type (for commercial properties)
  if (filters.spaceType) {
    // Convert frontend format to backend enum format
    const backendSpaceType =
      filters.spaceType === "enclosed"
        ? "ENCLOSED_SPACE"
        : filters.spaceType === "open"
          ? "OPEN_SPACE"
          : filters.spaceType; // Fallback for any other values
    params.set("filter[spaceType][eq]", backendSpaceType);
  }

  // Search
  if (filters.search) {
    params.set("search", filters.search);
  }

  // console.log("🔗 URLService: Final API query string:", params.toString());
  return params.toString();
}

/**
 * Helper to create default "Browse All Properties" URL
 */
export function getDefaultBrowseAllUrl(): string {
  return "/residential/apartments-for-rent";
}

/**
 * Helper to extract location from search query and return slugified version
 * Returns slugified search term for URL path
 */
export function extractLocationFromSearch(search: string): string | undefined {
  if (!search) return undefined;

  // Clean and slugify the search term
  const slugified = search
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters

  if (!slugified) return undefined;

  return slugified;
}


/**
 * Converts PropertyFilters to listed page URL with query params
 * Used when on listed page and filters change (but propertyType is not set)
 */
export function filtersToListedUrl(filters: PropertyFilters): string {
  const queryParams = new URLSearchParams();

  // Add all filter query params
  if (filters.location) {
    queryParams.set("location", filters.location);
  }

  if (filters.bedrooms !== undefined) {
    queryParams.set("bedrooms", filters.bedrooms.toString());
  }

  // Don't include spaceType for listed page
  // if (filters.spaceType) {
  //   queryParams.set("spaceType", filters.spaceType);
  // }

  if (filters.furnished === true) {
    queryParams.set("furnished", "true");
  } else if (filters.furnished === false) {
    queryParams.set("furnished", "false");
  }

  if (filters.parking) {
    queryParams.set("parking", "true");
  }

  if (filters.gym) {
    queryParams.set("gym", "true");
  }

  if (filters.swimmingPool) {
    queryParams.set("pool", "true");
  }

  if (filters.petFriendly) {
    queryParams.set("petFriendly", "true");
  }

  if (filters.unused) {
    queryParams.set("unused", "true");
  }

  if (filters.letAgreed === false) {
    queryParams.set("letAgreed", "false");
  }

  if (filters.priceMin !== undefined && filters.priceMin > 0) {
    queryParams.set("priceMin", filters.priceMin.toString());
  }

  if (filters.priceMax !== undefined && filters.priceMax > 0) {
    queryParams.set("priceMax", filters.priceMax.toString());
  }

  if (filters.page !== undefined && filters.page > 1) {
    queryParams.set("page", filters.page.toString());
  }

  if (filters.orderBy && filters.orderBy !== "-updatedAt") {
    queryParams.set("orderBy", filters.orderBy);
  }

  // Note: content filter is NOT included for listed routes
  // We want all data regardless of content

  const query = queryParams.toString();
  return query ? `/listed?${query}` : "/listed";
}
