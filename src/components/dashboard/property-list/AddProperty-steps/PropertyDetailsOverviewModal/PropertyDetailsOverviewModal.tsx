"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/ResponsiveDialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setEditRequestProperty } from "@/redux/reducers/property/editRequestPropertySlice";
import { useLazyGetPendingEditRequestQuery, useLazyGetSinglePropertyQuery, useSubmitEditRequestMutation } from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import BasicInfoFragment from "../first-step/basicinfo";
import DocumentUpload from "../fourth-step/DocumentFragment";
import LocationFragment from "../second-step/locationinfo";
import MediaFragment from "../third-step/MediaFragment";
import StepHeader from "./StepHeader";


interface PropertyDetailsOverviewModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
  userId: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL";
}

export default function PropertyDetailsOverviewModal({
  open,
  onClose,
  onContinue,
  title,
  userId,
  propertyType,
}: PropertyDetailsOverviewModalProps) {
  const dispatch = useAppDispatch();
  const propertyId = useAppSelector((state) => state.property.createdProperty.id);
  const basicInfoRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const documentsRef = useRef<any>(null);



  // Fetch property by ID
  /*const { data, isSuccess } = useGetSinglePropertyQuery(propertyId, {
    skip: !propertyId,
  });
  const { data: editRequestData,
  isSuccess: isEditRequestSuccess,
  isError: isEditRequestError,
  isLoading: isEditRequestLoading,} = useGetPendingEditRequestQuery(propertyId, {
    skip: !propertyId,
  });*/

  const [triggerGetSingleProperty] = useLazyGetSinglePropertyQuery();
  const [triggerGetPendingEditRequest] = useLazyGetPendingEditRequestQuery();

  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [submitEditRequest] = useSubmitEditRequestMutation();
  const { success, error } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open || !propertyId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const propertyResult = await triggerGetSingleProperty(propertyId).unwrap();
        let editResult = null;

        try {
          editResult = await triggerGetPendingEditRequest(propertyId).unwrap();
        } catch (err) {
          console.warn("No pending edit request or fetch failed:", err);
        }

        const property = propertyResult?.property;

        const hasValidEditRequest =
          editResult?.success === true &&
          editResult?.request?.status === "PENDING" &&
          editResult?.request?.changes;

        const overridden = hasValidEditRequest
          ? { ...property, ...editResult.request.changes }
          : property;

        setPropertyData(overridden);
        dispatch(setCreatedProperty(property)); // Set the property in state
        dispatch(setEditRequestProperty(overridden));
      } catch (err: any) {
        error(err?.data?.message || "Failed to load property data.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [open, propertyId, dispatch]);

  


  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
      // Delay resetting the ID to avoid race with closing animation
      const timeout = setTimeout(() => {
        dispatch(setCreatedProperty({ id: null }));
        dispatch(setEditRequestProperty({})); // Reset edit request property
      }, 150); // Adjust delay as needed, matching Dialog's exit transition

      return () => clearTimeout(timeout);
    }
  }, [open, dispatch]);

  const [triggerGetFreshProperty] = useLazyGetSinglePropertyQuery();
  // Handle Next
  const handleContinue = async () => {
    const refs = [basicInfoRef, locationRef, mediaRef, documentsRef];
    const collectedChanges: Record<string, any> = {};

    try {
      // ✅ Fetch latest property data from backend
      const freshResult = await triggerGetFreshProperty(propertyId).unwrap();
      const freshData = freshResult?.property;

      if (!freshData) {
        error("Failed to fetch latest property data.");
        return;
      }

      // ✅ Collect changes from all fragment refs
      for (const ref of refs) {
        if (ref.current?.save) {
          const fragmentChanges = await ref.current.save("collect");
          Object.assign(collectedChanges, fragmentChanges);
        }
      }

      // ✅ Normalize and diff changes
      const actualChanges: Record<string, any> = {};
      const numericFields = ["bedrooms", "bathrooms", "price"];

      for (const [key, newValue] of Object.entries(collectedChanges)) {
        // 🚫 Skip undefined or null values (likely defaulted)
        if (newValue === undefined || newValue === null) continue;

        const oldValue = freshData[key];
        const isNumeric = numericFields.includes(key);

        const normalizedOld = isNumeric && oldValue != null ? Number(oldValue) : oldValue;
        const normalizedNew = isNumeric && newValue != null ? Number(newValue) : newValue;

        const isDifferent = isNumeric
          ? normalizedOld !== normalizedNew
          : JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew);

        if (isDifferent) {
          if (isNumeric && Number(newValue) === 0) continue;
          if (typeof newValue === "string" && newValue.trim() === "") continue;
          actualChanges[key] = newValue;
        }
      }

      if (Object.keys(actualChanges).length === 0) {
        error("No changes detected.");
        onClose();
        return;
      }

      await submitEditRequest({ id: propertyId, changes: actualChanges }).unwrap();
      success("Edit request submitted for admin approval.");
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (err: any) {
      error(err?.data?.message || "Failed to submit edit request.");
      console.error("Error collecting/saving data:", err);
    }
  };

  /*useEffect(() => {
    if (isSuccess && data?.property) {
      const property = data.property;

      // Check for valid pending edit request
      const isValidPendingEdit =
        isEditRequestSuccess &&
        editRequestData?.request?.status === "PENDING" &&
        editRequestData?.request?.changes;

      const overridden = isValidPendingEdit
        ? { ...property, ...editRequestData.request.changes }
        : property;

      dispatch(setCreatedProperty(overridden));
    }
  }, [isSuccess, data, isEditRequestSuccess, editRequestData, dispatch]);*/


  //console.log("📌 propertyId:", propertyId);
  //console.log("📌 useGetSinglePropertyQuery -> isSuccess:", isSuccess, "data:", data);
  //console.log("📌 useGetPendingEditRequestQuery -> isEditRequestSuccess:", isEditRequestSuccess, "editRequestData:", editRequestData);

  //const isEditRequestReady =
  //isEditRequestSuccess || isEditRequestError || editRequestData?.success === false;


  //const isFullyReady = isSuccess && isEditRequestReady;

  //console.log("📌 isEditRequestReady:", isEditRequestReady);
  //console.log("📌 isFullyReady:", isFullyReady);



  // Steps moved inside component to access props
  const steps = [
    {
      id: "1",
      title: "Basic Info",
      content: <BasicInfoFragment ref={basicInfoRef} userId={userId} propertyType={propertyType} useEditSlice variant="overview"/>,
    },
    {
      id: "2",
      title: "Location",
      content: <LocationFragment ref={locationRef} useEditSlice variant="overview"/>,
    },
    {
      id: "3",
      title: "Media",
      content: <MediaFragment variant="overview" ref={mediaRef} />,
    },
    {
      id: "4",
      title: "Documents",
      content: <DocumentUpload ref={documentsRef} />,
    },
  ];

  return (

    
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-[16px] lg:rounded-[30px] md:min-w-[90%] lg:min-w-[70%]"
      >
        <DialogHeader className="-mt-1">
          {!showSuccess ?  (
            <DialogTitle className="text-base text-sm sm:text-xl font-light text-left py-3 border-b-1 border-gray-200">
              {title}
            </DialogTitle>
          ):(
            <DialogTitle className="hidden text-base text-sm sm:text-xl font-light text-left py-3 border-b-1 border-gray-200">
              {title}
            </DialogTitle>
          )}
          
        </DialogHeader>

        <div className="overflow-y-hidden md:overflow-y-auto max-h-none md:max-h-[70vh] pr-2 -mt-2">
          {showSuccess ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-light text-secondary mb-2">Changes Submitted Successfully!</h3>
              <p className="text-muted text-center">Your edit request has been submitted for admin approval.</p>
            </div>
          ) : !loading && propertyData ? (
            steps.map((step) => (
              <div key={step.id}>
                <StepHeader index={step.id} title={step.title} />
                <div className="mb-3 px-1">{step.content}</div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin mr-3" />
              <p>Loading Property Details...</p>
            </div>
          )}
        </div>

        {!loading && propertyData && !showSuccess ?  (
          <div className="mt-2 flex justify-end">
          <Button className="w-full sm:w-[25%] py-5" onClick={handleContinue}>
            Submit Changes
          </Button>
        </div>
        ):(
          <div className="mt-2 flex justify-end">
            <Button className="hidden w-full sm:w-[25%] py-5" onClick={handleContinue}>
              Submit Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
