import { baseApi } from "@/redux/api/baseAPi";

export const ownerContractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateOwnerContract: builder.mutation({
      query: (body: { package: "BASIC" | "SMART" | "SMARTPLUS" }) => ({
        url: "owner-contract/generate",
        method: "POST",
        body,
      }),
    }),
    getUnsignedContract: builder.query<{ success: boolean; downloadUrl: string }, string>({
      query: (contractId) => ({
        url: `owner-contract/${contractId}/unsigned`,
        method: "GET",
      }),
    }),
    getSignedContract: builder.query<{ success: boolean; downloadUrl: string }, string>({
      query: (contractId) => ({
        url: `owner-contract/${contractId}/signed`,
        method: "GET",
      }),
    }),
    signContract: builder.mutation<{ success: boolean; signedContractUrl: string }, string>({
      query: (contractId: string) => ({
        url: `owner-contract/${contractId}/sign`,
        method: "POST",
      }),
    }),
  }),
});

export const { useGenerateOwnerContractMutation, useGetUnsignedContractQuery ,useLazyGetUnsignedContractQuery, useGetSignedContractQuery ,useLazyGetSignedContractQuery, useSignContractMutation, } = ownerContractApi;
