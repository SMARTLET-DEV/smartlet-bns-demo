import { ChevronDownIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DebouncedInput } from "../common/DebouncedInput";
import { useAppSelector } from "@/redux/hook";
import { useRef, useState, useEffect } from "react";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (
    minPrice: number | undefined,
    maxPrice: number | undefined
  ) => void;
}

export default function PriceFilter({
    minPrice,
    maxPrice,
    onChange,
}: PriceFilterProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, []);

    // Get minimum allowed price from Redux state (property data)
    const { minPrice: minAllowedPrice, loading } = useAppSelector(
        (state) => state.property.data
    );
    const isLoading = loading;

    const handleMinPriceChange = (value: string) => {
        const numValue = value ? Number(value) : undefined;
        // Validate against minimum allowed price
        if (numValue !== undefined && numValue < minAllowedPrice) {
            onChange(minAllowedPrice, maxPrice);
        } else {
            onChange(numValue, maxPrice);
        }
    };

    const handleMaxPriceChange = (value: string) => {
        const numValue = value ? Number(value) : undefined;
        onChange(minPrice, numValue);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button ref={triggerRef} variant="outline" className="cursor-pointer">
          Price Range <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-4"
                style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
            >
                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex flex-col w-full">
                        <DebouncedInput
                            value={minPrice || ""}
                            onChange={handleMinPriceChange}
                            delay={800}
                            placeholder="Min"
                            type="number"
                            className="w-full placeholder:text-muted placeholder:font-light rounded-lg py-5.5 shadow-none border-gray-200 no-spinner text-secondary"
                            min={minAllowedPrice || 0}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            onBlur={(e) => {
                                if (Number(e.target.value) < minAllowedPrice) {
                                    handleMinPriceChange(minAllowedPrice.toString());
                                }
                            }}
                        />
                        {!isLoading && minAllowedPrice > 0 && (
                            <p className="text-xs mt-1 text-muted">
                *Starts from BDT {minAllowedPrice}
                            </p>
                        )}
                    </div>
                    <DebouncedInput
                        value={maxPrice || ""}
                        onChange={handleMaxPriceChange}
                        delay={800}
                        placeholder="Max"
                        type="number"
                        className="w-full placeholder:text-muted placeholder:font-light rounded-lg py-5.5 shadow-none border-gray-200 no-spinner text-secondary"
                        min={0}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
