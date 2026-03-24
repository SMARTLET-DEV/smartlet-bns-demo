import { useEffect, useState } from "react";
import Select from "react-select";

export function DropdownFilter({
    label,
    state,
    setState,
    options,
    placeholder,
}: {
  label: string;
  state: string; // selected value (should match one of the options)
  setState: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Format options for react-select
    const selectOptions = options.map((opt) => ({
        value: opt,
        label: opt,
    }));

    // Find currently selected option
    const getSelectedOption = (val: string) =>
        selectOptions.find((opt) => opt.value === val) || null;

    const menuPortalTarget = typeof window !== "undefined" && isMounted ? document.body : null;

    return (
        <div className="w-full">
            <h3 className="font-normal text-secondary mb-2 text-left">{label}</h3>
            <div className="w-full">
                <Select
                    value={getSelectedOption(state)}
                    onChange={(selected) => setState(selected?.value ?? "")}
                    options={selectOptions}
                    isClearable={false}
                    isSearchable={false}
                    placeholder={placeholder || `Select ${label.toLowerCase()}`}
                    className="text-sm w-full"
                    menuPortalTarget={menuPortalTarget}
                    menuPosition="fixed"
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: state.isFocused ? "#fde8ec" : "#e5e7eb",
                            boxShadow: state.isFocused ? "0 0 0 1px #fde8ec" : "none",
                            minHeight: 44,
                            width: "100%",
                            backgroundColor: "transparent",
                            "&:hover": {
                                borderColor: "#fde8ec",
                            },
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 10000000,
                            borderRadius: "0.5rem",
                            border: "1px solid #e5ebf1",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                            backgroundColor: "#fff",
                            marginTop: "4px",
                        }),
                        menuList: (base) => ({
                            ...base,
                            maxHeight: "300px",
                            padding: "4px",
                        }),
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 10000000,
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                                ? "#F3F4F6"
                                : "#fff",
                            color: "#111827",
                            cursor: "pointer",
                            borderRadius: "0.375rem",
                            margin: "2px 0",
                            fontSize: "0.875rem",
                            padding: "8px 12px",
                            "&:active": {
                                backgroundColor: "#F3F4F6",
                            },
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            fontSize: "0.875rem",
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: "#111827",
                            fontSize: "0.875rem",
                        }),
                    }}
                />
            </div>
        </div>
    );
}
