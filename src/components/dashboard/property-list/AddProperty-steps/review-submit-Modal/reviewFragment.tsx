"use client";

import DocumentPreviewSection from "./DocumentPreviewSection";
import MediaPreviewSection from "./MediaPreviewSection";
import OverviewSection from "./OverviewSection";

interface ReviewFragmentProps {
  property: any;
}


export default function ReviewFragment({ property }:ReviewFragmentProps) {
  console.log("📦 Property from Redux in reviewFragment:", property);
  return (
    <div className="overflow-y-hidden md:overflow-y-auto max-h-none md:max-h-[70vh] pr-2 -mt-2">
      <OverviewSection property={property} />
      <MediaPreviewSection property={property} />
      <DocumentPreviewSection property={property} />
    </div>
  );
}
