import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
    user: null | User;
    token: null | string;
};

export type User = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    id: string | null;
    name: string | null;
    isEmailVerified: boolean | null;
    isPhoneVerified: boolean | null;
    updatedAt: string | null;
    avatarSrc: string | null;
};

const initialState: TAuthState = {
    user: null,
    token: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
