"use client";

import { ChevronDownIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setPdfLoading } from "@/redux/reducers/contact/pdfPreviewSlice";
import { Download } from "lucide-react";

interface TermsAndConditionsSectionProps {
  pdfUrl: string;
  agreed: boolean;
  onAgreementChange: (value: boolean) => void;
}

export default function TermsAndConditionsSection({
  pdfUrl,
  agreed,
  onAgreementChange,
}: TermsAndConditionsSectionProps) {

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.pdfPreview.isLoading);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "terms-and-conditions.pdf"; // default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Optional: fallback
      window.open(pdfUrl, "_blank"); // Opens file in browser tab when failed to download
    }
  };

  return (
    <div className="space-y-4 text-sm w-full">
      <h3 className="font-normal text-black">Terms & Conditions</h3>

      {/* Small PDF Preview */}
      <div className="relative bg-white border rounded-xl overflow-hidden">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        )}

        {/* Download Button */}
        <div className="absolute top-2 right-2  z-10 flex items-center gap-2">
          {/* Green Signed Badge */}
          {useAppSelector((state) => state.pdfPreview.isSigned) && (
            <span className="h-8 rounded-md gap-1.5 px-3 text-xs bg-gray-100 text-green-600 border border-green-300 flex items-center bg-green-100">
              Signed
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-xs bg-gray-100 text-secondary px-3 py-1 rounded-sm flex items-center gap-1 border border-gray-300"
          >
            Download <Download className="w-3.5 h-3.5" />
          </Button>
        </div>

        <iframe
          src={pdfUrl}
          title="Terms PDF Preview"
          className="w-full h-[180px]"
          onLoad={() => dispatch(setPdfLoading(false))}
        />

        {/* View Full Terms */}
        <div className="absolute bottom-0 left-0 w-full text-center bg-white bg-opacity-90 py-2">
          <Button
            variant={"link"}
            type="button"
            size={"sm"}
            onClick={() => window.open(pdfUrl, "_blank")}
            className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:no-underline"
            >
            View full Terms <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => onAgreementChange(Boolean(checked))}
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the Terms & Conditions
        </Label>
      </div>
    </div>
  );
}
