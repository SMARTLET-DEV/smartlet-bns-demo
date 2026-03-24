/**
 * Formats bytes to human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Gets appropriate icon name for file type
 * @param mimeType - MIME type of the file
 * @returns Icon identifier
 */
export function getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet';
    return 'file';
}

/**
 * Validates if file type is allowed
 * @param file - File to validate
 * @returns true if valid, false otherwise
 */
export function validateFileType(file: File): boolean {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
    ];

    return allowedTypes.includes(file.type);
}

/**
 * Validates if file size is within limit
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 10MB)
 * @returns true if valid, false otherwise
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
}

/**
 * Gets file extension from filename
 * @param filename - Name of the file
 * @returns File extension
 */
export function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
