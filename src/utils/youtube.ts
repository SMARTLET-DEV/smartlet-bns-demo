/**
 * Converts various YouTube URL formats to a proper embed URL
 * @param url Full YouTube URL (watch, share, or embed)
 * @returns A valid embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)
 */
export function getYouTubeEmbedUrl(url?: string): string {
    if (!url) return "";
  
    // Match regular YouTube watch URLs
    const watchMatch = url.match(/v=([^&]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
  
    // Match youtu.be short links
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
  
    // If it's already an embed URL or unknown format, fallback
    return url;
  }
  