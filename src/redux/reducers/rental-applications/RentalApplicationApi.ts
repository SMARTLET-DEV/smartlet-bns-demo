import { baseApi } from "@/redux/api/baseAPi";

const RENTAL_APPLICATION_TAG = "RentalApplication" as const;

const rentalApplicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRentalApplications: builder.query<any, void>({
            query: () => ({
                url: "/rental-applications",
                method: "GET",
            }),
            providesTags: [{ type: "RentalApplication", id: "LIST" }],
        }),

        cancelApplication: builder.mutation<any, { applicationId: string }>({
            query: ({ applicationId }) => ({
                url: `/rental-applications/${applicationId}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: RENTAL_APPLICATION_TAG, id: "LIST" }],
        }),

        generateContract: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/rental-applications/${id}/generate-contract`,
                method: "POST",
            }),
        }),

        getUnsignedContract: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/rental-applications/${id}/unsigned-contract`,
                method: "GET",
            }),
        }),

        uploadSignature: builder.mutation<
            any,
            { formData: FormData; id: string }
        >({
            query: ({ formData, id }) => ({
                url: `/rental-applications/${id}/sign-contract`,
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: [{ type: "RentalApplication", id: "LIST" }],
        }),

        getContract: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/rental-applications/${id}/contract`,
                method: "GET",
            }),
        }),

        getDepositInvoice: builder.mutation<
            any,
            { tran_id: string; applicationId: string }
        >({
            query: ({ tran_id, applicationId }) => ({
                url: `/rental-applications/${applicationId}/receipt/${tran_id}`,
                method: "GET",
            }),
        }),

        getPaymentInvoice: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/rental-applications/${id}/payment-invoice`,
                method: "GET",
            }),
        }),

        payNow: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/rental-applications/${id}/mark-paid`,
                method: "POST",
            }),
        }),

        applyAgain: builder.mutation<any, { applicationId: string; body: any }>(
            {
                query: ({ applicationId, body }) => ({
                    url: `rental-applications/${applicationId}/apply-again`,
                    method: "POST",
                    body,
                }),
            }
        ),
    }),
});

export const {
    useGetAllRentalApplicationsQuery,
    useUploadSignatureMutation,
    useGenerateContractMutation,
    useGetUnsignedContractMutation,
    useGetContractMutation,
    useGetPaymentInvoiceMutation,
    usePayNowMutation,
    useGetDepositInvoiceMutation,
    useCancelApplicationMutation,
    useApplyAgainMutation,
} = rentalApplicationApi;
