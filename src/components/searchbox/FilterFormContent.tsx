"use client";

import { useGetAllPropertiesQuery, useGetPriceRangeQuery } from "@/redux/reducers/property/propertyApi";
import { CheckboxFilter } from "./Filter/CheckboxFilter";
import { DropdownFilter } from "./Filter/DropdownFilter";
import { FilterFooter } from "./Filter/FilterFooter";
import { FilterHeader } from "./Filter/FilterHeader";
import { RangeDropdownFilter } from "./Filter/RangeDropdownFilter";
import { RangeFilter } from "./Filter/RangeFilter";

export type FilterConfig =
  | {
    label: string;
    type: "dropdown";
    range?: [number, number];
    options?: string[];
    state: string;
    setState: (val: string) => void;
    placeholder?: string;
  }
  | {
    label: string;
    type: "range";
    placeholderMin?: string;
    placeholderMax?: string;
  }
  | {
    label: string;
    type: "range-dropdown";
    range: [number, number];
    minState: string;
    maxState: string;
    setMinState: (val: string) => void;
    setMaxState: (val: string) => void;
    options?: string[];
    placeholderMin?: string;
    placeholderMax?: string;
  }
  | {
    label: string;
    type: "checkbox";
    values: string[];
  };

type FilterResultValue = string | { min?: string; max?: string } | string[];
export type FilterResult = Record<string, FilterResultValue>;

