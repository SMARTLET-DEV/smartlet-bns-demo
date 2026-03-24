"use client";

import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useUpdatePropertyMutation } from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { normalizePropertyResponse } from "@/utils/property";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import ErrorAlertMessage from "../ErrorAlertMessage";
import CityAreaFormFields from "./cityareaformfields";
import InteractiveMap from "./locateMapfield";
import LocationFormFields from "./locationformfields";
import PopularLandmarksFormFields from "./popularlandmarksformfields";

interface Props {
  onSuccess?: () => void;
  useEditSlice?: boolean;
  variant?: "default" | "overview";
}

const LocationFragment = forwardRef(function LocationFragment({ onSuccess,useEditSlice,variant = "default" }: Props, ref) {
  const createdProperty = useAppSelector((state) =>
    useEditSlice ? state.property.editRequestProperty : state.property.createdProperty
  );
  const dispatch = useAppDispatch();
  const [updateProperty] = useUpdatePropertyMutation();
  const { success, error } = useToast();

  const form = useForm({
    defaultValues: {
      address: "",
      nearbyLandmarks: "",
      city: "",
      area: "",
      popularLandmarks:"",
    },
  });

  const { control, handleSubmit, reset } = form;
  useImperativeHandle(ref, () => ({
    save: (mode = "submit") => {
      if (mode === "collect") return collectChanges();
      return handleSubmit(handleSubmitLocation)();
    },
  }));

  


  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Prefill form and coordinates when Redux state updates
  useEffect(() => {
    reset({
      address: createdProperty.address || "",
      nearbyLandmarks: createdProperty.nearbyLocations || "",
      area: createdProperty.area || "",
      city: createdProperty.city || "",
      popularLandmarks: createdProperty.popularLandmarks || ""  ,
    });

    setLatitude(createdProperty.latitude ?? null);
    setLongitude(createdProperty.longitude ?? null);
  }, [createdProperty, reset]);

  const handleLocationChange = useCallback((lng: number, lat: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const handleSubmitLocation = async (values: any) => {
    const { address, nearbyLandmarks, city, area, popularLandmarks } = values;

    if (!address || !nearbyLandmarks || latitude === null || longitude === null || !city || !area) {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (!createdProperty.id) return;

    const updatePayload = {
      address,
      nearbyLocations: nearbyLandmarks,
      latitude,
      longitude,
      city,
      area,
      popularLandmarks,
    };

    try {
      const response = await updateProperty({
        id: createdProperty.id,
        data: updatePayload as any,
      }).unwrap();

      const updated = normalizePropertyResponse(response.property);
      dispatch(setCreatedProperty(updated));
      success("Location updated successfully");

      onSuccess?.();
    } catch (err: any) {
      console.error("Location update failed", err);
      error(err?.data?.message || "Failed to update location");
    }
  };


  const collectChanges = () => {
    const values = form.getValues();
    const changes: Record<string, any> = {};

    if (values.address !== createdProperty.address) changes.address = values.address;
    if (values.nearbyLandmarks !== createdProperty.nearbyLocations) {
      changes.nearbyLocations = values.nearbyLandmarks;
    }
    if (values.city !== createdProperty.city) changes.city = values.city;
    if (values.area !== createdProperty.area) changes.area = values.area;
    if (values.popularLandmarks !== createdProperty.popularLandmarks) {
      changes.popularLandmarks = values.popularLandmarks;
    }

    if (
      createdProperty.latitude !== latitude ||
      createdProperty.longitude !== longitude
    ) {
      if (latitude != null) changes.latitude = latitude;
      if (longitude != null) changes.longitude = longitude;
    }

    return changes;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleSubmitLocation)}
        className={cn(
                        "grid grid-cols-2 sm:grid-cols-2 gap-6",
                        variant === "default"
                          ? "max-h-[444px] sm:max-h-[370px] overflow-y-auto"
                          : "h-fit overflow-visible"
                      )}
      >
        <LocationFormFields control={control} />
        <CityAreaFormFields control={control} />
        <PopularLandmarksFormFields control={control} />

        <div className="col-span-2">
          <p className="text-base font-normal mb-2">Map</p>
          <InteractiveMap
            onLocationChange={handleLocationChange}
            initialCoordinates={
              latitude !== null && longitude !== null
                ? { lat: latitude, lng: longitude }
                : undefined
            }
          />
        </div>

        <button type="submit" className="hidden" />
      </form>
      <ErrorAlertMessage message={errorMessage} className="mt-5"/>
    </Form>
  );
});
export default LocationFragment;
