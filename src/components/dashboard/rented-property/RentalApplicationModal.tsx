"use client";

import { RentStatus } from "@/assets/enumerators";
import { AlertIcon, BuildingIcon } from "@/assets/icons";
import {
    RenterTimeline,
    Step,
    StepperMethods,
} from "@/components/properties/apply-for-rent/RenterTimeline";
import { setRentalApplicationModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/ResponsiveDialog";
import ApplicationStatus from "./ApplicationStatus";
import ContractSigning from "./ContractSigning";
import RejectedStatus from "./RejectedStatus";
import RentalPayment from "./RentalPayment";

const steps: Step[] = [
    {
        id: "1",
        title: "Application Info",
        content: (methods: StepperMethods) => (
            <ApplicationStatus stepperMethods={methods} />
        ),
        disabled: true,
    },
    {
        id: "2",
        title: "Contract Signing",
        content: (methods: StepperMethods) => (
            <ContractSigning stepperMethods={methods} />
        ),
        disabled: true,
    },
    {
        id: "3",
        title: "Payment",
        content: (methods: StepperMethods) => (
            <RentalPayment stepperMethods={methods} />
        ),
        disabled: true,
    },
];

export default function RentalApplicationModal() {
    const rentalApplicationModal = useSelector(
        (state: RootState) => state.rentalApplication.rentalApplicationModal
    );
    const rentalApplication = useSelector(
        (state: RootState) => state.rentalApplication.application
    );
    const dispatch = useDispatch();

    return (
        <Dialog
            open={rentalApplicationModal}
            onOpenChange={(state) => {
                dispatch(setRentalApplicationModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[685px]">
                <DialogHeader className="text-left">
                    {rentalApplication?.status === RentStatus.REJECTED ? (
                        <DialogTitle className="flex flex-col items-center gap-2 justify-center text-center">
                            <p className="p-3 rounded-full bg-primary text-white">
                                <AlertIcon className="w-5 h-5" />
                            </p>
                            <p className="text-xl font-light">
                                Application Issue Details
                            </p>
                        </DialogTitle>
                    ) : (
                        <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                            <BuildingIcon className="w-6 h-6" />
                            Apply for Rent
                        </DialogTitle>
                    )}
                </DialogHeader>
                {rentalApplication?.status === RentStatus.REJECTED ? (
                    <RejectedStatus />
                ) : (
                    <RenterTimeline steps={steps} />
                )}
            </DialogContent>
        </Dialog>
    );
}
