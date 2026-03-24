"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { Control } from "react-hook-form";

interface LocationFormFieldsProps {
  control: Control<any>;
}

export default function LocationFormFields({ control }: LocationFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full col-span-2">
      <ControlledInput
        control={control}
        name="address"
        label="Address"
        placeHolder="Enter your property address"
        required
      />
      <ControlledInput
        control={control}
        name="nearbyLandmarks"
        label="Nearby Locations"
        placeHolder="Enter your nearby areas seperated by comma"
        required
      />
    </div>
  );
}
