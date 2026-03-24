
import { OwnerTimeline, Step } from "@/components/properties/apply-for-rent/OwnerTimeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/ResponsiveDialog";
import { resetListingModal } from "@/redux/reducers/listingModal/listingModalSlice";
import { setAddPropertyDetailsModal, setClearCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicInfoFragment from "./AddProperty-steps/first-step/basicinfo";
import DocumentUpload from "./AddProperty-steps/fourth-step/DocumentFragment";
import LocationFragment from "./AddProperty-steps/second-step/locationinfo";
import MediaFragment from "./AddProperty-steps/third-step/MediaFragment";
import { useIsMobile } from "./useIsMobile";

interface AddPropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
  children?: React.ReactNode;
  propertyType: "RESIDENTIAL" | "COMMERCIAL";
  packageType: "BASIC" | "SMART" | "SMARTPLUS";
  userId: string;
}


export default function AddPropertyDetailsModal({
  open,
  onClose,
  onContinue,
  title,
  children,
  propertyType,
  packageType,
  userId,
}: AddPropertyDetailsModalProps) {
  const stepperMethodsRef = useRef<any>(null);
  //console.log(userId+" "+propertyType);
  



  const [isStepSubmitting, setIsStepSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const steps: Step[] = [
      {
        id: "1",
        title: "Basic Info",
        content: (
          <BasicInfoFragment
            {...(isMobile ? { variant: "overview" } : {})}
            userId={userId}
            propertyType={propertyType}
            packageType={packageType}
            onSuccess={(id) => {
              //console.log("✅ Created property ID:", id);
              stepperMethodsRef.current?.next();
            }}
            onStatusChange={(status) => setIsStepSubmitting(status)}
          />
        ),
      },
      {
          id: "2",
          title: "Location",
          content: <LocationFragment onSuccess={() => stepperMethodsRef.current?.next()} {...(isMobile ? { variant: "overview" } : {})} />,
      },
      {
        id: "3",
        title: "Media",
        content: <MediaFragment onSuccess={() => stepperMethodsRef.current?.next()} {...(isMobile ? { variant: "overview" } : {})}/>,
      },

      {
          id: "4",
          title: "Documents",
          content: <DocumentUpload onSuccess={onContinue}/>,
      },
  ];  

  const propertyDetailsModal= useSelector((state: any) => state.property.createdProperty.addPropertyDetailsModal);
  const dispatch=useDispatch();

  const handleNext = () => {
    document.querySelector("form")?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };





  return (
    <Dialog open={propertyDetailsModal} 
    onOpenChange={ (state) => {
      dispatch(setAddPropertyDetailsModal(state));
      dispatch(setClearCreatedProperty());
      dispatch(resetListingModal());  
      } }>
      <DialogContent
        className="rounded-[16px] lg:rounded-[30px] md:min-w-[90%] lg:min-w-[70%]"
      >
        <DialogHeader className="-mt-1">
          <DialogTitle className="text-base text-sm sm:text-xl font-light text-left py-3 border-b-1 border-gray-200">
            Property Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <OwnerTimeline
            steps={steps}
            onStepperReady={(methods) => {
              stepperMethodsRef.current = methods;
            }}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            className="w-[50%] sm:w-[25%] py-5"
            onClick={() => {
              if (stepperMethodsRef.current?.prev) {
                stepperMethodsRef.current.prev();
              }
            }}
            disabled={isStepSubmitting || !stepperMethodsRef.current?.prev}
          >
            Back
          </Button>
          <Button className="w-[50%] sm:w-[25%] py-5" onClick={handleNext} disabled={isStepSubmitting}>
            {isStepSubmitting ? "Submitting..." : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
