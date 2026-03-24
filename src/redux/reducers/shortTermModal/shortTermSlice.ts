// src/redux/reducers/shortTerm/shortTermSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShortTermState {
  value: boolean | null; // null = unanswered
}

const initialState: ShortTermState = {
    value: null,
};

const shortTermSlice = createSlice({
    name: "shortTerm",
    initialState,
    reducers: {
        setShortTerm: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
        resetShortTerm: (state) => {
            state.value = null;
        },
    },
});

export const { setShortTerm, resetShortTerm } = shortTermSlice.actions;
export default shortTermSlice.reducer;
