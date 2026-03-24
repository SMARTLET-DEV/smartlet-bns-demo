import { GeoAltIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useApplyAgainMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { setRentalApplicationModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const RejectedStatus = () => {
    const dispatch = useDispatch();
    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );
    const [applyAgain, { isLoading }] = useApplyAgainMutation();

    const handleApplyAgain = async () => {
        if (!application?.id) return;
        console.log(application?.id);
        try {
            const response = await applyAgain({
                applicationId: application?.id,
                body: {
                    rentalApplicationId: application?.id,
                },
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="p-4 bg-card rounded-lg grid grid-cols-2">
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium">
                        {application?.property?.title}
                    </p>
                    <p className="text-sm text-muted flex items-center gap-1">
                        <GeoAltIcon className="w-4 h-4" />
                        {application?.property?.area},{" "}
                        {application?.property?.city}
                    </p>
                </div>
                <div className="flex justify-end items-center">
                    <p className="text-destructive-foreground px-2 py-1 rounded-md text-sm">
                        Rejected
                    </p>
                </div>
            </div>

            <p className="text-muted text-sm pt-6 pb-10 text-center">
                {application?.rejectionReason || "No reason provided"}
            </p>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        dispatch(setRentalApplicationModal(false));
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={handleApplyAgain} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Apply Again"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default RejectedStatus;
