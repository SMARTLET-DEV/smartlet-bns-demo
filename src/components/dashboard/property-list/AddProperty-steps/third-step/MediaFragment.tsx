"use client";

import { ImagePlaceholderIcon, VideoIcon, VirtualTourPlaceholderIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hook";
import { useUploadPropertyMedia } from "@/utils/submitMediaFiles";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import DynamicFieldArrayInput from "../first-step/DynamicFieldArrayInput";
import FloorPlansSection from "./Floorplan-section/FloorPlansSection";
import MediaLinkInput from "./MediaLinkInput";
import MediaSection from "./MediaSection";

interface MediaFragmentProps {
  variant?: "default" | "overview";
  onSuccess?: () => void;
}



const MediaFragment = forwardRef(function MediaFragment(
  { variant = "default", onSuccess }: MediaFragmentProps,
  ref
) {
  const { control, getValues, setValue } = useForm();
  const createdProperty = useAppSelector((state) => state.property.createdProperty);
  const { submitMediaFiles } = useUploadPropertyMedia();
  const { success: showSuccess, error: showError } = useToast();

  const [localFiles, setLocalFiles] = useState<Record<string, File[]>>({});
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, Record<string, "uploading" | "uploaded">>
  >({});

  const [sectionWarnings, setSectionWarnings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (createdProperty.tags?.length) {
      // Ensure trimmed string array
      const cleanedTags = createdProperty.tags.map((tag: string) => tag.trim());
      setValue("tags", cleanedTags);
    }
  }, [createdProperty.tags, setValue]);

  
  const [mediaLinks, setMediaLinks] = useState({ video: "", virtualTour: "" });
    // ✅ When Redux data updates later (asynchronously), sync into local state
    useEffect(() => {
      setMediaLinks({
        video: createdProperty.video || "",
        virtualTour: createdProperty.virtualTour || "",
      });
  }, [createdProperty.video, createdProperty.virtualTour]);

  // ✅ Extracted upload logic
  const uploadMedia = async () => {
    const rawTags = getValues("tags") || [];

    // ✅ Filter out empty or whitespace-only tags
    const tags = rawTags
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    const payload = {
      ...localFiles,
      video: mediaLinks.video,
      virtualTour: mediaLinks.virtualTour,
      tags,
    };

    const success = await submitMediaFiles(payload);

    if (success) {
      showSuccess("Media uploaded successfully");
      onSuccess?.();
    } else {
      showError("Failed to upload media");
    }
  };

  // ✅ Form submit handler
  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadMedia();
  };

  // ✅ Imperative save exposed to parent
  useImperativeHandle(ref, () => ({
    save: uploadMedia,
  }));

  const handleUpload = (section: string, newFiles: File[]) => {
    setLocalFiles((prev) => {
      const existing = prev[section] || [];
      const uniqueNew = newFiles.filter(
        (file) => !existing.some((f) => f.name === file.name)
      );

      const duplicates = newFiles.length - uniqueNew.length;
      if (duplicates > 0) {
        setSectionWarnings((prev) => ({
          ...prev,
          [section]: `${duplicates} duplicate file${duplicates > 1 ? "s" : ""} skipped.`,
        }));
        setTimeout(() => {
          setSectionWarnings((prev) => {
            const updated = { ...prev };
            delete updated[section];
            return updated;
          });
        }, 5000);
      }

      return {
        ...prev,
        [section]: [...existing, ...uniqueNew],
      };
    });

    setUploadStatuses((prev) => {
      const updated = { ...(prev[section] || {}) };
      newFiles.forEach((file) => {
        if (!updated[file.name]) {
          updated[file.name] = "uploading";
          setTimeout(() => {
            setUploadStatuses((prev2) => ({
              ...prev2,
              [section]: {
                ...(prev2[section] || {}),
                [file.name]: "uploaded",
              },
            }));
          }, 1000);
        }
      });
      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  const handleDelete = (section: string, fileName: string) => {
    setLocalFiles((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((file) => file.name !== fileName),
    }));

    setUploadStatuses((prev) => {
      const updated = { ...(prev[section] || {}) };
      delete updated[fileName];
      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  const hiResImageUrls = createdProperty.media || [];
  const layoutUrls = createdProperty.layout || [];
  const thumbnailUrl = createdProperty.thumbnail || "";
  const tags= createdProperty.tags || [];

  return (
    <form
      onSubmit={handleSubmitUpload}
      className={cn(
        "px-1 sm:px-4 space-y-6 pr-3",
        variant === "default"
          ? "max-h-[444px] sm:max-h-[370px] overflow-y-auto"
          : "h-fit overflow-visible"
      )}
    >
      
      
      {/* Uploadable Media Section */}
      <MediaSection
        title="Upload HI-Resolution Images"
        required
        
        description="Drop image to upload or click (4 MB max)"
        name="hiResImages"
        logo={<ImagePlaceholderIcon />}
        files={localFiles["hiResImages"] || []}
        statuses={uploadStatuses["hiResImages"] || {}}
        onUpload={handleUpload}
        onDelete={handleDelete}
        warning={sectionWarnings["hiResImages"]}
        initialUrls={hiResImageUrls}
      />

      <MediaSection
        title="Upload Property Thumbnail"
        description="Drop image to upload or click (4 MB max)"
        name="thumbnail"
        required
        logo={<ImagePlaceholderIcon />}
        files={localFiles["thumbnail"] || []}
        statuses={uploadStatuses["thumbnail"] || {}}
        onUpload={(name, files) => {
          // ✅ Restrict to only 1 file
          if (files.length > 1) {
            files = [files[0]];
          }
          handleUpload(name, files);
        }}
        onDelete={handleDelete}
        allowMultiple={false}
        warning={sectionWarnings["thumbnail"]}
        {...(createdProperty.thumbnail ? { initialUrls: [createdProperty.thumbnail] } : {})}
      />


      

      {/* Floor Plan Upload + Preview */}
      <FloorPlansSection
        onUpload={handleUpload}
        initialLayoutUrls={layoutUrls}
      />

      {/* Video Link */}
      <MediaLinkInput
        label="Video Walkthrough URL"
        placeholder="Enter video walkthrough link"
        value={mediaLinks.video}
        onChange={(val) => setMediaLinks((prev) => ({ ...prev, video: val }))}
        required
        logo={<VideoIcon className="text-muted"/>}
      />

      {/* Virtual Tour */}
      <MediaLinkInput
        label="360° Virtual Tour URL (Optional)"
        placeholder="Enter virtual tour link"
        value={mediaLinks.virtualTour}
        onChange={(val) => setMediaLinks((prev) => ({ ...prev, virtualTour: val }))}
        required={false}
        logo={<VirtualTourPlaceholderIcon/>}
      />
      
      <span className="text-lg font-normal col-span-2 mt-1 mb-3 data-[error=true]:text-secondary">Tags:</span>
      <div className="mt-5">
        <DynamicFieldArrayInput
          control={control}
          name="tags"
          label="Tags"
          placeholderPrefix="Tag"
        />
      </div>

      {/* Hidden submit button */}
      <button type="submit" className="hidden" />
    </form>
  );
});
export default MediaFragment;
