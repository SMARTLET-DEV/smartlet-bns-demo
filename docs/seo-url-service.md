# SEO-Friendly URL Service Documentation

## Overview

The SEO-friendly URL service (`src/lib/urlService.ts`) provides a comprehensive solution for converting between:

1. **SEO-friendly URLs** - Clean, readable URLs for better SEO and user experience
2. **Filter objects** - Used internally by React components
3. **Backend API query strings** - Used for API calls

## URL Format

### Old Format (Query String)

```
/properties?page=1&take=20&filter[bedrooms][gte]=1&orderBy=-createdAt&filter[propertyType][eq]=RESIDENTIAL&filter[createdAt][gt]=2023-01-01T00:00:00Z&filter[viewStatus][eq]=APPROVED&filter[isVisible][eq]=true&filter[isPaused][eq]=false&filter[bedrooms][lte]=3&filter[price][lte]=200000&filter[furnished][eq]=true&filter[parking][gt]=0&search=banani
```

### New Format (SEO-Friendly)

```
/properties/rent/residential/banani/3-bedrooms/furnished/with-parking?priceMax=200000&page=1&take=20
```

## URL Structure

### Path Segments (in order)

1. **Listing Type**: `rent` or `sale`
2. **Property Type**: `residential` or `commercial`
3. **Property Subtype**: `apartment`, `house`, `office`, `shop` (optional)
4. **Location**: Extracted from search (e.g., `gulshan`, `banani`, `dhanmondi`)
5. **Bedrooms**: `3-bedrooms`, `2-bedroom`, etc.
6. **Furnished Status**: `furnished` or `unfurnished`
7. **Parking**: `with-parking`
8. **Gym**: `with-gym`
9. **Swimming Pool**: `with-swimming-pool`

### Query Parameters

- `priceMin` - Minimum price filter
- `priceMax` - Maximum price filter
- `bedroomMin` - Minimum bedroom count (when different from path)
- `search` - Search query (if not location-based)
- `orderBy` - Sort order (default: `-createdAt`)
- `page` - Current page (default: 1)
- `take` - Items per page (default: 12)

## API Reference

### `filtersToSeoUrl(filters: PropertyFilters): string`

Converts a filter object to an SEO-friendly URL.

**Example:**

```typescript
import { filtersToSeoUrl } from "@/lib/urlService";

const url = filtersToSeoUrl({
  listingType: "rent",
  propertyType: "residential",
  location: "gulshan",
  bedrooms: 3,
  furnished: true,
  parking: true,
  gym: true,
  priceMin: 10000,
  priceMax: 200000,
  page: 1,
  take: 12,
});

// Result: /properties/rent/residential/gulshan/3-bedrooms/furnished/with-parking/with-gym?priceMin=10000&priceMax=200000&page=1&take=12
```

### `parseUrlToFilters(searchParams: URLSearchParams): PropertyFilters`

Parses URL search parameters and converts them to a PropertyFilters object.

**Example:**

```typescript
import { parseUrlToFilters } from "@/lib/urlService";
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const filters = parseUrlToFilters(searchParams);

console.log(filters);
// { propertyType: 'residential', bedrooms: 3, furnished: true, ... }
```

### `filtersToApiQuery(filters: PropertyFilters): string`

Converts PropertyFilters to backend API query string format.

**Example:**

```typescript
import { filtersToApiQuery } from "@/lib/urlService";

const apiQuery = filtersToApiQuery({
  propertyType: "residential",
  bedrooms: 3,
  furnished: true,
  page: 1,
  take: 12,
});

// Result: page=1&take=12&orderBy=-createdAt&filter[createdAt][gt]=2023-01-01T00:00:00Z&filter[viewStatus][eq]=APPROVED&filter[isVisible][eq]=true&filter[isPaused][eq]=false&filter[propertyType][eq]=RESIDENTIAL&filter[bedrooms][gte]=1&filter[bedrooms][lte]=3&filter[furnished][eq]=true
```

### `getDefaultBrowseAllUrl(): string`

Returns the default "Browse All Properties" URL.

