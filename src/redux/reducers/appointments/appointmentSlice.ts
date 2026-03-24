import { createSlice } from "@reduxjs/toolkit";
import { ViewingAppointment } from "../property/propertyApi";

type TAppointmentState = {
    rescheduleModalOpen: boolean;
    propertyId: string;
    appointmentId: string;
    cancelModalOpen: boolean;
    appointments: ViewingAppointment[];
};

const initialState: TAppointmentState = {
    rescheduleModalOpen: false,
    propertyId: "",
    appointmentId: "",
    cancelModalOpen: false,
    appointments: [],
};
const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        changeRescheduleModalOpen: (state, action) => {
            state.rescheduleModalOpen = action.payload;
        },
        setPropertyId: (state, action) => {
            state.propertyId = action.payload;
        },
        setAppointmentId: (state, action) => {
            state.appointmentId = action.payload;
        },
        changeCancelModalOpen: (state, action) => {
            state.cancelModalOpen = action.payload;
        },
        setAppointments: (state, action) => {
            state.appointments = action.payload;
        },
    },
});

export const {
    changeRescheduleModalOpen,
    setPropertyId,
    changeCancelModalOpen,
    setAppointmentId,
    setAppointments,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
