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

import { useLoginMutation, useGoogleAuthMutation } from "@/redux/reducers/auth/authApi";
import {
    changeForgetPasswordModalOpen,
    changeLoginModalOpen,
    changeSignupModalOpen,
} from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { ControlledInput } from "../common/ControlledInput";
import { ControlledPasswordInput } from "../common/ControlledPassword-input";
import { Button } from "../ui/button";

import { Form } from "../ui/form";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
// ⬇️ Import mobile detection hook like your first code
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/ResponsiveDialog";

interface ErrorResponse {
    data: {
        data: {
            errors: Array<{ msg: string }>;
        };
    };
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

interface LoginErrorData {
    message: string;
    code?: number;
}

type FetchBaseQueryErrorWithData = FetchBaseQueryError & {
    data: LoginErrorData;
};

const isFetchBaseQueryErrorWithData = (
    error: unknown
): error is FetchBaseQueryErrorWithData => {
    return (error as FetchBaseQueryError).status !== undefined;
};

export default function LoginModal() {
    const dispatch = useDispatch();
    const isLoginModalOpen = useSelector(
        (state: RootState) => state.authModals.loginModalOpen
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });
    const [
        login,
        {
            isLoading: isLoginLoading,
            error: loginError,
            reset: loginErrorReset,
        },
    ] = useLoginMutation();
    
    const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

    useEffect(() => {
        if (loginError?.data?.data) {
            setErrors(loginError?.data?.data);
        } else {
            setErrors({});
        }
    }, [loginError]);

    const { success } = useToast();

    const handleLogin = async (formData: z.infer<typeof loginSchema>) => {
        try {
            const result = await login(formData).unwrap();   
            success("Logged in successfully!");
            dispatch(changeLoginModalOpen(false));
        } catch (err: any) {
            // Error handling is already done by the existing error state management
            console.error("Login error:", err);
        }
    };

    const handleGoogleLogin = () => {
        // Direct redirect to Auth0 authorization endpoint for Google login
        const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth-redirect`;
        const authUrl = `https://${auth0Domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&connection=google-oauth2&scope=openid%20profile%20email&audience=https://dev-i6xeypf5e5jykifx.uk.auth0.com/api/v2/`;
        window.location.href = authUrl;
    };


    return (
        <Dialog
            open={isLoginModalOpen}
            onOpenChange={(state) => {
                dispatch(changeLoginModalOpen(state));
                form.reset({
                    email: "",
                    password: "",
                });
                form.clearErrors();
                loginErrorReset();
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] ">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-light">
                        Login
                    </DialogTitle>
                    <DialogDescription className="text-muted font-medium border-b border-card pb-3">
                        Log in to your account
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleLogin)}
                        className="flex flex-col gap-6"
                    >
                        <ControlledInput
                            control={form.control}
                            name="email"
                            label="Email"
                            placeHolder="Enter your email address"
                        />
                        <ControlledPasswordInput
                            control={form.control}
                            name="password"
                            label="Password"
                            placeHolder="Enter your password"
                        />
                    </form>
                    <Button
                        asChild
                        variant="ghost"
                        onClick={() => {
                            dispatch(changeLoginModalOpen(false));
                            dispatch(changeForgetPasswordModalOpen(true));
                        }}
                        className="hover:bg-transparent hover:underline w-fit h-fit cursor-pointer ms-auto p-0 font-normal"
                    >
                        <p>Forgot Password?</p>
                    </Button>
                </Form>
                <DialogFooter className="mt-4 w-full">
                    <div className="flex flex-col w-full">
                        {loginError &&
                            isFetchBaseQueryErrorWithData(loginError) && (
                            <div className="text-red-500 mb-3">
                                {loginError.data.message && (
                                    <p className="text-red-500">
                                            Error: {loginError.data.message}
                                    </p>
                                )}
                                {errors.message && (
                                    <p className="text-red-500">
                                            Error: {errors.message}
                                    </p>
                                )}
                                {(loginError as ErrorResponse)?.data?.data
                                    ?.errors?.length > 0 && (
                                    <>
                                        <p>Error:</p>
                                        <ul className="text-red-500 pl-4.5">
                                            {(
                                                    loginError as ErrorResponse
                                            )?.data?.data?.errors?.map(
                                                (message, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-disc"
                                                    >
                                                        {message.msg}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full py-3 h-fit cursor-pointer"
                            disabled={isLoginLoading || isGoogleLoading}
                            onClick={() => form.handleSubmit(handleLogin)()}
                        >
                            {isLoginLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </Button>

                        {/* Google Login Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-2 h-fit mt-3 flex items-center justify-center border-black text-black font-normal transition-colors duration-200 hover:border-primary"
                            style={{
                                borderWidth: 1,
                                background: "#fff",
                            }}
                            disabled={isLoginLoading || isGoogleLoading}
                            onClick={handleGoogleLogin}
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <GoogleLogo />
                            )}
                            <span className="text-base">
                                {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                            </span>
                        </Button>
                        <p className="text-muted font-medium text-center mt-3">
                            Don&apos;t have an account?{" "}
                            <Button
                                type="button"
                                variant="ghost"
                                className="font-normal p-0 w-fit h-fit text-secondary text-base cursor-pointer hover:underline"
                                onClick={() => {
                                    dispatch(changeLoginModalOpen(false));
                                    dispatch(changeSignupModalOpen(true));
                                }}
                            >
                                Sign up
                            </Button>
                        </p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
