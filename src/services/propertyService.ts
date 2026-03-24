import { PropertyFilters } from "@/lib/urlService";
import { filtersToApiQuery } from "@/lib/urlService";

/**
 * PropertyService - Utility service for property-related operations
 * Note: This service is currently not in use as components now use RTK Query directly
 * with URL-based filtering. Kept for potential future utility needs.
 */
class PropertyService {
    private static instance: PropertyService;
    private cache = new Map<string, any>();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutes

    static getInstance(): PropertyService {
        if (!PropertyService.instance) {
            PropertyService.instance = new PropertyService();
        }
        return PropertyService.instance;
    }

    /**
   * Fetch properties with filters (without Redux)
   * This method is kept for potential future use
   */
    async fetchProperties(filters: PropertyFilters, forceRefresh = false) {
    // Only run on client side
        if (typeof window === "undefined") {
            return { properties: [], pagination: {}, success: true };
        }

        const cacheKey = this.generateCacheKey(filters);

        // Check cache first
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const queryString = filtersToApiQuery(filters);
            const response = await fetch(`/api/v1/properties?${queryString}`);
            const data = await response.json();

            if (data.success) {
                // Cache the result
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now(),
                });

                return data;
            } else {
                throw new Error(data.message || "Failed to fetch properties");
            }
        } catch (error: any) {
            console.error("Property fetch error:", error);
            throw error;
        }
    }

    /**
   * Fetch minimum price for price validation
   */
    async fetchMinPrice(filters: PropertyFilters) {
        const minPriceFilters = {
            ...filters,
            take: 1,
            orderBy: "price",
            page: 1,
        };

        const data = await this.fetchProperties(minPriceFilters);
        const minPrice = data?.properties?.[0]?.price ?? 0;

        return minPrice;
    }

    /**
   * Clear cache
   */
    clearCache() {
        this.cache.clear();
    }

    /**
   * Generate cache key from filters
   */
    private generateCacheKey(filters: PropertyFilters): string {
        return JSON.stringify(filters);
    }
}

export const propertyService = PropertyService.getInstance();
