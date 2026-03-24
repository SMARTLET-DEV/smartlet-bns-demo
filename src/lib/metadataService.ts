import { Metadata } from "next";
import { PropertyFilters } from "./urlService";

/**
 * Generate dynamic SEO metadata based on property filters
 */
export function generatePropertyMetadata(filters: PropertyFilters): Metadata {
    // Build dynamic title
    const titleParts: string[] = [];

    if (filters.bedrooms) {
        if (filters.bedrooms === 1) {
            titleParts.push("Studio Apartment");
        } else {
            titleParts.push(`${filters.bedrooms} Bedroom`);
        }
    }

    if (filters.furnished === true) {
        titleParts.push("Fully Furnished");
    }

    // if (filters.propertyType) {
    //   titleParts.push(
    //     filters.propertyType.charAt(0).toUpperCase() +
    //       filters.propertyType.slice(1)
    //   );
    // }

    if (filters.propertyType) {
        let typeLabel: string;

        if (filters.propertyType === "residential") {
            typeLabel = "Apartments";
        } else if (filters.propertyType === "commercial") {
            typeLabel = "Commercial Spaces";
        } else {
            const pt = filters.propertyType as string; // 👈 Fix
            typeLabel = pt.charAt(0).toUpperCase() + pt.slice(1);
        }
        titleParts.push(typeLabel);
    }

    if (filters.location) {
        const locationFormatted = filters.location
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        titleParts.push(`in ${locationFormatted}`);
    }

    const title =
    titleParts.length > 0
        ? `${titleParts.join(" ")} for Rent | OPENDOOR`
        : "Properties for Rent | OPENDOOR";

    // Build dynamic description
    const descriptionParts: string[] = [];

    if (titleParts.length > 0) {
        descriptionParts.push(
            `Find ${titleParts.join(" ").toLowerCase()} in Dhaka, Bangladesh.`
        );
    } else {
        descriptionParts.push(
            "Find apartments and houses for rent in Dhaka, Bangladesh."
        );
    }

    const features: string[] = [];
    if (filters.parking) features.push("parking");
    if (filters.gym) features.push("gym");
    if (filters.swimmingPool) features.push("swimming pool");

    if (features.length > 0) {
        descriptionParts.push(`With ${features.join(", ")}.`);
    }

    if (filters.priceMin || filters.priceMax) {
        const priceRange: string[] = [];
        if (filters.priceMin)
            priceRange.push(`from ৳${filters.priceMin.toLocaleString()}`);
        if (filters.priceMax)
            priceRange.push(`up to ৳${filters.priceMax.toLocaleString()}`);
        descriptionParts.push(`Price range ${priceRange.join(" ")}.`);
    }

    descriptionParts.push("Browse verified properties with OPENDOOR.");

    const description = descriptionParts.join(" ");

    // Build keywords
    const keywords: string[] = ["rent property dhaka", "opendoor rent"];

    if (filters.location) {
        const locationFormatted = filters.location.replace(/-/g, " ");
        keywords.push(`rent ${locationFormatted}`);
        keywords.push(`${locationFormatted} properties`);
        keywords.push(`${locationFormatted} rent dhaka`);
    }

    if (filters.bedrooms) {
        if (filters.bedrooms === 1) {
            keywords.push("studio apartment for rent");
            keywords.push("studio apartment dhaka");
        } else {
            keywords.push(`${filters.bedrooms} bedroom flat for rent`);
            keywords.push(`${filters.bedrooms} bedroom apartment dhaka`);
        }
    }

    if (filters.propertyType) {
        keywords.push(`${filters.propertyType} property rent`);
        keywords.push(`${filters.propertyType} for rent dhaka`);
    }

    if (filters.furnished === true) {
        keywords.push("furnished apartment rent");
        keywords.push("furnished property dhaka");
    }

    if (filters.parking) {
        keywords.push("property with parking");
    }

    // Build canonical URL (no "/rent" - using route group)
    const canonicalSegments: string[] = [];
    if (filters.propertyType) canonicalSegments.push(filters.propertyType);

    if (filters.location) {
        const locationSlug = filters.location.toLowerCase().replace(/\s+/g, "-");
        canonicalSegments.push(`apartments-for-rent-in-${locationSlug}`);
    } else {
        canonicalSegments.push("apartments-for-rent");
    }

    const canonical =
    canonicalSegments.length > 0
        ? `/${canonicalSegments.join("/")}`
        : "/residential/apartments-for-rent";

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "OPENDOOR",
            images: [
                {
                    url: "https://opendoor.com.bd/og-image-v2.PNG",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://opendoor.com.bd/og-image-v2.PNG"],
        },
        alternates: {
            canonical,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
