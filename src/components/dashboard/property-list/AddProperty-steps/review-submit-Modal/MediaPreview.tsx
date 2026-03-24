import { FloorPreview } from "./FloorPreview";
import ImagePreview from "./ImagePreview";

interface MediaPreviewProps {
  images: string[];
  floorPlans: string[];
}

export function MediaPreview({ images, floorPlans }: MediaPreviewProps) {
  // Group floorPlans by floor index (1-based)
  const groupedFloors: Record<number, string[]> = {};
  floorPlans.forEach((url, index) => {
    groupedFloors[index + 1] = [url]; // index 0 => Floor 1, etc.
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <ImagePreview urls={images} />
      <FloorPreview floorPlans={groupedFloors} />
    </div>
  );
}
