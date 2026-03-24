"use client";

import { CalendarBookingIcon } from "@/assets/icons";
import AppointmentBookingCalendar from "@/components/properties/appointment-booking/AppointmentBookingCalendar";
import TimeSlot from "@/components/properties/appointment-booking/TimeSlot";
import {
    changeRescheduleModalOpen,
    setPropertyId,
} from "@/redux/reducers/appointments/appointmentSlice";

import { useRescheduleAppointmentBookingMutation } from "@/redux/reducers/appointments/appointmentsApi";
import { setAppointmentBookingSuccess } from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { Button } from "../../ui/button";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import { Form } from "../../ui/form";

// Form schema for the form fields
const formSchema = z.object({
    date: z.string().refine((date) => {
        try {
            const d = new Date(date);
            return !isNaN(d.getTime()) && d.toISOString() === date;
        } catch {
            return false;
        }
    }, "Please select a valid date in ISO format"),
    time: z.string(),
});

// Zod schema for the final API request
const appointmentBookingSchema = z.object({
    date: z.string().datetime("Invalid ISO date format"),
    status: z.literal("SCHEDULED"),
    property: z.object({
        connect: z.object({
            id: z.string().uuid("Invalid property ID format"),
        }),
    }),
});

// Type inference from the schemas
type FormValues = z.infer<typeof formSchema>;
type AppointmentBookingRequest = z.infer<typeof appointmentBookingSchema>;

export default function AppointmentReschedule() {
    const form = useForm<FormValues>({
        defaultValues: {
            date: new Date().toISOString(),
            time: new Date().toISOString(),
        },
        resolver: zodResolver(formSchema),
    });
    const propertyId = useSelector(
        (state: RootState) => state.appointment.propertyId
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const [disabledDates, setDisabledDates] = useState<Date[]>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const dispatch = useDispatch();
    const rescheduleModalOpen = useSelector(
        (state: RootState) => state.appointment.rescheduleModalOpen
    );

    const allAppointments = useSelector(
        (state: RootState) => state.appointment.appointments
    );
    const [rescheduleAppointment, { isLoading }] =
        useRescheduleAppointmentBookingMutation();

    useEffect(() => {
        setSelectedDate(new Date(form.watch("date")));
    }, [form.watch("date")]);

    // Filter appointments for the selected date and get their time slots
    const unavailableTimeSlots = React.useMemo(() => {
        if (!selectedDate || !allAppointments) return [];

        // Get the start and end of the selected date in local timezone
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        return allAppointments
            .filter((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return (
                    appointmentDate >= startOfDay && appointmentDate <= endOfDay
                );
            })
            .map((appointment) => new Date(appointment.date).toISOString());
    }, [selectedDate, allAppointments]);

    async function onSubmit(formData: FormValues) {
        console.log("formData: ", formData);
        if (formData.date && formData.time) {
            try {
                const isoString = generateDateTime(
                    formData.date,
                    formData.time
                );

                const appointmentId = allAppointments?.find(
                    (appointment) => appointment.renterId === user?.id
                )?.id;

                if (!appointmentId) return;

                const { data } = await rescheduleAppointment({
                    appointmentId: appointmentId,
                    date: isoString,
                });
                // console.log("rescheduleAppointment: ", data);
                if (data.success) {
                    dispatch(changeRescheduleModalOpen(false));
                    dispatch(setAppointmentBookingSuccess(true));
                    dispatch(setPropertyId(""));
                    form.reset();
                }
            } catch (error) {
                console.error("Failed to create appointment:", error);
            }
        }
    }

    return (
        <Dialog
            open={rescheduleModalOpen}
            onOpenChange={(state) => {
                dispatch(changeRescheduleModalOpen(state));
                dispatch(setPropertyId(""));
                form.reset();
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-normal pb-3 border-b border-card">
                        <CalendarBookingIcon className="w-6 h-6" />
                        Appointment Reschedule
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col items-center gap-5"
                    >
                        <AppointmentBookingCalendar
                            name="date"
                            control={form.control}
                            disabledDates={disabledDates || []}
                        />
                        <TimeSlot
                            control={form.control}
                            name="time"
                            unavailableSlots={unavailableTimeSlots}
                        />
                        <DialogFooter className="grid grid-cols-2 gap-5 w-full mt-5">
                            <Button
                                onClick={() => {
                                    dispatch(changeRescheduleModalOpen(false));
                                    dispatch(setPropertyId(""));
                                    form.reset();
                                }}
                                className="cursor-pointer"
                                variant="ghost"
                                type="button"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#CBC3E3] text-white border border-primary hover:bg-primary font-normal rounded-lg transition cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Reschedule Appointment"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function generateDateTime(date: string, time: string) {
    const selectedDate = new Date(date);

    // Extract hours and minutes from the time string (format: "HH:mm")
    const [hours, minutes] = time.split(":").map(Number);

    // Set the hours and minutes to the selected date
    selectedDate.setHours(hours, minutes, 0, 0);

    // Convert to ISO string
    const isoString = selectedDate.toISOString();
    return isoString;
}
