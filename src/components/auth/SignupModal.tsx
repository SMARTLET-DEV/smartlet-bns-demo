import { changeSignupModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/ResponsiveDialog";
import SignupInformtionForm from "./SignupInformtionForm";
import SignupRoleInformationForm from "./SignupRoleInformationForm";

export enum ROLES {
    OWNER = "OWNER",
    RENTER = "RENTER",
}

export const signupSchema = z
    .object({
        firstName: z.string().min(1, { message: "First name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
        email: z
            .string()
            .min(1, "Email is required")
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
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                {
                    message:
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                }
            ),
        confirmPassword: z.string().min(1, {
            message: "Confirm password is required",
        }),
        role: z
            .string()
            .refine((val) => Object.values(ROLES).includes(val as ROLES), {
                message: "Please select a valid role",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords should match!",
        path: ["confirmPassword"],
    });

export default function SignupModal() {
    const form = useForm<z.infer<typeof signupSchema>>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
        resolver: zodResolver(signupSchema),
    });
    const dispatch = useDispatch();
    const isSignupModalOpen = useSelector(
        (state: RootState) => state.authModals.signupModalOpen
    );

    const role = form.watch("role");

    useEffect(() => {
        console.log(role);
    }, [role]);

    return (
        <Dialog
            open={isSignupModalOpen}
            onOpenChange={(state) => {
                dispatch(changeSignupModalOpen(state));
                form.reset();
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[685px] [&>*]:text-secondary">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-light">
                        Signup
                    </DialogTitle>
                    <DialogDescription className="text-muted font-medium pb-3">
                        {form.watch("role") === ROLES.OWNER ||
                        form.watch("role") === ROLES.RENTER
                            ? "Fill in the details below to continue."
                            : "Welcome to OPENDOOR. Create your account."}
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    {form.watch("role") === ROLES.OWNER ||
                    form.watch("role") === ROLES.RENTER ? (
                            <SignupInformtionForm />
                        ) : (
                            <SignupRoleInformationForm />
                        )}
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
