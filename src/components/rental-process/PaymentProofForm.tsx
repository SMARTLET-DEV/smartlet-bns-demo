"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useSubmitPaymentProofMutation } from "@/redux/reducers/rental-process/rentalProcessApi";
import { toast } from "sonner";
import { RentalProcessStatus, RentalFile } from "@/types/rental-process";

interface PaymentProofFormProps {
    token: string;
    password?: string;
    status: RentalProcessStatus;
    paymentProof?: RentalFile;
    rejectedReason?: string | null;
    onSuccess: () => void;
}

export function PaymentProofForm({
    token,
    password,
    status,
    paymentProof,
    rejectedReason,
    onSuccess,
}: PaymentProofFormProps) {
    const [submitProof, { isLoading }] = useSubmitPaymentProofMutation();
    const [receipt, setReceipt] = useState<File | null>(null);
    const [payerAccount, setPayerAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const isRejected = status === "PAYMENT_REJECTED";
    const isVisible = ["PAYMENT_INSTRUCTION_READY", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_REJECTED"].includes(status);
    const isPaymentConfirmed = ["PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH", "OWNER_RECEIVED_CONFIRMED", "MOVE_IN_SCHEDULED", "COMPLETED"].includes(status);

    // If not visible and not submitted (or if completed, we probably hide this or show summary elsewhere)
    // Actually, if submitted and pending, we show "Submitted" state.
    // If submitted and confirmed, we might hide this or show "Confirmed" card.
    // Let's rely on status for visibility of the form vs summary.

    if (!isVisible && !isPaymentConfirmed && !isRejected && status !== "AWAITING_PAYMENT_CONFIRMATION") return null;

    if (isPaymentConfirmed) {
        return (
            <Card className="bg-white border-gray-200 shadow-none">
                <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                        Payment Verified
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Your payment has been received and verified.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (status === "AWAITING_PAYMENT_CONFIRMATION" && !isRejected) {
        return (
            <Card className="bg-white border-gray-200 shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-primary flex items-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Payment is being verified
                    </CardTitle>
                    <CardDescription>
                        We are verifying your payment. This usually takes 24 hours.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receipt || !payerAccount || !amount || !date) {
            toast.error("Please fill all fields and upload the receipt.");
            return;
        }

        const formData = new FormData();
        formData.append("receipt", receipt);
        formData.append("payerAccountNumber", payerAccount);
        formData.append("amount", amount);
        formData.append("depositDate", date);

        try {
            const res = await submitProof({ token, password, data: formData }).unwrap();
            if (res.success) {
                toast.success("Payment proof submitted successfully!");
                onSuccess();
            }
        } catch (err) {
            toast.error("Failed to submit proof. Please try again.");
            console.error(err);
        }
    };

    return (
        <Card className={isRejected ? "border-red-200 bg-red-50/10 shadow-none" : "bg-white border-gray-200 shadow-none"}>
            <CardHeader>
                <CardTitle className={isRejected ? "text-red-700" : "text-gray-900"}>
                    {isRejected ? "Payment Rejected" : "Submit Payment Proof"}
                </CardTitle>
                <CardDescription>
                    {isRejected
                        ? "Your payment proof was rejected. Please check the reason below."
                        : "Please upload the transfer receipt and details."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isRejected && rejectedReason && (
                    <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h5 className="font-medium text-red-800 mb-1">Issue with Payment</h5>
                            <p className="text-sm text-red-700">{rejectedReason}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="payerAccount">Sender&apos;s Account Number</Label>
                            <Input
                                id="payerAccount"
                                placeholder="e.g. 123456789"
                                value={payerAccount}
                                onChange={(e) => setPayerAccount(e.target.value)}
                                disabled={isLoading}
                                className="h-11 px-4"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount Sent</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="e.g. 25000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                                className="h-11 px-4"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date of Transfer</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isLoading}
                            className="h-11 px-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Receipt</Label>
                        <div
                            onClick={() => document.getElementById("receiptInput")?.click()}
                            className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white h-32"
                        >
                            {receipt ? (
                                <>
                                    <CheckCircle className="h-6 w-6 text-primary mb-2" />
                                    <p className="text-sm font-medium text-center truncate w-full px-2">{receipt?.name}</p>
                                    <p className="text-xs text-muted-foreground">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Upload Receipt</p>
                                    <p className="text-xs text-muted-foreground mt-1">Image or PDF</p>
                                </>
                            )}
                            <input
                                id="receiptInput"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="outline"
                            className="px-8 h-11 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                "Submit Proof"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
