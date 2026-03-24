"use client";

import { useEffect, useRef } from "react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

import { EyeIcon, PdfIcon, UploadIcon, XIcon } from "@/assets/icons";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

interface ControlledInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    accept?: string;
    [key: string]: any;
}

export function ControlledFileInput<T extends FieldValues>({
    control,
    name,
    label,
    accept,
    ...props
}: ControlledInputProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const value = useWatch({ control, name });

    useEffect(() => {
        if (!value && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [value]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value: fieldValue, onChange, ...field } }) => (
                <FormItem className="gap-3">
                    {label && (
                        <FormLabel className="text-base flex items-center justify-between font-normal">
                            {label}
                            {!value && (
                                <Button
                                    onClick={() => inputRef.current?.click()}
                                    type="button"
                                    variant="outline"
                                >
                                    <UploadIcon className="w-4 h-4" />
                                    Upload
                                </Button>
                            )}
                        </FormLabel>
                    )}
                    <FormControl className="h-fit placeholder:text-muted">
                        <div className="w-full">
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

                            {value && (
                                <div className="w-full max-w-full overflow-hidden border rounded-lg bg-background p-4 flex justify-between items-center gap-3">
                                    <div className="flex items-start gap-3 overflow-hidden">
                                        <PdfIcon className="w-10 h-10 text-primary shrink-0" />
                                        <div className="flex flex-col w-full min-w-0 overflow-hidden">
                                            <p className="text-base font-medium break-words truncate max-w-[150px] lg:max-w-[250px] overflow-hidden">
                                                {value?.name}
                                            </p>
                                            <p className="text-sm text-muted mt-1">
                                                Support formats: PDF (Max 5MB)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="p-2 w-9 h-9 flex justify-center items-center"
                                            onClick={() => {
                                                if (value) {
                                                    const fileUrl =
                                                        URL.createObjectURL(
                                                            value
                                                        );
                                                    window.open(
                                                        fileUrl,
                                                        "_blank"
                                                    );
                                                }
                                            }}
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => onChange(undefined)}
                                            variant="ghost"
                                            className="p-2 w-9 h-9 flex justify-center items-center"
                                        >
                                            <XIcon className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
}
