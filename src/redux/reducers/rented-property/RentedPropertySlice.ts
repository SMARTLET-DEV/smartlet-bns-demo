import { RentedPropertyState } from "@/assets/enumerators";
import { createSlice } from "@reduxjs/toolkit";
import { PaymentSchedule } from "./RentedPropertyApi";
interface SinglePayment {
    id: string;
    rentalId: string;
    propertyId: string;
    renterId: string;
    amountPaid: string;
    transactionId: string;
    paymentType: string;
    status: string;
    forMonth: string;
    isAdvance: boolean;
    dueDate: string;
    paidDate: string;
    dueDateExtensionRequested: boolean;
    extendedDueDate: string | null;
    lateFee: string;
    serviceFee: string | null;
    platformFee: string;
    createdAt: string;
    updatedAt: string;
    disbursementId: string | null;
    receiptPdfUrl: string;
    sslCommerzTransactionId: string;
}

type PaymentHistory = {
    success: boolean;
    payments: SinglePayment[];
};

type TRentedPropertyState = {
    paymentHistoryModal: boolean;
    paymentSchedule: PaymentSchedule[];
    dueDateExtensionModal: boolean;
    dueDateExtensionData: PaymentSchedule;
    rentedProperty: RentedPropertyState;
    dueDateExtensionFormData: {
        address: string;
        dueDate: string;
        newDate: string;
        reason: string;
    };
    dueDateExtensionSuccessModal: boolean;
    rentPaymentModal: boolean;
    rentPaymentData: PaymentSchedule;
    contractCancellationModal: boolean;
    paymentHistory: PaymentHistory;
    contractCancellationData: ContractCancellationData;
    contractCancellationSuccessModal: boolean;
    rentPaymentStatus: "pending" | "paid" | "failed" | undefined;
};

type ContractCancellationData = {
    moveOutDate: string;
    reason: string;
};

const initialState: TRentedPropertyState = {
    paymentHistoryModal: false,
    paymentSchedule: [],
    dueDateExtensionModal: false,
    dueDateExtensionData: {
        baseRent: "",
        canPay: false,
        dueDate: "",
        forMonth: "",
        lateFee: "",
        status: "",
        totalDue: "",
    },
    rentedProperty: {} as RentedPropertyState,
    dueDateExtensionFormData: {
        address: "",
        dueDate: "",
        newDate: "",
        reason: "",
    },
    dueDateExtensionSuccessModal: false,
    rentPaymentModal: false,
    rentPaymentData: {} as PaymentSchedule,
    paymentHistory: {} as PaymentHistory,
    contractCancellationModal: false,
    contractCancellationData: {} as ContractCancellationData,
    contractCancellationSuccessModal: false,
    rentPaymentStatus: undefined,
};

const rentedPropertySlice = createSlice({
    name: "rentedProperty",
    initialState,
    reducers: {
        setPaymentHistoryModal: (state, action) => {
            state.paymentHistoryModal = action.payload;
        },
        setPaymentSchedule: (state, action) => {
            state.paymentSchedule = action.payload;
        },
        setDueDateExtensionModal: (state, action) => {
            state.dueDateExtensionModal = action.payload;
        },
        setDueDateExtensionData: (state, action) => {
            state.dueDateExtensionData = action.payload;
        },
        setRentedProperty: (state, action) => {
            state.rentedProperty = action.payload;
        },
        setDueDateExtensionFormData: (state, action) => {
            state.dueDateExtensionFormData = action.payload;
        },
        setDueDateExtensionSuccessModal: (state, action) => {
            state.dueDateExtensionSuccessModal = action.payload;
        },
        setRentPaymentModal: (state, action) => {
            state.rentPaymentModal = action.payload;
        },
        setRentPaymentData: (state, action) => {
            state.rentPaymentData = action.payload;
        },
        setContractCancellationModal: (state, action) => {
            state.contractCancellationModal = action.payload;
        },
        setPaymentHistory: (state, action) => {
            state.paymentHistory = action.payload;
        },
        setContractCancellationData: (state, action) => {
            state.contractCancellationData = action.payload;
        },
        setContractCancellationSuccessModal: (state, action) => {
            state.contractCancellationSuccessModal = action.payload;
        },
        setRentPaymentStatus: (state, action) => {
            state.rentPaymentStatus = action.payload;
        },
    },
});

export const {
    setPaymentHistoryModal,
    setPaymentSchedule,
    setDueDateExtensionModal,
    setDueDateExtensionData,
    setRentedProperty,
    setDueDateExtensionFormData,
    setDueDateExtensionSuccessModal,
    setRentPaymentModal,
    setRentPaymentData,
    setContractCancellationModal,
    setPaymentHistory,
    setContractCancellationData,
    setContractCancellationSuccessModal,
    setRentPaymentStatus,
} = rentedPropertySlice.actions;
export default rentedPropertySlice.reducer;
