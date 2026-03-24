"use client";

import { Button } from "@/components/ui/button";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import {
  setAppointmentBooking,
  setCallSupportDialog
} from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

interface PropertyActionsMobileStickyProps {
  alreadyAppliedForViewing: boolean;
  packageType: string;
}

export default function PropertyActionsMobileSticky({
  alreadyAppliedForViewing,
  packageType,
}: PropertyActionsMobileStickyProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div id="property-actions-sticky" className="sm:hidden fixed bottom-0 left-0 right-0 bg-white z-50 border-t border-gray-200">
      <div className="max-w-[410px] mx-auto grid grid-cols-1 p-4">
        <Button
          className="cursor-pointer py-3 h-fit font-normal"
          disabled={!!(user && user.role !== "RENTER")}
          onClick={() => {
            dispatch(setCallSupportDialog(true));
            // window.location.href = "tel:+8801711994478";
          }}
        >
          Call Us
        </Button>
      </div>
    </div>
  );
}
