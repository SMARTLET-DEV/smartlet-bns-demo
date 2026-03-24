"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import {
    useGetAllAppointmentBookingQuery,
    useGetUserRentalApplicationsQuery,
} from "@/redux/reducers/property/propertyApi";
import {
    setApplyForRent,
    setAppointmentBooking,
    setMakeAnOffer,
    setCallSupportDialog
} from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallSupportDialog from "../property-details/callSupportDIalog";
import PropertyActionsMobileSticky from "../property-details/propertyActionsMobileSticky";
import { Button } from "../ui/button";
import ApplyForRent from "./apply-for-rent/ApplyForRent";
import ApplyForRentSuccess from "./apply-for-rent/ApplyForRentSuccess";
import AppointmentBooking from "./appointment-booking/AppointmentBooking";
import AppointmentBookingSuccess from "./appointment-booking/AppointmentBookingSuccess";
import MakeAnOffer from "./make-an-offer/MakeAnOffer";

export interface PropertyInfoCardProps {
  propertyID: string;
  packageType: string;
}

export default function PropertyRentalViewingAppointmentCard({
    propertyID,
    packageType
}: PropertyInfoCardProps) {

    const [alreadyAppliedForViewing, setAlreadyAppliedForViewing] = useState<boolean>(false);
    const [alreadyAppliedForRent, setAlreadyAppliedForRent] = useState<boolean>(false);

    const isMobile = useIsMobile();
    const user: any = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    // console.log("mama property id: ",propertyID);

    // TODO: need to change the get all query with specific user based call
    const { data: allAppointments } = useGetAllAppointmentBookingQuery(
        propertyID,
        { skip: !user }
    );
    const { data: allRentalApplications } = useGetUserRentalApplicationsQuery(
        propertyID,
        { skip: !user }
    );

    useEffect(() => {
        if (allAppointments) {
            const isAlreadyApplied = allAppointments.some(
                (appointment) => appointment.renterId === user?.id
            );
            setAlreadyAppliedForViewing(isAlreadyApplied);
        }
    }, [allAppointments, user?.id]);

    useEffect(() => {
        if (allRentalApplications) {
            const isAlreadyApplied = allRentalApplications.some(
                (application: any) => application.renterId === user?.id
            );
            setAlreadyAppliedForRent(isAlreadyApplied);
        }
    }, [allRentalApplications, user?.id]);

    return (
        <>
            <div className="max-w-[410px] w-full h-fit flex flex-col text-secondary bg-white rounded-2xl p-4 relative pb-4">
                <div className="grid grid-cols-1 mb-4 sm:grid sm:mt-4 hidden">
                    <Button
                        variant="outline"
                        className="hover:bg-primary font-normal py-3 h-fit hover:text-white text-primary cursor-pointer border-primary bg-transparent"
                        disabled={user && user?.role !== "RENTER"}
                        onClick={() => {
                            dispatch(setCallSupportDialog(true));
                        }}
                    >
            Call Us
                    </Button>
                </div>

                {/* Buttons Removed for Demo */}

                <CallSupportDialog />
                <AppointmentBooking />
                <AppointmentBookingSuccess />
                <ApplyForRent />
                <ApplyForRentSuccess />
                <MakeAnOffer />
                <PropertyActionsMobileSticky packageType={packageType} alreadyAppliedForViewing={alreadyAppliedForViewing} />
            </div>
        </>
    );
}
