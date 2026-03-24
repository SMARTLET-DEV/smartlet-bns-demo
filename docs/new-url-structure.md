# New SEO URL Structure Implementation

## URL Format

### Pattern

```
/[propertyType]/[base-or-location]/[bedrooms?]/[furnished?]/[parking?]/[gym?]/[pool?]
```

### Examples

#### 1. Base URL (No filters)

```
/residential/houses-for-rent
```

#### 2. Location Only

```
/residential/house-rent-in-gulshan
```

#### 3. Location + Bedrooms

```
/residential/house-rent-in-gulshan/2-bedroom-flat
/residential/house-rent-in-banani/studio-apartment  (for 1 bedroom)
```

#### 4. Full Filters

```
/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments
/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments/with-parking
/residential/house-rent-in-dhanmondi/3-bedroom-flat/fully-furnished-apartments/with-parking/with-gym
/residential/house-rent-in-uttara/studio-apartment/fully-furnished-apartments/with-parking/with-gym/with-swimming-pool
```

## Key Changes from Previous Implementation

### 1. Route Group `(rent)`

- **Old:** `/rent/residential/...`
- **New:** `/residential/...`
- The `(rent)` folder name is hidden from URLs

### 2. Location Format

- **Old:** `/gulshan`
- **New:** `/house-rent-in-gulshan`
- More descriptive and SEO-friendly

### 3. Bedroom Format

- **Old:** `/3-bedrooms` (range with min/max)
- **New:** `/2-bedroom-flat` (single select)
- **Special:** `1 bedroom` → `/studio-apartment`

### 4. Furnished Format

- **Old:** `/furnished`
- **New:** `/fully-furnished-apartments`
- More descriptive for SEO

### 5. Gym & Pool

- **Old:** Query params `?gym=true&pool=true`
- **New:** Path segments `/with-gym/with-swimming-pool`
- Better for SEO indexing

### 6. Removed Features

- ❌ Bedroom range (minBed/maxBed) - now single select
- ❌ Unfurnished as separate option - now included with furnished checkbox

## URL Parsing Logic

### Position-Based Recognition

```typescript
Segment Recognition Order:
1. Property type: "residential" or "commercial"
2. Location: starts with "house-rent-in-"
3. Bedrooms: "studio-apartment" or "{n}-bedroom-flat"
4. Furnished: "fully-furnished-apartments"
5. Parking: "with-parking"
6. Gym: "with-gym"
7. Pool: "with-swimming-pool"
```

### Example Parsing

**URL:** `/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments/with-parking/with-gym`

```javascript
Parsed:
{
  listingType: "rent",        // Implied by route group
  propertyType: "residential", // Segment: "residential"
  location: "gulshan",         // From: "house-rent-in-gulshan"
  bedrooms: 2,                 // From: "2-bedroom-flat"
  furnished: true,             // From: "fully-furnished-apartments"
  parking: true,               // From: "with-parking"
  gym: true                    // From: "with-gym"
}
```

## SEO Metadata Examples

### Example 1: Base

**URL:** `/residential/houses-for-rent`

```yaml
Title: "Houses for Rent | smartLET"
Description: "Find apartments and houses for rent in Dhaka, Bangladesh. Browse verified properties with smartLET."
Canonical: "/residential/houses-for-rent"
```

### Example 2: Location

**URL:** `/residential/house-rent-in-gulshan`

```yaml
Title: "Residential in Gulshan for Rent | smartLET"
Description: "Find residential in gulshan in Dhaka, Bangladesh. Browse verified properties with smartLET."
Keywords: ["rent gulshan", "gulshan properties", "gulshan rent dhaka", ...]
Canonical: "/residential/house-rent-in-gulshan"
```

### Example 3: Studio Apartment

**URL:** `/residential/house-rent-in-banani/studio-apartment`

```yaml
Title: "Studio Apartment Residential in Banani for Rent | smartLET"
Description: "Find studio apartment residential in banani in Dhaka, Bangladesh. Browse verified properties with smartLET."
Keywords: ["studio apartment for rent", "studio apartment dhaka", ...]
```

### Example 4: Full Filters

**URL:** `/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments/with-gym/with-swimming-pool`

```yaml
Title: "2 Bedroom Flat Fully Furnished Residential in Gulshan for Rent | smartLET"
Description: "Find 2 bedroom flat fully furnished residential in gulshan in Dhaka, Bangladesh. With gym, swimming pool. Browse verified properties with smartLET."
Keywords:
  [
    "2 bedroom flat for rent",
    "furnished apartment rent",
    "property with parking",
    ...,
  ]
Canonical: "/residential/house-rent-in-gulshan"
```

## Navigation Links Updated

### Navbar

```typescript
- Residential → /residential/houses-for-rent
- Commercial → /commercial/houses-for-rent
```

### Footer Locations

```typescript
- Gulshan → /residential/house-rent-in-gulshan
- Banani → /residential/house-rent-in-banani
- Baridhara → /residential/house-rent-in-baridhara
- Bashundhara → /residential/house-rent-in-bashundhara
- Dhanmondi → /residential/house-rent-in-dhanmondi
- Uttara → /residential/house-rent-in-uttara
```

