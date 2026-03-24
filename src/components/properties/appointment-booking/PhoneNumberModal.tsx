"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form schema for phone number validation
const phoneNumberSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\d{11,}$/, "Phone number must be at least 11 digits and contain only numbers"),
});

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

interface PhoneNumberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContinue: (phoneNumber: string) => void;
}

export default function PhoneNumberModal({
    open,
    onOpenChange,
    onContinue,
}: PhoneNumberModalProps) {
    const form = useForm<PhoneNumberFormValues>({
        resolver: zodResolver(phoneNumberSchema),
        defaultValues: {
            phoneNumber: "",
        },
    });

    const handleSubmit = (data: PhoneNumberFormValues) => {
        onContinue(data.phoneNumber);
        form.reset();
    };

    const handleCancel = () => {
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-normal pb-3 border-b border-card">
                        <Phone className="w-5 h-5" />
                        Please provide your phone number to book an appointment.
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your phone number"
                                            {...field}
                                            type="tel"
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="grid grid-cols-2 gap-3 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCancel}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition cursor-pointer"
                                disabled={!form.formState.isValid || !form.watch("phoneNumber")}
                            >
                                Continue
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}