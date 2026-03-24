import { DownloadIcon, XIcon } from "@/assets/icons";
import { StepperMethods } from "@/components/properties/apply-for-rent/RenterTimeline";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetUnsignedContractMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { setRentalApplicationModal } from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignatureImageInput from "./SignatureImageInput";

interface ContractSigningProps {
    stepperMethods: StepperMethods;
}

const ContractSigning = ({ stepperMethods }: ContractSigningProps) => {
    const [isChecked, setIsChecked] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [contractUrl, setContractUrl] = useState<string | null>(null);
    const [isLoadingContract, setIsLoadingContract] = useState(false);
    const [getUnsignedContract, { isLoading }] =
        useGetUnsignedContractMutation();
    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );
    const dispatch = useDispatch();

    // Load contract URL when component mounts
    useEffect(() => {
        setIsChecked(application?.contractSigned === true);
        setUploaded(application?.contractSigned === true);
        const loadContract = async () => {
            if (application?.id) {
                setIsLoadingContract(true);
                try {
                    const { data } = await getUnsignedContract({
                        id: application?.id,
                    });
                    if (data?.downloadUrl) {
                        setContractUrl(data.downloadUrl);
                    }
                } catch (error) {
                    console.error("Error loading contract:", error);
                } finally {
                    setIsLoadingContract(false);
                }
            }
        };

        loadContract();
    }, [application?.id, getUnsignedContract]);

    const handleDownloadClick = async () => {
        if (application?.id) {
            try {
                const { data } = await getUnsignedContract({
                    id: application?.id,
                });
                window.open(data.downloadUrl, "_blank");
            } catch (error) {
                console.error("Error downloading contract:", error);
            }
        }
    };

    return (
        <div className="pe-2 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-card">
                <p className="text-xl font-light">Terms & Conditions</p>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleDownloadClick}
                        variant={"outline"}
                        disabled={isLoading}
                        type="button"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <DownloadIcon className="w-4 h-4" />
                        )}
                        Download Document
                    </Button>
                    <XIcon className="w-7 h-7" />
                </div>
            </div>

            {/* Contract PDF Viewer */}
            <div className="bg-card mt-5 rounded-lg overflow-hidden">
                {isLoadingContract ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="ml-2">Loading contract...</span>
                    </div>
                ) : contractUrl ? (
                    <iframe
                        src={contractUrl}
                        title="Terms PDF Preview"
                        className="w-full h-[180px] rounded-md border"
                        onLoad={() => setIsLoadingContract(false)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-64 text-muted">
                        <p>No contract available</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-2">
                <Label className="cursor-pointer">
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                            setIsChecked(checked === true)
                        }
                        disabled={
                            uploaded || application?.contractSigned === true
                        }
                    />
                    <p>I agree to the terms and conditions</p>
                </Label>
            </div>
            <div className="mt-3">
                {isChecked && (
                    <SignatureImageInput
                        setUploaded={setUploaded}
                        applicationId={application?.id}
                        stepperMethods={stepperMethods}
                    />
                )}
            </div>
            <div className="justify-end mt-5 w-full gap-4 grid grid-cols-2">
                <Button
                    variant={"outline"}
                    disabled={isLoading}
                    onClick={() => {
                        dispatch(setRentalApplicationModal(false));
                    }}
                >
                    Cancel
                </Button>

                <Button
                    disabled={!uploaded}
                    onClick={async () => {
                        stepperMethods.next();
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ContractSigning;
