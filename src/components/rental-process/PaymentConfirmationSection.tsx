"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useConfirmPaymentReceivedMutation } from "@/redux/reducers/rental-process/rentalProcessApi";
import { toast } from "sonner";
import { PaymentProofSubmission, RentalProcessStatus } from "@/types/rental-process";

interface PaymentConfirmationSectionProps {
    token: string;
    password?: string;
    status: RentalProcessStatus;
    paymentProof?: PaymentProofSubmission;
    onSuccess: () => void;
}

export function PaymentConfirmationSection({
    token,
    password,
    status,
    paymentProof,
    onSuccess,
}: PaymentConfirmationSectionProps) {
    const [confirmPayment, { isLoading }] = useConfirmPaymentReceivedMutation();

    const canConfirm = status === "AWAITING_OWNER_DISPATCH";
    const isConfirmed = ["COMPLETED", "MOVE_IN_SCHEDULED"].includes(status);
    const isPaymentInProgress = ["PAYMENT_INSTRUCTION_READY", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_CONFIRMED"].includes(status);

    if (isPaymentInProgress && !paymentProof && !canConfirm) {
        return (
            <Card className="bg-white border-gray-200 shadow-sm border">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Payment in progress
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Waiting for renter to complete the payment.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Original logic continues...
    if (isConfirmed) {
        // ... (existing confirmed logic)
        return (
            <Card className="bg-white border-gray-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                        Payment Confirmed
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        You have confirmed receiving the payment.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (!paymentProof && !canConfirm) return null;

    const handleConfirm = async () => {
        try {
            const res = await confirmPayment({ token, password }).unwrap();
            if (res.success) {
                toast.success("Payment receipt confirmed!");
                onSuccess();
            }
        } catch (err) {
            toast.error("Failed to confirm payment.");
            console.error(err);
        }
    };

    return (
        <Card className="border-gray-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-gray-900">Payment Confirmation Required</CardTitle>
                <CardDescription className="text-gray-500">
                    Please confirm receipt of funds.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {paymentProof ? (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100 space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Payer Account</p>
                                <p className="font-medium text-gray-900">{paymentProof.payerAccountNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="font-medium text-gray-900">{paymentProof.amount} BDT</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="font-medium text-gray-900">{paymentProof.depositDate}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md text-sm text-center text-gray-500 border border-gray-100">
                        Payment details unavailable, but status indicates payment is confirmed.
                    </div>
                )}

                {canConfirm && (
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="w-auto px-8 h-11 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Confirm Rent Receipt
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
