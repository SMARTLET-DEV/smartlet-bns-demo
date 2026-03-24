import { EyeIcon, EyeSlashIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeHolder?: string;
}

export function ControlledPasswordInput<T extends FieldValues>({
    control,
    name,
    label,
    placeHolder,
}: ControlledInputProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-normal data-[error=true]:text-secondary">
                        {label}
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                placeholder={placeHolder}
                                {...field}
                                className="py-3 px-4 h-fit placeholder:text-muted relative "
                                type={showPassword ? "text" : "password"}
                            />
                            <Button
                                className="absolute right-[5px] bottom-[50%] cursor-pointer translate-y-[50%] size-fit p-2 hover:bg-transparent"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                asChild
                            >
                                <p>
                                    {!showPassword ? (
                                        <EyeIcon className="w-6 h-6 text-black" />
                                    ) : (
                                        <EyeSlashIcon className="w-6 h-6 text-black" />
                                    )}
                                </p>
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
