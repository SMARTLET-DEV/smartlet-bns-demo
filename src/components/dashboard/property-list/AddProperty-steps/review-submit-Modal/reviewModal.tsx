"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/ResponsiveDialog";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearFetchedProperty, setFetchedProperty } from "@/redux/reducers/property/getSinglePropertySlice";
import { useGetSinglePropertyQuery } from "@/redux/reducers/property/propertyApi";
import { useEffect } from "react";
import ReviewFragment from "./reviewFragment";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
}

export default function ReviewModal({
  open,
  onClose,
  onContinue,
  title,
}: ReviewModalProps) {
  const dispatch = useAppDispatch();
  const propertyId = useAppSelector((state) => state.property.createdProperty.id);

  const { data, isSuccess, refetch, isFetching, isError } = useGetSinglePropertyQuery(propertyId, {
    skip: !propertyId,
    refetchOnMountOrArgChange: true, // ✅ Forces fresh fetch on modal open
  });

  useEffect(() => {
    if (open && isSuccess && data?.property) {
      console.log("✅ Re-dispatching fetched property on modal open");
      dispatch(setFetchedProperty(data.property));
    }
  }, [open, isSuccess, data, dispatch]);

  useEffect(() => {
    if (!open) {
      dispatch(clearFetchedProperty());
    }
  }, [open, dispatch]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {data?.property?.id ? (
        <DialogContent
          className="rounded-[16px] lg:rounded-[30px] md:min-w-[90%] lg:min-w-[70%]"
        >
          <DialogHeader className="-mt-1">
            <DialogTitle className="text-base text-sm sm:text-xl font-light text-left py-3 border-b-1 border-gray-200">
              {title}
            </DialogTitle>
          </DialogHeader>

          <ReviewFragment property={data.property} />

          <div className="mt-2 flex justify-end">
            <Button className="w-full sm:w-[25%] py-5" onClick={onContinue}>
              Close
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className={cn(
            "min-w-full sm:min-w-[70%] h-fit sm:max-w-[70%]",
            "rounded-t-2xl rounded-b-none sm:rounded-3xl px-4 sm:px-6 py-5",
            "fixed bottom-0 sm:left-1/2 sm:top-1/2",
            "transition ease-in-out",
            "-translate-y-100 sm:translate-y-[-50%] sm:translate-x-[-50%]"
          )}
        >
          <div className="text-muted text-sm text-center py-10">
            Loading property details...
          </div>
        </DialogContent>
      )}
    </Dialog>
  );

}
