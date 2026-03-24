import { MediaPreview } from "./MediaPreview";

interface MediaPreviewSectionProps {
  property: any;
}

export default function MediaPreviewSection({ property }: MediaPreviewSectionProps) {
  return (
    <div className="space-y-4 mb-3">
      <MediaPreview images={property?.media || []} floorPlans={property?.layout || []}/>

      <div className="grid grid-cols-2 gap-y-4 text-sm text-muted-foreground">
        <div className="space-y-1">
          <div className="font-normal text-muted">Video walkthrough</div>
          <div className="font-normal">{property?.video ? "Uploaded" : "Not uploaded"}</div>
        </div>
        <div className="space-y-1">
          <div className="font-normal text-muted">360° virtual tour</div>
          <div className="font-normal">{property?.virtualTour ? "Uploaded" : "Not uploaded"}
          </div>
        </div>
      </div>
    </div>
  );
}
