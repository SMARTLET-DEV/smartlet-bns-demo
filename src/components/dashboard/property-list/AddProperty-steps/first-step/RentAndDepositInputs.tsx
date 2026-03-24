"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { Control } from "react-hook-form";

interface Props {
  control: Control<any>;
}

export default function RentAndDepositInputs({ control }: Props) {
  return (
    <>
      <ControlledInput
        control={control}
        name="rent"
        label="Rent"
        placeHolder="Enter Amount"
        type="number"
        required
      />

      <ControlledInput
        control={control}
        name="serviceCharge"
        label="Service Charge"
        placeHolder="Enter Amount"
        type="number"
        required
      />

      <ControlledInput
        control={control}
        name="description"
        label="Description"
        placeHolder="Enter description"
        required
      />
      <ControlledInput
        control={control}
        name="size"
        label="Size"
        placeHolder="Enter size (sqft)"
        required
      />
      <ControlledInput
        control={control}
        name="balcony"
        label="Balcony"
        placeHolder="Enter Number of Balconies"
        type="number"
        required
      />
      <ControlledInput
        control={control}
        name="facing"
        label="Facing"
        placeHolder="Enter property facing"
      />
      <ControlledInput
        control={control}
        name="floor"
        label="Floor"
        placeHolder="Enter Floor Number"
      />
      <ControlledInput
        control={control}
        name="elevators"
        label="Elevators"
        placeHolder="Enter Number of Elevators"
        type="number"
      />
      <ControlledInput
        control={control}
        name="parking"
        label="Parking"
        placeHolder="Enter Number of Parking"
        type="number"
      />
    </>
  );
}
