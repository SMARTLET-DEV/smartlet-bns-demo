// src/redux/reducers/smartView/smartViewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  // key by propertyId (stringified) => clicked?
  clickedByPropertyId: Record<string, boolean>;
};

const initialState: State = {
  clickedByPropertyId: {},
};

const smartViewSlice = createSlice({
  name: "smartView",
  initialState,
  reducers: {
    markSmartViewClicked(state, action: PayloadAction<{ propertyId: string | number }>) {
      const key = String(action.payload.propertyId);
      state.clickedByPropertyId[key] = true;
    },
    resetSmartViewClicked(state, action: PayloadAction<{ propertyId: string | number }>) {
      const key = String(action.payload.propertyId);
      delete state.clickedByPropertyId[key];
    },
    // optional: clear all (dev-only)
    resetAllSmartView(state) {
      state.clickedByPropertyId = {};
    },
  },
});

export const { markSmartViewClicked, resetSmartViewClicked, resetAllSmartView } =
  smartViewSlice.actions;

export default smartViewSlice.reducer;
