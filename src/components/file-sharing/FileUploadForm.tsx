'use client';

import { AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatFileSize, validateFileSize, validateFileType } from '@/utils/fileHelpers';

interface FileUploadFormProps {
    onUpload: (files: File[]) => Promise<void>;
    isUploading: boolean;
    uploadSuccess: boolean;
    errorMessage?: string;
    label?: string;
    notes?: string;
}

export default function FileUploadForm({
    onUpload,
    isUploading,
    uploadSuccess,
    errorMessage,
    label,
    notes,
}: FileUploadFormProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationError, setValidationError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        const errors: string[] = [];

        // Validate each file
        fileArray.forEach((file) => {
            if (!validateFileType(file)) {
                errors.push(`${file.name}: Invalid file type. Only PDF and images are allowed.`);
            } else if (!validateFileSize(file, 10)) {
                errors.push(`${file.name}: File size exceeds 10MB limit.`);
            }
        });

        if (errors.length > 0) {
            setValidationError(errors.join(' '));
            return;
        }

        setValidationError('');
        setSelectedFiles((prev) => [...prev, ...fileArray]);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            setValidationError('Please select at least one file to upload.');
            return;
        }

        await onUpload(selectedFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    if (uploadSuccess) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                    Documents Uploaded Successfully
                </h3>
                <p className="text-green-700 dark:text-green-300">
                    Your documents have been uploaded successfully. You can now close this page.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {label || 'Upload Your Documents'}
                </h1>

                {notes && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {notes}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Drag and Drop Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            Drag and drop files here, or click to select
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Supported formats: PDF, JPG, PNG, GIF, WEBP (Max 10MB per file)
                        </p>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                            id="file-input"
                            disabled={isUploading || uploadSuccess}
                        />
                        <label htmlFor="file-input">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isUploading || uploadSuccess}
                                onClick={() => document.getElementById('file-input')?.click()}
                            >
                                Select Files
                            </Button>
                        </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                Selected Files ({selectedFiles.length})
                            </h3>
                            <div className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            disabled={isUploading}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Validation Error */}
                    {validationError && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
                        </div>
                    )}

                    {/* API Error */}
                    {errorMessage && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6">
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isUploading || uploadSuccess || selectedFiles.length === 0}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Documents'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