export function FilterFormContent({
    config,
    onApply,
    onCancel,
    checkboxState,
    setCheckboxState,
    rangeState,
    setRangeState,
    variant = "flex",
}: {
  config: FilterConfig[];
  onApply: (values: FilterResult) => void;
  onCancel: () => void;
  checkboxState: Record<string, Set<string>>;
  setCheckboxState: React.Dispatch<
    React.SetStateAction<Record<string, Set<string>>>
  >;
  rangeState: Record<string, { min: string; max: string }>;
  setRangeState: React.Dispatch<
    React.SetStateAction<Record<string, { min: string; max: string }>>
  >;
  variant?: "flex" | "grid";
}) {
    // Fetch price range dynamically
    const { data: priceRangeData } = useGetPriceRangeQuery();
    const minimumPrice = priceRangeData?.minPrice || 0;
    const maximumPrice = priceRangeData?.maxPrice || 10000000;


    const handleCheckboxToggle = (label: string, value: string) => {
        setCheckboxState((prev) => {
            const current = new Set(prev[label] || []);
            if (value === "Furnished" || value === "Unfurnished") {
                // Mutual exclusivity for Furnished/Unfurnished only
                if (value === "Furnished") {
                    current.delete("Unfurnished");
                    if (current.has("Furnished")) {
                        current.delete("Furnished");
                    } else {
                        current.add("Furnished");
                    }
                } else if (value === "Unfurnished") {
                    current.delete("Furnished");
                    if (current.has("Unfurnished")) {
                        current.delete("Unfurnished");
                    } else {
                        current.add("Unfurnished");
                    }
                }
                return { ...prev, [label]: current };
            } else {
                // Normal behavior for others
                if (current.has(value)) {
                    current.delete(value);
                } else {
                    current.add(value);
                }
                return { ...prev, [label]: current };
            }
        });
    };

    const handleRangeChange = (
        label: string,
        field: "min" | "max",
        value: string
    ) => {
        if (!/^\d*$/.test(value)) return;
        setRangeState((prev) => ({
            ...prev,
            [label]: { ...prev[label], [field]: value },
        }));
    };

    const handleReset = () => {
        config.forEach((field) => {
            if (field.type === "dropdown") {
                // Keep Property Type as Residential, clear all other dropdowns
                if (field.label === "Property Type") {
                    field.setState("Residential");
                } else {
                    field.setState("");
                }
            }
            if (field.type === "range-dropdown") {
                field.setMinState("");
                field.setMaxState("");
            }
        });
        setRangeState({});
        setCheckboxState({});
    };

    const handleCancel = () => {
        handleReset();
        onCancel();
    };

    const handleApply = () => {
        const result: FilterResult = {};

        config.forEach((field) => {
            if (field.type === "dropdown") {
                result[field.label] = field.state;
            } else if (field.type === "range") {
                const { min, max } = rangeState[field.label] || {};
                result[field.label] = { min, max };
            } else if (field.type === "range-dropdown") {
                result[field.label] = {
                    min: field.minState,
                    max: field.maxState,
                };
            } else if (field.type === "checkbox") {
                result[field.label] = Array.from(checkboxState[field.label] || []);
            }
        });

        onApply(result);
        onCancel(); // optional auto-close
    };

    return (
        <div className="relative space-y-6 sm:space-y-0 sm:space-x-0">
            <div className="mb-4 sm:mb-6">
                <FilterHeader onReset={handleReset} onClose={onCancel} />
            </div>

            {/* ---- MAIN FILTERS ROW ---- */}
            <div className="hidden sm:flex w-full gap-4 mb-6">
                {config.map((section, i) => {
                    if (section.type === "checkbox") return null;
                    // Dropdown filters get less space, range filters get more
                    const flexClass =
            section.type === "dropdown"
                ? "flex-[0.7] min-w-0"
                : "flex-1 min-w-0";
                    return (
                        <div key={i} className={flexClass}>
                            {section.type === "dropdown" && (
                                <DropdownFilter
                                    label={section.label}
                                    state={section.state}
                                    setState={section.setState}
                                    options={
                                        section.options ??
                    Array.from(
                        {
                            length:
                          (section.range?.[1] ?? 5) -
                          (section.range?.[0] ?? 1) +
                          1,
                        },
                        (_, idx) => (idx + (section.range?.[0] ?? 1)).toString()
                    )
                                    }
                                    placeholder={section.placeholder}
                                />
                            )}

                            {section.type === "range" && (
                                <RangeFilter
                                    label={section.label}
                                    min={rangeState[section.label]?.min ?? ""}
                                    max={rangeState[section.label]?.max ?? ""}
                                    onMinChange={(val) =>
                                        handleRangeChange(section.label, "min", val)
                                    }
                                    onMaxChange={(val) =>
                                        handleRangeChange(section.label, "max", val)
                                    }
                                    placeholderMin={section.placeholderMin}
                                    placeholderMax={section.placeholderMax}
                                    minimumPrice={minimumPrice}
                                    maximumPrice={maximumPrice}
                                />
                            )}

                            {section.type === "range-dropdown" && (
                                <RangeDropdownFilter
                                    label={section.label}
                                    range={section.range}
                                    minValue={section.minState}
                                    maxValue={section.maxState}
                                    setMinValue={section.setMinState}
                                    setMaxValue={section.setMaxState}
                                    options={section.options}
                                    placeholderMin={section.placeholderMin}
                                    placeholderMax={section.placeholderMax}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* MOBILE: STACKED FILTERS */}
            <div className="space-y-6 sm:hidden">
                {config.map((section, i) => {
                    if (section.type === "dropdown") {
                        const options =
              section.options ??
              Array.from(
                  {
                      length:
                    (section.range?.[1] ?? 5) - (section.range?.[0] ?? 1) + 1,
                  },
                  (_, idx) => (idx + (section.range?.[0] ?? 1)).toString()
              );

                        return (
                            <DropdownFilter
                                key={i}
                                label={section.label}
                                state={section.state}
                                setState={section.setState}
                                options={options}
                                placeholder={section.placeholder}
                            />
                        );
                    }

                    if (section.type === "range") {
                        const min = rangeState[section.label]?.min ?? "";
                        const max = rangeState[section.label]?.max ?? "";

                        return (
                            <RangeFilter
                                key={i}
                                label={section.label}
                                min={min}
                                max={max}
                                onMinChange={(val) =>
                                    handleRangeChange(section.label, "min", val)
                                }
                                onMaxChange={(val) =>
                                    handleRangeChange(section.label, "max", val)
                                }
                                placeholderMin={section.placeholderMin}
                                placeholderMax={section.placeholderMax}
                                minimumPrice={minimumPrice}
                                maximumPrice={maximumPrice}
                            />
                        );
                    }

                    if (section.type === "range-dropdown") {
                        return (
                            <RangeDropdownFilter
                                key={i}
                                label={section.label}
                                range={section.range}
                                minValue={section.minState}
                                maxValue={section.maxState}
                                setMinValue={section.setMinState}
                                setMaxValue={section.setMaxState}
                                options={section.options}
                                placeholderMin={section.placeholderMin}
                                placeholderMax={section.placeholderMax}
                            />
                        );
                    }

                    return null;
                })}
            </div>

            {/* CHECKBOX FILTERS */}
            <div className="sm:col-span-3 sm:mt-2 mb-6">
                {config.map((section, i) => {
                    if (section.type !== "checkbox") return null;
                    return (
                        <CheckboxFilter
                            key={i}
                            label={section.label}
                            values={section.values}
                            selectedValues={checkboxState[section.label] || new Set()}
                            onToggle={handleCheckboxToggle}
                            variant={variant}
                        />
                    );
                })}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="sm:col-span-3 flex sm:justify-end">
                <div className="w-full sm:w-auto">
                    <FilterFooter onCancel={handleCancel} onApply={handleApply} />
                </div>
            </div>
        </div>
    );
}
