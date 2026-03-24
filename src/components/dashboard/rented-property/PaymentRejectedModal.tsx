import { AlertIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { setPaymentRejectedModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { setPaymentHistoryModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const PaymentRejectedModal = () => {
    const paymentRejected = useSelector(
        (state: RootState) => state.rentalApplication.paymentRejectedModal
    );

    const dispatch = useDispatch();

    return (
        <Dialog
            open={paymentRejected}
            onOpenChange={(state) => dispatch(setPaymentRejectedModal(state))}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        <AlertIcon className="w-8 h-8 text-red-500" />
                        <p className="text-2xl font-light text-secondary text-center">
                            Payment Failed
                        </p>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-2 justify-center text-center">
                    <div className="text-lg font-medium">
                        Please{" "}
                        <Button
                            variant="link"
                            className="p-0 text-lg underline"
                            onClick={() => {
                                dispatch(setPaymentRejectedModal(false));
                                dispatch(setPaymentHistoryModal(true));
                            }}
                        >
                            try again
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentRejectedModal;
