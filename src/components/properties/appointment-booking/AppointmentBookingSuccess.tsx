"use client";

import {
    CalendarBookingIcon,
    CheckCircleIcon,
    ClockIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";

import { setAppointmentBookingSuccess } from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const AppointmentBookingSuccess = ({
    showGoToDashboard = true,
}: {
    showGoToDashboard?: boolean;
}) => {
    const lastSuccessfulAppointment = useSelector(
        (state: RootState) => state.property.lastSuccessfulAppointment
    );
    const appointmentBookingSuccess = useSelector(
        (state: RootState) =>
            state.property.propertyModal.appointmentBookingSuccess
    );
    const dispatch = useDispatch();
    const router = useRouter();

    if (!lastSuccessfulAppointment.date || !lastSuccessfulAppointment.id)
        return null;

    return (
        <Dialog
            open={appointmentBookingSuccess}
            onOpenChange={(state) => {
                dispatch(setAppointmentBookingSuccess(state));
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
                        Your viewing request has been submitted
                    </h1>
                    <p className="text-sm text-gray-500 text-center">
                        You will get a confirmation shortly.
                    </p>

                    <div className="mt-5 px-4 py-8 bg-card border rounded-lg w-full flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-secondary flex items-center gap-2">
                                <CalendarBookingIcon className="w-5 h-5" />
                                Date:
                            </p>
                            <p className="text-muted">
                                {new Date(
                                    lastSuccessfulAppointment.date
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-secondary flex items-center gap-2">
                                <ClockIcon className="w-5 h-5" />
                                Time:
                            </p>
                            <p className="text-muted">
                                {new Date(
                                    lastSuccessfulAppointment.date
                                ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full grid grid-cols-2 gap-5 justify-between">
                        {!showGoToDashboard && <div></div>}
                        <Button
                            variant="outline"
                            onClick={() =>
                                dispatch(setAppointmentBookingSuccess(false))
                            }
                        >
                            Close
                        </Button>
                        {showGoToDashboard && (
                            <Button
                                onClick={() => {
                                    dispatch(
                                        setAppointmentBookingSuccess(false)
                                    );
                                    router.push("/appointments");
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentBookingSuccess;
