"use client";

import { FilterIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useMemo } from "react";
import type { FilterResult } from "./FilterFormContent";
import { FilterConfig, FilterFormContent } from "./FilterFormContent";
import CustomSearchInput from "./customSearchInput";
import { useDispatch } from "react-redux";
import { setHomeFilterOpen } from "@/redux/reducers/property/propertySlice";
import { useIsMobile } from "@/hooks/useIsMobile";

export function SearchBar({
    searchValue,
    onSearchChange,
    onSearchClick,
    placeholderText,
    primarybuttonLabel,
    hangingbuttonLabel,
    filterConfig,
    suggestions = [],
    onSuggestionClick,
    primarybuttonDisabled = false,
    onApplyFilter,
    checkboxState,
    setCheckboxState,
}: {
    searchValue: string;
    onSearchChange: (val: string) => void;
    onSearchClick: () => void;
    placeholderText: string;
    primarybuttonLabel: string;
    hangingbuttonLabel: string;
    filterConfig: FilterConfig[];
    suggestions?: string[];
    onSuggestionClick?: (val: string) => void;
    primarybuttonDisabled?: boolean;
    onApplyFilter?: (filters: FilterResult) => void;
    checkboxState?: Record<string, Set<string>>;
    setCheckboxState?: React.Dispatch<
        React.SetStateAction<Record<string, Set<string>>>
    >;
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [localCheckboxState, setLocalCheckboxState] = useState<
        Record<string, Set<string>>
    >({});
    const [rangeState, setRangeState] = useState<
        Record<string, { min: string; max: string }>
    >({});
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(true);

    // Use provided checkboxState and setCheckboxState if available, otherwise use local state
    const effectiveCheckboxState = checkboxState || localCheckboxState;
    const effectiveSetCheckboxState = setCheckboxState || setLocalCheckboxState;
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const isMobile = useIsMobile();

    const activeFilterCount = useMemo(() => {
        let count = 0;

        // Count Dropdowns
        filterConfig.forEach((field) => {
            if (field.type === "dropdown") {
                // Ignore "Property Type" as it's a mandatory category match, not usually counted as an added filter
                if (field.label !== "Property Type" && field.state) {
                    count++;
                }
            } else if (field.type === "range") {
                // Check rangeState matching this field label
                const range = rangeState[field.label];
                if (range && (range.min || range.max)) {
                    count++;
                }
            } else if (field.type === "checkbox") {
                const set = effectiveCheckboxState[field.label];
                if (set && set.size > 0) {
                    count += set.size;
                }
            }
        });

        return count;
    }, [filterConfig, effectiveCheckboxState, rangeState]);

    useEffect(() => {
        if (suggestions.length > 0) setIsSuggestionVisible(true);
    }, [suggestions]);

    // Prevent background scroll when filter is open on mobile
    useEffect(() => {
        if (isFilterOpen && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFilterOpen, isMobile]);

    const handleOpenFilter = () => {
        setIsFilterOpen(true);
        dispatch(setHomeFilterOpen(true));
        filterContainerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };
    const handleCloseFilter = () => {
        setIsFilterOpen(false);
        dispatch(setHomeFilterOpen(false));
    };
    const handleApplyFilter = (data: FilterResult) => {
        onApplyFilter?.(data);
        handleCloseFilter();
    };

    return (
        <div className="relative w-full sm:w-[80%] lg:w-[60%] max-w-screen-lg h-[120px] sm:h-auto mx-auto">
            <div
                className={`
          flex flex-col sm:flex-row gap-4 sm:gap-5 bg-background px-3 py-3 w-full z-10 shadow-none sm:border
          rounded-xl
          ${isFilterOpen
            ? "sm:rounded-b-none"
            : "sm:rounded-bl-none sm:rounded-br-xl"
        }
        `}
            >
                <div className="h-[48px] w-full lg:w-[384px] xl:w-[538px] 2xl:w-[692px]">
                    <CustomSearchInput
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                        onSearchClick={onSearchClick}
                        placeholderText={placeholderText}
                        isSuggestionVisible={isSuggestionVisible}
                        suggestions={suggestions}
                        onSuggestionClick={onSuggestionClick}
                        setIsSuggestionVisible={setIsSuggestionVisible}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        className="flex mt-1.5 -ml-2.5 items-center justify-center gap-1 text-primary hover:text-primary font-normal text-base sm:text-base bg-background px-4 py-3 rounded-lg transition w-full sm:hidden flex-1"
                        onClick={handleOpenFilter}
                    >
                        <FilterIcon className="w-5 h-5" />
                        {hangingbuttonLabel}{activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </Button>

                    <Button
                        onClick={onSearchClick}
                        disabled={false}
                        className="pointer-events-auto bg-[#CBC3E3] hover:bg-primary font-normal border border-primary sm:font-normal text-base sm:text-base h-[48px] rounded-lg transition w-full sm:w-[160px] flex-1 sm:flex-none"
                    >
                        {primarybuttonLabel}
                    </Button>
                </div>
            </div>

            {!isFilterOpen && (
                <div className="hidden sm:block absolute left-0 -bottom-9 z-0">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-primary hover:text-red-500 font-medium text-sm bg-background w-[100px] h-[36px] rounded-t-none rounded-b-lg transition"
                        onClick={handleOpenFilter}
                    >
                        <FilterIcon className="w-5 h-5" />
                        {hangingbuttonLabel}{activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </Button>
                </div>
            )}

            <div
                ref={filterContainerRef}
                className={`
          hidden md:block
          absolute z-[40] mt-0 mb-4 p-3
          rounded-2xl rounded-t-none border border-t-0 bg-background
          transform origin-top
          transition-transform duration-300 ease-in-out w-full
          ${isFilterOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}
        `}
            >
                <FilterFormContent
                    config={filterConfig}
                    onCancel={handleCloseFilter}
                    onApply={handleApplyFilter}
                    checkboxState={effectiveCheckboxState}
                    setCheckboxState={effectiveSetCheckboxState}
                    rangeState={rangeState}
                    setRangeState={setRangeState}
                    variant="flex"
                />
            </div>

            <div className="md:hidden fixed inset-0 z-50 pointer-events-none">
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out
                      ${isFilterOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0"
        }`}
                    onClick={handleCloseFilter}
                />
                <div
                    className={`
            fixed inset-x-0 bottom-0
            w-full max-w-[1000px] mx-auto
            max-h-[70vh] overflow-y-auto
            bg-background rounded-t-2xl p-5
            shadow-lg border
            transform transition-transform duration-300 ease-out
            ${isFilterOpen
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full"
        }
          `}
                >
                    <FilterFormContent
                        config={filterConfig}
                        onCancel={handleCloseFilter}
                        onApply={handleApplyFilter}
                        checkboxState={effectiveCheckboxState}
                        setCheckboxState={effectiveSetCheckboxState}
                        rangeState={rangeState}
                        setRangeState={setRangeState}
                        variant="grid"
                    />
                </div>
            </div>
        </div>
    );
}
