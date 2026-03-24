"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/ResponsiveDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    useApplyJobMutation,
    JobPost,
} from "@/redux/reducers/career/careerApi";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ControlledInput } from "@/components/common/ControlledInput";
import { ControlledTextarea } from "@/components/common/ControlledTextarea";

// Schema
const formSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    coverLetter: z.string().optional(),
});

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost;
}

export function JobApplicationModal({
    isOpen,
    onClose,
    job,
}: JobApplicationModalProps) {
    const [applyJob, { isLoading, isSuccess, isError }] = useApplyJobMutation();
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSuccessState, setIsSuccessState] = useState(false);
    const [cvError, setCvError] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            coverLetter: "",
        },
    });

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            form.reset();
            setCvFile(null);
            setIsSuccessState(false);
            setCvError("");
        }
    }, [isOpen, form]);

    useEffect(() => {
        if (isSuccess) {
            setIsSuccessState(true);
        }
    }, [isSuccess]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setCvError("");

        if (file) {
            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                setCvError("File size must be less than 10MB");
                e.target.value = "";
                setCvFile(null);
                return;
            }

            // Validate file type
            const validTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!validTypes.includes(file.type)) {
                setCvError("Please upload a PDF, DOC, or DOCX file");
                e.target.value = "";
                setCvFile(null);
                return;
            }

            setCvFile(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!cvFile) {
            setCvError("CV is required");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", job.id);
        // Combine firstName and lastName for fullName
        const fullName = `${values.firstName} ${values.lastName}`.trim();
        formData.append("fullName", fullName);
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);

        if (values.coverLetter) {
            formData.append("coverLetter", values.coverLetter);
        }

        formData.append("cv", cvFile);

        try {
            await applyJob(formData).unwrap();
        } catch (err: any) {
            console.error("Failed to apply:", err);
            // Show backend error message if available
            if (err?.data?.message) {
                setCvError(err.data.message);
            } else if (err?.data?.error) {
                setCvError(err.data.error);
            } else if (err?.data?.data?.errors) {
                // Handle validation errors array
                const errorMessages = err.data.data.errors
                    .map((error: any) => `${error.path}: ${error.msg}`)
                    .join(", ");
                setCvError(errorMessages);
            } else {
                setCvError("Failed to submit application. Please try again.");
            }
        }
    };

    if (isSuccessState) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent hideCloseButton className="sm:max-w-md">
                    <div className="flex flex-col items-center text-center p-6 space-y-4">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">
              ✓
                        </div>
                        <DialogTitle className="text-2xl font-light">
              Application Submitted
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600">
              Your application has been submitted successfully.
                            <br />
              Our team will review it and contact you if there&apos;s a match.
                        </DialogDescription>
                        <Button onClick={onClose} className="mt-4 min-w-[120px]">
              Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-l sm:text-xl font-light">Apply for {job.title}</DialogTitle>
                    {/* <DialogDescription>{job.team}</DialogDescription> */}
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 mt-4"
                    >
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
                                type="email"
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
                                <FormItem>
                                    <FormLabel className="text-base font-normal mb-2">
                    Upload CV
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                        />
                                    </FormControl>
                                    {cvFile && (
                                        <p className="text-sm text-green-600 mt-1">
                      Selected: {cvFile.name}
                                        </p>
                                    )}
                                    {cvError && (
                                        <p className="text-sm font-medium text-destructive mt-1">
                                            {cvError}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC, DOCX. Max 10MB
                                    </p>
                                </FormItem>
                            </div>
                            <div className="lg:col-span-2 flex flex-col">
                                <ControlledTextarea
                                    control={form.control}
                                    name="coverLetter"
                                    label="Cover Letter"
                                    placeHolder="Write a short message about yourself. Feel free to add links to showcase your work."
                                    className="bg-white"
                                    rows={6}
                                />
                                {/* <p className="text-sm text-muted-foreground mt-1">
                  Feel free to add links to showcase your work
                </p> */}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 pb-2 flex justify-end">
                            <div className="w-auto sm:w-auto">
                                <Button
                                    type="submit"
                                    className="min-w-[170px] border-primary text-white hover:bg-primary hover:text-white/80 transition duration-300 font-normal"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                                </Button>

                                {isError && (
                                    <p className="text-destructive text-sm text-right mt-2">
                    Something went wrong. Please try again later.
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
