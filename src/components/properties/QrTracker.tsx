"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useIncrementQrVisitCountMutation } from "@/redux/reducers/property/propertyApi";

interface QrTrackerProps {
  propertyId: string;
}

const QrTracker = ({ propertyId }: QrTrackerProps) => {
  const searchParams = useSearchParams();
  const [incrementQrVisitCount] = useIncrementQrVisitCountMutation();

  useEffect(() => {
    // console.log("QrTracker mounted with propertyId:", propertyId);
    // console.log("Search params:", searchParams.toString());
    
    const isQrCodeVisit = searchParams.get("qrCode") === "true";
    // console.log("Is QR code visit:", isQrCodeVisit);
    
    if (isQrCodeVisit && propertyId) {
      // console.log("Attempting to increment QR visit count for property:", propertyId);
      incrementQrVisitCount(propertyId)
        .unwrap()
        .then(() => {
          // console.log("QR visit count incremented successfully");
        })
        .catch((error) => {
          console.error("Failed to increment QR visit count:", error);
        });
    } else {
      // console.log("QR tracking conditions not met:", { isQrCodeVisit, propertyId });
    }
  }, [searchParams, propertyId, incrementQrVisitCount]);

  return <div data-qr-tracker="true" style={{ display: "none" }} />; // Hidden marker for debugging
};

export default QrTracker;