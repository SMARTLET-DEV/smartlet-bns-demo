import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface ControlledInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeHolder?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
    required?: boolean;
    className?: string;
    labelClassName?: string;
    options: { label: string; value: string }[];
}

export function ControlledSelect<T extends FieldValues>({
    control,
    name,
    label,
    placeHolder,
    type = "text",
    onChange,
    required = false,
    className,
    labelClassName,
    options,
    ...props
}: ControlledInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && (
                        <FormLabel
                            className={cn(
                                "text-base font-normal data-[error=true]:text-secondary",
                                labelClassName
                            )}
                        >
                            {label}
                            {required && (
                                <span className="text-red-500">*</span>
                            )}
                        </FormLabel>
                    )}
                    <FormControl className="">
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            {...props}
                        >
                            <FormControl>
                                <SelectTrigger
                                    className={cn(
                                        "py-3 px-4 h-fit placeholder:text-muted shadow-none aria-invalid:border-input",
                                        className
                                    )}
                                >
                                    <SelectValue placeholder={placeHolder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
