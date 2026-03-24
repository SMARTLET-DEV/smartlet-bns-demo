"use client";

import {
  AdditionalFeatureIcon,
  GalleryIcon,
  LayoutIcon,
  SmartView360Icon,
  VideoIcon
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GalleryModal } from "../property-details/galleryModal";
import { SmartViewModal } from "../property-details/smartViewModal";
import { VideoModal } from "../property-details/videoModal";

type PropertyQuickActionsProps = {
  media: string[];
  video: string;
  virtualTour?: string;
  title?: string;
  location?: string;
  label?: string;
};

export default function PropertyQuickActions({ media, video,virtualTour,title,location,label }: PropertyQuickActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  //console.log("Video:",video);

  return (
    // 🔁 Enable horizontal scroll, smooth scroll, snap, and hide scrollbar
    <div className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
      <div className="flex flex-nowrap gap-4">
        <GalleryModal
          media={media}
          virtualTour={virtualTour}
          title={title}
          location={location}
          onSmartViewClick={() => setModalOpen(true)}
        >
          <Button
            variant="ghost"
            className={`rounded-md px-4 shadow-none outline-none bg-white shrink-0 snap-start ${isMobile ? 'h-13 !px-6' : ''}`}
          >
            <GalleryIcon className="w-5 h-5" />
            <span>Gallery</span>
          </Button>
        </GalleryModal>

        <Button
          variant="ghost"
          disabled={!virtualTour}
          className={`rounded-md px-4 border border-primary/40 shadow-none outline-none bg-white shrink-0 snap-start ${isMobile ? 'h-13 !px-6' : ''}`}
          onClick={() => setModalOpen(true)}
        >
          <SmartView360Icon className="w-5 h-5" />
          <span>smartVIEW</span>
        </Button>

        <VideoModal video={video}>
          <Button
            variant="ghost"
            disabled={!video}
            className={`rounded-md px-4 shadow-none outline-none bg-white shrink-0 snap-start ${isMobile ? 'h-13 !px-6' : ''}`}
          >
            <VideoIcon className="w-5 h-5" />
            <span>Video</span>
          </Button>
        </VideoModal>

        {/* Label */}
        <SmartViewModal
          virtualTour={virtualTour}
          title={title}
          location={location}
          triggerState={modalOpen} 
          setTriggerState={setModalOpen} 
          triggerNode={
            <Button
              className="absolute top-1.5 right-10 bg-secondary/15 backdrop-blur-xs rounded-md px-3 py-1 text-sm text-primary-foreground font-medium z-10 group-hover:text-primary group-hover:bg-background transition hover:text-white"
              onClick={() => setModalOpen(true)} 
            >
              {label}
            </Button>
          }
        />

        <Button
          variant="ghost"
          className={`rounded-md px-4 shadow-none outline-none bg-white shrink-0 snap-start ${isMobile ? 'h-13 !px-6' : ''}`}
          onClick={() => router.push(`${pathname}#layoutView`)}
        >
          <LayoutIcon className="w-5 h-5" />
          <span>Layout</span>
        </Button>

        <Button
          variant="ghost"
          className={`rounded-md px-4 shadow-none outline-none bg-white shrink-0 snap-start ${isMobile ? 'h-13 !px-6' : ''}`}
          onClick={() => router.push(`${pathname}#AdditionalFeaturesView`)}
        >
          <AdditionalFeatureIcon className="w-5 h-5" />
          <span>Additional Features</span>
        </Button>

      </div>
    </div>
  );
}