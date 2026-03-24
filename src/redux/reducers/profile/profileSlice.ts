import { createSlice } from "@reduxjs/toolkit";

type TProfileState = {
    profileData: null | ProfileData;
};

export type ProfileData = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    id: string | null;
    isEmailVerified: boolean | null;
    isPhoneVerified: boolean | null;
    updatedAt: string | null;
    avatar: string | null;
};

const initialState: TProfileState = {
    profileData: null,
};
const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileData: (state, action) => {
            const { profileData } = action.payload;
            state.profileData = profileData;
        },
    },
});

export const { setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
