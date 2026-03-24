import * as React from "react";
import { ReactNode } from "react";
import { CustomModal } from "../common/customModal";
import { GalleryCarousel } from "./galleryCarousel";

type GalleryModalProps = {
  children: ReactNode;
  media: string[];
  virtualTour?: string;
  title?: string;
  location?: string;
  onSmartViewClick?: () => void;
};

export function GalleryModal({ children, media, virtualTour, title, location, onSmartViewClick }: GalleryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSmartViewClick = () => {
    setIsOpen(false); // Close gallery modal
    onSmartViewClick?.(); // Open smartVIEW modal
  };
  
  return (
    <>
      <CustomModal
        triggerNode={children}
        triggerState={isOpen}
        setTriggerState={setIsOpen}
        className="galleryModalContainer border-0 h-[35vh] md:h-[80vh] lg:h-[90vh]"
      >
        {media && media.length > 0 ? (
          <div className="w-full">
            <GalleryCarousel
              images={media}
              virtualTour={virtualTour}
              title={title}
              location={location}
              onSmartViewClick={handleSmartViewClick}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-normal text-secondary mb-2">No Image Available</h3>
              <p className="text-muted-foreground">This property does not have any image yet.</p>
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}
