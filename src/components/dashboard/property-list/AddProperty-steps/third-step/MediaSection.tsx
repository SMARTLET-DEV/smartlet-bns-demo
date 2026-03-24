import UploadItem from "./UploadItem";


interface MediaSectionProps {
  title: string;
  name: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  floorSelection?: boolean;
  files: File[];
  logo?: React.ReactNode;
  statuses: Record<string, "uploading" | "uploaded">;
  onUpload: (name: string, files: File[]) => void;
  onDelete: (name: string, fileName: string) => void;
  warning?: string;
  variant?: "default" | "layout";
  allowMultiple?: boolean;
  initialUrls?: string[];
}

export default function MediaSection({
  title,
  name,
  required,
  optional,
  description,
  floorSelection,
  files,
  logo,
  statuses,
  onUpload,
  onDelete,
  warning,
  variant = "default",
  allowMultiple = true,
  initialUrls = [],
}: MediaSectionProps) {
  return (
    <section className="space-y-2">
      {variant === "default" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-3">
            {logo && <span className="w-5 h-5">{logo}</span>}
            <label className="font-medium text-base">
              {title}{" "}
              {required && <span className="text-red-500">*</span>}
              {optional && (
                <span className="text-muted-foreground">(optional)</span>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Combined preview */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-12 gap-3 sm:gap-4">
        {/* Previews from Redux */}
        {initialUrls.map((url, index) => (
          <UploadItem
            key={`redux-${index}`}
            url={url}
            status="uploaded"
            onDelete={() => onDelete(name, url)} // pass url as filename
            fromRedux
          />
        ))}

        {/* Previews from local upload */}
        {files.map((file) => (
          <UploadItem
            key={file.name}
            file={file}
            status={statuses[file.name] || "uploading"}
            onDelete={() => onDelete(name, file.name)}
          />
        ))}

        {/* Upload field */}
        <label htmlFor={`fileUpload-${name}`} className="cursor-pointer">
          <div className="aspect-square max-w-[105px] max-h-[105px] rounded-lg border border-dashed border-secondary flex items-center justify-center hover:border-primary transition-colors">
            <span className="text-sm text-muted-foreground">Upload</span>
          </div>
          <input
            id={`fileUpload-${name}`}
            type="file"
            accept="image/*,video/*"
            multiple={allowMultiple}
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files ?? []);
              onUpload(name, selectedFiles);
            }}
            className="hidden"
          />
        </label>
      </div>

      {warning && (
        <p className="text-sm text-destructive mt-1 text-primary">{warning}</p>
      )}
    </section>
  );
}
