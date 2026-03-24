import { ChevronRightIcon } from "@/assets/icons";
import AppointmentList from "@/components/dashboard/appointment-list/AppointmentList";
import AppointmentReschedule from "@/components/dashboard/appointment-list/AppointmentReschedule";
import CancelAppointmentModal from "@/components/dashboard/appointment-list/CancelAppointmentModal";
import AppointmentBookingSuccess from "@/components/properties/appointment-booking/AppointmentBookingSuccess";
import Link from "next/link";

const AppointmentsPage = () => {
    return (
        <div className="flex-grow">
            <div className="lg:mb-12 mb-4">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-light">
                    Manage Appointments
                </h1>
                <div className="lg:flex hidden items-center gap-4 mt-4">
                    <Link href="/" className="text-muted">
                        Home
                    </Link>
                    <p>
                        <ChevronRightIcon className="w-3 h-3" />
                    </p>
                    <p>Manage Appointments</p>
                </div>
            </div>
            <div>
                <AppointmentList />
            </div>
            <AppointmentReschedule />
            <CancelAppointmentModal />
            <AppointmentBookingSuccess showGoToDashboard={false} />
        </div>
    );
};

export default AppointmentsPage;
