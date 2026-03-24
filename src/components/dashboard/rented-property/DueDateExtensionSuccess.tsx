import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Dialog } from "@/components/ui/dialog";
import { setDueDateExtensionSuccessModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const DueDateExtensionSuccessModal = () => {
    const dispatch = useDispatch();
    const dueDateExtensionModal = useSelector(
        (state: RootState) => state.rentedProperty.dueDateExtensionSuccessModal
    );
    const dueDateExtensionFormData = useSelector(
        (state: RootState) => state.rentedProperty.dueDateExtensionFormData
    );

    return (
        <Dialog
            open={dueDateExtensionModal}
            onOpenChange={(state) => {
                dispatch(setDueDateExtensionSuccessModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[650px]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        Request due date extension
                    </DialogTitle>
                </DialogHeader>
                <div className="p-8 px-4 bg-card rounded-lg flex flex-col gap-4 border">
                    <div className="flex item-center gap-1">
                        <p>Property Address:</p>
                        <p className="text-muted">
                            {dueDateExtensionFormData.address}
                        </p>
                    </div>
                    <div className="flex item-center gap-1">
                        <p>Current Rent Due Date:</p>
                        <p className="text-muted">
                            {dueDateExtensionFormData.dueDate}
                        </p>
                    </div>
                    <div className="flex item-center gap-1">
                        <p>New Rent Due Date:</p>
                        <p className="text-muted">
                            {dueDateExtensionFormData.newDate}
                        </p>
                    </div>
                    <div className="flex item-center gap-1">
                        <p>Reason:</p>
                        <p className="text-muted">
                            {dueDateExtensionFormData.reason}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DueDateExtensionSuccessModal;
