"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any>;
  propertyType: string;
}


export default function SelectFieldsGroup({ control, propertyType }: Props) {
  const selectFieldsConfig = [
    {
      name: "type",
      label: "Category",
      placeholder: "Select",
      options: [
        { label: "Residential", value: "RESIDENTIAL" },
        { label: "Commercial", value: "COMMERCIAL" },
      ],
    },
    {
      name: "bedrooms",
      label: "Bedrooms",
      placeholder: "Select",
      options: Array.from({ length: 10 }, (_, i) => ({
        label: `${i}`,
        value: `${i}`,
      })),
    },
    {
      name: "bathrooms",
      label: "Bathrooms",
      placeholder: "Select",
      options: Array.from({ length: 10 }, (_, i) => ({
        label: `${i}`,
        value: `${i}`,
      })),
    },
  ];

  return (
    <>
      {selectFieldsConfig.map(({ name, label, placeholder, options }) => {
        const isTypeField = name === "type";
        const selectedValue = isTypeField ? propertyType : undefined;

        return (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-normal">{label}<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select
                    value={isTypeField ? propertyType : field.value}
                    onValueChange={field.onChange}
                    disabled={isTypeField}
                  >
                    <SelectTrigger className="h-12 px-4 py-3 text-sm border border-input shadow-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50">
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="hover:font-normal"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
}
