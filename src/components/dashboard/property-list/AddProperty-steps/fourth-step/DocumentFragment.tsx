"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useDeletePropertyFilesMutation, useLazyGetSinglePropertyQuery, useUpdatePropertyMutation } from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { normalizePropertyResponse } from "@/utils/property";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ErrorAlertMessage from "../ErrorAlertMessage";
import FilePreviewDialog from "./FilePreviewDialog";
import UploadCard from "./UploadCard";


interface DocumentUploadProps {
  onSuccess?: () => void;
}

type UploadFile = {
  name: string;
  file: File;
  preview: string;
};

const DOC_CATEGORIES = [
  { id: "titleDeed", label: "Title Deed" },
  { id: "utilityBill", label: "Utility Bill" },
];

const DocumentUpload = forwardRef(function DocumentUpload({ onSuccess }: DocumentUploadProps, ref) {
  
  const dispatch = useAppDispatch();
  const createdProperty = useAppSelector((state) => state.property.createdProperty);
  const isUploadAllowed = createdProperty?.viewStatus === "PENDING";
  console.log("🏷️ DocumentUpload - createdProperty:", createdProperty?.viewStatus);
  const [updateProperty, { isLoading }] = useUpdatePropertyMutation();
  const [deletePropertyFiles] = useDeletePropertyFilesMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadFile | null>>({
    titleDeed: null,
    utilityBill: null,
  });

  const [triggerGetSingleProperty] = useLazyGetSinglePropertyQuery();

  const uploadSingleDocument = async (field: "titleDeed" | "utilityBill", file: File) => {
    const formData = new FormData();
    formData.append(field, file);

    try {
      await updateProperty({ id: createdProperty.id, data: formData }).unwrap();

      const refetched = await triggerGetSingleProperty(createdProperty.id).unwrap();
      const normalized = normalizePropertyResponse(refetched.property);
      dispatch(setCreatedProperty(normalized));
    } catch (err) {
      console.error(`❌ Failed to upload ${field}:`, err);
    }
  };


  const handleSubmitDocuments = async (e?: React.FormEvent | "collect") => {
    if (typeof e === "object" && e?.preventDefault) e.preventDefault();
    if (e === "collect") return {};

    const hasAtLeastOneFile =
      uploadedFiles.titleDeed?.preview || uploadedFiles.utilityBill?.preview;

    if (!hasAtLeastOneFile) {
      setErrorMessage("Uploading at least one document is recommended.");
      setTimeout(() => setErrorMessage(""), 5000);
      //return;
    }

    onSuccess?.();
  };


  const removeFile = (category: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  useEffect(() => {
    const titleDeedURL = createdProperty?.titleDeed;
    const utilityBillURL = createdProperty?.utilityBill;

    //console.log("🏷️ Created Property - titleDeed:", titleDeedURL);
    //console.log("🏷️ Created Property - utilityBill:", utilityBillURL);

    setUploadedFiles({
      titleDeed: titleDeedURL
        ? { name: "Title Deed", file: null as any, preview: titleDeedURL }
        : null,
      utilityBill: utilityBillURL
        ? { name: "Utility Bill", file: null as any, preview: utilityBillURL }
        : null,
    });
  }, [createdProperty]);


  useEffect(() => {
    return () => {
      Object.values(uploadedFiles).forEach((entry) => {
        if (entry?.preview) {
          URL.revokeObjectURL(entry.preview);
        }
      });
    };
  }, [uploadedFiles]);

  

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useImperativeHandle(ref, () => ({
    save: (mode = "submit") => {
      if (mode === "collect") return handleSubmitDocuments("collect");
      return handleSubmitDocuments();
    },
  }));
  
  return (
    <form onSubmit={handleSubmitDocuments} className="space-y-4">
      <div className="space-y-4">
        <p className="font-normal text-normal text-secondary">Upload Verification Documents</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {DOC_CATEGORIES.map(({ id, label }) => (
            <UploadCard
              key={id}
              id={id}
              label={label}
              file={uploadedFiles[id]?.file ?? null}
              preview={uploadedFiles[id]?.preview}
              onUpload={(file) => {
                if (!isUploadAllowed) {
                  setErrorMessage("Document upload not allowed once rejected or approved.");
                  setTimeout(() => setErrorMessage(""), 5000);
                  return;
                }

                setUploadedFiles((prev) => {
                  const oldPreview = prev[id]?.preview;
                  if (oldPreview) URL.revokeObjectURL(oldPreview);

                  const preview = URL.createObjectURL(file);

                  uploadSingleDocument(id as "titleDeed" | "utilityBill", file);

                  return {
                    ...prev,
                    [id]: { name: file.name, file, preview },
                  };
                });
              }}
              onRemove={() => {
                if (!isUploadAllowed) {
                  setErrorMessage("Document removal not allowed once rejected or approved.");
                  setTimeout(() => setErrorMessage(""), 5000);
                  return;
                }

                const filePreview = uploadedFiles[id]?.preview;

                const isBackendFile = filePreview && !filePreview.startsWith("blob:");

                // Backend deletion
                if (isBackendFile) {
                  const deleteBody = { [id]: true }; // e.g., { titleDeed: true }
                  deletePropertyFiles({ id: createdProperty.id, body: deleteBody })
                    .unwrap()
                    .then((res) => {
                      console.log(`🧾 Deleted ${id} response:`, res);
                      if (res.success) {
                        dispatch(setCreatedProperty(normalizePropertyResponse(res.property)));
                        setUploadedFiles((prev) => ({
                          ...prev,
                          [id]: null,
                        }));
                      }
                    })
                    .catch((err) => {
                      console.error(`Failed to delete ${id}:`, err);
                      setErrorMessage("Failed to delete document.");
                      setTimeout(() => setErrorMessage(""), 5000);
                    });

                  return;
                }
                setUploadedFiles((prev) => {
                  const oldPreview = prev[id]?.preview;
                  if (oldPreview?.startsWith("blob:")) URL.revokeObjectURL(oldPreview);
                  return { ...prev, [id]: null };
                });
              }}
              onPreview={() => setPreviewFile(uploadedFiles[id])}
            />
          ))}
        </div>

        <FilePreviewDialog
          file={previewFile?.file ?? null}
          preview={previewFile?.preview ?? ""}
          onClose={() => setPreviewFile(null)}
        />
        <ErrorAlertMessage message={errorMessage} />
        <button type="submit" className="hidden" />
      </div>
    </form>
  );
});
export default DocumentUpload;
