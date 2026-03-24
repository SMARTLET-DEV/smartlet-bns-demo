import {
  BathIcon,
  BedIcon,
  GeoAltIcon,
  MenuIcon,
  SizeIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLazyGetPropertyReceiptQuery, useSubmitDeleteRequestMutation } from "@/redux/reducers/property/propertyApi";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import DeleteRequestModal from "./DeleteRequestModal";
import { MiniThumbnailCarousel } from "./miniThumbnailCarousel"; // assumes a thumbnail carousel component exists

interface DashboardPropertyCardProps {
  images: string[];
  label: string;
  title: string;
  location: string;
  bed: number;
  bath: number;
  floorsqft: number;
  rent: number;
  layout?: "horizontal" | "vertical"; // default = horizontal
  isPaused: boolean;
  onPauseClick?: () => void;
  propertyId: string;
  onEditClick?: (propertyId: string) => void;
  viewStatus: "APPROVED" | "PENDING" | "REJECTED" | string;
  onViewClick?: (viewStatus: string, propertyId: string) => void;
  ownerId: string;
  packageType?: string; // Assuming packageType is a string, adjust as necessary
}

export function DashboardPropertyCard({
  images,
  label,
  title,
  location,
  bed,
  bath,
  floorsqft,
  rent,
  isPaused,
  propertyId,
  onPauseClick,
  onEditClick,
  viewStatus,
  onViewClick,
  layout = "horizontal",
  ownerId,
  packageType // Assuming packageType is a string, adjust as necessary
}: DashboardPropertyCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submitDeleteRequest, { isLoading }] = useSubmitDeleteRequestMutation();
  const [getPropertyReceipt] = useLazyGetPropertyReceiptQuery();
  const { success, error } = useToast();
  
  const handleDownloadReceipt = async () => {
    if (isDownloading) return;

    console.log('📋 Starting download for propertyId:', propertyId);
    setIsDownloading(true);

    try {
      if (!propertyId) {
        throw new Error('Property ID is missing');
      }

      const response = await getPropertyReceipt(propertyId).unwrap();
      console.log('📊 API Response:', response);

      if (response.success && response.data?.receiptUrl) {
        // Open in a new tab instead of downloading
        window.open(response.data.receiptUrl, "_blank");
        success("Receipt downloaded successfully!");
      } else {
        console.warn("⚠️ No receipt available:", response.message);
        error(response.message || "No receipt available for this property.");
      }
    } catch (err: any) {
      console.error("❌ Failed to open receipt:", err);

      if (err?.status === 400) {
        error("Invalid property ID. Please try again.");
      } else if (err?.data?.message) {
        error(err.data.message);
      } else {
        error("Failed to open receipt. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };


  const isVertical = layout === "vertical";
  const statusClassMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
    APPROVED: "bg-green-100 text-green-800",
    PAUSED: "bg-gray-200 text-gray-700",
  };


  return (
    <>
      <div
        className={cn(
          "overflow-hidden transition relative",
          isVertical
            ? "w-full h-fit rounded-2xl bg-background shadow-sm"
            : "flex justify-between items-center border border-border rounded-xl p-4 w-full h-[210px]"
        )}
      >

        {/* Absolute Label for Vertical */}
        {isVertical && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <span
              className={cn(
                "px-2 py-1 text-xs font-normal rounded",
                statusClassMap[label] || "bg-gray-100 text-gray-800"
              )}
            >
              {label.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
            </span>
            {isPaused && (
              <span className="px-2 py-1 text-xs font-normal rounded bg-gray-200 text-gray-700">
                Paused
              </span>
            )}
          </div>
        )}
        {/* Thumbnail Carousel */}
        <MiniThumbnailCarousel images={images} isVertical={isVertical} />

        {/* Property Info */}
        <div className="flex flex-col justify-between h-full flex-1 px-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-left gap-6">
              <h3 className="text-lg font-light">{title}</h3>
              {!isVertical && (
                <>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-normal rounded z-10",
                      statusClassMap[label] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {label.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                  {isPaused && (
                    <span className="px-2 py-1 text-xs font-normal rounded bg-gray-200 text-gray-700 -ml-4">
                      Paused
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="text-base text-muted flex items-center gap-1 mt-1">
              <GeoAltIcon className="w-4 h-4" />
              {location}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted text-base mt-2 mb-4">
              <p className="flex items-center gap-1">
                <BedIcon className="w-4 h-4" /> {bed} Beds
              </p>
              <p className="flex items-center gap-1">
                <BathIcon className="w-4 h-4" /> {bath} Baths
              </p>
              <p className="flex items-center gap-1">
                <SizeIcon className="w-4 h-4" /> {floorsqft} Sqft
              </p>
            </div>
          </div>

          

          {isVertical ? (
            <div className="flex items-center justify-between mb-4 border-t pt-4">
              <p className="text-primary text-lg font-normal">
                ৳{rent} <span className="text-base text-muted">/month</span>
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="default" onClick={() => onViewClick?.(viewStatus, propertyId)}>View Details</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MenuIcon className="w-5 h-5 cursor-pointer text-muted" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-0 rounded-tr-none shadow-xs text-muted">
                    {[...(packageType === "BASIC" && viewStatus === "APPROVED" ? ["Download Receipt"] : []),"Edit", isPaused ? "Reactivate" : "Pause", "Remove"].map((item, index) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => {
                          if (item === "Pause" || item === "Reactivate") {
                            onPauseClick?.();
                          }
                          if (item === "Edit") {
                            onEditClick?.(propertyId);

                          } 
                          if (item === "Remove") {
                            setShowDeleteModal(true);
                          }
                          if (item === "Download Receipt") {
                            handleDownloadReceipt();
                            // Handle download receipt logic here
                            //console.log("Download Receipt clicked for propertyId:", propertyId);
                          }
                        }}
                        className={cn(
                          "px-3 py-2 text-sm cursor-pointer rounded-none",
                          index !== 0 && "border-t border-border"
                        )}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            null
          )}
          {!isVertical?(
            <p className="text-primary text-lg font-normal mt-2">
              ৳{rent} <span className="text-base text-muted">/month</span>
            </p>
            ):null}
        </div>

        {!isVertical?(
        <div className="hidden md:flex flex-col gap-2 items-end h-full justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MenuIcon className="w-5 h-5 cursor-pointer text-muted" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-0 rounded-tr-none shadow-xs text-muted">
              {[...(packageType === "BASIC" && viewStatus === "APPROVED" ? ["Download Receipt"] : []),"Edit", isPaused ? "Reactivate" : "Pause", "Remove"].map((item, index) => (
                <DropdownMenuItem
                  key={item}
                  disabled={item === ""}
                  onClick={() => {
                    if (item === "Pause" || item === "Reactivate") {
                      onPauseClick?.();
                    }
                    if (item === "Edit") {
                      onEditClick?.(propertyId);
                    } 
                    if (item === "Remove") {
                      setShowDeleteModal(true);
                    }
                    if (item === "Download Receipt") {
                      handleDownloadReceipt();
                      // Handle download receipt logic here
                      //console.log("Download Receipt clicked for propertyId:", propertyId);
                    }  
                  }}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer rounded-none",
                    index !== 0 && "border-t border-border"
                  )}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant={isVertical ? "default" : "outline"} onClick={() => onViewClick?.(viewStatus, propertyId)}>View Details</Button>
        </div>):null}
      </div>
      <DeleteRequestModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSubmitDeleteRequest={async (reason) => {
          try {
            const response = await submitDeleteRequest({ propertyId, ownerId, reason }).unwrap();
            success("Delete request submitted successfully!");
            setShowDeleteModal(false);
            //console.log("✅ Delete request successful:", response);
          } catch (err: any) {
            error(err?.data?.message || "Failed to submit delete request. Please try again.");
            console.error("Delete request failed:", err);
          }
        }}
      />
    </>
  );
}

