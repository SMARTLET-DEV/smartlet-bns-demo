import MediaSection from "../MediaSection";

interface FloorUploadSectionProps {
  floor: number;
  files: File[];
  statuses: Record<string, "uploading" | "uploaded">;
  onUpload: (floor: number, files: File[]) => void;
  onDelete: (floor: number, fileName: string) => void;
  warning?: string;
  initialUrls?: string[];
}

export default function FloorUploadSection({
  floor,
  files,
  statuses,
  onUpload,
  onDelete,
  warning,
  initialUrls = [],
}: FloorUploadSectionProps) {
  return (
    <MediaSection
      variant="layout"
      title={`Floor ${floor}`}
      name={`floor-${floor}`}
      files={files}
      statuses={statuses}
      onUpload={(name, files) => onUpload(floor, files)}
      onDelete={(name, fileName) => onDelete(floor, fileName)}
      warning={warning}
      initialUrls={initialUrls}
    />
  );
}
