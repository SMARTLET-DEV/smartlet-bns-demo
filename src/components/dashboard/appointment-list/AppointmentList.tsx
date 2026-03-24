"use client";

import { useGetAllAppointmentsQuery } from "@/redux/reducers/appointments/appointmentsApi";
import SingleAppointment from "./SingleAppointment";

const AppointmentList = () => {
    const { data, isLoading } = useGetAllAppointmentsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-5">
            {data?.viewingAppointments.map((appointment: any) => (
                <SingleAppointment
                    key={appointment.id}
                    appointment={appointment}
                />
            ))}
            {!data?.viewingAppointments ||
                (data?.viewingAppointments.length < 1 && (
                    <p className="text-center text-xl text-muted">
                        You have no appointments scheduled.
                    </p>
                ))}
        </div>
    );
};

export default AppointmentList;
