import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContactState {
  isSuccessDialogOpen: boolean;
  submittedFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    requestMessage: string;
  } | null;
}

const initialState: ContactState = {
  isSuccessDialogOpen: false,
  submittedFormData: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setSuccessDialogOpen(state, action: PayloadAction<boolean>) {
      state.isSuccessDialogOpen = action.payload;
    },
    setSubmittedFormData(state, action: PayloadAction<ContactState["submittedFormData"]>) {
      state.submittedFormData = action.payload;
    },
    resetContactState(state) {
      state.isSuccessDialogOpen = false;
      state.submittedFormData = null;
    },
  },
});

export const { setSuccessDialogOpen, setSubmittedFormData, resetContactState } = contactSlice.actions;
export default contactSlice.reducer;