"use client";

import UploadIconPlaceholder from "./UploadIconPlaceholder";

interface ImagePreviewProps {
  urls: string[]; 
}

export default function ImagePreview({ urls }: ImagePreviewProps) {
  return (
    <div className="space-y-3 py-2">
      <div className="text-sm font-normal text-muted">Images</div>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <UploadIconPlaceholder key={`img-${i}`} url={url} />
        ))}
      </div>
    </div>
  );
}
