import { createSlice } from "@reduxjs/toolkit";

type TAuthModalsState = {
    loginModalOpen: boolean;
    signupModalOpen: boolean;
    resetPasswordModalOpen: boolean;
    forgetPasswordModalOpen: boolean;
};

const initialState: TAuthModalsState = {
    loginModalOpen: false,
    signupModalOpen: false,
    resetPasswordModalOpen: false,
    forgetPasswordModalOpen: false,
};
const authModalsSlice = createSlice({
    name: "authModals",
    initialState,
    reducers: {
        changeLoginModalOpen: (state, action) => {
            state.loginModalOpen = action.payload;
        },
        changeSignupModalOpen: (state, action) => {
            state.signupModalOpen = action.payload;
        },
        changeResetPasswordModalOpen: (state, action) => {
            state.resetPasswordModalOpen = action.payload;
        },
        changeForgetPasswordModalOpen: (state, action) => {
            state.forgetPasswordModalOpen = action.payload;
        },
    },
});

export const {
    changeLoginModalOpen,
    changeSignupModalOpen,
    changeResetPasswordModalOpen,
    changeForgetPasswordModalOpen,
} = authModalsSlice.actions;
export default authModalsSlice.reducer;
