"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { resetShortTerm } from "@/redux/reducers/shortTermModal/shortTermSlice";
import { normalizePropertyResponse } from "@/utils/property"; //
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorAlertMessage from "../ErrorAlertMessage";
import AmenitiesCheckboxGroup from "./AmenitiesCheckboxGroup";
import DateInputCalendar from "./DateInputCalendar";
import DynamicFieldArrayInput from "./DynamicFieldArrayInput";
import RentAndDepositInputs from "./RentAndDepositInputs";
import SelectFieldsGroup from "./SelectFieldsGroup";

// Interface for createdProperty typing
interface CreatedProperty {
  id?: string;
  title?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rent?: number | null;
  serviceCharge?: number | null;
  description?: string;
  amenities?: string[];
  size?: string;
  balcony?: number | null;
  facing?: string;
  floor?: string;
  parking?: number | null;
  elevators?: number | null;
  availableFrom?: string;
  additionalFeatures?: string[];
  propertyType?: string;
}

interface Props {
  userId: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL";
  packageType?: "BASIC" | "SMART" | "SMARTPLUS";
  onSuccess?: (id?: string) => void;
  onStatusChange?: (loading: boolean) => void;
  useEditSlice?: boolean;
  variant?: "default" | "overview";
}

interface BasicInfoFormValues {
  name: string;
  bedrooms: string;
  bathrooms: string;
  rent: string;
  serviceCharge: string;
  description: string;
  amenities: string[];
  size: string;
  balcony: string;
  facing: string;
  floor: string;
  parking: string;
  elevators: string;
  availableFrom?: string; // NEW
  additionalFeatures?: string[]; // NEW
}

