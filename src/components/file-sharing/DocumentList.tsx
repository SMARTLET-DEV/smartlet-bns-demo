'use client';

import { Download, FileText, Image as ImageIcon, FileVideo, File, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatFileSize, getFileIcon } from '@/utils/fileHelpers';
import { DocumentFile } from '@/lib/api/fileSharing';

interface DocumentListProps {
    files: DocumentFile[];
    label?: string;
    renterName?: string;
}

function getIconComponent(iconType: string) {
    switch (iconType) {
    case 'image':
        return ImageIcon;
    case 'pdf':
        return FileText;
    case 'video':
        return FileVideo;
    default:
        return File;
    }
}

const CORRECT_PASSWORD = '123456'; // Frontend password for now

export default function DocumentList({ files, label, renterName }: DocumentListProps) {
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    if (files.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No documents available.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {label || 'Uploaded Documents'}
                </h1>

                {renterName && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Submitted by: <span className="font-medium">{renterName}</span>
                    </p>
                )}

                {/* Password Protection */}
                {!isUnlocked && (
                    <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Password Required
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Please enter the password to view and download the documents.
                        </p>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            )}
                            <Button type="submit" className="w-full" disabled={!password}>
                                Unlock Documents
                            </Button>
                        </form>
                    </div>
                )}

                {/* Document List */}
                <div className="space-y-3">
                    {files.map((file) => {
                        const IconComponent = getIconComponent(getFileIcon(file.mimeType));

                        return (
                            <div
                                key={file.id}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        <IconComponent className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {isUnlocked ? file.fileName : '••••••••••••••'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {isUnlocked ? formatFileSize(file.size) : 'Hidden'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {isUnlocked ? (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={file.fileName}
                                        >
                                            <Button variant="outline" size="sm">
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Locked
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Download links are valid for a limited time.
                    </p>
                </div>
            </div>
        </div>
    );
}
