"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useLazyGetDownloadUrlQuery } from "@/redux/reducers/rental-process/rentalProcessApi";
import { toast } from "sonner";
import { RentalProcessStatus } from "@/types/rental-process";
import { cn } from "@/lib/utils";

interface DownloadsSectionProps {
    token: string;
    role: "renter" | "owner";
    password?: string;
    status: RentalProcessStatus;
    show?: "INVOICE" | "RECEIPT" | "ALL";
}

export function DownloadsSection({ token, role, password, status, show = "ALL" }: DownloadsSectionProps) {
    const [triggerInvoice, { isFetching: isInvoiceFetching }] = useLazyGetDownloadUrlQuery();
    const [triggerSecond, { isFetching: isSecondFetching }] = useLazyGetDownloadUrlQuery();

    const isInvoiceAvailable = ["OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED", "PAID"].includes(status);

    // Owner gets PAYMENT_CONFIRMATION, Renter gets RECEIPT
    const secondConfig = role === "owner" ? {
        type: "PAYMENT_CONFIRMATION" as const,
        label: "Payment Confirmation",
        isAvailable: ["PAYMENT_CONFIRMATION", "OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED"].includes(status)
    } : {
        type: "RECEIPT" as const,
        label: "Payment Receipt",
        isAvailable: ["PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH", "OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED", "PAID"].includes(status)
    };

    const shouldShowInvoice = (show === "ALL" || show === "INVOICE") && isInvoiceAvailable;
    const shouldShowSecond = (show === "ALL" || show === "RECEIPT") && secondConfig.isAvailable;

    if (!shouldShowInvoice && !shouldShowSecond) return null;

    const handleDownload = async (
        type: "INVOICE" | "RECEIPT" | "PAYMENT_CONFIRMATION",
        trigger: any
    ) => {
        try {
            const blob = await trigger({ role, token, type, password }).unwrap();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `opendoor_${type.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error("Failed to download file.");
            console.error(err);
        }
    };

    return (
        <Card className="bg-white border-gray-200 shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900 text-lg">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    {show === "INVOICE" ? "Rental Invoice" : show === "RECEIPT" ? "Payment Receipt" : "Documents & Invoices"}
                </CardTitle>
                <CardDescription>
                    {show === "INVOICE"
                        ? "Download your official rental invoice."
                        : show === "RECEIPT"
                            ? "Download your payment confirmation receipt."
                            : "Download your official rental documents."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className={cn(
                    "grid gap-6",
                    shouldShowInvoice && shouldShowSecond ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                    {shouldShowInvoice && (
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm font-medium mb-2">Rental Invoice</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                    onClick={() => handleDownload("INVOICE", triggerInvoice)}
                                    disabled={isInvoiceFetching}
                                >
                                    Download
                                </Button>
                                <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">PDF</span>
                            </div>
                        </div>
                    )}

                    {shouldShowSecond && (
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm font-medium mb-2">{secondConfig.label}</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                    onClick={() => handleDownload(secondConfig.type, triggerSecond)}
                                    disabled={isSecondFetching}
                                >
                                    Download
                                </Button>
                                <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">PDF</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
