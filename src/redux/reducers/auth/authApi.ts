import { baseApi } from "@/redux/api/baseAPi";
import { login, logout } from "./authSlice";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    let resData = {
                        user: data?.tokenData?.user,
                        token: data?.tokenData?.access_token,
                    };
                    dispatch(login(resData));
                } catch (error: any) {
                    //   console.error("Login failed:", error);
                }
            },
        }),
        signup: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),
        forgetPassword: builder.mutation({
            query: (data) => ({
                url: "auth/forgot-password",
                method: "POST",
                body: data,
            }),
        }),
        checkSession: builder.query({
            query: () => ({
                url: "/auth/check",
                method: "GET",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error: any) {
                    //   console.error("Logout failed:", error);
                }
            },
        }),
        googleAuth: builder.mutation({
            query: (data) => ({
                url: "/auth/google-login",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    let resData = {
                        user: data?.tokenData?.user,
                        token: data?.tokenData?.access_token,
                    };
                    dispatch(login(resData));
                } catch (error: any) {
                    console.error("Google auth failed:", error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useForgetPasswordMutation,
    useCheckSessionQuery,
    useLazyCheckSessionQuery, 
    useLogoutMutation,
    useGoogleAuthMutation
} = authApi;
