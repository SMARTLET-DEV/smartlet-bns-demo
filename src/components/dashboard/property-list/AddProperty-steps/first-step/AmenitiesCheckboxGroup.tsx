"use client";

import ControlledCheckbox from "@/components/common/ControlledCheckbox";
import { useAppSelector } from "@/redux/hook";
import { Control } from "react-hook-form";

interface Props {
  control: Control<any>;
}

export default function AmenitiesCheckboxGroup({ control }: Props) {
  const createdProperty = useAppSelector((state) => state.property.createdProperty);

  const amenities = [
    { id: "furnished", label: "Furnished" },
    { id: "swimmingPool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
  ];

  const selectedAmenities = createdProperty?.amenities || [];

  return (
    <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-x-20 gap-y-2 -mt-3">
      {amenities.map((item) => (
        <ControlledCheckbox
          key={item.id}
          control={control}
          name="amenities"
          item={item}
          multipleSelection
          defaultChecked={selectedAmenities.includes(item.id)}
        />
      ))}
    </div>
  );
}
