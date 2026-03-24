"use client";

import { AlertIcon } from "@/assets/icons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const PaymentFailedPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Send message to parent window for all payment types
        if (window.opener) {
            // Send message based on payment type
            const messageData = {
                type: "PAYMENT_FAILED",
            };

            // Store in localStorage as fallback
            localStorage.setItem(
                "paymentSuccessData",
                JSON.stringify(messageData)
            );

            // Send message with retry mechanism
            let retryCount = 0;
            const maxRetries = 5;

            const sendMessage = () => {
                try {
                    window.opener.postMessage(messageData, "*");
                    console.log("Message sent successfully");
                } catch (error) {
                    console.error("Error sending message:", error);
                    retryCount++;
                    if (retryCount < maxRetries) {
                        setTimeout(sendMessage, 1000); // Retry after 1 second
                    }
                }
            };

            sendMessage();
        }
    }, [dispatch]);

    function handleClosePage() {
        // Try to close the window
        if (window.opener) {
            // If this window was opened by another window, close it
            window.close();
        } else {
            // If window.close() doesn't work (due to browser security), try to redirect
            window.location.href = "about:blank";
            // Fallback: try to close after a short delay
            setTimeout(() => {
                window.close();
            }, 100);
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-full flex flex-col max-w-[550px] text-secondary bg-white rounded-2xl p-4">
                <AlertIcon className="w-16 h-16 mx-auto text-red-500" />
                <p className="text-2xl font-light text-secondary text-center mt-3">
                    Payment Failed
                </p>
                <div className="mt-5 text-muted pb-5 mb-5">
                    <p className="text-center">
                        Please{" "}
                        <span
                            className="underline cursor-pointer"
                            onClick={handleClosePage}
                        >
                            close
                        </span>{" "}
                        this page to continue with your rental application
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
