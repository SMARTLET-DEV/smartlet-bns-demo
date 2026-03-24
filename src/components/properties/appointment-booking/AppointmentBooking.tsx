"use client";

import { CalendarBookingIcon } from "@/assets/icons";
import {
    useCreateAppointmentBookingMutation,
    useGetAllAppointmentBookingQuery,
} from "@/redux/reducers/property/propertyApi";
import {
    setAppointmentBooking,
    setAppointmentBookingSuccess,
    setPhoneNumberModal,
    setPhoneNumber,
    resetAppointmentFlow,
} from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { Button } from "../../ui/button";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import { Form } from "../../ui/form";
import AppointmentBookingCalendar from "./AppointmentBookingCalendar";
import TimeSlot from "./TimeSlot";
import PhoneNumberModal from "./PhoneNumberModal";

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
    contactNo: z.string().optional(),
    property: z.object({
        connect: z.object({
            id: z.string().uuid("Invalid property ID format"),
        }),
    }),
});

// Type inference from the schemas
type FormValues = z.infer<typeof formSchema>;
type AppointmentBookingRequest = z.infer<typeof appointmentBookingSchema>;

export default function AppointmentBooking() {
    const user = useSelector((state: RootState) => state.auth.user);
    const form = useForm<FormValues>({
        defaultValues: {
            date: new Date().toISOString(),
            time: new Date().toISOString(),
        },
        resolver: zodResolver(formSchema),
    });
    const { id } = useParams();
    const propertyId = id as string;

    const { data: allAppointments } = useGetAllAppointmentBookingQuery(
        propertyId,
        { skip: !user }
    );

    const [createAppointment, { isLoading }] =
        useCreateAppointmentBookingMutation();
    const { success, error } = useToast();
    const [disabledDates, setDisabledDates] = useState<Date[]>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const dispatch = useDispatch();
    const { appointmentBooking, phoneNumberModal, phoneNumber } = useSelector(
        (state: RootState) => state.property.propertyModal
    );

    // Get the selected date from the form
    const selectedDate = form.watch("date");

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

    // Function to play click sound
    const playClickSound = () => {
        try {
            const audio = new Audio('/sound-effect/mouse-click-sound.mp3');
            audio.volume = 0.5; // Set volume to 50%
            audio.play().catch(console.error);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    // Handle phone number modal continue
    const handlePhoneNumberContinue = (enteredPhoneNumber: string) => {
        dispatch(setPhoneNumber(enteredPhoneNumber));
    };

    // Handle appointment booking modal open
    const handleAppointmentBookingOpen = () => {
        if (!phoneNumber) {
            dispatch(setPhoneNumberModal(true));
        }
        // If phoneNumber exists, the modal is already open via appointmentBooking state
    };

    async function onSubmit(formData: FormValues) {
        // Clear any previous error messages
        setErrorMessage("");

        if (formData.date && formData.time) {
            try {
                // Play click sound when request viewing button is pressed
                playClickSound();

                if (!propertyId) {
                    const errorMsg = "Property ID is missing";
                    setErrorMessage(errorMsg);
                    error(errorMsg);
                    return;
                }

                const isoString = generateDateTime(
                    formData.date,
                    formData.time
                );

                // Create the final request object
                const requestData: AppointmentBookingRequest = {
                    date: isoString,
                    status: "SCHEDULED",
                    contactNo: phoneNumber,
                    property: {
                        connect: {
                            id: propertyId,
                        },
                    },
                };

                await createAppointment(requestData).unwrap();
                success("Appointment booked successfully!");
                dispatch(setAppointmentBookingSuccess(true));
                setErrorMessage(""); // Clear error on success
            } catch (err: any) {
                // Backend returns error in nested structure: { data: { message: "..." } }
                // Try multiple paths to extract the error message
                let errorMsg =
                    err?.data?.data?.message || // Nested structure
                    err?.data?.message ||        // Direct structure
                    err?.message ||              // Error object message
                    "Failed to book appointment. Please try again.";

                // Clean up "Error in service: " prefix if present
                if (typeof errorMsg === 'string' && errorMsg.startsWith('Error in service: ')) {
                    errorMsg = errorMsg.replace('Error in service: ', '');
                }

                setErrorMessage(errorMsg);
                error(errorMsg);
                console.error("Failed to create appointment:", err);
            }
        }
    }

    return (
        <>
            <PhoneNumberModal
                open={phoneNumberModal}
                onOpenChange={(open) => {
                    dispatch(setPhoneNumberModal(open));
                }}
                onContinue={handlePhoneNumberContinue}
            />
            <Dialog
                open={appointmentBooking && !phoneNumberModal && phoneNumber !== ""}
                onOpenChange={(state) => {
                    if (!state) {
                        dispatch(resetAppointmentFlow());
                        form.reset();
                        setErrorMessage(""); // Clear error message when closing
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-normal pb-3 border-b border-card">
                            <CalendarBookingIcon className="w-6 h-6" />
                            Appointment Booking
                        </DialogTitle>
                    </DialogHeader>

                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    )}

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
                                        dispatch(resetAppointmentFlow());
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
                                        "Request Viewing"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
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
