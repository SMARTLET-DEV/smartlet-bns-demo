import { ChevronDownIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface SpaceTypeFilterProps {
  value?: "enclosed" | "open";
  onChange: (spaceType: "enclosed" | "open" | undefined) => void;
}

export default function SpaceTypeFilter({
  value,
  onChange,
}: SpaceTypeFilterProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  const spaceTypeOptions = [
    { value: "enclosed", label: "Enclosed Space" },
    { value: "open", label: "Open Space" },
  ] as const;

  // Find the selected option label
  const selectedOption = spaceTypeOptions.find(
    (option) => option.value === value
  );
  const buttonText = selectedOption ? selectedOption.label : "Space Type";

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [value]);

  const handleSelect = (selectedValue: "enclosed" | "open") => {
    // Toggle: if clicking the same value, deselect it
    if (value === selectedValue) {
      onChange(undefined);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={triggerRef} variant="outline" className="cursor-pointer">
          {buttonText} <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-4"
        style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
      >
        <div className="flex flex-col gap-2">
          {spaceTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "text-left px-3 py-2 rounded-md text-sm font-normal transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                value === option.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
