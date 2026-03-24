import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface ControlledInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string | React.ReactNode;
    placeHolder?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    labelClassName?: string;
    [key: string]: any;
}

export function ControlledTextarea<T extends FieldValues>({
    control,
    name,
    label,
    placeHolder,
    onChange,
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
                        </FormLabel>
                    )}
                    <FormControl className="py-3 px-4 h-fit placeholder:text-muted">
                        <Textarea
                            placeholder={placeHolder}
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                            className={cn(
                                "placeholder:text-muted aria-invalid:border-input",
                                className
                            )}
                            {...props}
                            rows={props.rows || 4}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
