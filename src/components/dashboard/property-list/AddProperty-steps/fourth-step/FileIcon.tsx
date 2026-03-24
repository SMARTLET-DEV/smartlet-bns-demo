"use client";

interface FileIconProps {
  file?: File | null;
  preview?: string;
}

export function FileIcon({ file, preview }: FileIconProps) {
  const fileName = file?.name ?? preview ?? "";
  const fileType = file?.type;

  const isPdf =
    fileType === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf");

  return (
    <span className="text-primary">
      {isPdf ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2a2 2 0 0 0-2 2v16c0 1.103.897 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zM6 20V4h7v5h5v11H6z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.103-.897-2-2-2H5C3.897 3 3 3.897 3 5v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM5 5h14l.002 4H5V5zm0 6h14v8H5v-8z" />
        </svg>
      )}
    </span>
  );
}
