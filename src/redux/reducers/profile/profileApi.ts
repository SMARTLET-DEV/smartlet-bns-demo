import { baseApi } from "@/redux/api/baseAPi";
import { setProfileData } from "./profileSlice";

const PROFILE_TAG = "Profile" as const;

const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfileData: builder.query({
            query: (id) => `/profiles/${id}`,
            providesTags: [{ type: PROFILE_TAG, id: "LIST" }],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setProfileData(data));
                } catch (err) {
                    console.log(err);
                }
            },
        }),

        updateProfileData: builder.mutation<
            any,
            { profileId: string; data: FormData }
        >({
            query: ({ profileId, data }) => ({
                url: `/profiles/${profileId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [{ type: PROFILE_TAG, id: "LIST" }],
        }),

        forgotPassword: builder.mutation<any, { email: string }>({
            query: ({ email }) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: { email },
            }),
        }),
    }),
});

export const {
    useGetProfileDataQuery,
    useUpdateProfileDataMutation,
    useForgotPasswordMutation,
} = profileApi;
