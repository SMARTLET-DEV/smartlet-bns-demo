import { PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxItem } from "./listing-filter";
import { useRef, useState, useEffect } from "react";

interface PropertyTypeFilterProps {
  propertyTypes: CheckboxItem[];
  currentType?: "residential" | "commercial";
  onChange: (type: "residential" | "commercial") => void;
}

export default function PropertyTypeFilter({
    propertyTypes,
    currentType,
    onChange,
}: PropertyTypeFilterProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button ref={triggerRef} variant="outline" className="cursor-pointer">
          Property Type <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-4"
                style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
            >
                <div className="flex flex-col gap-3 mt-2">
                    {propertyTypes.map((propertyType) => (
                        <div key={propertyType.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={propertyType.id}
                                checked={currentType === propertyType.id}
                                onCheckedChange={() => {
                                    onChange(propertyType.id as "residential" | "commercial");
                                }}
                            />
                            <label
                                htmlFor={propertyType.id}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted"
                            >
                                {propertyType.label}
                            </label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
