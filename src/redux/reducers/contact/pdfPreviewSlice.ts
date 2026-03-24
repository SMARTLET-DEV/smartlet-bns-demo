import { createSlice } from "@reduxjs/toolkit";

interface PdfPreviewState {
  isLoading: boolean;
  isSigned?: boolean; // Optional property to track if the PDF is signed
}

const initialState: PdfPreviewState = {
    isLoading: true,
    isSigned: false, // Default to false, can be updated based on actions
};

const pdfPreviewSlice = createSlice({
    name: "pdfPreview",
    initialState,
    reducers: {
        setPdfLoading(state, action) {
            state.isLoading = action.payload;
        },
        resetPdfLoading(state) {
            state.isLoading = true;
        },
        setIsSigned(state, action) {
            state.isSigned = action.payload;
        },
        resetIsSigned(state) {
            state.isSigned = false; // Reset to false when needed
        },
    },
});

export const { setPdfLoading, resetPdfLoading, setIsSigned, resetIsSigned } = pdfPreviewSlice.actions;
export default pdfPreviewSlice.reducer;
