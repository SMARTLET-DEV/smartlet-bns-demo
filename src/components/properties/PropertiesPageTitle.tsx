"use client";

import { PropertyFilters } from "@/lib/urlService";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

interface PropertiesPageTitleProps {
  totalCount?: number;
  filters?: PropertyFilters;
}

export default function PropertiesPageTitle({
  totalCount,
  filters: propsFilters,
}: PropertiesPageTitleProps) {
  const { filters: urlFilters, updateFilters } = useUrlFilters();

  // Use props filters if provided, otherwise use URL filters
  const filters = propsFilters || urlFilters;
  const formattedCount = (totalCount || 0).toLocaleString();

  // Generate title from filters
  let title = "All Properties";
  const rawSearch = (filters.search || "").trim();

  if (rawSearch) {
    const capitalizedSearch = capitalizeFirst(rawSearch);
    if (filters.propertyType === "commercial") {
      title = `Commercial Properties in ${capitalizedSearch}`;
    } else if (filters.propertyType === "residential") {
      title = `Residential Properties in ${capitalizedSearch}`;
    } else {
      title = `Properties in ${capitalizedSearch}`;
    }
  } else if (filters.propertyType) {
    if (filters.propertyType === "commercial") {
      title = "All Commercial Properties";
    } else if (filters.propertyType === "residential") {
      title = "All Residential Properties";
    }
  }

  const handleSortChange = (value: string) => {
    let newOrderBy = "-updatedAt";
    if (value === "Newest") newOrderBy = "-updatedAt";
    else if (value === "Price (Low to High)") newOrderBy = "price";
    else if (value === "Price (High to Low)") newOrderBy = "-price";

    // console.log("🔄 Sort change:", value, "→ orderBy:", newOrderBy);
    updateFilters({ orderBy: newOrderBy, page: 1 });
  };

  const getSelectedOption = () => {
    const orderBy = filters.orderBy || "-updatedAt";
    if (orderBy === "-updatedAt") return "Newest";
    if (orderBy === "price") return "Price (Low to High)";
    if (orderBy === "-price") return "Price (High to Low)";
    return "Newest";
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden sm:flex justify-between items-center py-3 w-full">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-secondary">{title}</h1>
          <p className="text-muted text-base mt-1">
            {formattedCount} properties available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary font-medium">Sort by:</span>
          <Select value={getSelectedOption()} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              {getSelectedOption()}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Price (Low to High)">
                Price (Low to High)
              </SelectItem>
              <SelectItem value="Price (High to Low)">
                Price (High to Low)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="sm:hidden py-3 w-full px-0">
        <div className="text-left mb-3">
          <h1 className="text-2xl font-light text-secondary">{title}</h1>
          <p className="text-muted text-base mt-1">
            {formattedCount} properties available
          </p>
        </div>
        <div className="flex items-center justify-start gap-2">
          <span className="text-sm text-secondary font-medium">Sort by:</span>
          <Select value={getSelectedOption()} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] text-sm h-9">
              {getSelectedOption()}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Price (Low to High)">
                Price (Low to High)
              </SelectItem>
              <SelectItem value="Price (High to Low)">
                Price (High to Low)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
