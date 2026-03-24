import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { setRentPaymentModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import RentPaymentInvoice from "./RentPaymentInvoice";

const RentPaymentModal = () => {
    const dispatch = useDispatch();
    const rentPaymentModal = useSelector(
        (state: RootState) => state.rentedProperty.rentPaymentModal
    );
    const rentPaymentData = useSelector(
        (state: RootState) => state.rentedProperty.rentPaymentData
    );
    return (
        <Dialog
            open={rentPaymentModal}
            onOpenChange={(state) => {
                dispatch(setRentPaymentModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[650px]">
                {/* Visually hidden */}
                <DialogHeader className="text-left hidden">
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        Payment Summary
                    </DialogTitle>
                </DialogHeader>
                <RentPaymentInvoice
                    baseRent={Number(rentPaymentData.baseRent)}
                    lateFee={Number(rentPaymentData.lateFee)}
                    totalDue={Number(rentPaymentData.totalDue)}
                    dueDate={rentPaymentData.dueDate}
                />
            </DialogContent>
        </Dialog>
    );
};

export default RentPaymentModal;
