"use client";

import { useState, useEffect } from "react";

interface PriceRangeSliderProps {
    min: string;
    max: string;
    onMinChange: (val: string) => void;
    onMaxChange: (val: string) => void;
    minimumPrice?: number;
    maximumPrice?: number;
}

const MIN_ALLOWED = 0;

export function PriceRangeSlider({
    min,
    max,
    onMinChange,
    onMaxChange,
    minimumPrice = 0,
    maximumPrice = 1500000,
}: PriceRangeSliderProps) {
    // Ensure minimum price is at least minimumPrice from props
    const absoluteMin = minimumPrice;
    const absoluteMax = maximumPrice;

    // Local state for slider values
    const [minValue, setMinValue] = useState(
        min ? Math.max(Number(min), absoluteMin) : absoluteMin
    );
    const [maxValue, setMaxValue] = useState(
        max ? Number(max) : absoluteMax
    );

    // Sync with parent when props change
    useEffect(() => {
        if (min) {
            setMinValue(Math.max(Number(min), absoluteMin));
        } else {
            setMinValue(absoluteMin);
        }
    }, [min, absoluteMin]);

    useEffect(() => {
        if (max) {
            setMaxValue(Number(max));
        } else {
            setMaxValue(absoluteMax);
        }
    }, [max, absoluteMax]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        // Ensure min doesn't exceed max
        const newMin = Math.min(value, maxValue);
        setMinValue(newMin);
        onMinChange(newMin.toString());
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        // Ensure max doesn't go below min
        const newMax = Math.max(value, minValue);
        setMaxValue(newMax);
        onMaxChange(newMax.toString());
    };

    // Calculate percentages for slider styling
    const minPercent = ((minValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
    const maxPercent = ((maxValue - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

    // Format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="w-full">
            <h3 className="font-normal text-secondary mb-2 text-left">Price Range</h3>

            {/* Display selected values */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    <span className="text-muted">Min: </span>
                    <span className="font-medium text-secondary">{formatPrice(minValue)}</span>
                </div>
                <div className="text-sm">
                    <span className="text-muted">Max: </span>
                    <span className="font-medium text-secondary">{formatPrice(maxValue)}</span>
                </div>
            </div>

            {/* Slider container */}
            <div className="relative h-2 mb-8">
                {/* Track background */}
                <div className="absolute w-full h-1 top-0.5 bg-gray-200 rounded-full" />

                {/* Active range */}
                <div
                    className="absolute h-1 top-0.5 bg-primary rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                {/* Min slider */}
                <input
                    type="range"
                    min={absoluteMin}
                    max={absoluteMax}
                    step={1000}
                    value={minValue}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: minValue > absoluteMax - (absoluteMax - absoluteMin) * 0.1 ? 5 : 3 }}
                />

                {/* Max slider */}
                <input
                    type="range"
                    min={absoluteMin}
                    max={absoluteMax}
                    step={1000}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: 4 }}
                />
            </div>
        </div>
    );
}
