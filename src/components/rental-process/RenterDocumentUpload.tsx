"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, FileText, Loader2, AlertCircle } from "lucide-react";
import { useUploadRenterDocumentsMutation, useLazyGetUnsecureFileDownloadUrlByTypeQuery } from "@/redux/reducers/rental-process/rentalProcessApi";
import { toast } from "sonner";
import { RentalProcessStatus, RentalFile } from "@/types/rental-process";

interface RenterDocumentUploadProps {
    token: string;
    password?: string;
    status: RentalProcessStatus;
    documents?: {
        idDoc?: RentalFile;
        businessCard?: RentalFile;
    };
    rejectedReason?: string | null;
    onSuccess: () => void;
}

export function RenterDocumentUpload({
    token,
    password,
    status,
    documents,
    rejectedReason,
    onSuccess,
}: RenterDocumentUploadProps) {
    const [uploadDocuments, { isLoading }] = useUploadRenterDocumentsMutation();
    const [idDoc, setIdDoc] = useState<File | null>(null);
    const [businessCard, setBusinessCard] = useState<File | null>(null);

    const isRejected = status === "DOCUMENTS_REJECTED";
    // Allow upload if status is PENDING or REJECTED.
    // If pending, we check if documents are already there. If there, we assume submitted.
    // Spec says: "Show only while status requires renter submission (typically DOCUMENTS_PENDING or DOCUMENTS_REJECTED)."
    const isUploadRequired = ["DOCUMENTS_PENDING", "DOCUMENTS_REJECTED"].includes(status);

    // If user has uploaded but status is still PENDING, display "Submitted".
    // Actually, backend status updates to SUBMITTED? The spec implies status changes only on events.
    // "After success, refresh...". 
    // If documents exist and status is PENDING, maybe waiting for admin?
    // Let's assume if documents exist and NOT rejected, we are in waiting mode.
    const hasUploaded = !!documents?.idDoc;
    const [triggerDownload] = useLazyGetUnsecureFileDownloadUrlByTypeQuery();

    const statusesWithInstruction = [
        "PAYMENT_INSTRUCTION_READY",
        "AWAITING_PAYMENT_CONFIRMATION",
        "PAYMENT_REJECTED",
        "PAYMENT_CONFIRMED",
        "AWAITING_OWNER_DISPATCH",
        "OWNER_RECEIVED_CONFIRMED",
        "MOVE_IN_SCHEDULED",
        "COMPLETED"
    ];
    const showPaymentNote = !statusesWithInstruction.includes(status);

    const handleDownload = async (fileType: "RENTER_IDENTIFICATION_DOCUMENT" | "RENTER_BUSINESS_CARD", fileName: string, mimeType: string) => {
        try {
            const blob = await triggerDownload({ role: "renter", token, fileType, password }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            // Infer extension from mimeType if possible, or fallback to name
            const extension = mimeType.split("/")[1] || "pdf";
            const downloadName = fileName.includes(".") ? fileName : `${fileName}.${extension}`;

            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error("Failed to download document.");
            console.error(err);
        }
    };

    if (hasUploaded && !isRejected && status !== "DOCUMENTS_PENDING") {
        // If status moved past pending/rejected, we just show summary
        return (
            <Card className="bg-white border-gray-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                        Documents Submitted
                    </CardTitle>
                    <CardDescription>
                        Your documents have been verified or are being processed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm font-medium mb-2">ID Document</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                    onClick={() => handleDownload("RENTER_IDENTIFICATION_DOCUMENT", "id-document", documents!.idDoc!.mimeType)}
                                >
                                    Download
                                </Button>
                                <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">Received</span>
                            </div>
                        </div>

                        {documents?.businessCard && (
                            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                                <FileText className="h-8 w-8 text-primary mb-2" />
                                <p className="text-sm font-medium mb-2">Business Card</p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                        onClick={() => handleDownload("RENTER_BUSINESS_CARD", "business-card", documents!.businessCard!.mimeType)}
                                    >
                                        Download
                                    </Button>
                                    <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">Received</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {showPaymentNote && (
                        <p className="text-sm text-gray-500 text-center italic">
                            Note: Please wait for payment instruction.
                        </p>
                    )}
                </CardContent>
            </Card>
        )
    }

    if (!isUploadRequired && hasUploaded) {
        // Waiting state if PENDING and uploaded
        return (
            <Card className="bg-white border-gray-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                        Awaiting Verification
                    </CardTitle>
                    <CardDescription>
                        You have submitted your documents. Please wait for admin approval.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm font-medium mb-2">ID Document</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                    onClick={() => handleDownload("RENTER_IDENTIFICATION_DOCUMENT", "id-document", documents!.idDoc!.mimeType)}
                                >
                                    Download
                                </Button>
                                <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">Submitted</span>
                            </div>
                        </div>

                        {documents?.businessCard && (
                            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
                                <FileText className="h-8 w-8 text-primary mb-2" />
                                <p className="text-sm font-medium mb-2">Business Card</p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                                        onClick={() => handleDownload("RENTER_BUSINESS_CARD", "business-card", documents!.businessCard!.mimeType)}
                                    >
                                        Download
                                    </Button>
                                    <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">Submitted</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {showPaymentNote && (
                        <p className="text-sm text-gray-500 text-center italic">
                            Note: Please wait for payment instruction.
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    // If not upload required and no documents, something is weird, but we default to show nothing or empty.
    if (!isUploadRequired) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idDoc) {
            toast.error("Please select an ID document.");
            return;
        }

        const formData = new FormData();
        formData.append("idDoc", idDoc);
        if (businessCard) {
            formData.append("businessCard", businessCard);
        }

        try {
            const res = await uploadDocuments({ token, password, data: formData }).unwrap();
            if (res.success) {
                toast.success("Documents uploaded successfully!");
                onSuccess();
                setIdDoc(null);
                setBusinessCard(null);
            }
        } catch (err) {
            toast.error("Failed to upload documents. Please try again.");
            console.error(err);
        }
    };

    return (
        <Card className={isRejected ? "border-red-200 bg-red-50/10 shadow-none" : "bg-white border-gray-200 shadow-none"}>
            <CardHeader>
                <CardTitle className={isRejected ? "text-red-700" : ""}>
                    {isRejected ? "Documents Rejected" : "Details & Documents"}
                </CardTitle>
                <CardDescription>
                    {isRejected
                        ? "Your previously submitted documents were rejected. Please check the reason below and upload again."
                        : "Please upload your identification document and optional business card to proceed."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isRejected && rejectedReason && (
                    <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h5 className="font-medium text-red-800 mb-1">Action Required</h5>
                            <p className="text-sm text-red-700">{rejectedReason}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ID Document Upload Card */}
                        <div className="space-y-2">
                            <div
                                onClick={() => document.getElementById("idDocInput")?.click()}
                                className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white h-40"
                            >
                                {idDoc ? (
                                    <>
                                        <FileText className="h-8 w-8 text-primary mb-2" />
                                        <p className="text-sm font-medium text-center truncate w-full px-2">{idDoc.name}</p>
                                        <p className="text-xs text-muted-foreground">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">ID Document Upload</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-center">Passport / NID <span className="text-red-500">*</span></p>
                                    </>
                                )}
                                <input
                                    id="idDocInput"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => setIdDoc(e.target.files?.[0] || null)}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Accepted formats: PDF, JPG, PNG</p>
                        </div>

                        {/* Business Card Upload Card */}
                        <div className="space-y-2">
                            <div
                                onClick={() => document.getElementById("businessCardInput")?.click()}
                                className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white h-40"
                            >
                                {businessCard ? (
                                    <>
                                        <FileText className="h-8 w-8 text-primary mb-2" />
                                        <p className="text-sm font-medium text-center truncate w-full px-2">{businessCard.name}</p>
                                        <p className="text-xs text-muted-foreground">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Business Card Upload</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-center">Optional</p>
                                    </>
                                )}
                                <input
                                    id="businessCardInput"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => setBusinessCard(e.target.files?.[0] || null)}
                                    disabled={isLoading}
                                />
                            </div>
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    {isRejected ? "Re-upload Documents" : "Upload Documents"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
