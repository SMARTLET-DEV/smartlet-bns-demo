"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import {
    ContactFormSchema,
    contactSchema,
} from "@/lib/validations/contactSchema";
import { useAppDispatch } from "@/redux/hook";
import { useSubmitContactRequestMutation } from "@/redux/reducers/contact/contactApi";
import {
    setSubmittedFormData,
    setSuccessDialogOpen,
} from "@/redux/reducers/contact/contactSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";
import { Form } from "../ui/form";
import SuccessDialog from "./SuccessDialog";

export default function ContactSection() {
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

    const { handleSubmit, reset } = form;

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
            console.error("Contact form submission failed:", err);
        }
    };

    return (
        <section className="w-full py-10 bg-white">
            <div className="container mx-auto px-5 flex flex-col items-center sm:mt-8">
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-[#f9f9f9] rounded-2xl p-4 sm:p-10 space-y-6 max-w-[820px] w-full"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-8">
                            Send Us a Message
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <ControlledInput
                                    name="firstName"
                                    label="First Name"
                                    placeholder="Enter your first name"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>
                            <div>
                                <ControlledInput
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Enter your last name"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <ControlledInput
                                    name="email"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    control={form.control}
                                    className="bg-white"
                                    type="email"
                                />
                            </div>

                            <div>
                                <ControlledInput
                                    name="phone"
                                    label="Phone"
                                    placeholder="Enter your phone number"
                                    control={form.control}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <ControlledTextarea
                                name="requestMessage"
                                label="Message"
                                placeholder="Enter your message"
                                control={form.control}
                                className="min-h-[120px] bg-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="default"
                                className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-8 sm:py-5 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <SuccessDialog />
        </section>
    );
}
