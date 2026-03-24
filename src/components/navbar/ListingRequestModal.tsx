"use client";

import { SuccessIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/useToast";
import { useSubmitAgentRequestMutation } from "@/redux/reducers/request/agentRequestApi";
import { useGetMeQuery } from "@/redux/reducers/user/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/ResponsiveDialog";
import { Form } from "../ui/form";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
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
    address: z.string().min(1, { message: "Address is required" }),
    requestMessage: z.string().optional(),
});

export default function ListingRequestModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            requestMessage: "",
        },
    });

    const { data: meData } = useGetMeQuery();
    const [submitAgentRequest, { isLoading }] = useSubmitAgentRequestMutation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { success, error } = useToast();

    const handleRequestListing = async (
        formData: z.infer<typeof formSchema>
    ) => {
        try {
            // Combine firstName and lastName for fullName
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await submitAgentRequest({
                fullName: fullName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                requestMessage: formData.requestMessage || "",
                userId: meData?.user?.id,
            }).unwrap();
            
            success("Request submitted successfully! We'll get back to you soon.");
            setShowSuccess(true);
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Something went wrong. Please try again.";
            error(errorMsg);
            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={`rounded-2xl ${
                    showSuccess ? "lg:min-w-[300px]" : "sm:min-w-[630px]"
                }`}
            >
                <DialogHeader>
                    {!showSuccess && (
                        <DialogTitle className="text-xl text-left font-light flex flex-col gap-2">
                            Make a Request to Add Your Property
                            <p className="text-sm text-muted font-light">
                                  Provide a few details to get started, and our team will be in touch shortly.
                            </p>
                        </DialogTitle>
                    )}
                </DialogHeader>

                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
                        <SuccessIcon className="w-14 h-14 text-[#04DA8D]" />
                        <p className="text-2xl font-light">
                            Property listing request submitted successfully!
                        </p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleRequestListing)}
                        >
                            <div className="flex flex-col gap-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <ControlledInput
                                        control={form.control}
                                        name="firstName"
                                        label="First Name"
                                        placeHolder="Enter your first name"
                                    />
                                    <ControlledInput
                                        control={form.control}
                                        name="lastName"
                                        label="Last Name"
                                        placeHolder="Enter your last name"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <ControlledInput
                                        control={form.control}
                                        name="email"
                                        label="Email"
                                        placeHolder="Enter your email address"
                                    />
                                    <ControlledInput
                                        control={form.control}
                                        name="phone"
                                        label="Phone"
                                        placeHolder="Enter your phone number"
                                    />
                                </div>
                                <ControlledTextarea
                                    control={form.control}
                                    name="address"
                                    label="Address"
                                    placeHolder="Enter your full address"
                                    className="h-16"
                                />
                                <ControlledTextarea
                                    control={form.control}
                                    name="requestMessage"
                                    label={
                                        <p className="flex items-center gap-1">
                                            Message
                                            <span className="text-xs font-normal">
                                                (Optional)
                                            </span>
                                        </p>
                                    }
                                    placeHolder="Enter your message"
                                    className="h-28"
                                />
                            </div>

                            {errorMessage && (
                                <div className="text-red-500 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <DialogFooter className="flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-0 border border-primary text-primary bg-transparent hover:bg-primary hover:text-white font-normal rounded-md transition-colors duration-300 px-6 flex items-center gap-2"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Send Request
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
