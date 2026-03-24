"use client";

import { useToast } from "@/hooks/useToast";
import { useSubmitSmartmoveRequestMutation } from "@/redux/reducers/smartmove/smartmoveApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormItem, FormLabel } from "../ui/form";

const formSchema = z.object({
    name: z.string().min(1, "Full name is required"),
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
    destination: z.string().min(1, "Destination is required"),
    notes: z.string().optional(),
});

const RequestSmartmoveSection = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            destination: "",
            notes: "",
        },
    });

    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const { success } = useToast();
    const [submitSmartmoveRequest, { isLoading }] = useSubmitSmartmoveRequestMutation();

    const handleRequestSmartmove = async (
        formData: z.infer<typeof formSchema>
    ) => {
        try {
            const apiPayload = {
                name: formData.name,
                email: formData.email,
                phone: `+88${formData.phone}`,
                address: formData.address,
                currentAddress: formData.address,
                destinationAddress: formData.destination,
                additionalNotes: formData.notes || "",
            };

            await submitSmartmoveRequest(apiPayload).unwrap();
            success("Smartmove request submitted successfully");
            form.reset();
        } catch (error) {
            console.error('Error submitting smartmove request:', error);
            success("Failed to submit request. Please try again.");
        }
    };

    return (
        <div className="lg:py-20 py-10 mt-5" id="request-smartmove-form">
            <div className="container mx-auto px-5 flex flex-col items-center">
                <Form {...form}>
                    <form
                        className="bg-[#f9f9f9] rounded-2xl p-4 sm:p-10 space-y-6 max-w-[820px] w-full"
                        onSubmit={form.handleSubmit(handleRequestSmartmove)}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-8">
                            Request smartMOVE
                        </h2>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <ControlledInput
                                control={form.control}
                                name="name"
                                label="Full Name"
                                placeHolder="Enter your full name"
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
                            <ControlledInput
                                control={form.control}
                                name="address"
                                label="Current Address"
                                placeHolder="Enter your current address"
                                className="bg-white"
                            />
                            <ControlledInput
                                control={form.control}
                                name="destination"
                                label="Destination"
                                placeHolder="Enter your destination"
                                className="bg-white"
                            />
                            <div className="lg:col-span-2 flex flex-col">
                                <ControlledTextarea
                                    control={form.control}
                                    name="notes"
                                    label="Any Additional Notes (Optional)"
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
                                        <FormLabel className="cursor-pointer leading-none text-base">
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

export default RequestSmartmoveSection;
