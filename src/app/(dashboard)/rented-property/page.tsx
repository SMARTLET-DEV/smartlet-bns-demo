"use client";

import { ChevronRightIcon } from "@/assets/icons";
import ApplicationCancellationModal from "@/components/dashboard/rented-property/ApplicationCancellationModal";
import ContractCancellationModal from "@/components/dashboard/rented-property/ContractCancellationModal";
import ContractCancellationSuccessModal from "@/components/dashboard/rented-property/ContractCancellationSuccessModal";
import ContractSignSuccess from "@/components/dashboard/rented-property/ContractSignSuccess";
import DueDateExtensionModal from "@/components/dashboard/rented-property/DueDateExtensionModal";
import DueDateExtensionSuccessModal from "@/components/dashboard/rented-property/DueDateExtensionSuccess";
import PaymentHistoryModal from "@/components/dashboard/rented-property/PaymentHistoryModal";
import PaymentRejectedModal from "@/components/dashboard/rented-property/PaymentRejectedModal";
import PaymentSuccessModal from "@/components/dashboard/rented-property/PaymentSuccessModal";
import RentalApplicationModal from "@/components/dashboard/rented-property/RentalApplicationModal";
import RentalPropertyList from "@/components/dashboard/rented-property/RentalPropertyList";
import RentPaymentModal from "@/components/dashboard/rented-property/RentPaymentModal";
import Link from "next/link";

const RentedPropertyPage = () => {
    return (
        <div className="flex-grow">
            <div className="lg:mb-12 mb-4">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-light">Rental Status</h1>
                <div className="lg:flex hidden items-center gap-4 mt-4">
                    <Link href="/" className="text-muted">
                        Home
                    </Link>
                    <p>
                        <ChevronRightIcon className="w-3 h-3" />
                    </p>
                    <p>Rental Status</p>
                </div>
            </div>
            <RentalPropertyList />
            <RentalApplicationModal />
            <ContractSignSuccess />
            <PaymentSuccessModal />
            <PaymentHistoryModal />
            <DueDateExtensionModal />
            <DueDateExtensionSuccessModal />
            <RentPaymentModal />
            <ContractCancellationModal />
            <ContractCancellationSuccessModal />
            <PaymentRejectedModal />
            <ApplicationCancellationModal />
        </div>
    );
};

export default RentedPropertyPage;
