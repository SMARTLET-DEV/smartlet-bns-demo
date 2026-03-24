"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@/assets/icons"; // Matching first code
import { useIsMobile } from "@/hooks/useIsMobile";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setSuccessDialogOpen } from "@/redux/reducers/contact/contactSlice";

export function SuccessDialog() {
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const { isSuccessDialogOpen, submittedFormData } = useAppSelector((state) => state.contact);

    const handleOpenChange = (open: boolean) => {
        dispatch(setSuccessDialogOpen(open));
    };

    const content = (
        <>
            <DialogHeader>
                <DialogTitle className="hidden">Success</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-3" />
                <p className="text-lg sm:text-xl font-medium text-black mb-6">
          You will be contacted by our team shortly.
                </p>
                {/* <div className="space-y-4 mb-6">
          <h3 className="text-xl font-normal text-black">Message Sent Successfully</h3>
          {submittedFormData && (
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">First Name:</p>
                <p>{submittedFormData.firstName}</p>
              </div>
              <div>
                <p className="font-medium">Last Name:</p>
                <p>{submittedFormData.lastName}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{submittedFormData.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>{submittedFormData.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Message:</p>
                <p className="whitespace-pre-wrap">{submittedFormData.requestMessage}</p>
              </div>
            </div>
          )}
          <p className="text-lg font-medium text-black">
            We got your message, we will get back to you soon.
          </p>
        </div> */}

            </div>
            <DialogFooter className="w-full">
                <Button
                    className="bg-[#EB5C60] text-white hover:bg-[#D94D51] w-full max-w-[120px] mx-auto"
                    onClick={() => handleOpenChange(false)}
                >
          Okay
                </Button>
            </DialogFooter>
        </>
    );

    return (
        <Dialog open={isSuccessDialogOpen} onOpenChange={handleOpenChange}>
            {isMobile ? (
                <DialogContent
                    className="
            fixed bottom-0 left-0 right-0 w-full top-auto
            max-w-screen-sm
            translate-x-0 translate-y-0
            max-h-[70vh]
            overflow-y-auto overflow-x-hidden
            rounded-t-2xl z-50 transition-transform duration-300 ease-in-out
            px-4 pt-4 pb-6 bg-white
            [&>button]:hidden
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
                <DialogContent className="sm:max-w-[480px] max-h-[95vh] overflow-y-auto sm:max-h-[700px] rounded-[16px] lg:rounded-[30px] [&>button]:hidden">
                    {content}
                </DialogContent>
            )}
        </Dialog>
    );
}

export default SuccessDialog;
