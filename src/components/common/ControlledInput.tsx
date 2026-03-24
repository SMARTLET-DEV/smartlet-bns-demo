import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
}

export function ControlledInput<T extends FieldValues>({
    control,
    name,
    label,
    placeHolder,
    type = "text",
    onChange,
    required = false,
    className,
    labelClassName,
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
                    <FormControl className="py-3 px-4 h-fit placeholder:text-muted">
                        <Input
                            placeholder={placeHolder}
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                onChange?.(e);
                            }}
                            value={field.value ?? ""}
                            className={cn(
                                "placeholder:text-muted aria-invalid:border-input",
                                className
                            )}
                            type={type}
                            {...props}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
