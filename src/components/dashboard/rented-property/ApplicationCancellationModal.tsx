import { TrashcanIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCancelApplicationMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { setApplicationCancellationModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ApplicationCancellationModal = () => {
    const dispatch = useDispatch();
    const applicationCancellationModal = useSelector(
        (state: RootState) =>
            state.rentalApplication.applicationCancellationModal
    );
    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );

    const [cancelApplication, { isLoading }] = useCancelApplicationMutation();

    const handleCancelApplication = async () => {
        console.log("application:", application);
        if (!application?.id) return;
        const response = await cancelApplication({
            applicationId: application.id,
        });
        if (response.error) {
            console.log("error:", response.error);
        } else {
            dispatch(setApplicationCancellationModal(false));
        }
    };

    return (
        <Dialog
            open={applicationCancellationModal}
            onOpenChange={(state) => {
                dispatch(setApplicationCancellationModal(state));
            }}
        >
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px] px-10"
            >
                <DialogHeader>
                    <DialogTitle className="flex flex-col text-center items-center gap-2 font-light text-2xl pb-3">
                        <TrashcanIcon className="w-16 h-16 text-primary" />
                        Confirm Cancellation
                    </DialogTitle>
                </DialogHeader>
                <p className="text-center text-muted">
                    Are you sure you want to cancel your application for{" "}
                    {application?.property?.title}? This action cannot be
                    undone.
                </p>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    <Button
                        variant="outline"
                        onClick={() => {
                            dispatch(setApplicationCancellationModal(false));
                        }}
                        disabled={isLoading}
                    >
                        Keep Application
                    </Button>
                    <Button
                        onClick={handleCancelApplication}
                        disabled={isLoading}
                        className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Cancel Application"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationCancellationModal;
