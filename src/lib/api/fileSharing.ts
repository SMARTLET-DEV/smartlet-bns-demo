import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UploadSessionInfo {
    success: boolean;
    label?: string;
    notes?: string;
    message?: string;
}

export interface DocumentFile {
    id: string;
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
}

export interface ViewDocumentsResponse {
    success: boolean;
    label?: string;
    renterName?: string;
    files?: DocumentFile[];
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
}

/**
 * Validates upload token and gets session info
 * @param uploadToken - Upload token from URL
 * @returns Session information or error
 */
export async function validateUploadToken(
    uploadToken: string
): Promise<UploadSessionInfo> {
    try {
        const url = `${BASE_URL}/public/file-sharing/upload/${uploadToken}`;
        console.log('Validating upload token, URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status);

        let data = await response.json();
        console.log('Response data (raw):', data);

        // Decode JWT if response is wrapped in data field
        if (data.data && typeof data.data === 'string') {
            try {
                const decoded: any = jwtDecode(data.data);
                data = JSON.parse(decoded.data);
                console.log('Response data (decoded):', data);
            } catch (e) {
                console.error('Failed to decode JWT:', e);
            }
        }

        if (!response.ok) {
            return {
                success: false,
                message: data.message || `Failed to validate upload link (Status: ${response.status})`,
            };
        }

        return data;
    } catch (error) {
        console.error('Error validating upload token:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
}

/**
 * Uploads documents to the backend
 * @param uploadToken - Upload token from URL
 * @param files - Array of files to upload
 * @returns Upload result
 */
export async function uploadDocuments(
    uploadToken: string,
    files: File[]
): Promise<UploadSessionInfo> {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(
            `${BASE_URL}/public/file-sharing/upload/${uploadToken}`,
            {
                method: 'POST',
                body: formData,
            }
        );

        let data = await response.json();

        // Decode JWT if response is wrapped in data field
        if (data.data && typeof data.data === 'string') {
            try {
                const decoded: any = jwtDecode(data.data);
                data = JSON.parse(decoded.data);
            } catch (e) {
                console.error('Failed to decode JWT:', e);
            }
        }

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to upload documents',
            };
        }

        return data;
    } catch (error) {
        console.error('Error uploading documents:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
}

/**
 * Fetches documents for viewing
 * @param viewToken - View token from URL
 * @returns Documents list or error
 */
export async function getViewDocuments(
    viewToken: string
): Promise<ViewDocumentsResponse> {
    try {
        const url = `${BASE_URL}/public/file-sharing/view/${viewToken}`;
        console.log('Fetching view documents, URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('View response status:', response.status);

        let data = await response.json();
        console.log('View response data (raw):', data);

        // Decode JWT if response is wrapped in data field
        if (data.data && typeof data.data === 'string') {
            try {
                const decoded: any = jwtDecode(data.data);
                data = JSON.parse(decoded.data);
                console.log('View response data (decoded):', data);
            } catch (e) {
                console.error('Failed to decode JWT:', e);
            }
        }

        if (!response.ok) {
            return {
                success: false,
                message: data.message || `Failed to fetch documents (Status: ${response.status})`,
                statusCode: response.status,
            } as any;
        }

        return data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
}
