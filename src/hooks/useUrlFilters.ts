import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import {
  PropertyFilters,
  parseCompleteUrl,
  filtersToSeoUrl,
  filtersToListedUrl,
} from "@/lib/urlService";

/**
 * Hook to manage filters via URL (single source of truth)
 * Replaces Redux-based filter management
 *
 * @returns {Object} - filters object, updateFilters function, and resetFilters function
 */
export function useUrlFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse current URL to get filters (memoized for performance)
  const filters = useMemo(() => {
    return parseCompleteUrl(pathname, searchParams);
  }, [pathname, searchParams]);

  // Update filters by updating URL (merges with existing filters)
  const updateFilters = useCallback(
    (updates: Partial<PropertyFilters>) => {
      const isListedRoute = pathname.startsWith("/listed");
      const isPropertyTypeChange = updates.propertyType !== undefined;

      // If on listed page, always stay on listed page and use SEO-friendly structure
      if (isListedRoute) {
        const newFilters = { ...filters, ...updates };
        // Remove content filter when navigating within listed page
        delete newFilters.content;

        // Generate the standard SEO URL (e.g., /commercial/space-for-rent)
        // Then prefix with /listed to keep the route context
        const seoUrl = filtersToSeoUrl(newFilters);
        const newUrl = `/listed${seoUrl}`;

        router.push(newUrl);
        return;
      }

      // For regular pages, use normal SEO URL generation
      const newFilters = { ...filters, ...updates };
      // console.log("🚀 ~ useUrlFilters ~ newFilters:", newFilters);
      const newUrl = filtersToSeoUrl(newFilters);
      router.push(newUrl);
    },
    [filters, router, pathname]
  );

  // Reset filters to default (residential apartments for rent)
  const resetFilters = useCallback(() => {
    const resetUrl = "/residential/apartments-for-rent";
    router.push(resetUrl);
  }, [router]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
