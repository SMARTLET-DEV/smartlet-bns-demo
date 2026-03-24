import { z } from "zod";

export const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
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
    requestMessage: z.string().min(1, "Message is required"),
});

export type ContactFormSchema = z.infer<typeof contactSchema>;
