"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRentalAuth } from "@/hooks/useRentalAuth";
import { useGetRentalProcessQuery } from "@/redux/reducers/rental-process/rentalProcessApi";
import { PasswordPrompt } from "@/components/rental-process/PasswordPrompt";
// Sub-components will be imported here
import { PropertySummaryCard } from "@/components/rental-process/PropertySummaryCard";
import { RenterDocumentUpload } from "@/components/rental-process/RenterDocumentUpload";

import { PaymentInstructionSection } from "@/components/rental-process/PaymentInstructionSection";
import { PaymentProofForm } from "@/components/rental-process/PaymentProofForm";
import { DownloadsSection } from "@/components/rental-process/DownloadsSection";
import { ProcessTimelineLayout } from "@/components/rental-process/ProcessTimelineLayout";
import { CheckCircle } from "lucide-react";
import { RenterProcessResponse } from "@/types/rental-process";

export default function RenterProcessPage() {
    const params = useParams();
    const token = params?.token as string;
    const { password, setPassword, isInitialized } = useRentalAuth("renter", token);
    const [authError, setAuthError] = useState<string>("");

    const { data: rawData, error, isLoading, refetch } = useGetRentalProcessQuery(
        { role: "renter", token, password: password || "" },
        { skip: !password }
    );

    useEffect(() => {
        if (error) {
            // If 401, it means password is wrong
            if ((error as any).status === 401) {
                setAuthError("Invalid password. Please try again.");
            }
        } else if (rawData) {
            setAuthError("");
        }
    }, [error, rawData]);

    const handlePasswordSubmit = (inputPassword: string) => {
        setPassword(inputPassword);
        setAuthError("");
    };

    // If session storage not initialized yet, show nothing or loader
    if (!isInitialized) return null;

    // If no password or API error (unauthorized), show password prompt
    if (!password || authError || (error && (error as any).status === 401)) {
        return (
            <PasswordPrompt
                onSubmit={handlePasswordSubmit}
                error={authError}
                isLoading={isLoading}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex bg-gray-50 min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Handle other errors (e.g. 404, 500)
    if (error && (error as any).status !== 401) {
        return (
            <div className="flex bg-gray-50 min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-900">Unable to load rental process</h1>
                    <p className="text-gray-500 mt-2">
                        {(error as any)?.data?.message || "Link expired or unavailable. Please contact support."}
                    </p>
                </div>
            </div>
        );
    }

    if (!rawData?.success) {
        return null; // Should be handled by error state, but safe guard
    }

    // Narrowing the type since we know we requested 'renter' role
    const data = rawData as RenterProcessResponse;
    const { process } = data;
    const { property } = process;

    // Fallback: Derive renterDocuments from files array if backend doesn't provide the shape
    const renterDocuments = process.renterDocuments || {
        idDoc: process.files?.find(f => f.fileType === "RENTER_IDENTIFICATION_DOCUMENT"),
        businessCard: process.files?.find(f => f.fileType === "RENTER_BUSINESS_CARD")
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-5 container mx-auto">
            <div className="space-y-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Rental Application Status</h1>
                    <p className="text-gray-500">Track your application and complete required steps.</p>
                </header>

                <div className="lg:grid lg:grid-cols-[1fr_480px] lg:gap-6 items-start">
                    {/* Main Content: Timeline */}
                    <div className="order-2 lg:order-1">
                        <ProcessTimelineLayout status={process.status}>
                            {/* Step 0: Documents */}
                            <RenterDocumentUpload
                                token={token}
                                password={password}
                                status={process.status}
                                documents={renterDocuments}
                                rejectedReason={process.documentsRejectedReason}
                                onSuccess={refetch}
                            />

                            {/* Step 1: Payment */}
                            <div className="space-y-6">
                                <PaymentInstructionSection
                                    status={process.status}
                                    depositAmount={property.deposit_amount || ((property.rent_amount || property.price || 0) * property.deposit_months)}
                                    paymentInstruction={process.paymentInstruction}
                                />

                                <PaymentProofForm
                                    token={token}
                                    password={password}
                                    status={process.status}
                                    paymentProof={process.paymentProof}
                                    rejectedReason={process.paymentRejectedReason}
                                    onSuccess={refetch}
                                />

                                <DownloadsSection
                                    token={token}
                                    role="renter"
                                    password={password}
                                    status={process.status}
                                    show="RECEIPT"
                                />
                            </div>

                            {/* Step 2: Rental Complete */}
                            <div className="space-y-6">
                                <DownloadsSection
                                    token={token}
                                    role="renter"
                                    password={password}
                                    status={process.status}
                                    show="INVOICE"
                                />

                                {["OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED"].includes(process.status) && (
                                    <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center text-center space-y-4 shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Application Finalized</h3>
                                            <p className="text-sm text-gray-500 max-w-sm">
                                                Your rental process is complete. You can now coordinate move-in details and access your documents anytime.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ProcessTimelineLayout>
                    </div>

                    {/* Sidebar: Property Summary (Sticky) */}
                    <aside className="order-1 lg:order-2 mb-12 lg:mb-0 lg:sticky lg:top-24 h-fit lg:mt-8">
                        <PropertySummaryCard property={property} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
