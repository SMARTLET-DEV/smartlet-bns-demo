// Google SVG logo
const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <g clipPath="url(#clip0_17_40)">
            <path d="M19.805 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.48c-.24 1.28-1.01 2.36-2.16 3.09v2.57h3.49c2.04-1.88 3.21-4.66 3.21-7.45z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.97-.89 6.63-2.41l-3.49-2.57c-.97.65-2.21 1.04-3.14 1.04-2.41 0-4.45-1.63-5.18-3.82H1.18v2.61C2.92 17.98 6.22 20 10 20z" fill="#34A853"/>
            <path d="M4.82 12.24c-.22-.65-.35-1.34-.35-2.04s.13-1.39.35-2.04V5.55H1.18A9.98 9.98 0 0 0 0 10c0 1.61.39 3.13 1.18 4.45l3.64-2.21z" fill="#FBBC05"/>
            <path d="M10 3.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87C14.97 1.13 12.7 0 10 0 6.22 0 2.92 2.02 1.18 5.55l3.64 2.61C5.55 5.59 7.59 3.96 10 3.96z" fill="#EA4335"/>
        </g>
        <defs>
            <clipPath id="clip0_17_40">
                <rect width="20" height="20" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);
import {
    useLoginMutation,
    useSignupMutation,
    useGoogleAuthMutation,
} from "@/redux/reducers/auth/authApi";
import {
    changeLoginModalOpen,
    changeSignupModalOpen,
} from "@/redux/reducers/authModals/authModalsSlice";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledPasswordInput } from "../common/ControlledPassword-input";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import { signupSchema, ROLES } from "./SignupModal";


type SignupFormData = z.infer<typeof signupSchema>;

const SignupInformtionForm = () => {
    const dispatch = useDispatch();
    const form = useFormContext<SignupFormData>();

    const handleSignup = async (formData: SignupFormData) => {
        try {
            let signUpData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
            };
            const result = await signup(signUpData).unwrap();
            success("Account created successfully!");
            
            try {
                await login({
                    email: formData.email,
                    password: formData.password,
                }).unwrap();
                success("Logged in successfully");
                dispatch(changeSignupModalOpen(false));
            } catch (loginError) {
                showError("Account created but login failed. Please try logging in manually.");
                dispatch(changeSignupModalOpen(false));
                dispatch(changeLoginModalOpen(true));
            }
        } catch (signupError: any) {
            // Handle specific error cases
            if (signupError?.status === 409) {
                showError("An account with this email already exists. Please log in instead.");
                // Optionally switch to login modal
                // dispatch(changeSignupModalOpen(false));
                // dispatch(changeLoginModalOpen(true));
            } else {
                showError(signupError?.data?.message || "Failed to create account. Please try again.");
            }
        }
    };

    const [signup, { isLoading, error }] = useSignupMutation();
    const [login, { isLoading: isLoginLoading, error: loginError }] =
        useLoginMutation();
    const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
    const { success, error: showError } = useToast();


    const handleGoogleSignup = () => {
        // Direct redirect to Auth0 authorization endpoint for Google signup
        const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth-redirect`;
        
        const authUrl = `https://${auth0Domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&connection=google-oauth2&scope=openid%20profile%20email&audience=https://dev-i6xeypf5e5jykifx.uk.auth0.com/api/v2/`;
        
        window.location.href = authUrl;
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSignup)}
                    className="flex flex-col gap-6"
                >
                    <div className="grid lg:grid-cols-2 gap-4 items-start">
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
                        <ControlledInput
                            control={form.control}
                            name="email"
                            label="Email Address"
                            placeHolder="Enter your email address"
                            type="email"
                        />
                        <ControlledInput
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeHolder="Enter your phone number"
                        />
                    </div>
                    <ControlledPasswordInput
                        control={form.control}
                        name="password"
                        label="Password"
                        placeHolder="Enter your password"
                    />
                    <ControlledPasswordInput
                        control={form.control}
                        name="confirmPassword"
                        label="Confirm Password"
                        placeHolder="Confirm your password"
                    />
                </form>
            </Form>
            <DialogFooter className="mt-4 w-full">
                <div className="flex flex-col w-full">
                    {error && (
                        <p className="text-destructive-foreground text-center mb-5">
                            {"status" in error && error.status === 409
                                ? "An account with this email already exists. Please log in instead."
                                : "data" in error &&
                                  typeof error.data === "object" &&
                                  error.data !== null
                                    ? (error.data as { message?: string })
                                        .message || "An error occurred"
                                    : "An error occurred"}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-5">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-3 h-fit cursor-pointer"
                            disabled={isLoading || isLoginLoading}
                            onClick={() => form.reset({})}
                        >
                            Back
                        </Button>

                        <Button
                            type="submit"
                            className="w-full py-3 h-fit cursor-pointer"
                            disabled={isLoading || isLoginLoading || isGoogleLoading}
                            onClick={() => form.handleSubmit(handleSignup)()}
                        >
                            {isLoading || isLoginLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </div>
                    {/* Google Signup Button - Only for RENTER */}
                    {form.watch("role") === ROLES.RENTER && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-2 h-fit mt-3 flex items-center justify-center border-black text-black font-normal transition-colors duration-200 hover:border-primary"
                            style={{
                                borderWidth: 1,
                                background: "#fff",
                            }}
                            disabled={isLoading || isLoginLoading || isGoogleLoading}
                            onClick={handleGoogleSignup}
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <GoogleLogo />
                            )}
                            <span className="text-base">
                                {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
                            </span>
                        </Button>
                    )}
                    <p className="text-muted font-medium text-center mt-3">
                        Already have an account?{" "}
                        <Button
                            type="button"
                            variant="ghost"
                            className="font-normal p-0 w-fit h-fit text-secondary text-base cursor-pointer hover:underline"
                            onClick={() => {
                                dispatch(changeSignupModalOpen(false));
                                dispatch(changeLoginModalOpen(true));
                            }}
                        >
                            Login
                        </Button>
                    </p>
                </div>
            </DialogFooter>
        </motion.div>
    );
};

export default SignupInformtionForm;
