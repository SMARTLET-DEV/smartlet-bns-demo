import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

import { UploadIcon } from "@/assets/icons";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";

interface ControlledInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    accept?: string;
    img?: string;
    [key: string]: any;
}

export function ProfileImageInput<T extends FieldValues>({
    control,
    name,
    label,
    accept,
    img,
    ...props
}: ControlledInputProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const value = useWatch({
        control,
        name,
    });

    // Reset input element when form field is reset
    useEffect(() => {
        if (!value && inputRef.current) {
            inputRef.current.value = "";
            setPreviewUrl(null);
        }
    }, [value]);

    // Create preview URL when file is selected
    useEffect(() => {
        if (
            value &&
            typeof value === "object" &&
            "name" in value &&
            "size" in value &&
            "type" in value
        ) {
            const file = value as File;
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Cleanup function to revoke the URL when component unmounts or file changes
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value: fieldValue, onChange, ...field } }) => (
                <FormItem className="gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden relative group">
                        <img
                            src={previewUrl || img}
                            alt="profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                        <Button
                            onClick={() => {
                                inputRef.current?.click();
                            }}
                            type="button"
                            variant="ghost"
                            className="absolute bottom-0 right-0 w-full h-full rounded-full hover:bg-[rgba(0,0,0,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <UploadIcon className="size-7 text-white" />
                        </Button>
                    </div>

                    <FormControl className="h-fit placeholder:text-muted">
                        <div>
                            <Input
                                {...field}
                                ref={inputRef}
                                type="file"
                                accept={accept}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file || undefined);
                                }}
                                className="hidden"
                                {...props}
                            />
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
