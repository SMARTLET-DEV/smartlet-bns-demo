import Select from "react-select";
import { useIsMobile } from "@/hooks/useIsMobile";

// Brand color and light shade
const BRAND_COLOR = "#CBC3E3";
const BRAND_LIGHT = "#fde8ec";
// Tailwind's gray-200
const GRAY_200 = "#e5e7eb";

export function RangeDropdownFilter({
    label,
    range,
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    options: providedOptions,
    placeholderMin = "Min",
    placeholderMax = "Max",
}: {
    label: string;
    range: [number, number];
    minValue: string;
    maxValue: string;
    setMinValue: (val: string) => void;
    setMaxValue: (val: string) => void;
    options?: string[];
    placeholderMin?: string;
    placeholderMax?: string;
}) {
    // Build options for react-select
    const options = providedOptions
        ? providedOptions.map(opt => ({ value: opt, label: opt }))
        : Array.from(
            { length: range[1] - range[0] + 1 },
            (_, i) => ({
                value: (i + range[0]).toString(),
                label: (i + range[0]).toString(),
            })
        );

    const getSelectedOption = (val: string) =>
        options.find((opt) => opt.value === val) || null;

    const menuPortalTarget = typeof window !== "undefined" ? document.body : null;

    const isMobile = useIsMobile();

    return (
        <div>
            <h3 className="font-normal text-secondary mb-2 text-left">
                {label}
            </h3>
            <div className="flex gap-2">
                {/* Min Dropdown */}
                <div className="w-full">
                    <Select
                        value={getSelectedOption(minValue)}
                        onChange={(selected) => setMinValue(selected?.value ?? "")}
                        options={options}
                        isClearable
                        placeholder={placeholderMin}
                        className="text-sm w-full"
                        menuPortalTarget={menuPortalTarget}
                        menuPosition="fixed"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                borderRadius: "0.5rem",
                                borderColor:
                                    state.isFocused || minValue
                                        ? BRAND_LIGHT
                                        : GRAY_200,
                                boxShadow:
                                    state.isFocused || minValue
                                        ? `0 0 0 1px ${BRAND_LIGHT}`
                                        : "none",
                                minHeight: 44,
                                backgroundColor: "transparent",
                                width: "100%",
                                "&:hover": {
                                    borderColor: BRAND_LIGHT,
                                },
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? BRAND_COLOR
                                    : state.isFocused
                                    ? "#F3F4F6"
                                    : "#fff",
                                color: state.isSelected ? "#fff" : "#111827",
                                cursor: "pointer",
                                fontWeight: state.isSelected
                                    ? 600
                                    : 400,
                                "&:active": {
                                    backgroundColor: BRAND_COLOR,
                                    color: "#fff",
                                },
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#9ca3af",
                                fontWeight: 400,
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 10000000,
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 10000000,
                            }),
                        }}
                    />
                </div>
                {/* Max Dropdown */}
                <div className="w-full">
                    <Select
                        value={getSelectedOption(maxValue)}
                        onChange={(selected) => setMaxValue(selected?.value ?? "")}
                        options={options}
                        isClearable
                        placeholder={placeholderMax}
                        className="text-sm w-full"
                        menuPortalTarget={menuPortalTarget}
                        menuPosition="fixed"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                borderRadius: "0.5rem",
                                borderColor:
                                    state.isFocused || maxValue
                                        ? BRAND_LIGHT
                                        : GRAY_200,
                                boxShadow:
                                    state.isFocused || maxValue
                                        ? `0 0 0 1px ${BRAND_LIGHT}`
                                        : "none",
                                minHeight: 44,
                                backgroundColor: "transparent",
                                width: "100%",
                                "&:hover": {
                                    borderColor: BRAND_LIGHT,
                                },
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? BRAND_COLOR
                                    : state.isFocused
                                    ? "#F3F4F6"
                                    : "#fff",
                                color: state.isSelected ? "#fff" : "#111827",
                                cursor: "pointer",
                                fontWeight: state.isSelected
                                    ? 600
                                    : 400,
                                "&:active": {
                                    backgroundColor: BRAND_COLOR,
                                    color: "#fff",
                                },
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#9ca3af",
                                fontWeight: 400,
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 10000000,
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 10000000,
                            }),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
