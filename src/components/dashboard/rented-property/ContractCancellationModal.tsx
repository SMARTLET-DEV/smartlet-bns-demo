import { ControlledTextarea } from "@/components/common/ControlledTextarea";
import AppointmentBookingCalendar from "@/components/properties/appointment-booking/AppointmentBookingCalendar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { useRequestContractTerminationMutation } from "@/redux/reducers/rented-property/RentedPropertyApi";
import {
    setContractCancellationData,
    setContractCancellationModal,
    setContractCancellationSuccessModal,
} from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const contractTerminationSchema = z.object({
    moveOutDate: z.string().refine((date) => {
        try {
            const d = new Date(date);
            return !isNaN(d.getTime()) && d.toISOString() === date;
        } catch {
            return false;
        }
    }, "Please select a valid date in ISO format"),
    reason: z.string().min(5, { message: "Reason is required" }),
    rentalId: z.string(),
});

const ContractCancellationModal = () => {
    const dispatch = useDispatch();
    const contractCancellationModal = useSelector(
        (state: RootState) => state.rentedProperty.contractCancellationModal
    );
    const contractCancellationSuccessModal = useSelector(
        (state: RootState) =>
            state.rentedProperty.contractCancellationSuccessModal
    );
    const form = useForm<z.infer<typeof contractTerminationSchema>>({
        resolver: zodResolver(contractTerminationSchema),
        defaultValues: {
            moveOutDate: "",
            reason: "",
            rentalId: "",
        },
    });
    const rentalId = useSelector(
        (state: RootState) => state.rentedProperty?.rentedProperty?.id
    );
    const [requestContractTermination, { isLoading }] =
        useRequestContractTerminationMutation();

    const handleContractTermination = async (
        formData: z.infer<typeof contractTerminationSchema>
    ) => {
        const data = {
            moveOutDate: formData.moveOutDate,
            reason: formData.reason,
            rentalId,
        };
        try {
            const responseData = await requestContractTermination(data);
            const response = responseData.data;
            console.log(responseData);
            if (response.success === true) {
                dispatch(setContractCancellationData(response.request));
                form.reset();
                dispatch(setContractCancellationModal(false));
                dispatch(setContractCancellationSuccessModal(true));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog
            open={contractCancellationModal}
            onOpenChange={(state) => {
                dispatch(setContractCancellationModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[685px]">
                <DialogHeader className="text-left">
                    <DialogTitle className="pb-3 border-b border-card">
                        <p className="text-xl font-light">
                            Request Contract Termination
                        </p>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleContractTermination)}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-light">Move-out Date</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <p className="w-full text-left py-3 px-4 border text-base md:text-sm rounded-md cursor-pointer">
                                        {form.watch("moveOutDate")
                                            ? new Date(
                                                  form.watch("moveOutDate")
                                              ).toLocaleDateString("en-UK", {
                                                  day: "2-digit",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "Select a date"}
                                    </p>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-96">
                                    <div className="p-5">
                                        <AppointmentBookingCalendar
                                            control={form.control}
                                            name="moveOutDate"
                                            disabledDates={[]}
                                            calendarMaxWidth="w-full"
                                        />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <ControlledTextarea
                            control={form.control}
                            name="reason"
                            label="Reason for cancellation"
                            placeHolder="Enter your reason"
                            className="h-32"
                        />
                        <DialogFooter className="mt-4 grid grid-cols-2">
                            <div className=""></div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ContractCancellationModal;
