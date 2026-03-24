import { ChevronDownIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface BedroomFilterProps {
  value?: number;
  onChange: (bedrooms: number | undefined) => void;
  propertyType?: string;
  spaceType?: "enclosed" | "open";
}

export default function BedroomFilter({
    value,
    onChange,
    propertyType,
    spaceType,
}: BedroomFilterProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
        undefined
    );

    const isCommercial = propertyType?.toUpperCase() === "COMMERCIAL";
    const isEnclosedCommercial = isCommercial && spaceType === "enclosed";
    const labelText = isCommercial ? "Rooms" : "Bedrooms";

    // All possible bedroom options
    const allBedroomOptions = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5+" },
    ];

    // Filter out option 1 for enclosed commercial spaces
    const bedroomOptions = isEnclosedCommercial
        ? allBedroomOptions.filter((option) => option.value !== 1)
        : allBedroomOptions;

    // Always show the label text, not the selected value
    const buttonText = labelText;
    const isSelected = value !== undefined;

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [labelText]);

    const handleSelect = (selectedValue: number) => {
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
                <Button
                    ref={triggerRef}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                        "cursor-pointer",
                        isSelected && "bg-primary hover:bg-primary text-primary-foreground"
                    )}
                >
                    {buttonText} <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-4"
                style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
            >
                <div className="flex flex-col gap-1">
                    {bedroomOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                                "text-right px-3 py-1.5 rounded-md text-sm font-normal transition-colors",
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
