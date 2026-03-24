"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuthMutation } from "@/redux/reducers/auth/authApi";
import { useToast } from "@/hooks/useToast";
import LoaderAnimation from "@/components/utils/LoaderAnimation";

export default function AuthRedirectPage() {
    const router = useRouter();
    const [googleAuth] = useGoogleAuthMutation();
    const { success, error: showError } = useToast();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Extract the authorization code from URL
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');

                if (error) {
                    showError(`Authentication failed: ${error}`);
                    router.push('/');
                    return;
                }

                if (code) {   
                    
                    // console.log("code",code);
                    // Call the backend google-login API
                    const result = await googleAuth({
                        code: code
                    }).unwrap();
                    if (result.success || result.tokenData) {
                        success("Successfully authenticated with Google!");
                        // Clean up URL and redirect to home
                        window.history.replaceState({}, document.title, '/');
                        router.push('/');
                    } else {
                        showError("Authentication failed. Please try again.");
                        router.push('/');
                    }
                } else {
                    showError("No authorization code received.");
                    router.push('/');
                }
            } catch (error: any) {
                console.error("Google authentication failed:", error);
                showError("Authentication failed. Please try again.");
                router.push('/');
            } finally {
                setIsProcessing(false);
            }
        };

        // Small delay to ensure URL parameters are available
        const timer = setTimeout(handleAuthCallback, 500);
        
        return () => clearTimeout(timer);
    }, [googleAuth, router, success, showError]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="mb-8">
                    <LoaderAnimation />
                </div>
                <h2 className="text-2xl font-light text-gray-800 mb-4">
                    {isProcessing ? "Completing your sign-in..." : "Redirecting..."}
                </h2>
                <p className="text-gray-600">
                    Please wait while we securely log you in.
                </p>
            </div>
        </div>
    );
}