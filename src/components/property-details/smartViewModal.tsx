import { AddressIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { X } from "lucide-react";  

import {useIsMobileUserAgent} from "@/hooks/useIsMobileUserAgent";


type SmartViewModalProps = {
  triggerNode?: ReactNode;
  triggerState?: boolean;
  className?: any;
  setTriggerState?: (val: boolean) => void;
  title?: string;
  location?: string;
  virtualTour?: string;
};

export function SmartViewModal({
  triggerNode,
  triggerState,
  className,
  setTriggerState,
  title,
  location,
  virtualTour,
}: SmartViewModalProps) {
  const [image, setImage] = useState({
    title: title,
    address: location,
  });

  const isMobileUserAgent = useIsMobileUserAgent();


  const handleClose = () => {
    if (setTriggerState) {
      setTriggerState(false);  
    }
  };

  return (
    <Dialog open={triggerState} onOpenChange={setTriggerState} modal={true}>
      {triggerNode && <DialogTrigger asChild>{triggerNode}</DialogTrigger>}
      <DialogContent
        className={`max-sm:h-[80vh] h-[486px] lg:h-[680px] min-w-[90vw] w-[90vw] lg:min-w-[1280px] lg:w-[1280px] p-0 border-0 overflow-hidden flex flex-col ${className}`}
        hideCloseButton
      >
        <button
          onClick={handleClose}
          className={`absolute top-0 ${isMobileUserAgent ? 'right-[76px] w-[38px] h-[38px]' : 'right-[32px] w-[32px] h-[32px]'} bg-[rgba(0,0,0,0.9)] flex items-center justify-center shadow-md focus:outline-none cursor-pointer`}
          aria-label="Close Modal"
        >
          <X className={`text-white hover:text-gray-300 ${isMobileUserAgent ? 'w-[26px] h-[26px]' : 'w-[24px] h-[24px]'}`} />
        </button>

        {/* Accessibility title */}
        <div className="sr-only">
          <DialogTitle>{image.title || "Virtual Tour"}</DialogTitle>
        </div>

        {/* Position the address at the bottom-left corner */}
        <div className="absolute bottom-4 left-1 flex items-center text-sm font-light gap-2 z-10 bg-black/60 px-4 py-2 rounded-md text-white">
          <AddressIcon />
          <span>{image.address}</span>
        </div>

        {/* Conditional Virtual Tour or Message */}
        <div className="w-full h-full flex items-center justify-center">
          {virtualTour ? (
            <iframe
              src={virtualTour}
              width="100%"
              height="100%"
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              className="w-full h-full"
            />
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-normal text-secondary mb-2">
                No Virtual Tour Available
              </h3>
              <p className="text-muted-foreground">
                This property does not have any virtual tour yet.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
