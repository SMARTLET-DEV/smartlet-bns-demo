import { baseApi } from "@/redux/api/baseAPi";

interface SmartmoveRequest {
  name: string;
  email: string;
  phone: string;
  currentAddress: string;
  destinationAddress: string;
  additionalNotes?: string;
}

export const smartmoveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitSmartmoveRequest: builder.mutation<void, SmartmoveRequest>({
      query: (body) => ({
        url: "/basic-smart-move-requests/",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitSmartmoveRequestMutation } = smartmoveApi;