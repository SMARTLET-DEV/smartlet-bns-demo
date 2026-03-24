import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetPaymentHistoryMutation } from "@/redux/reducers/rented-property/RentedPropertyApi";
import { setPaymentHistoryModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table/DataTable";
import { columns } from "./data-table/columns";

const PaymentHistoryModal = () => {
    const dispatch = useDispatch();
    const paymentHistoryModal = useSelector(
        (state: RootState) => state.rentedProperty.paymentHistoryModal
    );
    const paymentSchedule = useSelector(
        (state: RootState) => state.rentedProperty.paymentSchedule
    );
    const rentedProperty = useSelector(
        (state: RootState) => state.rentedProperty.rentedProperty
    );

    const [getPaymentHistory, { isLoading }] = useGetPaymentHistoryMutation();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (rentedProperty?.id) {
            getPaymentHistory({ id: rentedProperty?.id });
        }
    }, [getPaymentHistory, rentedProperty?.id, user]);

    if (isLoading) {
        return null;
    }

    return (
        <Dialog
            open={paymentHistoryModal}
            onOpenChange={(state) => {
                dispatch(setPaymentHistoryModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[850px]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        Payment History
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {paymentSchedule.length > 0 ? (
                        <DataTable columns={columns} data={paymentSchedule} />
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                                No payment history found
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentHistoryModal;