const BasicInfoFragment = forwardRef(function BasicInfoFragment(
    { userId, propertyType, packageType, onSuccess, onStatusChange,useEditSlice,variant = "default" }: Props,
    ref
  ) {
  const createdProperty = useAppSelector((state) =>
    useEditSlice ? state.property.editRequestProperty : state.property.createdProperty
  );
  const isForShortTerm = useAppSelector((state) => state.shortTerm.value);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingFieldsMessage, setMissingFieldsMessage] = useState("");

  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const { success, error } = useToast();
  const currentPropertyType = createdProperty.propertyType || propertyType;

  useEffect(() => {
    onStatusChange?.(isSubmitting);
  }, [isSubmitting]);

  const form = useForm<BasicInfoFormValues>({
    defaultValues: {
      name: createdProperty.title || "",
      bedrooms: createdProperty.bedrooms != null ? Number(createdProperty?.bedrooms).toString() : "",
      bathrooms: createdProperty.bathrooms != null ? Number(createdProperty.bathrooms).toString() : "",
      rent: createdProperty.rent != null ? Number(createdProperty.rent).toString() : "",
      serviceCharge: createdProperty.serviceCharge != null ? Number(createdProperty.serviceCharge).toString() : "", // NEW
      description: createdProperty.description || "",
      amenities: createdProperty.amenities || [],
      size: createdProperty.size || "",
      balcony: createdProperty.balcony || "",
      facing: createdProperty.facing || "",
      floor: createdProperty.floor || "",
      parking: createdProperty.parking || "",
      elevators: createdProperty.elevators || "",
      availableFrom: createdProperty.availableFrom || "", // ISO date
      additionalFeatures: createdProperty.additionalFeatures || [""],
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useImperativeHandle(ref, () => ({
    save: (mode = "submit") => {
      if (mode === "collect") return collectChanges();
      return handleSubmit(handleSave)();
    },
  }));

  

  useEffect(() => {
    if (createdProperty?.id) {
      reset({
        name: createdProperty.title || "",
        bedrooms: Number(createdProperty.bedrooms)?.toString() || "",
        bathrooms: Number(createdProperty.bathrooms)?.toString() || "",
        rent: Number(createdProperty.rent)?.toString() || "",
        serviceCharge: Number(createdProperty.serviceCharge)?.toString() || "",
        description: createdProperty.description || "",
        amenities: createdProperty.amenities || [],
        size: createdProperty.size || "",
        balcony: createdProperty.balcony || "",
        facing: createdProperty.facing || "",   
        floor: createdProperty.floor || "",
        parking: createdProperty.parking || "",
        elevators: createdProperty.elevators || "",
        availableFrom: createdProperty.availableFrom || "",
        additionalFeatures: createdProperty.additionalFeatures || [""],
      });
    }
  }, [createdProperty, reset]);

  const handleSave = async (data: BasicInfoFormValues) => {
    const { name, bedrooms, bathrooms, rent, serviceCharge, description, size, floor, facing, parking, elevators, balcony, availableFrom } = data;

    if (!name || !bedrooms || !bathrooms || !rent || !serviceCharge || !description|| !size || !balcony|| !availableFrom) {
      setMissingFieldsMessage("Please fill out all required fields before submitting.");
      setTimeout(() => setMissingFieldsMessage(""), 5000);
      return;
    }

    setIsSubmitting(true);
    onStatusChange?.(true);

    const amenities = data.amenities || [];

    const payload = {
      title: name,
      price: Number(rent),
      serviceCharge: Number(serviceCharge),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      description,
      size,
      balcony:Number(balcony),
      facing,
      floor,    
      availableFrom: data.availableFrom,
      additionalFeatures: data.additionalFeatures?.filter(Boolean) || [],
      parking: Number(parking),
      elevators: Number(elevators),
      swimmingPool: amenities.includes("swimmingPool"),
      gym: amenities.includes("gym"),
      furnished: amenities.includes("furnished"),
    };

    const isPropertyAlreadyCreated = Boolean(createdProperty?.id);

    try {
      if (!isPropertyAlreadyCreated) {
        // CREATE
        const createPayload = {
          ...payload,
          propertyType,
          city: "",
          address: "",
          viewStatus: "PENDING",
          package: packageType,
          isForShortTerm: isForShortTerm ?? false,
          owner: {
            connect: {
              id: userId,
            },
          },
        };
        
        const normalized = normalizePropertyResponse(payload);
        dispatch(setCreatedProperty(normalized));
        const response = await createProperty(createPayload).unwrap();
        console.log("✅ response property:", response.property);
        console.log("✅ normalized property:", normalized);

        

        {/*reset({
          name: normalized.title,
          bedrooms: normalized.bedrooms?.toString() || "",
          bathrooms: normalized.bathrooms?.toString() || "",
          rent: normalized.rent?.toString() || "",
          description: normalized.description || "",
          amenities: normalized.amenities || [],
        });*/}

        success("Property created successfully");
        dispatch(resetShortTerm());
        onSuccess?.(normalized.id);
      } else {
        // UPDATE
        const hasChanged =
          createdProperty.title !== payload.title ||
          createdProperty.rent !== payload.price ||
          createdProperty.serviceCharge !== payload.serviceCharge ||
          createdProperty.bedrooms !== payload.bedrooms ||
          createdProperty.bathrooms !== payload.bathrooms ||
          createdProperty.description !== payload.description ||
          createdProperty.size !== payload.size ||
          Number(createdProperty.balcony) !== Number(payload.balcony) ||
          createdProperty.facing !== payload.facing ||
          createdProperty.floor !== payload.floor ||
          createdProperty.availableFrom !== payload.availableFrom ||
          JSON.stringify(createdProperty.additionalFeatures || []) !==
          JSON.stringify(payload.additionalFeatures || []);

          Number(createdProperty.parking) !== Number(payload.parking) ||  
          Number(createdProperty.elevators) !== Number(payload.elevators) ||
          JSON.stringify(createdProperty.amenities || []) !== JSON.stringify(amenities);

        if (hasChanged) {
          const normalized = normalizePropertyResponse(payload);
          dispatch(setCreatedProperty(normalized));
          const response = await updateProperty({
            id: createdProperty.id,
            data: payload as any,
          }).unwrap();

          success("Property updated successfully");
        } else {
          console.log("✅ No changes detected — skipping update");
        }

        onSuccess?.(createdProperty.id);
      }
    } catch (err: any) {
      console.error("Property save failed:", err);
      error(err?.data?.message || "Failed to save property");
    } finally {
      setIsSubmitting(false);
      onStatusChange?.(false);
    }
  };

  const collectChanges = () => {
    const values = form.getValues();
    const changes: Record<string, any> = {};

    if (values.name !== createdProperty.title) changes.title = values.name;
    if (Number(values.bedrooms) !== createdProperty.bedrooms) changes.bedrooms = Number(values.bedrooms);
    if (Number(values.bathrooms) !== createdProperty.bathrooms) changes.bathrooms = Number(values.bathrooms);
    if (Number(values.rent) !== createdProperty.rent) changes.price = Number(values.rent);
    if (Number(values.serviceCharge) !== createdProperty.serviceCharge) changes.serviceCharge = Number(values.serviceCharge);
    if (values.description !== createdProperty.description) changes.description = values.description;
    if (values.size !== createdProperty.size) changes.size = values.size;
    if (values.balcony !== createdProperty.balcony) changes.balcony = values.balcony;
    if (values.facing !== createdProperty.facing) changes.facing = values.facing;
    if (values.floor !== createdProperty.floor) changes.floor = values.floor;
    if (values.parking !== createdProperty.parking) changes.parking = values.parking;
    if (values.elevators !== createdProperty.elevators) changes.elevators = values.elevators;
    if (values.availableFrom !== createdProperty.availableFrom) changes.availableFrom = values.availableFrom;

    if (
      JSON.stringify(values.additionalFeatures || []) !==
      JSON.stringify(createdProperty.additionalFeatures || [])
    ) {
      changes.additionalFeatures = values.additionalFeatures?.filter(Boolean);
    }


    const amenities = values.amenities || [];
    const currentAmenities = createdProperty.amenities || [];

    if (
      JSON.stringify([...amenities].sort()) !== JSON.stringify([...currentAmenities].sort())
    ) {
      changes.furnished = amenities.includes("furnished");
      changes.gym = amenities.includes("gym");
      changes.swimmingPool = amenities.includes("swimmingPool");
    }

    return changes;
  };

  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSave)}
        className={cn(
                "grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6",
                variant === "default"
                  ? "max-h-[444px] sm:max-h-[370px] overflow-y-auto"
                  : "h-fit overflow-visible"
              )}
        >
        <ControlledInput
          control={control}
          name="name"
          label="Title"
          placeHolder="Enter Title"
          required
        />

        <SelectFieldsGroup control={control} propertyType={currentPropertyType} />
        <RentAndDepositInputs control={control} />
        <div className="sm:col-span-1 col-span-2"> 
          <DateInputCalendar
            control={control}
            name="availableFrom"
            label="Available From"
            disabledDates={[]}
            required
          />    
        </div>
          
        <span className="text-lg font-normal col-span-2 mt-1 data-[error=true]:text-secondary">Amenities:</span>
        <AmenitiesCheckboxGroup control={control} />
        
        <span className="text-lg font-normal col-span-2 mt-1 data-[error=true]:text-secondary">Additional Features:</span>
        <DynamicFieldArrayInput
          control={control}
          name="additionalFeatures"
          label="Additional Features"
          placeholderPrefix="Feature"
        />


        

        <button type="submit" className="hidden" />
      </form>
      {missingFieldsMessage && (
          <ErrorAlertMessage message={missingFieldsMessage} className="mt-5"/>
        )}
    </Form>
  );
});
export default BasicInfoFragment;
