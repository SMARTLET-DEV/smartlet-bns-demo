import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListingCardState {
  hoveredCardId: string | null;
}

const initialState: ListingCardState = {
    hoveredCardId: null,
};

const listingCardSlice = createSlice({
    name: "listingCard",
    initialState,
    reducers: {
        setHoveredCard(state, action: PayloadAction<string | null>) {
            state.hoveredCardId = action.payload;
        },
    },
});

export const { setHoveredCard } = listingCardSlice.actions;
export default listingCardSlice.reducer;