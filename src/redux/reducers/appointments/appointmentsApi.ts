import { baseApi } from "@/redux/api/baseAPi";
import { ViewingAppointment } from "../property/propertyApi";
import { setLastSuccessfulAppointment } from "../property/propertySlice";
import { setAppointments } from "./appointmentSlice";

const APPOINTMENT_TAG = "AppointmentBooking" as const;

interface AppointmentResponse {
    success: boolean;
    viewingAppointments: ViewingAppointment[];
}

interface AppointmentBookingRequest {
    date: string;
    status: "SCHEDULED";
    property: {
        connect: { id: string };
    };
}

const appointmentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAppointments: builder.query<AppointmentResponse, void>({
            query: () => ({
                url: `/viewing-appointments`,
                method: "GET",
            }),
            providesTags: [{ type: APPOINTMENT_TAG, id: "LIST" }],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                console.log("data: ", data);
                dispatch(setAppointments(data.viewingAppointments));
            },
        }),
        cancelAppointment: builder.mutation<any, string>({
            query: (appointmentId) => ({
                url: `/viewing-appointments/${appointmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: APPOINTMENT_TAG, id: "LIST" }],
        }),
        rescheduleAppointmentBooking: builder.mutation<
            any,
            { appointmentId: string; date: string }
        >({
            query: ({ appointmentId, date }) => ({
                url: `/viewing-appointments/${appointmentId}`,
                method: "PUT",
                body: { date },
            }),
            invalidatesTags: [{ type: APPOINTMENT_TAG, id: "LIST" }],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                if (data.success) {
                    dispatch(
                        setLastSuccessfulAppointment(data?.viewingAppointment)
                    );
                }
            },
        }),
    }),
});

export const {
    useGetAllAppointmentsQuery,
    useCancelAppointmentMutation,
    useRescheduleAppointmentBookingMutation,
} = appointmentsApi;
