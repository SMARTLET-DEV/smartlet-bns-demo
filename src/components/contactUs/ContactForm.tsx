"use client";

import { Button } from "@/components/ui/button";
import { useSubmitContactRequestMutation } from "@/redux/reducers/contact/contactApi";
import SuccessDialog from "./SuccessDialog";

import { useToast } from "@/hooks/useToast";
import {
    ContactFormSchema,
    contactSchema,
} from "@/lib/validations/contactSchema";
import { useAppDispatch } from "@/redux/hook";
import {
    setSubmittedFormData,
    setSuccessDialogOpen,
} from "@/redux/reducers/contact/contactSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Loader2 } from "lucide-react";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";
import { Form } from "../ui/form";

type ContactFormProps = {
    title?: string;
    description?: string;
    from?: string;
};

export function ContactForm({
    title,
    description,
    from = "default",
}: ContactFormProps) {
    const [submitContactRequest, { isLoading }] =
        useSubmitContactRequestMutation();
    const { success, error } = useToast();
    const dispatch = useAppDispatch();

    const form = useForm<ContactFormSchema>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            requestMessage: "",
        },
        resolver: zodResolver(contactSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const onSubmit = async (data: ContactFormSchema) => {
        try {
            await submitContactRequest(data).unwrap();
            success("Message sent successfully! We'll get back to you soon.");
            dispatch(setSubmittedFormData(data));
            dispatch(setSuccessDialogOpen(true));
            reset();
        } catch (err: any) {
            error(
                err?.data?.message ||
                    "Failed to send message. Please try again."
            );
            console.error("Contact form submission error:", err);
        }
    };

    return (
        <section className={`w-full bg-white pb-10`}>
            <div className="container mx-auto px-5 bg-white rounded-xl">
                <div
                    className={`w-full px-2 sm:px-10 lg:px-60 py-10 sm:py-16 space-y-10 `}
                >
                    {/* Form Section */}
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-full p-4 sm:p-6 rounded-lg grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 bg-[#f9f9f9]"
                        >
                            <div className="col-span-1 md:col-span-2 text-center">
                                {title && (
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-6">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-lg text-[#191919] font-light max-w-2xl mx-auto">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <div className="w-full">
                                <ControlledInput
                                    name="firstName"
                                    label="First Name"
                                    placeholder="Enter your first name"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>

                            <div className="w-full">
                                <ControlledInput
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Enter your last name"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>

                            <div className="w-full">
                                <ControlledInput
                                    name="email"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    control={form.control}
                                    className="bg-white"
                                    type="email"
                                />
                            </div>

                            <div className="w-full">
                                <ControlledInput
                                    name="phone"
                                    label="Phone"
                                    placeholder="Enter your phone number"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 w-full">
                                <ControlledTextarea
                                    name="requestMessage"
                                    label="Message"
                                    placeholder="Enter your message"
                                    control={form.control}
                                    className="bg-white h-40"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 w-full">
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="w-auto border-primary text-primary hover:bg-primary hover:text-white duration-300"
                                        variant="outline"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <SuccessDialog />
        </section>
    );
}
