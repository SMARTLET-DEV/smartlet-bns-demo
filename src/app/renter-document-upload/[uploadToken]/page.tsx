'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FileUploadForm from '@/components/file-sharing/FileUploadForm';
import ErrorMessage from '@/components/file-sharing/ErrorMessage';
import { validateUploadToken, uploadDocuments, UploadSessionInfo } from '@/lib/api/fileSharing';

type ErrorType = 'invalid' | 'expired' | 'restricted' | 'not-uploaded' | 'network' | 'generic';

export default function RenterDocumentUploadPage() {
    const params = useParams();
    const uploadToken = params.uploadToken as string;

    const [loading, setLoading] = useState(true);
    const [sessionInfo, setSessionInfo] = useState<UploadSessionInfo | null>(null);
    const [error, setError] = useState<{ type: ErrorType; message: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');

    useEffect(() => {
        async function validateSession() {
            setLoading(true);
            const result = await validateUploadToken(uploadToken);

            if (result.success) {
                setSessionInfo(result);
            } else {
                // Determine error type based on message
                const message = result.message || 'An error occurred';
                let errorType: ErrorType = 'generic';

                if (message.toLowerCase().includes('invalid')) {
                    errorType = 'invalid';
                } else if (message.toLowerCase().includes('expired') || message.toLowerCase().includes('completed')) {
                    errorType = 'expired';
                } else if (message.toLowerCase().includes('network')) {
                    errorType = 'network';
                }

                setError({ type: errorType, message });
            }

            setLoading(false);
        }

        if (uploadToken) {
            validateSession();
        }
    }, [uploadToken]);

    const handleUpload = async (files: File[]) => {
        setIsUploading(true);
        setUploadError('');

        const result = await uploadDocuments(uploadToken, files);

        if (result.success) {
            setUploadSuccess(true);
        } else {
            const message = result.message || 'Failed to upload documents';

            // Check if it's an expired/invalid error
            if (message.toLowerCase().includes('expired') || message.toLowerCase().includes('invalid')) {
                let errorType: ErrorType = 'expired';
                if (message.toLowerCase().includes('invalid')) {
                    errorType = 'invalid';
                }
                setError({ type: errorType, message });
            } else {
                setUploadError(message);
            }
        }

        setIsUploading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Validating upload link...</p>
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
            <FileUploadForm
                onUpload={handleUpload}
                isUploading={isUploading}
                uploadSuccess={uploadSuccess}
                errorMessage={uploadError}
                label={sessionInfo?.label}
                notes={sessionInfo?.notes}
            />
        </div>
    );
}