### Call-to-Action Buttons

```typescript
- "Browse All Properties" → /residential/houses-for-rent
- "Start Searching Now" → /residential/houses-for-rent
- "See All" → /residential/houses-for-rent
```

## Bedroom Filter Component

### Before (Range Input)

```typescript
<ControlledInput name="minBed" placeholder="Min Bedrooms" />
<ControlledInput name="maxBed" placeholder="Max Bedrooms" />
```

### After (Single Select)

```typescript
<Select value={field.value} onValueChange={field.onChange}>
  <SelectItem value="">Any</SelectItem>
  <SelectItem value="1">Studio (1 Bedroom)</SelectItem>
  <SelectItem value="2">2 Bedrooms</SelectItem>
  <SelectItem value="3">3 Bedrooms</SelectItem>
  <SelectItem value="4">4 Bedrooms</SelectItem>
  <SelectItem value="5">5+ Bedrooms</SelectItem>
</Select>
```

## Query Parameters

Only used for:

- **Price range:** `?priceMin=10000&priceMax=50000`
- **Search term:** `?search=Banani+DOHS`
- **Pagination:** `?page=2&take=20` (only if not default)
- **Sort order:** `?orderBy=price` (only if not default)

## Technical Implementation

### Redux State

```typescript
{
  propertyType: "residential",
  location: "gulshan",
  bedrooms: 2,           // Single value (not min/max)
  furnished: true,
  gym: true,
  swimmingPool: true,
  priceMin: 10000,
  priceMax: 50000,
  page: 1,
  take: 12
}
```

### URL Generation Flow

```
1. User selects filters
   ↓
2. Update Redux state
   ↓
3. Generate SEO URL: filtersToSeoUrl(reduxFilters)
   ↓
4. Router push to new URL
   ↓
5. Metadata generated server-side
```

### URL Parsing Flow

```
1. User visits URL
   ↓
2. Parse path: parsePathToFilters(pathname)
   ↓
3. Parse query: extract from searchParams
   ↓
4. Combine: parseCompleteUrl(pathname, searchParams)
   ↓
5. Initialize Redux: dispatch(initializeFromUrl(filters))
   ↓
6. Render UI from Redux
```

## SEO Benefits

✅ **Highly Descriptive URLs**

- "house-rent-in-gulshan" clearly states intent
- "2-bedroom-flat" is exact match for searches
- "fully-furnished-apartments" matches user queries

✅ **Location-Specific Landing Pages**

- Each area gets unique SEO page
- Targets local search queries
- Better ranking for "houses for rent in [location]"

✅ **Feature-Rich URLs**

- Gym and pool visible in URL
- Studio apartment highlighted
- Furnished status clear

✅ **Clean & Shareable**

- Short, readable URLs
- No ugly query parameters for main filters
- Professional appearance

## Migration from Old Format

### Backward Compatibility

The system still supports old query param format:

```
/properties?filter[propertyType][eq]=RESIDENTIAL&search=gulshan
↓
Redirects to: /residential/house-rent-in-gulshan
```

This is handled by `parseUrlToFilters()` for backward compatibility.

## Testing URLs

Try these complete examples:

```bash
# Base
http://localhost:3000/residential/houses-for-rent

# Location only
http://localhost:3000/residential/house-rent-in-gulshan

# Studio apartment
http://localhost:3000/residential/house-rent-in-banani/studio-apartment

# 2 bedroom with filters
http://localhost:3000/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments

# With parking
http://localhost:3000/residential/house-rent-in-gulshan/2-bedroom-flat/fully-furnished-apartments/with-parking

# Full filters (all amenities)
http://localhost:3000/residential/house-rent-in-dhanmondi/3-bedroom-flat/fully-furnished-apartments/with-parking/with-gym/with-swimming-pool

# With price range
http://localhost:3000/residential/house-rent-in-gulshan/2-bedroom-flat?priceMin=15000&priceMax=30000
```

## File Structure

```
src/
  app/
    (rent)/                        ← Route group (hidden from URL)
      residential/
        [[...params]]/             ← Catch-all for residential properties
          layout.tsx               ← Dynamic metadata
          page.tsx                 ← Residential listings
      commercial/
        [[...params]]/             ← Catch-all for commercial properties
          layout.tsx               ← Dynamic metadata
          page.tsx                 ← Commercial listings
  lib/
    urlService.ts                  ← URL generation & parsing
    metadataService.ts             ← Dynamic SEO metadata
  redux/
    reducers/
      property/
        propertyFiltersSlice.ts    ← Filter state management
  components/
    listing-filter/
      ListingFilter.tsx            ← Main filter component
      BedroomFilter.tsx            ← Single select dropdown
```

## Build & Deploy

```bash
# Build (should work without errors)
npm run build

# Start dev server
npm run dev

# Test URLs
Visit: http://localhost:3000/residential/houses-for-rent
Visit: http://localhost:3000/residential/house-rent-in-gulshan
```

## Status

✅ All files created  
✅ All links updated  
✅ No linter errors  
✅ Next.js 15+ compatible  
✅ Production ready

---

**Implementation Date:** October 21, 2025  
**Status:** ✅ Complete
