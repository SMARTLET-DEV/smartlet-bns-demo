import { RentStatus } from "@/assets/enumerators";
import { GeoAltIcon } from "@/assets/icons";
import { StepperMethods } from "@/components/properties/apply-for-rent/RenterTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGenerateContractMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { setRentalApplicationModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface ApplicationStatusProps {
    stepperMethods: StepperMethods;
}

const ApplicationStatus = ({ stepperMethods }: ApplicationStatusProps) => {
    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );

    const [generateContract, { isLoading }] = useGenerateContractMutation();
    const dispatch = useDispatch();

    return (
        <div className="pe-2 max-h-[70vh] overflow-y-auto">
            <p className="text-center text-xl font-light">
                {application?.status === RentStatus.PENDING
                    ? "Your Application is in review"
                    : application?.status === RentStatus.REJECTED
                    ? "Your Application has been rejected"
                    : application?.status === RentStatus.APPROVED
                    ? "Your Application has been approved"
                    : null}
            </p>
            <div className="mt-6 p-4 bg-card rounded-lg grid grid-cols-2">
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium">
                        {application?.property.title}
                    </p>
                    <p className="text-sm text-muted flex items-center gap-1 capitalize">
                        <GeoAltIcon className="w-4 h-4" />
                        {`${application?.property.area}, ${application?.property.city}`}
                    </p>
                </div>
                <div className="flex justify-end items-center">
                    <Badge
                        variant={
                            application?.status === RentStatus.PENDING
                                ? "warning"
                                : application?.status === RentStatus.REJECTED
                                ? "destructive"
                                : application?.status === RentStatus.APPROVED
                                ? "success"
                                : application?.status === RentStatus.RENTED
                                ? "default"
                                : "default"
                        }
                        className="capitalize text-sm hidden lg:block"
                    >
                        {application?.status.toLowerCase()}
                    </Badge>
                </div>
            </div>

            <div
                className={`justify-end mt-5 w-full  gap-4 ${
                    application?.status === RentStatus.APPROVED
                        ? "grid grid-cols-2"
                        : "flex"
                }`}
            >
                <Button
                    variant={"outline"}
                    disabled={isLoading}
                    onClick={() => {
                        dispatch(setRentalApplicationModal(false));
                    }}
                >
                    Cancel
                </Button>
                {application?.status === RentStatus.APPROVED && (
                    <Button
                        disabled={isLoading}
                        onClick={async () => {
                            if (
                                application?.id &&
                                !application?.contractSigned
                            ) {
                                await generateContract({
                                    id: application?.id,
                                });
                            }
                            stepperMethods.next();
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            "Next"
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ApplicationStatus;
