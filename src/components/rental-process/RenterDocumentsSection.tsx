"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Upload } from "lucide-react";
import { toast } from "sonner";
import { RentalFile } from "@/types/rental-process";
import { useLazyGetUnsecureFileDownloadUrlByTypeQuery } from "@/redux/reducers/rental-process/rentalProcessApi";

interface RenterDocumentsSectionProps {
    token: string;
    password?: string;
    renterDocuments?: {
        idDoc?: RentalFile;
        businessCard?: RentalFile;
    };
}

// Helper component for individual file card
const FileCard = ({ label, file, token, password }: { label: string, file: RentalFile, token: string, password?: string }) => {
    const [triggerView, { isFetching }] = useLazyGetUnsecureFileDownloadUrlByTypeQuery();

    const handleView = async () => {
        try {
            // @ts-ignore
            const blob = await triggerView({ role: "owner", token, fileType: file.fileType, password }).unwrap();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (e) {
            toast.error("Could not load document.");
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white h-40 text-center">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium mb-2">{label}</p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-6 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                    onClick={handleView}
                    disabled={isFetching}
                >
                    Download
                </Button>
                <span className="text-xs text-primary font-semibold px-2 py-1 bg-gray-100 rounded-full">Received</span>
            </div>
        </div>
    )
}

export function RenterDocumentsSection({ token, password, renterDocuments }: RenterDocumentsSectionProps) {
    if (!renterDocuments?.idDoc) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider ml-1">Renter Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileCard
                    label="ID Document (Passport/NID)"
                    file={renterDocuments.idDoc}
                    token={token}
                    password={password}
                />
                {renterDocuments.businessCard && (
                    <FileCard
                        label="Business Card / Employee ID"
                        file={renterDocuments.businessCard}
                        token={token}
                        password={password}
                    />
                )}
            </div>
        </div>
    );
}
