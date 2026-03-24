import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../store";

function getSecret(envVar: string, purpose: string): Uint8Array {
  const secret = process.env[envVar];
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getSecret("NEXT_PUBLIC_API_JWT_SECRET", "signing");

const JWT_SECRET_BUFFER = Buffer.from(JWT_SECRET);

const encryptData = (data: any) => {
  const dataToEncrypt = typeof data === "string" ? data : JSON.stringify(data);
  // console.log("JWT_SECRET_BUFFER: ", JWT_SECRET_BUFFER); // Log Buffer for debugging
  return jwt.sign({ data: dataToEncrypt }, "testing");
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithJwtDecodeAndTransform = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  // Handle proxy API routes (Next.js API routes)
  if (
    args?.url?.startsWith("/api/") ||
    args?.url?.startsWith("http://") ||
    args?.url?.startsWith("https://")
  ) {
    // For proxy routes, use direct fetch without baseUrl
    const url =
      args.url.startsWith("/api/") && typeof window !== "undefined"
        ? `${window.location.origin}${args.url}`
        : args.url;

    try {
      const state = api.getState();
      const token = (state as any).auth?.token;

      const response = await fetch(url, {
        method: args.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...args.headers,
        },
        credentials: "include",
        body: args.body ? JSON.stringify(args.body) : undefined,
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Failed to fetch" }));
        return { error: { status: response.status, data: error } };
      }

      const data = await response.json();
      return { data };
    } catch (error: any) {
      return { error: { status: "FETCH_ERROR", error: error.message } };
    }
  }

  const isEscapeMethods = ["POST", "PUT"].find((item) => item === args?.method);
  const isEscapeRoutes = [
    "/rental-applications",
    "/properties",
    "/profiles",
    "/auth/check",
  ].some((item) => args?.url?.startsWith(item));

  // Skip encryption for FormData (multipart/form-data)
  const isFormData = args.body instanceof FormData;

  if (args.body && !isEscapeMethods && !isEscapeRoutes && !isFormData) {
    args.body = {
      data: encryptData(args.body),
    };
  }
  let result: any = await baseQuery(args, api, extraOptions);
  if (result.data) {
    try {
      if (typeof result.data === "object" && result.data.data) {
        let parsedData: any = jwtDecode(result.data.data);
        result.data = JSON.parse(parsedData.data);
      } else if (typeof result.data === "string") {
        let parsedData: any = jwtDecode(result.data);
        result.data = JSON.parse(parsedData.data);
      }
    } catch (error: any) {
      // console.log("JWT decode error:", error?.data);
      return result;
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithJwtDecodeAndTransform,
  // baseQuery: baseQuery,
  tagTypes: [
    "AppointmentBooking",
    "Profile",
    "Blog",
    "RentalApplication",
    "RentedProperty",
    "Favorites",
    "Job",
  ],
  endpoints: () => ({}),
});
