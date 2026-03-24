import { ReactNode } from "react";
import { CustomModal } from "../common/customModal";
import { GalleryCarousel } from "./galleryCarousel";
import { getYouTubeEmbedUrl } from "@/utils/youtube";

type GalleryModalProps = {
  children: ReactNode;
  video?: string;
};

export function VideoModal({ children, video }: GalleryModalProps) {
    const embedUrl = video ? getYouTubeEmbedUrl(video) : "";
    return (
        <>
            <CustomModal
                triggerNode={children}
                className="videoModalContainer border-0"
            >
                {video ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `<iframe
              width="1260"
              height="315"
              src="${embedUrl}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>`,
                        }}
                        className="videoContainer"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h3 className="text-lg font-normal text-secondary mb-2">No Video Available</h3>
                            <p className="text-muted-foreground">This property does not have a video tour yet.</p>
                        </div>
                    </div>
                )}
            </CustomModal>
        </>
    );
}
