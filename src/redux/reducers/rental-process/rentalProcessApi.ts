import { baseApi } from "@/redux/api/baseAPi";
import { RenterProcessResponse, OwnerProcessResponse } from "@/types/rental-process";

export const rentalProcessApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRentalProcess: builder.query<RenterProcessResponse | OwnerProcessResponse, { role: "renter" | "owner"; token: string; password?: string }>({
            query: ({ role, token, password }) => ({
                url: `/rental-process/${role}/${token}`,
                method: "GET",
                headers: password ? { "x-rental-password": password } : undefined,
            }),
        }),
        uploadRenterDocuments: builder.mutation<any, { token: string; password?: string; data: FormData }>({
            query: ({ token, password, data }) => ({
                url: `/rental-process/renter/${token}/documents`,
                method: "POST",
                body: data,
                headers: password ? { "x-rental-password": password } : undefined,
            }),
        }),
        submitPaymentProof: builder.mutation<any, { token: string; password?: string; data: FormData }>({
            query: ({ token, password, data }) => ({
                url: `/rental-process/renter/${token}/payment-proof`,
                method: "POST",
                body: data,
                headers: password ? { "x-rental-password": password } : undefined,
            }),
        }),
        submitMoveInInfo: builder.mutation<any, { token: string; password?: string; data: { moveInDate: string; note: string } }>({
            query: ({ token, password, data }) => ({
                url: `/rental-process/renter/${token}/move-in`,
                method: "POST",
                body: data,
                headers: password ? { "x-rental-password": password } : undefined,
            }),
        }),
        confirmPaymentReceived: builder.mutation<any, { token: string; password?: string }>({
            query: ({ token, password }) => ({
                url: `/rental-process/owner/${token}/confirm-received`,
                method: "POST",
                headers: password ? { "x-rental-password": password } : undefined,
            }),
        }),
        getUnsecureFileDownloadUrl: builder.query<Blob, { role: "renter" | "owner"; token: string; fileId: string; password?: string }>({
            query: ({ role, token, fileId, password }) => ({
                url: `/rental-process/${role}/${token}/files/${fileId}`,
                method: "GET",
                headers: password ? { "x-rental-password": password } : undefined,
                responseHandler: (response: Response) => response.blob(),
            })
        }),
        getUnsecureFileDownloadUrlByType: builder.query<Blob, { role: "renter" | "owner"; token: string; fileType: "RENTER_IDENTIFICATION_DOCUMENT" | "RENTER_BUSINESS_CARD"; password?: string }>({
            query: ({ role, token, fileType, password }) => ({
                url: `/rental-process/${role}/${token}/files/${fileType}`,
                method: "GET",
                headers: password ? { "x-rental-password": password } : undefined,
                responseHandler: (response: Response) => response.blob(),
            })
        }),
        getDownloadUrl: builder.query<Blob, { role: "renter" | "owner"; token: string; type: "INVOICE" | "RECEIPT" | "PAYMENT_CONFIRMATION"; password?: string }>({
            query: ({ role, token, type, password }) => ({
                url: `/rental-process/${role}/${token}/download/${type}`,
                method: "GET",
                headers: password ? { "x-rental-password": password } : undefined,
                responseHandler: (response: Response) => response.blob(),
            })
        }),
    }),
});

export const {
    useGetRentalProcessQuery,
    useUploadRenterDocumentsMutation,
    useSubmitPaymentProofMutation,
    useSubmitMoveInInfoMutation,
    useConfirmPaymentReceivedMutation,
    useLazyGetUnsecureFileDownloadUrlQuery,
    useLazyGetUnsecureFileDownloadUrlByTypeQuery,
    useLazyGetDownloadUrlQuery
} = rentalProcessApi;
