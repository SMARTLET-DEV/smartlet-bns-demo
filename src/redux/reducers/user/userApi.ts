import { baseApi } from "@/redux/api/baseAPi";
interface MeResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    role: "OWNER" | "RENTER" | "ADMIN";
  };
}

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ skip = 0, take = 20, sort = "name" }) => ({
                url: `users?skip=${skip}&take=${take}&orderBy=${sort}`,
                method: "GET",
            }),
        }),
        getMe: builder.query<MeResponse, void>({
            query: () => ({
                url: "auth/me",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUsersQuery, useGetMeQuery } = userApi;
