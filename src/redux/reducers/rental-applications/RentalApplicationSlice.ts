import { PropertyState } from "@/assets/enumerators";
import { createSlice } from "@reduxjs/toolkit";

type TRentalApplicationState = {
    rentalApplicationModal: boolean;
    application:
        | (PropertyState & {
              id: string;
              contractSigned?: boolean;
              signedContractUrl?: string;
              currentStep?: string;
              rejectionReason?: string;
          })
        | null;
    stepperControlsRef: React.RefObject<HTMLDivElement> | null;
    contractSignSuccess: boolean;
    paymentSuccess: boolean;
    paymentRejectedModal: boolean;
    paymentStatus: "pending" | "paid" | "failed" | undefined;
    applicationCancellationModal: boolean;
};

const initialState: TRentalApplicationState = {
    rentalApplicationModal: false,
    application: null,
    stepperControlsRef: null,
    contractSignSuccess: false,
    paymentSuccess: false,
    paymentRejectedModal: false,
    paymentStatus: undefined,
    applicationCancellationModal: false,
};
const rentalApplicationSlice = createSlice({
    name: "rentalApplication",
    initialState,
    reducers: {
        setRentalApplicationModal: (state, action) => {
            state.rentalApplicationModal = action.payload;
        },
        setRentalApplicationProperty: (state, action) => {
            state.application = action.payload;
        },
        setRentalApplicationContractSigned: (state, action) => {
            if (state.application) {
                state.application.contractSigned = action.payload;
            }
        },
        setStepperControlsRef: (state, action) => {
            state.stepperControlsRef = action.payload;
        },
        setContractSignSuccess: (state, action) => {
            state.contractSignSuccess = action.payload;
        },
        setPaymentSuccess: (state, action) => {
            state.paymentSuccess = action.payload;
        },
        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload;
        },
        setPaymentRejectedModal: (state, action) => {
            state.paymentRejectedModal = action.payload;
        },
        setApplicationCancellationModal: (state, action) => {
            state.applicationCancellationModal = action.payload;
        },
    },
});

export const {
    setRentalApplicationModal,
    setRentalApplicationProperty,
    setStepperControlsRef,
    setContractSignSuccess,
    setPaymentSuccess,
    setPaymentStatus,
    setPaymentRejectedModal,
    setApplicationCancellationModal,
    setRentalApplicationContractSigned,
} = rentalApplicationSlice.actions;
export default rentalApplicationSlice.reducer;
