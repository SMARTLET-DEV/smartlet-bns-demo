import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxFilter({
    label,
    values,
    selectedValues,
    onToggle,
    variant = "flex",
}: {
    label: string;
    values: string[];
    selectedValues: Set<string>;
    onToggle: (label: string, value: string) => void;
    variant?: "flex" | "grid";
}) {
    const containerClasses =
        variant === "grid"
            ? "grid grid-cols-2 gap-x-8 gap-y-3"
            : "flex flex-wrap gap-x-8 gap-y-3";

    return (
        <div>
            {/* <h3 className="font-normal text-secondary mb-2 text-left">
                {label}
            </h3> */}
            <div className={containerClasses}>
                {values.map((val) => (
                    <label
                        key={val}
                        className="flex items-center gap-2 text-secondary font-normal text-sm justify-start"
                    >
                        <Checkbox
                            checked={selectedValues.has(val)}
                            onCheckedChange={() => onToggle(label, val)}
                            className="border-gray-200 shrink-0"
                        />
                        <span className="whitespace-nowrap">{val}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
