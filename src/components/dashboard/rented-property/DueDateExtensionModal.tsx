import ControlledDateInput from "@/components/common/ControlledDateInput";
import { ControlledInput } from "@/components/common/ControlledInput";
import { ControlledTextarea } from "@/components/common/ControlledTextarea";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useRequestDueDateExtensionMutation } from "@/redux/reducers/rented-property/RentedPropertyApi";
import {
    setDueDateExtensionFormData,
    setDueDateExtensionModal,
    setDueDateExtensionSuccessModal,
} from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const dueDateExtensionSchema = z.object({
    address: z.string().min(1, { message: "Address is required" }),
    dueDate: z
        .string()
        .min(1, { message: "Due date is required" })
        .refine((date) => date.split("T")[0]),
    newDate: z
        .string()
        .min(1, { message: "New due date is required" })
        .refine((date) => date.split("T")[0]),
    reason: z.string().min(1, { message: "Reason is required" }),
});

const DueDateExtensionModal = () => {
    const dispatch = useDispatch();
    const dueDateExtensionModal = useSelector(
        (state: RootState) => state.rentedProperty.dueDateExtensionModal
    );
    const rentedProperty = useSelector(
        (state: RootState) => state.rentedProperty.rentedProperty
    );
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [requestDueDateExtension, { isLoading }] =
        useRequestDueDateExtensionMutation();
    const form = useForm<z.infer<typeof dueDateExtensionSchema>>({
        resolver: zodResolver(dueDateExtensionSchema),
        defaultValues: {
            address: "",
            dueDate: "",
            newDate: "",
            reason: "",
        },
    });
    const currentDueDateInformation = useSelector(
        (state: RootState) => state.rentedProperty.dueDateExtensionData
    );

    useEffect(() => {
        form.setValue("address", rentedProperty?.property?.address || "");
        form.setValue("dueDate", currentDueDateInformation?.dueDate || "");

        if (currentDueDateInformation?.dueDate) {
            const currentDate = new Date(currentDueDateInformation.dueDate);
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            const newDateString = newDate.toISOString().split("T")[0];
            form.setValue("newDate", newDateString);
        }
    }, [rentedProperty, currentDueDateInformation, dueDateExtensionModal]);

    async function handleDueDateExtension(
        formData: z.infer<typeof dueDateExtensionSchema>
    ) {
        const formattedData = {
            ...formData,
            newDueDate: formData.newDate.split("T")[0],
        };
        dispatch(setDueDateExtensionFormData(formattedData));
        setErrMsg(null);

        const response = await requestDueDateExtension({
            id: rentedProperty?.id,
            ...formattedData,
        });
        console.log("response: ", response);

        if (response.error) {
            setErrMsg(response.error.data.data.message);
        } else {
            dispatch(setDueDateExtensionModal(false));
            dispatch(setDueDateExtensionSuccessModal(true));
        }
    }

    return (
        <Dialog
            open={dueDateExtensionModal}
            onOpenChange={(state) => {
                form.resetField("newDate");
                form.resetField("reason");
                dispatch(setDueDateExtensionModal(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] sm:max-w-[650px]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-light flex items-center gap-2 border-b border-card pb-3">
                        Request due date extension
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleDueDateExtension)}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <ControlledInput
                                    control={form.control}
                                    name="address"
                                    label="Address"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-light">
                                    Current Rent Due Date
                                </p>
                                <ControlledDateInput
                                    form={form}
                                    control={form.control}
                                    name="dueDate"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-light">
                                    New Rent Due Date
                                </p>
                                <ControlledDateInput
                                    form={form}
                                    control={form.control}
                                    name="newDate"
                                    calendarWidth="w-80"
                                    disabled
                                />
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-muted italic">
                                    *Due date can be extended by 7 days, only
                                    once per month.
                                </p>
                            </div>
                            <div className="col-span-2">
                                <ControlledTextarea
                                    form={form}
                                    control={form.control}
                                    name="reason"
                                    label="Brief description of due date"
                                    className="h-24"
                                />
                            </div>
                        </div>
                        {errMsg && (
                            <p className="text-red-500 text-sm mt-3">
                                {errMsg}
                            </p>
                        )}
                        <div className="mt-6 grid">
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="ms-auto w-1/2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DueDateExtensionModal;
