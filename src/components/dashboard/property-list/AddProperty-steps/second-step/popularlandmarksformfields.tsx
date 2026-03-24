"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { Control } from "react-hook-form";

interface PopularLandmarksFormFieldsProps {
  control: Control<any>;
}

export default function PopularLandmarksFormFields({ control }: PopularLandmarksFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 w-full col-span-2">
      <ControlledInput
        control={control}
        name="popularLandmarks"
        label="Popular Landmarks"
        placeHolder="Enter your nearby Popular landmarks seperated by comma"
      />
    </div>
  );
}
