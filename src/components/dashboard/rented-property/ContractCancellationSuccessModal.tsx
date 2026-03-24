import { CalendarBookingIcon, CheckCircleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { setContractCancellationSuccessModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const ContractCancellationSuccessModal = () => {
    const contractCancellationSuccessModal = useSelector(
        (state: RootState) =>
            state.rentedProperty.contractCancellationSuccessModal
    );
    const dispatch = useDispatch();

    const contractCancellationData = useSelector(
        (state: RootState) => state.rentedProperty.contractCancellationData
    );

    return (
        <Dialog
            open={contractCancellationSuccessModal}
            onOpenChange={(state) => {
                dispatch(setContractCancellationSuccessModal(state));
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px]">
                <DialogHeader>
                    <DialogTitle className="hidden">
                        Appointment Booking Success
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center ">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mb-3" />
                    <h1 className="text-2xl font-light text-center mb-2">
                        Your contract cancellation request has been received,
                        you will be contacted shortly.
                    </h1>

                    <div className="mt-5 px-4 py-8 bg-card border rounded-lg w-full flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-secondary flex items-center gap-2">
                                <CalendarBookingIcon className="w-5 h-5" />
                                Move-out Date:
                            </p>

                            <p className="text-muted">
                                {new Date(
                                    contractCancellationData.moveOutDate
                                ).toLocaleDateString("en-UK", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-secondary flex items-center gap-2">
                                Reason:
                            </p>
                            <p className="text-muted">
                                {contractCancellationData.reason}
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full grid grid-cols-2 gap-5 justify-between">
                        <div className=""></div>
                        <Button
                            variant="outline"
                            onClick={() =>
                                dispatch(
                                    setContractCancellationSuccessModal(false)
                                )
                            }
                        >
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ContractCancellationSuccessModal;
