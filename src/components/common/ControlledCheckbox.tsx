import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from "react-hook-form";

interface ControlledCheckboxProps {
  control: any;
  name: string;
  item: { id: string; label: string | React.ReactNode };
  multipleSelection?: boolean;
  defaultChecked?: boolean;

  // Optional callback for custom handling when checkbox is toggled
  onToggle?: (id: string, isChecked: boolean, currentValues: string[]) => void;
}

export default function ControlledCheckbox({
    control,
    name,
    item,
    multipleSelection,
    defaultChecked,
    onToggle,
}: ControlledCheckboxProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => {
                const currentValue = value ?? [];
                const isChecked = currentValue.includes(item.id);

                const toggle = () => {
                    let newValue;
                    if (isChecked) {
                        newValue = currentValue.filter((val: string) => val !== item.id);
                    } else {
                        newValue = [...currentValue, item.id];
                    }

                    if (onToggle) {
                        onToggle(item.id, !isChecked, newValue);
                    } else {
                        onChange(newValue);
                    }
                };

                return (
                    <label className="flex items-center space-x-2">
                        <Checkbox checked={isChecked} onCheckedChange={toggle} />
                        <span>{item.label}</span>
                    </label>
                );
            }}
        />
    );
}
