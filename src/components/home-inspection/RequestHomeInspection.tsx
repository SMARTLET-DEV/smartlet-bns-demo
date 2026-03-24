"use client";

import { useToast } from "@/hooks/useToast";
import { useSubmitHomeInspectionRequestMutation } from "@/redux/reducers/home-inspection/homeInspectionApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledSelect } from "../common/ControlledSelect";
import { ControlledTextarea } from "../common/ControlledTextarea";
import AppointmentBookingCalendar from "../properties/appointment-booking/AppointmentBookingCalendar";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Form, FormControl, FormItem, FormLabel } from "../ui/form";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .refine(
            (val) => {
                return /^\d+$/.test(val);
            },
            {
                message:
                    "Phone number should only contain digits, no spaces or special characters",
            }
        )
        .refine((val) => val.startsWith("01"), {
            message: "Phone number must start with 01",
        })
        .refine(
            (val) => {
                const bangladeshPhoneRegex = /^01[2-9]\d{8}$/;
                return bangladeshPhoneRegex.test(val);
            },
            {
                message: "Phone number must contain only 11 digits",
            }
        ),
    address: z.string().min(1, "Current address is required"),
    notes: z.string().optional(),
    preferredDate: z.string().refine((date) => {
        try {
            const d = new Date(date);
            return !isNaN(d.getTime()) && d.toISOString() === date;
        } catch {
            return false;
        }
    }, "Please select a valid date in ISO format"),
    timeSlot: z.string().min(1, "Time slot is required"),
});

const timeSlots = [
    { label: "10:00 AM", value: "10:00 AM" },
    { label: "11:00 AM", value: "11:00 AM" },
    { label: "12:00 PM", value: "12:00 PM" },
    { label: "1:00 PM", value: "1:00 PM" },
    { label: "2:00 PM", value: "2:00 PM" },
];

const RequestHomeInspectionSection = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            notes: "",
            preferredDate: "",
            timeSlot: "",
        },
    });

    const timeSlot = useWatch({
        control: form.control,
        name: "timeSlot",
    });

    console.log(timeSlot);

    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const { success } = useToast();
    const [submitHomeInspectionRequest, { isLoading }] = useSubmitHomeInspectionRequestMutation();

    const handleRequestHomeInspection = async (
        formData: z.infer<typeof formSchema>
    ) => {
        try {
            // Combine preferredDate and timeSlot into ISO format
            const preferredDateTime = new Date(formData.preferredDate);
            const [time, period] = formData.timeSlot.split(' ');
            const [hours, minutes] = time.split(':');
            let hour24 = parseInt(hours);
            
            if (period === 'PM' && hour24 !== 12) {
                hour24 += 12;
            } else if (period === 'AM' && hour24 === 12) {
                hour24 = 0;
            }
            
            preferredDateTime.setHours(hour24, parseInt(minutes), 0, 0);

            // Combine firstName and lastName for fullName
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            const apiPayload = {
                fullName: fullName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: `+88${formData.phone}`,
                address: formData.address,
                preferredMoveinMonthandTime: preferredDateTime.toISOString(),
                additionalNotes: formData.notes || "",
            };

            await submitHomeInspectionRequest(apiPayload).unwrap();
            success("Home inspection request submitted successfully");
            form.reset();
        } catch (error) {
            console.error('Error submitting home inspection request:', error);
            success("Failed to submit home inspection request. Please try again.");
        }
    };

    return (
        <div className="lg:py-20 py-10 mt-5" id="request-home-inspection-form">
            <div className="container mx-auto px-5 flex flex-col items-center">
                <Form {...form}>
                    <form
                        className="bg-[#f9f9f9] rounded-2xl p-4 sm:p-10 space-y-6 max-w-[820px] w-full"
                        onSubmit={form.handleSubmit(
                            handleRequestHomeInspection
                        )}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10">
                            Request Home Inspection
                        </h2>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <ControlledInput
                                control={form.control}
                                name="firstName"
                                label="First Name"
                                placeHolder="Enter your first name"
                                className="bg-white"
                            />
                            <ControlledInput
                                control={form.control}
                                name="lastName"
                                label="Last Name"
                                placeHolder="Enter your last name"
                                className="bg-white"
                            />
                            <ControlledInput
                                control={form.control}
                                name="email"
                                label="Email"
                                placeHolder="Enter your email address"
                                className="bg-white"
                            />
                            <ControlledInput
                                control={form.control}
                                name="phone"
                                label="Phone"
                                placeHolder="Enter your phone number"
                                className="bg-white"
                            />
                            <div className="lg:col-span-2">
                                <ControlledInput
                                    control={form.control}
                                    name="address"
                                    label="Property Address"
                                    placeHolder="Enter your property address"
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-normal">
                                    Preferred Date
                                </p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <p className="w-full text-left py-3 px-4 border text-base md:text-sm rounded-md cursor-pointer bg-white">
                                            {form.watch("preferredDate")
                                                ? new Date(
                                                      form.watch(
                                                          "preferredDate"
                                                      )
                                                  ).toLocaleDateString(
                                                      "en-UK",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Select a date"}
                                        </p>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-96">
                                        <div className="p-5">
                                            <AppointmentBookingCalendar
                                                control={form.control}
                                                name="preferredDate"
                                                disabledDates={[]}
                                                calendarMaxWidth="w-full"
                                            />
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <ControlledSelect
                                control={form.control}
                                name="timeSlot"
                                label="Time Slot"
                                options={timeSlots}
                                className="bg-white"
                                placeHolder="Select a time slot"
                            />
                            <div className="lg:col-span-2 flex flex-col">
                                <ControlledTextarea
                                    control={form.control}
                                    name="notes"
                                    label="Additional Notes (Optional)"
                                    placeHolder="Any specific areas of concern or additional information"
                                    className="bg-white lg:col-span-2"
                                    rows={6}
                                />
                                <div className="flex items-center mt-4 cursor-pointer w-fit">
                                    <FormItem className="flex flex-row items-center space-x-1">
                                        <FormControl>
                                            <Checkbox
                                                checked={isTermsAccepted}
                                                onCheckedChange={(checked) =>
                                                    setIsTermsAccepted(
                                                        checked ===
                                                            "indeterminate"
                                                            ? false
                                                            : checked
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer leading-none text-base font-normal">
                                            I accept the{" "}
                                            <Link
                                                href="/terms-and-conditions"
                                                target="_blank"
                                                className="text-primary w-fit hover:underline"
                                            >
                                                Terms & Conditions
                                            </Link>
                                        </FormLabel>
                                    </FormItem>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-fit border-primary text-primary hover:bg-primary hover:text-white duration-200 font-normal bg-transparent self-end mt-5"
                                    size="lg"
                                    disabled={!isTermsAccepted || isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default RequestHomeInspectionSection;
