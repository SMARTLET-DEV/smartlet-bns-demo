import { CustomModal } from "../common/customModal";
import { FloorPlanCarousel } from "./floorPlanCarousel";

type FloorPlanModalProps = {
  triggerState: boolean;
  setTriggerState?: (val: boolean) => void;
  images: {
    src: string;
    title: string;
  }[];
};

export function FloorPlanModal({
    triggerState,
    setTriggerState,
    images,
}: FloorPlanModalProps) {
    return (
        <>
            <CustomModal
                title="Floor Plan"
                triggerState={triggerState}
                setTriggerState={setTriggerState}
                className=""
            >
                <div className="w-full">
                    <FloorPlanCarousel
                        images={images}
                    />
                </div>
            </CustomModal>
        </>
    );
}
