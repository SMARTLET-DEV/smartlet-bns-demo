import { z } from "zod";

export const addPropertyFormSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: "First name is required" }),
    lastName: z
        .string()
        .min(1, { message: "Last name is required" }),
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    mobile: z
        .string()
        .min(1, { message: "Mobile number is required" }),
    address: z
        .string()
        .min(1, { message: "Address is required" }),
    additionalMessage: z
        .string()
        .optional()
});

export type AddPropertyFormSchema = z.infer<typeof addPropertyFormSchema>;
