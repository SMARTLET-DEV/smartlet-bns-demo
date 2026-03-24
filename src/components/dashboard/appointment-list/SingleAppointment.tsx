import { CalendarIcon, ClockIcon, GeoAltIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    changeCancelModalOpen,
    changeRescheduleModalOpen,
    setAppointmentId,
    setPropertyId,
} from "@/redux/reducers/appointments/appointmentSlice";
import { ViewingAppointment } from "@/redux/reducers/property/propertyApi";
import { useDispatch } from "react-redux";

const serverURL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

export default function SingleAppointment({
    appointment,
}: {
    appointment: ViewingAppointment;
}) {
    const dispatch = useDispatch();

    function handleCancelClick() {
        dispatch(setPropertyId(appointment.propertyId));
        dispatch(setAppointmentId(appointment.id));
        dispatch(changeCancelModalOpen(true));
    }

    function handleRescheduleClick() {
        dispatch(setPropertyId(appointment.propertyId));
        dispatch(changeRescheduleModalOpen(true));
    }

    return (
        <div className="w-full lg:flex-row flex-col border border-card rounded-2xl overflow-hidden lg:p-4 flex gap-4 justify-between">
            <div className="flex gap-4 flex-col lg:flex-row flex-grow">
                <img
                    src={
                        appointment.property.media[0]
                            ? `${serverURL}${appointment.property.media[0]}`
                            : "/property-img.png"
                    }
                    alt={appointment.property.title}
                    className="w-full lg:max-w-[214px] h-full lg:max-h-[140px] lg:rounded-lg object-cover"
                />
                <div className="flex flex-col justify-between gap-3 px-4 lg:px-0">
                    <div className="flex flex-col lg:gap-2 gap-3 text-secondary ">
                        <div className="flex items-center gap-6">
                            <h3 className="text-xl font-light">
                                {appointment.property.title ||
                                    "The Property Title"}
                            </h3>
                        </div>
                        <p className="text-sm text-muted flex items-center gap-1 capitalize">
                            <span>
                                <GeoAltIcon className="w-5 h-5" />
                            </span>
                            {`${appointment.property.area}, ${appointment.property.city}` ||
                                "The Property Location"}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-5 h-5" />
                            <p className="text-muted">
                                {new Date(appointment.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <ClockIcon className="w-5 h-5" />
                            <p className="text-muted">
                                {new Date(appointment.date).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex px-4 lg:px-0 lg:flex-col flex-wrap gap-2 items-center lg:items-end justify-between lg:text-right">
                <div className="flex flex-col gap-1">
                    <p className="text-muted text-sm hidden lg:block">
                        Agent is not assigned
                    </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                    <div className="hidden lg:flex gap-4">
                        <Button variant="outline" onClick={handleCancelClick}>
                            Cancel
                        </Button>
                        <Button onClick={handleRescheduleClick}>
                            Reschedule
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:hidden p-4 gap-4 border-t mt-4">
                <Button variant="outline" onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button onClick={handleRescheduleClick}>Reschedule</Button>
            </div>
        </div>
    );
}
