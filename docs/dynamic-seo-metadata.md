# Dynamic SEO Metadata Implementation

## Overview

The application now generates dynamic metadata for property listing pages based on URL filters, improving SEO and search engine rankings.

## Implementation

### Files Created/Updated

1. **`src/lib/metadataService.ts`** - Metadata generation logic
2. **`src/app/rent/[[...params]]/layout.tsx`** - Dynamic metadata integration

## How It Works

### URL Pattern Recognition

The system parses the URL path to extract filters:

```
/rent/residential/banani/3-bedrooms/furnished/with-parking
```

Extracted filters:

- Property Type: residential
- Location: banani
- Bedrooms: 3
- Furnished: true
- Parking: true

### Metadata Generation

Based on extracted filters, the system generates:

#### 1. **Dynamic Title**

```
Format: [Bedrooms] [Furnished] [PropertyType] in [Location] for Rent | smartLET

Examples:
- "3 Bedrooms Furnished Residential in Banani for Rent | smartLET"
- "Residential in Gulshan for Rent | smartLET"
- "Properties for Rent | smartLET" (default)
```

#### 2. **Dynamic Description**

```
Format: Find [details] in Dhaka, Bangladesh. [With amenities.] [Price range.] Browse verified properties with smartLET.

Examples:
- "Find 3 bedrooms furnished residential in banani in Dhaka, Bangladesh. With parking. Browse verified properties with smartLET."
- "Find residential in gulshan in Dhaka, Bangladesh. Price range from ৳15,000 up to ৳30,000. Browse verified properties with smartLET."
```

#### 3. **Dynamic Keywords**

Automatically generated based on filters:

```javascript
[
  "rent property dhaka",
  "smartlet rent",
  "rent banani",
  "banani properties",
  "banani rent dhaka",
  "3 bedroom for rent",
  "3 bedroom apartment dhaka",
  "residential property rent",
  "residential for rent dhaka",
  "furnished apartment rent",
  "furnished property dhaka",
  "property with parking",
];
```

#### 4. **Canonical URL**

Clean canonical URL for SEO:

```
/rent/residential/banani
```

#### 5. **Open Graph & Twitter Cards**

Dynamic social media tags with the same title and description.

## Examples

### Example 1: Basic Listing

**URL:** `/rent/residential`

```yaml
Title: "Residential for Rent | smartLET"
Description: "Find residential for rent in Dhaka, Bangladesh. Browse verified properties with smartLET."
Keywords:
  [
    "rent property dhaka",
    "smartlet rent",
    "residential property rent",
    "residential for rent dhaka",
  ]
Canonical: "/rent/residential"
```

### Example 2: Location-Specific

**URL:** `/rent/residential/banani`

```yaml
Title: "Residential in Banani for Rent | smartLET"
Description: "Find residential in banani in Dhaka, Bangladesh. Browse verified properties with smartLET."
Keywords:
  [
    "rent property dhaka",
    "smartlet rent",
    "rent banani",
    "banani properties",
    "banani rent dhaka",
    "residential property rent",
    "residential for rent dhaka",
  ]
Canonical: "/rent/residential/banani"
```

### Example 3: Full Filter Set

**URL:** `/rent/residential/gulshan/3-bedrooms/furnished/with-parking`

```yaml
Title: "3 Bedrooms Furnished Residential in Gulshan for Rent | smartLET"
Description: "Find 3 bedrooms furnished residential in gulshan in Dhaka, Bangladesh. With parking. Browse verified properties with smartLET."
Keywords:
  [
    "rent property dhaka",
    "smartlet rent",
    "rent gulshan",
    "gulshan properties",
    "gulshan rent dhaka",
    "3 bedroom for rent",
    "3 bedroom apartment dhaka",
    "residential property rent",
    "residential for rent dhaka",
    "furnished apartment rent",
    "furnished property dhaka",
    "property with parking",
  ]
Canonical: "/rent/residential/gulshan"
```

### Example 4: With Price Range

**URL:** `/rent/residential/banani-dohs/2-bedrooms?priceMin=15000&priceMax=30000`

```yaml
Title: "2 Bedrooms Residential in Banani Dohs for Rent | smartLET"
Description: "Find 2 bedrooms residential in banani dohs in Dhaka, Bangladesh. Price range from ৳15,000 up to ৳30,000. Browse verified properties with smartLET."
Keywords:
  [
    "rent property dhaka",
    "smartlet rent",
    "rent banani dohs",
    "banani dohs properties",
    "banani dohs rent dhaka",
    "2 bedroom for rent",
    "2 bedroom apartment dhaka",
    "residential property rent",
    "residential for rent dhaka",
  ]
Canonical: "/rent/residential/banani-dohs"
```

## SEO Benefits

✅ **Unique Pages**: Each filter combination gets unique metadata  
✅ **Location-Based SEO**: Location-specific pages rank for local searches  
✅ **Rich Descriptions**: Detailed descriptions with bedrooms, price, amenities  
✅ **Keyword Optimization**: Auto-generated keywords based on filters  
✅ **Canonical URLs**: Clean canonical URLs prevent duplicate content issues  
✅ **Social Sharing**: Dynamic Open Graph tags for better social media previews  
✅ **Better CTR**: Descriptive titles improve click-through rates from search results

## Technical Details

### Next.js App Router Integration

The implementation uses Next.js 13+ App Router's `generateMetadata` function:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pathname = params.params ? `/rent/${params.params.join("/")}` : "/rent";

  const filters = parsePathToFilters(pathname);
  return generatePropertyMetadata(filters);
}
```

This ensures:

- Server-side metadata generation
- Proper SEO indexing
- Fast page loads
- Dynamic updates per URL

### Filter Priority

Metadata generation prioritizes filters in this order:

1. Bedrooms (most specific)
2. Furnished status
3. Property type
4. Location
5. Amenities (parking, gym, pool)
6. Price range

## Testing

To verify the implementation:

1. **View Source**: Check page source for dynamic `<title>` and `<meta>` tags
2. **Google Search Console**: Submit sitemap and monitor indexing
3. **Social Media Debuggers**:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
4. **SEO Tools**: Use tools like Ahrefs, SEMrush, or Moz to check metadata

## Future Enhancements

Potential improvements:

- Add structured data (JSON-LD) for rich snippets
- Include property count in title/description
- Add breadcrumbs for better navigation
- Implement hreflang tags for multilingual support
- Generate dynamic images for Open Graph
