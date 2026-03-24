"use client";

import { CheckCircleIcon, PdfIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
    clearRentalApplication,
    setApplyForRentSuccess,
} from "@/redux/reducers/property/propertySlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const ApplyForRentSuccess = () => {
    const lastSuccessfulApplication = useSelector(
        (state: RootState) => state.property.rentalApplication
    );
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const applyRentSuccessOpen = useSelector(
        (state: RootState) => state.property.propertyModal.applyForRentSuccess
    );

    if (!lastSuccessfulApplication.id) return null;

    const content = (
        <>
            <DialogHeader>
                <DialogTitle className="hidden">
                    Appointment Booking Success
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center ">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-3" />
                <h1 className="text-2xl font-light text-center mb-2">
                    Your application has been submitted
                </h1>
                <p className="text-sm text-gray-500 text-center">
                    We will get back to you within the next working day
                </p>

                <div className="mt-5 px-4 py-8 bg-card border rounded-lg w-full flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2 font-normal">
                            Name:
                        </p>
                        <p className="text-muted">{user?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2 font-normal">
                            Phone Number:
                        </p>
                        <p className="text-muted">{user?.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2 font-normal">
                            Email ID:
                        </p>
                        <p className="text-muted">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2 font-normal">
                            Preferred Move-In Month:
                        </p>
                        <p className="text-muted">
                            {new Date(
                                lastSuccessfulApplication.preferredMoveInMonth
                            ).toLocaleDateString("en-UK", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2">
                            <PdfIcon className="w-7 h-7 text-primary" />
                        </p>
                        <p className="text-muted">
                            {
                                lastSuccessfulApplication.renterDocuments
                                    .identityDocument
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-secondary flex items-center gap-2">
                            <PdfIcon className="w-7 h-7 text-primary" />
                        </p>
                        <p className="text-muted">
                            {
                                lastSuccessfulApplication.renterDocuments
                                    .financialDocument
                            }
                        </p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <div className="w-full flex justify-center">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            dispatch(clearRentalApplication());
                            dispatch(setApplyForRentSuccess(false));
                        }}
                    >
                        Close
                    </Button>
                </div>
            </DialogFooter>
        </>
    );

    return (
        <Dialog
            open={applyRentSuccessOpen}
            onOpenChange={(state) => {
                dispatch(clearRentalApplication());
                dispatch(setApplyForRentSuccess(state));
            }}
        >
            {isMobile ? (
                <DialogContent
                    className="
            fixed bottom-0 left-0 right-0 w-full
            max-w-screen-sm
            translate-x-0 translate-y-0
            max-h-[70vh]
            overflow-y-auto overflow-x-hidden
            rounded-t-2xl z-50 transition-transform duration-300 ease-in-out
            px-4 pt-4 pb-6
          "
                    style={{
                        boxSizing: "border-box",
                        maxWidth: "100vw",
                        overflowX: "hidden",
                    }}
                >
                    {content}
                </DialogContent>
            ) : (
                <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto sm:max-h-[700px] rounded-[16px] lg:rounded-[30px]">
                    {content}
                </DialogContent>
            )}
        </Dialog>
    );
};

export default ApplyForRentSuccess;
