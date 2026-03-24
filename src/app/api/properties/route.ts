import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
    
        // Get all query parameters from the request
        const queryString = searchParams.toString();
    
        if (!API_BASE_URL) {
            return NextResponse.json(
                { success: false, message: "API base URL not configured" },
                { status: 500 }
            );
        }

        // Forward the request to the backend API
        const backendUrl = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ""}`;
    
        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Forward cookies if needed
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, message: errorData.message || "Failed to fetch properties" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Proxy API error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

