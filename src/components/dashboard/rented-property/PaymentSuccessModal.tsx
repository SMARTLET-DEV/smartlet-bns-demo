import { BuildingIcon, CheckCircleIcon } from "@/assets/icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { setPaymentSuccess } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const PaymentSuccessModal = () => {
    const paymentSuccess = useSelector(
        (state: RootState) => state.rentalApplication.paymentSuccess
    );

    const dispatch = useDispatch();

    return (
        <Dialog
            open={paymentSuccess}
            onOpenChange={(state) => dispatch(setPaymentSuccess(state))}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[550px]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        <BuildingIcon className="w-6 h-6" />
                        Apply for Rent
                    </DialogTitle>
                    <div className="flex flex-col items-center gap-2 justify-center text-center">
                        <p className="rounded-full">
                            <CheckCircleIcon className="w-10 h-10 text-[#04da8d]" />
                        </p>
                        <p className="text-xl font-light w-[90%]">
                            Payment Successful
                        </p>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentSuccessModal;
