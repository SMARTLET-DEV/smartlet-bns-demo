import UploadItem from "./UploadItem";

interface UploadGridProps {
  name: string;
  files: File[];
  statuses: Record<string, "uploading" | "uploaded">;
  onUpload: (name: string, files: File[]) => void;
  onDelete: (name: string, fileName: string) => void;
}

export default function UploadGrid({
  name,
  files,
  statuses,
  onUpload,
  onDelete,
}: UploadGridProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    onUpload(name, selectedFiles);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-12 gap-3 sm:gap-4">
      {files.map((file) => (
        <UploadItem
          key={file.name}
          file={file}
          status={statuses[file.name] || "uploading"}
          onDelete={() => onDelete(name, file.name)}
        />
      ))}

      <label htmlFor={`fileUpload-${name}`} className="cursor-pointer">
        <div className="aspect-square max-w-[105px] max-h-[105px] rounded-lg border border-dashed border-secondary flex items-center justify-center hover:border-primary transition-colors">
          <span className="text-sm text-muted-foreground">Upload</span>
        </div>
        <input
          id={`fileUpload-${name}`}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}
