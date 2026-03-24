"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { Control } from "react-hook-form";

interface CityAreaFormFieldsProps {
  control: Control<any>;
}

export default function CityAreaFormFields({ control }: CityAreaFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 w-full col-span-2">
      <ControlledInput
        control={control}
        name="city"
        label="City"
        placeHolder="Enter City"
        required
      />
      <ControlledInput
        control={control}
        name="area"
        label="Area"
        placeHolder="Enter Area"
        required
      />
    </div>
  );
}
