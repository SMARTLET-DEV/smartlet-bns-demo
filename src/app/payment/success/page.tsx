"use client";

import { CheckCircleIcon } from "@/assets/icons";
import { useGetServiceReceiptMutation } from "@/redux/reducers/property/propertyApi";
import { useGetDepositInvoiceMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { setPaymentStatus } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { useGetRentInvoiceMutation } from "@/redux/reducers/rented-property/RentedPropertyApi";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const PaymentSuccessPage = ({ searchParams }: { searchParams: any }) => {
    const dispatch = useDispatch();
    const { tran_id, type, applicationId, rentalId, serviceRequestId } =
        React.use<any>(searchParams);
    const [getDepositInvoice] = useGetDepositInvoiceMutation();
    const [getRentInvoice] = useGetRentInvoiceMutation();
    const [getServiceReceipt] = useGetServiceReceiptMutation();

    useEffect(() => {
        switch (type) {
            case "SECURITY_DEPOSIT": {
                async function fetchInvoice() {
                    const { data } = await getDepositInvoice({
                        tran_id,
                        applicationId,
                    });
                    console.log("invoice data: ", data);
                    window.open(data.data.receiptUrl, "_blank");
                }
                fetchInvoice();
                break;
            }
            case "RENT": {
                async function fetchInvoice() {
                    console.log(tran_id, rentalId);
                    const { data } = await getRentInvoice({
                        tran_id,
                        rentalId,
                    });
                    console.log("invoice data: ", data);
                    window.open(data.data.receiptUrl, "_blank");
                }
                fetchInvoice();
                break;
            }
            case "SERVICE": {
                async function fetchInvoice() {
                    const { data } = await getServiceReceipt({
                        serviceRequestId,
                        transactionId: tran_id,
                    });
                    console.log("invoice data: ", data);
                    window.open(data?.data?.receiptUrl, "_blank");
                }
                fetchInvoice();
                break;
            }
        }
    }, [searchParams]);

    useEffect(() => {
        // Send message to parent window for all payment types
        if (window.opener && tran_id) {
            // Send message based on payment type
            const messageData = {
                type: "PAYMENT_SUCCESS",
                tran_id: tran_id,
                paymentType: type,
                ...(applicationId && { applicationId }),
                ...(rentalId && { rentalId }),
                ...(serviceRequestId && { serviceRequestId }),
            };

            console.log("Message data:", messageData);

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

            // Also dispatch payment status
            dispatch(setPaymentStatus("paid"));
        }
    }, [tran_id, type, applicationId, rentalId, serviceRequestId, dispatch]);

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
                <CheckCircleIcon className="w-16 h-16 mx-auto text-[#04DA8D]" />
                <p className="text-2xl font-light text-secondary text-center mt-3">
                    Payment Successful
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

export default PaymentSuccessPage;
