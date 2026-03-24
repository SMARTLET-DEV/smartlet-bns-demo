'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DocumentList from '@/components/file-sharing/DocumentList';
import ErrorMessage from '@/components/file-sharing/ErrorMessage';
import { getViewDocuments, ViewDocumentsResponse } from '@/lib/api/fileSharing';

type ErrorType = 'invalid' | 'expired' | 'restricted' | 'not-uploaded' | 'network' | 'generic';

export default function ViewTenantDocumentPage() {
    const params = useParams();
    const viewToken = params.viewToken as string;

    const [loading, setLoading] = useState(true);
    const [documentsData, setDocumentsData] = useState<ViewDocumentsResponse | null>(null);
    const [error, setError] = useState<{ type: ErrorType; message: string } | null>(null);

    useEffect(() => {
        async function fetchDocuments() {
            setLoading(true);
            const result = await getViewDocuments(viewToken);

            if (result.success && result.files) {
                setDocumentsData(result);
            } else {
                // Determine error type based on message and status code
                const message = result.message || 'An error occurred';
                const statusCode = (result as any).statusCode;
                let errorType: ErrorType = 'generic';

                if (statusCode === 403 || message.toLowerCase().includes('restricted')) {
                    errorType = 'restricted';
                } else if (statusCode === 404 || message.toLowerCase().includes('invalid')) {
                    errorType = 'invalid';
                } else if (statusCode === 410 || message.toLowerCase().includes('expired')) {
                    errorType = 'expired';
                } else if (statusCode === 400 || message.toLowerCase().includes('not been uploaded')) {
                    errorType = 'not-uploaded';
                } else if (message.toLowerCase().includes('network')) {
                    errorType = 'network';
                }

                setError({ type: errorType, message });
            }

            setLoading(false);
        }

        if (viewToken) {
            fetchDocuments();
        }
    }, [viewToken]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <ErrorMessage type={error.type} message={error.message} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <DocumentList
                files={documentsData?.files || []}
                label={documentsData?.label}
                renterName={documentsData?.renterName}
            />
        </div>
    );
}
