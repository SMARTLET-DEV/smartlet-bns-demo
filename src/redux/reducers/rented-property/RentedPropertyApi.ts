import { RentedPropertyState } from "@/assets/enumerators";
import { baseApi } from "@/redux/api/baseAPi";
import {
    setPaymentHistory,
    setPaymentSchedule,
    setRentedProperty,
} from "./RentedPropertySlice";

type RentedPropertyResponse = {
    success: boolean;
    active: RentedPropertyState;
    propertyId: string;
    past: RentedPropertyState[] | [];
};

type PaymentScheduleResponse = {
    success: boolean;
    schedule: PaymentSchedule[];
};

export type PaymentSchedule = {
    baseRent: string;
    canPay: boolean;
    dueDate: string;
    forMonth: string;
    lateFee: string | null;
    status: string;
    totalDue: string;
};

const RENTED_PROPERTY_TAG = "RentedProperty" as const;

const rentedPropertyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRentedProperty: builder.query<RentedPropertyResponse, void>({
            query: () => ({ url: "rental/my-rentals" }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                const data = await queryFulfilled;
                dispatch(setRentedProperty(data.data.active));
            },
            providesTags: [{ type: RENTED_PROPERTY_TAG, id: "LIST" }],
        }),
        getPaymentSchedule: builder.query<
            PaymentScheduleResponse,
            { id: string }
        >({
            query: ({ id }) => ({ url: `rental/${id}/payment-schedule` }),
            providesTags: [{ type: RENTED_PROPERTY_TAG, id: "LIST" }],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                const data = await queryFulfilled;
                dispatch(setPaymentSchedule(data.data.schedule));
            },
        }),
        requestDueDateExtension: builder.mutation<
            void,
            { id: string; dueDate: string; newDueDate: string; reason: string }
        >({
            query: ({ id, dueDate, newDueDate, reason }) => ({
                url: `rental/${id}/due-date-extension`,
                method: "POST",
                body: { dueDate, newDueDate, reason },
            }),
        }),
        rentPayment: builder.mutation<any, { id: string; months: string[] }>({
            query: ({ id, months }) => ({
                url: `rental/${id}/invoice-and-payment`,
                method: "POST",
                body: { months },
            }),
        }),
        getPaymentHistory: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({ url: `rental/${id}/rent-payments` }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                const data = await queryFulfilled;
                dispatch(setPaymentHistory(data.data));
            },
        }),
        getRentInvoice: builder.mutation<
            any,
            { tran_id: string; rentalId: string }
        >({
            query: ({ tran_id, rentalId }) => ({
                url: `rental/${rentalId}/receipt/${tran_id}`,
                method: "GET",
            }),
            invalidatesTags: [{ type: RENTED_PROPERTY_TAG, id: "LIST" }],
        }),
        requestContractTermination: builder.mutation<
            any,
            { rentalId: string; moveOutDate: string; reason: string }
        >({
            query: ({ rentalId, moveOutDate, reason }) => ({
                url: `moveout-requests/`,
                method: "POST",
                body: { rentalId, moveOutDate, reason },
            }),
        }),
        getSecurityDepositReceipt: builder.mutation<any, { rentalId: string }>({
            query: ({ rentalId }) => ({
                url: `rental/${rentalId}/security-deposit-receipt`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetRentedPropertyQuery,
    useGetPaymentScheduleQuery,
    useRequestDueDateExtensionMutation,
    useRentPaymentMutation,
    useGetPaymentHistoryMutation,
    useGetRentInvoiceMutation,
    useRequestContractTerminationMutation,
    useGetSecurityDepositReceiptMutation,
} = rentedPropertyApi;
