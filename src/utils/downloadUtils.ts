/**
 * Downloads a file from a URL
 * @param url - The URL to download from
 * @param filename - Optional filename for the downloaded file
 */
export const downloadFileFromUrl = async (url: string, filename?: string): Promise<void> => {
    try {
    // Fetch the file
        const response = await fetch(url);
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Get the blob
        const blob = await response.blob();
    
        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
    
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = blobUrl;
    
        // Set filename - either provided or extract from URL
        if (filename) {
            link.download = filename;
        } else {
            // Try to extract filename from URL
            const urlParts = url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            link.download = lastPart || 'receipt.pdf';
        }
    
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
};

/**
 * Generates a filename for property receipt
 * @param propertyTitle - Title of the property
 * @param propertyId - ID of the property
 * @returns Formatted filename
 */
export const generateReceiptFilename = (propertyTitle?: string, propertyId?: string): string => {
    const sanitizedTitle = propertyTitle?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Property';
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const shortId = propertyId?.substring(0, 8) || 'unknown';
  
    return `${sanitizedTitle}_Receipt_${date}_${shortId}.pdf`;
};
