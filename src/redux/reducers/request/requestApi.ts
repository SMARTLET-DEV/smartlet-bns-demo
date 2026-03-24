import { baseApi } from "@/redux/api/baseAPi";

interface RequestPayload {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requestMessage: string;
}

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitRequest: builder.mutation<void, RequestPayload>({
      query: (body) => ({
        url: "/custom-requests",
        method: "POST",
        body,
      }),
    }),
    
  }),
  overrideExisting: true,
});

export const { useSubmitRequestMutation } = requestApi;
