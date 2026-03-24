"use client";

import { TrashcanIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCancelAppointmentMutation } from "@/redux/reducers/appointments/appointmentsApi";
import {
    changeCancelModalOpen,
    setPropertyId,
} from "@/redux/reducers/appointments/appointmentSlice";
import { useGetSinglePropertyQuery } from "@/redux/reducers/property/propertyApi";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const CancelAppointmentModal = () => {
    const cancelModalOpen = useSelector(
        (state: RootState) => state.appointment.cancelModalOpen
    );
    const propertyId = useSelector(
        (state: RootState) => state.appointment.propertyId
    );

    const dispatch = useDispatch();
    const { data: property, isLoading } = useGetSinglePropertyQuery(propertyId);
    const allAppointments = useSelector(
        (state: RootState) => state.appointment.appointments
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const [cancelAppointment, { isLoading: isCancelling }] =
        useCancelAppointmentMutation();

    async function handleCancelClick() {
        const appointmentId = allAppointments?.find(
            (appointment) => appointment.renterId === user?.id
        )?.id;

        if (!appointmentId) return;

        await cancelAppointment(appointmentId);
        dispatch(changeCancelModalOpen(false));
        dispatch(setPropertyId(""));
    }

    return (
        <Dialog
            open={cancelModalOpen}
            onOpenChange={(state) => {
                dispatch(changeCancelModalOpen(state));
            }}
        >
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px] px-10"
            >
                <DialogHeader>
                    <DialogTitle className="flex flex-col text-center items-center gap-2 font-light text-2xl pb-3">
                        <TrashcanIcon className="w-16 h-16 text-primary" />
                        Confirm Cancellation
                    </DialogTitle>
                </DialogHeader>
                <p className="text-center text-muted">
                    Are you sure you want to cancel your appointment for{" "}
                    {property?.property?.title}? This action cannot be undone.
                </p>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    <Button
                        variant="outline"
                        onClick={() => {
                            dispatch(changeCancelModalOpen(false));
                            dispatch(setPropertyId(""));
                        }}
                        disabled={isCancelling}
                    >
                        Keep Appointment
                    </Button>
                    <Button 
                        onClick={handleCancelClick} 
                        disabled={isCancelling}
                        className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition"
                    >
                        {isCancelling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Cancel Appointment"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelAppointmentModal;
