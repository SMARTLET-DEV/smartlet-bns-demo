
import { MoreIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckboxItem } from "./listing-filter";
import { useMemo, useState, useEffect } from "react";
import { PropertyFilters } from "@/lib/urlService";

interface MoreFiltersComponentProps {
  filters: PropertyFilters;
  moreFilters: CheckboxItem[];
  onChange: (updates: Partial<PropertyFilters>) => void;
}

export default function MoreFiltersComponent({
  filters,
  moreFilters,
  onChange,
}: MoreFiltersComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate active filters from URL state
  const activeFilters = useMemo(() => {
    const active: string[] = [];
    if (filters.furnished === true) active.push("furnished");
    if (filters.furnished === false) active.push("unfurnished");
    if (filters.parking) active.push("parking");
    if (filters.swimmingPool) active.push("pool");
    if (filters.gym) active.push("gym");
    if (filters.petFriendly) active.push("pet-friendly");
    if (filters.unused) active.push("unused");
    if (filters.letAgreed === false) active.push("let-agreed");
    return active;
  }, [filters]);

  const activeFiltersCount = activeFilters.length;

  // Local state for pending changes
  const [pendingFilters, setPendingFilters] = useState<string[]>([]);

  // Sync local state with active filters when popover opens
  useEffect(() => {
    if (isOpen) {
      setPendingFilters([...activeFilters]);
    }
  }, [isOpen, activeFilters]);

  const handleToggle = (filterId: string, isChecked: boolean) => {
    setPendingFilters((prev) => {
      const next = new Set(prev);
      if (isChecked) {
        next.add(filterId);
        // Mutual exclusivity for furnished/unfurnished
        if (filterId === "furnished") next.delete("unfurnished");
        if (filterId === "unfurnished") next.delete("furnished");
      } else {
        next.delete(filterId);
      }
      return Array.from(next);
    });
  };

  const handleApply = () => {
    const updates: Partial<PropertyFilters> = {};
    const localSet = new Set(pendingFilters);

    // Handle furnished/unfurnished
    if (localSet.has("furnished")) {
      updates.furnished = true;
    } else if (localSet.has("unfurnished")) {
      updates.furnished = false;
    } else {
      updates.furnished = undefined;
    }

    // Handle other filters
    updates.parking = localSet.has("parking") ? true : undefined;
    updates.swimmingPool = localSet.has("pool") ? true : undefined;
    updates.gym = localSet.has("gym") ? true : undefined;
    updates.petFriendly = localSet.has("pet-friendly") ? true : undefined;
    updates.unused = localSet.has("unused") ? true : undefined;
    updates.letAgreed = localSet.has("let-agreed") ? false : undefined;

    onChange(updates);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={activeFiltersCount > 0 ? "default" : "outline"}
          className="cursor-pointer"
        >
          <MoreIcon className="w-6 h-6 mr-1" />
          More {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-6" align="start">
        <div className="grid grid-cols-2 gap-x-1 gap-y-4">
          {moreFilters.map((filter) => {
            const isChecked = pendingFilters.includes(filter.id);
            return (
              <div
                key={filter.id}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <Checkbox
                  id={filter.id}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    handleToggle(filter.id, checked as boolean);
                  }}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={filter.id}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted"
                >
                  {filter.label}
                </label>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleApply}
            className="px-8 font-normal bg-transparent border-primary text-primary hover:text-white hover:bg-primary duration-150"
            variant="outline"
            size="sm"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
