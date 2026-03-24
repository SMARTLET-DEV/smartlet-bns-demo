import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

/**
 * Decrypts Auth0 Google authentication tokens using the Auth0 client ID
 * This is specifically for Google auth tokens that are encrypted differently
 * from regular JWT tokens in the application
 */
export class Auth0TokenDecryption {
    private static readonly AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "CO6uH07U0r3SQDFOjNMD2lcleYI5Llhk";

    /**
     * Decrypts a Google auth token using Auth0 client ID as the secret
     * @param encryptedToken - The encrypted token from Google auth response
     * @returns The decrypted plain token or the original token if decryption fails
     */
    static decryptGoogleAuthToken(encryptedToken: string): string {
        if (!encryptedToken) {
            return encryptedToken;
        }

        try {
            // First, try to decode as a standard JWT to see if it's already decrypted
            if (encryptedToken.includes('.')) {
                const decodedToken: any = jwtDecode(encryptedToken);
                
                // If the token has a 'data' field, it's encrypted and needs decryption
                if (decodedToken.data) {
                    try {
                        // Try to verify and decode using Auth0 client ID as secret
                        const verified = jwt.verify(encryptedToken, this.AUTH0_CLIENT_ID) as any;
                        
                        if (verified.data) {
                            // Parse the inner data
                            const parsedData = JSON.parse(verified.data);
                            return parsedData;
                        }
                        
                        return verified;
                    } catch (verifyError) {
                        console.log("Auth0 token verification failed, trying alternative decryption:", verifyError);
                        
                        // If verification fails, try to parse the data directly
                        try {
                            const parsedData = JSON.parse(decodedToken.data);
                            return parsedData;
                        } catch (parseError) {
                            console.log("Direct parsing failed:", parseError);
                            return decodedToken.data;
                        }
                    }
                }
                
                // If no 'data' field, return the decoded token as is
                return decodedToken;
            }
            
            // If it doesn't look like a JWT, return as is
            return encryptedToken;
            
        } catch (error) {
            console.error("Auth0 token decryption failed:", error);
            // Return original token if all decryption attempts fail
            return encryptedToken;
        }
    }

    /**
     * Alternative decryption method using different approaches
     * @param encryptedToken - The encrypted token
     * @returns Decrypted token or original if decryption fails
     */
    static decryptWithFallback(encryptedToken: string): string {
        if (!encryptedToken) {
            return encryptedToken;
        }

        // Try multiple decryption approaches
        const approaches = [
            () => this.decryptGoogleAuthToken(encryptedToken),
            () => this.tryBase64Decode(encryptedToken),
            () => this.tryDirectJWTDecode(encryptedToken)
        ];

        for (const approach of approaches) {
            try {
                const result = approach();
                if (result && result !== encryptedToken) {
                    return result;
                }
            } catch (error) {
                // Continue to next approach
                continue;
            }
        }

        return encryptedToken;
    }

    private static tryBase64Decode(token: string): string {
        try {
            const decoded = atob(token);
            return JSON.parse(decoded);
        } catch {
            return token;
        }
    }

    private static tryDirectJWTDecode(token: string): string {
        try {
            const decoded: any = jwtDecode(token);
            return decoded.data ? JSON.parse(decoded.data) : decoded;
        } catch {
            return token;
        }
    }
}

/**
 * Convenience function for decrypting Google auth tokens
 * @param encryptedToken - The encrypted token from Google auth
 * @returns Decrypted plain token
 */
export const decryptGoogleAuthToken = (encryptedToken: string): string => {
    return Auth0TokenDecryption.decryptGoogleAuthToken(encryptedToken);
};

/**
 * Convenience function with fallback decryption methods
 * @param encryptedToken - The encrypted token
 * @returns Decrypted token with fallback attempts
 */
export const decryptTokenWithFallback = (encryptedToken: string): string => {
    return Auth0TokenDecryption.decryptWithFallback(encryptedToken);
};