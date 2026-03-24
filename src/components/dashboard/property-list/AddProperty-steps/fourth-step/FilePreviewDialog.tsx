"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";

interface FilePreviewDialogProps {
  file: File | null;
  preview?: string;
  onClose: () => void;
}


export default function FilePreviewDialog({ file, onClose, preview }: FilePreviewDialogProps) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  
  const fileURL = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (preview) return preview;
    return "";
  }, [file, preview]);


  useEffect(() => {
    if (file && fileURL.startsWith("blob:")) {
      return () => URL.revokeObjectURL(fileURL);
    }
  }, [file, fileURL]);

  useEffect(() => {
    const isPdf =
      (file?.type === "application/pdf") ||
      (preview?.toLowerCase().endsWith(".pdf"));

    if (isMobileOrTablet && isPdf && fileURL) {
      window.open(fileURL, "_blank");
      onClose();
    }
  }, [file, preview, isMobileOrTablet, fileURL, onClose]);
  



  useEffect(() => {
    // Detect mobile/tablet based on screen width and user agent
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));

    setIsMobileOrTablet(isMobile);

    // If PDF and on mobile, open in new tab automatically
    if (file && file.type === "application/pdf" && isMobile) {
      const pdfUrl = URL.createObjectURL(file);
      window.open(pdfUrl, "_blank");
      onClose();
    }
  }, [file, onClose]);

  if (!fileURL) return null;
  if (file?.type === "application/pdf" && isMobileOrTablet) {
    window.open(fileURL, "_blank");
    onClose();
    return null;
  }


  const isPdf = file?.type === "application/pdf" || preview?.endsWith(".pdf");


  return (
    <Dialog open={!!fileURL} onOpenChange={onClose}>
      <DialogContent className="w-full h-[90vh] p-1 overflow-hidden">
        {isPdf ? (
          <iframe
            src={fileURL}
            title="PDF Preview"
            className="w-full h-full rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-auto">
            <img
              src={fileURL}
              alt="File Preview"
              className="max-h-full max-w-full w-auto h-auto rounded-md object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
