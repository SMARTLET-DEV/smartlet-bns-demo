import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useDeletePropertyFilesMutation } from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { normalizePropertyResponse } from "@/utils/property";
import { EyeIcon, ImageIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

interface UploadItemProps {
  file?: File;
  url?: string; // For Redux image
  status: "uploaded" | "uploading";
  onDelete: () => void;
  fromRedux?: boolean;
}

export default function UploadItem({ file, url, status, onDelete, fromRedux }: UploadItemProps) {
  const dispatch = useAppDispatch();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const createdProperty = useAppSelector((state) => state.property.createdProperty);
  const [deletePropertyFiles] = useDeletePropertyFilesMutation();


  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreviewUrl(url);
    }
  }, [file, url]);

  const handleDeleteClick = async () => {
    if (fromRedux && url && createdProperty?.id) {
      try {
        const relativePath = url.split(".com/")[1];
        const keyType = relativePath.includes("layout") ? "layout" : "media";

        const res = await deletePropertyFiles({
          id: createdProperty.id,
          body: {
            [keyType]: [relativePath],
          },
        });

        if (res?.data?.success) {
          dispatch(setCreatedProperty(normalizePropertyResponse(res.data.property)));
          onDelete();
        }
      } catch (error) {
        console.error("File deletion failed:", error);
      }
    } else {
      onDelete();
    }
  };


  const baseClasses =
    "aspect-square max-w-[105px] max-h-[105px] rounded-lg border flex items-center justify-center text-muted-foreground text-sm overflow-hidden relative";

  if (status === "uploading") {
    return (
      <div className={cn(baseClasses, "flex-col gap-2 p-3")}>
        <ImageIcon className="w-5 h-5" />
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn(baseClasses, "bg-muted")}>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            className="object-cover w-full h-full rounded-lg"
          />
        )}

        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center gap-2">
          <div className="bg-transparent px-2 py-1 flex items-center gap-1">
            {/* Preview Button */}
            <Button
              type="button"
              variant="link"
              onClick={() => setIsPreviewOpen(true)}
              className="text-white hover:text-secondary transition-colors p-0 h-auto w-4"
            >
              <EyeIcon className="w-4 h-4" />
            </Button>

            {/* Delete Button */}
            <Button
              type="button"
              variant="link"
              onClick={handleDeleteClick}
              className="text-white hover:text-secondary transition-colors p-0 h-auto w-4"
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[80%] max-h-[80%] p-1">
          {previewUrl && (
            <img src={previewUrl} alt="Full Preview" className="w-full h-full rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
