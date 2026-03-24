import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PriceRangeSlider } from "./PriceRangeSlider";

export function RangeFilter({
    label,
    min,
    max,
    onMinChange,
    onMaxChange,
    placeholderMin,
    placeholderMax,
    minimumPrice,
    maximumPrice,
}: {
    label: string;
    min: string;
    max: string;
    onMinChange: (val: string) => void;
    onMaxChange: (val: string) => void;
    placeholderMin?: string;
    placeholderMax?: string;
    minimumPrice?: number;
    maximumPrice?: number;
}) {
    const isMobile = useIsMobile();
    const isPriceRange = label === "Price Range";

    // Show slider on mobile for Price Range only
    if (isMobile && isPriceRange) {
        return (
            <PriceRangeSlider
                min={min}
                max={max}
                onMinChange={onMinChange}
                onMaxChange={onMaxChange}
                minimumPrice={minimumPrice}
                maximumPrice={maximumPrice}
            />
        );
    }

    // Default: show input fields (desktop or non-price filters)
    return (
        <div className="w-full">
            <h3 className="font-normal text-secondary mb-2 text-left">
                {label}
            </h3>
            <div className="flex gap-2 w-full">
                <Input
                    className="w-full text-sm placeholder:text-muted placeholder:font-light rounded-lg py-5.5 shadow-none border-gray-200"
                    type="number"
                    placeholder={placeholderMin || "Min"}
                    value={min}
                    min={minimumPrice ?? 0}
                    onChange={(e) => onMinChange(e.target.value)}
                    onBlur={(e) => {
                        if (Number(e.target.value) < (minimumPrice ?? 0)) {
                            onMinChange((minimumPrice ?? 0).toString());
                        }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                />
                <Input
                    className="w-full text-sm placeholder:text-muted placeholder:font-light rounded-lg py-5.5 shadow-none border-gray-200"
                    type="number"
                    placeholder={placeholderMax || "Max"}
                    value={max}
                    min={0}
                    onChange={(e) => onMaxChange(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