**Example:**

```typescript
import { getDefaultBrowseAllUrl } from "@/lib/urlService";

const url = getDefaultBrowseAllUrl();
// Result: /properties/rent/residential?page=1&take=12
```

### `extractLocationFromSearch(search: string): string | undefined`

Extracts known location names from search queries.

**Example:**

```typescript
import { extractLocationFromSearch } from "@/lib/urlService";

const location = extractLocationFromSearch("Looking for apartment in Gulshan");
// Result: 'gulshan'
```

## Integration Examples

### In ListingFilter Component

```typescript
import { filtersToSeoUrl, PropertyFilters } from "@/lib/urlService";

const debouncedHandleSubmit = useCallback(
  debounce((data: FieldValues) => {
    const filters: PropertyFilters = {
      listingType: "rent",
      propertyType: data.propertyTypes?.toLowerCase() as
        | "residential"
        | "commercial",
      bedrooms: data.maxBed ? parseInt(data.maxBed) : undefined,
      priceMin: data.minPrice ? parseInt(data.minPrice) : undefined,
      priceMax: data.maxPrice ? parseInt(data.maxPrice) : undefined,
      // ... other filters
      page: 1,
      take: 12,
    };

    const newUrl = filtersToSeoUrl(filters);
    router.push(newUrl);
  }, 500),
  [router]
);
```

### In PropertiesContentContainer

```typescript
import { parseUrlToFilters, filtersToApiQuery } from "@/lib/urlService";

const searchParams = useSearchParams();

// Parse filters from URL
const filters = parseUrlToFilters(searchParams);

// Convert to API query
const apiQuery = filtersToApiQuery(filters);

// Use with API
const { data } = useGetFilteredPropertiesQuery(apiQuery);
```

### In Pagination Handler

```typescript
import { parseUrlToFilters, filtersToSeoUrl } from "@/lib/urlService";

const onClickHandler = (page: number) => {
  const filters = parseUrlToFilters(searchParams);
  filters.page = page;

  const newUrl = filtersToSeoUrl(filters);
  router.push(newUrl);
};
```

## PropertyFilters Interface

```typescript
interface PropertyFilters {
  // Path segments
  listingType?: "rent" | "sale";
  propertyType?: "residential" | "commercial";
  propertySubType?: "apartment" | "house" | "office" | "shop";
  location?: string;
  bedrooms?: number;
  furnished?: boolean | "unfurnished";
  parking?: boolean;
  gym?: boolean;
  swimmingPool?: boolean;

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

  // Backend-specific filters
  viewStatus?: string;
  isVisible?: boolean;
  isPaused?: boolean;
  createdAtGt?: string;
}
```

## SEO Benefits

1. **Cleaner URLs**: Easy to read and share
2. **Better Indexing**: Search engines prefer descriptive URLs
3. **Improved UX**: Users can understand the URL content
4. **Social Sharing**: URLs look professional when shared
5. **Reduced URL Length**: Shorter URLs are better for SEO

## Backward Compatibility

The service maintains backward compatibility by:

1. Supporting both old and new URL formats in `parseUrlToFilters()`
2. Converting old query parameter format to new SEO format
3. Maintaining existing API query string format in `filtersToApiQuery()`

## Location Detection

The service includes a list of known Dhaka locations:

- Gulshan, Banani, Dhanmondi, Uttara, Mirpur
- Bashundhara, Baridhara, Mohammadpur
- And more...

You can expand this list in the `extractLocationFromSearch()` function.

## Testing URLs

### Example 1: Simple Filter

```
/properties/rent/residential?page=1&take=12
```

### Example 2: Location + Bedrooms

```
/properties/rent/residential/gulshan/3-bedrooms?page=1&take=12
```

### Example 3: Full Filters

```
/properties/rent/residential/banani/2-bedrooms/furnished/with-parking/with-gym/with-swimming-pool?priceMin=15000&priceMax=50000&page=1&take=12
```

## Migration Notes

1. All existing URLs will continue to work
2. New URLs are generated when filters change
3. The API still receives the same query format
4. No backend changes required
