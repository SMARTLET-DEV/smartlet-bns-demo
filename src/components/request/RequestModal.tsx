"use client";

import { SuccessIcon } from "@/assets/icons";

import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/useToast";
import { useSubmitRequestMutation } from "@/redux/reducers/request/requestApi";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/ResponsiveDialog";
import { Form } from "../ui/form";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
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
    requestMessage: z.string().min(1, { message: "Message is required" }),
});

export default function RequestModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [showSuccess, setShowSuccess] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const [submitRequest, { isLoading, isSuccess }] =
        useSubmitRequestMutation();
    const { success, error } = useToast();

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            requestMessage: "",
        },
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        setShowSuccess(false);
        if (user) {
            // Split user.name into firstName and lastName if available
            const nameParts = user.name ? user.name.split(" ") : ["", ""];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            form.reset({
                firstName: firstName,
                lastName: lastName,
                email: user.email || "",
                phone: user.phone || "",
                requestMessage: "",
            });
        }
    }, [user]);

    const handleSubmitMessage = async (
        formData: z.infer<typeof formSchema>
    ) => {
        try {
            // Combine firstName and lastName for fullName
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            const data = await submitRequest({
                fullName: fullName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                requestMessage: formData.requestMessage,
            }).unwrap();
            console.log(data);
            success("Request submitted successfully! We'll get back to you soon.");
            setShowSuccess(true);
        } catch (err: any) {
            error(err?.data?.message || "Failed to submit request. Please try again.");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    setShowSuccess(false);
                }
                onClose();
            }}
        >
            <DialogContent
                className={`rounded-2xl ${
                    showSuccess ? "lg:min-w-[300px]" : "sm:min-w-[630px]"
                }`}
            >
                <DialogHeader>
                    {!showSuccess && (
                        <DialogTitle className="text-xl text-left font-light flex flex-col gap-2">
                            Make a Request
                            <p className="text-sm text-muted font-light">
                                  Provide a few details, and our team will get in touch with tailored recommendations.
                            </p>
                        </DialogTitle>
                    )}
                </DialogHeader>

                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
                        <SuccessIcon className="w-14 h-14 text-[#04DA8D]" />
                        <p className="text-2xl font-extrabold">
                            Request submitted successfully!
                        </p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmitMessage)}>
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <ControlledInput
                                        control={form.control}
                                        name="firstName"
                                        label="First Name"
                                        placeholder="Enter your first name"
                                    />
                                    <ControlledInput
                                        control={form.control}
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <ControlledInput
                                        control={form.control}
                                        name="email"
                                        label="Email"
                                        placeholder="Enter your email address"
                                        type="email"
                                    />

                                    <ControlledInput
                                        control={form.control}
                                        name="phone"
                                        label="Phone"
                                        placeholder="Enter your phone number"
                                        type="tel"
                                    />
                                    </div>
                                <ControlledTextarea
                                    control={form.control}
                                    name="requestMessage"
                                    label="Message"
                                    placeHolder="Tell us your requirements, such as preferred area, apartment size, rent etc."
                                    className="h-28"
                                />
                            </div>

                            <div className="flex justify-end mt-5">
                                <Button
                                    className="mt-2 px-6 border border-primary text-primary bg-transparent hover:bg-primary hover:text-white font-normal rounded-md transition-colors duration-300 flex items-center gap-2"
                                    type="submit"
                                    disabled={isLoading}
                                    >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
