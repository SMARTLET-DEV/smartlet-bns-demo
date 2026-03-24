import { baseApi } from "@/redux/api/baseAPi";

interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requestMessage: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactRequest: builder.mutation<void, ContactRequest>({
      query: (body) => ({
        url: "/contact-us-requests",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitContactRequestMutation } = contactApi;