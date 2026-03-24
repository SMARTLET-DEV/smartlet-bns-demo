import { baseApi } from "@/redux/api/baseAPi";

interface HomeInspectionRequest {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  preferredMoveinMonthandTime: string;
  additionalNotes?: string;
}

export const homeInspectionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        submitHomeInspectionRequest: builder.mutation<void, HomeInspectionRequest>({
            query: (body) => ({
                url: "/basic-home-inspection-requests/",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useSubmitHomeInspectionRequestMutation } = homeInspectionApi;