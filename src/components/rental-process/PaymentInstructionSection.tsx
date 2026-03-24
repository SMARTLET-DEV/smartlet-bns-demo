import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { PaymentInstruction } from "@/types/rental-process";

interface PaymentInstructionSectionProps {
    status: string;
    depositAmount: number;
    paymentInstruction?: PaymentInstruction | null;
}

export function PaymentInstructionSection({ status, depositAmount, paymentInstruction }: PaymentInstructionSectionProps) {
    // Logic to show instruction: typically when status is PAYMENT_INSTRUCTION_SENT
    // But also can show in later stages as reference.
    const isVisible = ["PAYMENT_INSTRUCTION_READY", "PAYMENT_PROOF_SUBMITTED", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH", "OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED"].includes(status);

    if (!isVisible || !paymentInstruction) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const displayAmount = paymentInstruction.amount || depositAmount;

    return (
        <Card className="border-gray-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-primary">Payment Instructions</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Please make a <strong>{paymentInstruction.method}</strong> of <strong>{displayAmount.toLocaleString()} BDT</strong> to the following account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <span className="text-muted-foreground text-sm">Amount to Pay</span>
                        <span className="font-bold text-xl text-primary">{displayAmount.toLocaleString()} BDT</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {paymentInstruction.bankName && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bank Name</p>
                                <p className="font-medium text-gray-900">{paymentInstruction.bankName}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Account Name</p>
                            <p className="font-medium text-gray-900">{paymentInstruction.accountName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Account Number</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900 text-lg tracking-tight">{paymentInstruction.accountNumber}</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900" onClick={() => copyToClipboard(paymentInstruction.accountNumber)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        {(paymentInstruction.branch || paymentInstruction.routing) && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Branch & Routing</p>
                                <p className="font-medium text-gray-900">
                                    {paymentInstruction.branch}
                                    {paymentInstruction.routing && <span className="text-gray-400"> ({paymentInstruction.routing})</span>}
                                </p>
                            </div>
                        )}
                        {/* Fallback Method Display if relevant */}
                        {!paymentInstruction.bankName && !paymentInstruction.branch && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Method</p>
                                <p className="font-medium text-gray-900">{paymentInstruction.method}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
