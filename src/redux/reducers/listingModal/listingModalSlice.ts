// redux/reducers/listingModal/listingModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListingModalState {
  listingOption: "BASIC" | "SMART" | "SMARTPLUS" | null;
  isAdPackageModalOpen: boolean;
  isEndToEndModalOpen: boolean;
  transactionId: string | null;
  serviceRequestId: string | null;
  selectedPackageResponse: {
    success: boolean;
    message: string;
    proceed: boolean;
    paymentLink?: string;
  } | null;
}


const initialState: ListingModalState = {
    listingOption: null,
    isAdPackageModalOpen: false,
    isEndToEndModalOpen: false,
    selectedPackageResponse: null,
    transactionId: null,
    serviceRequestId: null,
};


const listingModalSlice = createSlice({
    name: "listingModal",
    initialState,
    reducers: {
        setListingOption(state, action: PayloadAction<"BASIC" | "SMART"| "SMARTPLUS">) {
            state.listingOption = action.payload;
        },
        openAdPackageModal(state) {
            state.isAdPackageModalOpen = true;
        },
        closeAdPackageModal(state) {
            state.isAdPackageModalOpen = false;
        },
        openEndToEndModal(state) {
            state.isEndToEndModalOpen = true;
        },
        closeEndToEndModal(state) {
            state.isEndToEndModalOpen = false;
        },
        resetListingModal(state) {
            state.listingOption = null;
            state.isAdPackageModalOpen = false;
            state.isEndToEndModalOpen = false;
        },
        setTransactionDetails(state, action: PayloadAction<{ transactionId: string; serviceRequestId: string }>) {
            state.transactionId = action.payload.transactionId;
            state.serviceRequestId = action.payload.serviceRequestId;
        },
        clearTransactionDetails(state) {
            state.transactionId = null;
            state.serviceRequestId = null;
        },
        setSelectedPackageResponse(
            state,
            action: PayloadAction<ListingModalState["selectedPackageResponse"]>
        ) {
            state.selectedPackageResponse = action.payload;
        },

    },
});

export const {
    setListingOption,
    openAdPackageModal,
    closeAdPackageModal,
    openEndToEndModal,
    closeEndToEndModal,
    resetListingModal,
    setSelectedPackageResponse,
    setTransactionDetails, 
    clearTransactionDetails 
} = listingModalSlice.actions;

export default listingModalSlice.reducer;
