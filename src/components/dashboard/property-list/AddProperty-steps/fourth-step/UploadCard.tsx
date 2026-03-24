"use client";

import { CloseIcon, TickSquareIcon } from "@/assets/icons";
import { EyeIcon } from "lucide-react";
import { FileIcon } from "./FileIcon";

interface UploadCardProps {
  id: string;
  label: string;
  file: File | null;
  preview?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onPreview: () => void;
}

export default function UploadCard({
  id,
  label,
  file,
  preview,
  onUpload,
  onRemove,
  onPreview,
}: UploadCardProps) {
  return (
    <div className="space-y-2 relative">
      {(file || preview) && (
        <span className="absolute top-4 right-4 z-10 text-primary">
          <TickSquareIcon className="w-5 h-5" />
        </span>
      )}

      <label
        htmlFor={id}
        className="cursor-pointer h-[121px] sm:h-[150px] rounded-xl bg-card/50 border-1 p-4 flex flex-col justify-between items-center gap-2 text-center transition"
      >
        <input
          id={id}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
        <div className="mt-auto mb-5 flex flex-col space-y-1">
          <span className="font-light text-xl">{label}</span>
          <span className="text-xs text-muted">
            Supported File formats : jpg, png & PDF
          </span>
          <span className="text-xs text-muted">
            (Maximum size: 5 MB)
          </span>
        </div>
      </label>

      {(file || preview) && (
        <div className="flex items-center h-[65px] bg-card/50 justify-between border rounded-xl px-3 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileIcon file={file} preview={preview} />
            <span className="truncate max-w-[240px]">{file?.name ?? "Document Uploaded"}</span>
          </div>
          <div className="flex gap-2 items-center">
            <EyeIcon
              className="h-4 w-4 cursor-pointer hover:text-primary"
              onClick={onPreview}
            />
            <CloseIcon
              className="h-4 w-4 cursor-pointer text-secondary hover:text-primary"
              onClick={onRemove}
            />
          </div>
        </div>
      )}
    </div>
  );
}
