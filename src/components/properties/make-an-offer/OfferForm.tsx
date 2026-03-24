import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";
import {
    useGetProfileDataQuery,
} from "@/redux/reducers/profile/profileApi";
import {
    setMakeAnOffer,
} from "@/redux/reducers/property/propertySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { ControlledInput } from "../../common/ControlledInput";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import AppointmentBookingCalendar from "../appointment-booking/AppointmentBookingCalendar";

const offerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    contactNo: z.string().min(1, "Contact number is required"),
    rentOffer: z.coerce.number().min(1, "Rent offer is required"),
    preferredDepositMonths: z.coerce.number().min(1, "Preferred deposit months is required"),
    preferredMoveInDate: z.string().refine((date) => {
        try {
            const d = new Date(date);
            return !isNaN(d.getTime()) && d.toISOString() === date;
        } catch {
            return false;
        }
    }, "Please select a valid date in ISO format"),
    additionalNotes: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

export default function OfferForm() {
    const form = useForm<OfferFormData>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            name: "",
            contactNo: "",
            rentOffer: 0,
            preferredDepositMonths: 2,
            preferredMoveInDate: new Date().toISOString(),
            additionalNotes: "",
        },
    });

    const user = useSelector((state: any) => state.auth.user);

    if (!user) return null;

    const { data: profileData } = useGetProfileDataQuery(user?.id);
    const { id: propertyId } = useParams();

    useEffect(() => {
        if (user && profileData) {
            form.reset({
                name: `${profileData?.profile.firstName || ""} ${profileData?.profile.lastName || ""}`.trim(),
                contactNo: profileData?.profile.phone || "",
                rentOffer: 0,
                preferredDepositMonths: 2,
                preferredMoveInDate: new Date().toISOString(),
                additionalNotes: "",
            });
        }
    }, [user, profileData]);

    const dispatch = useDispatch();
    const { success, error } = useToast();
    const isLoading = false; // Will be used when backend is ready

    const handleOfferSubmit = async (formData: OfferFormData) => {
        try {
            if (!propertyId) {
                error("Property ID is missing");
                return;
            }

            const moveInDate = new Date(formData.preferredMoveInDate);
            if (isNaN(moveInDate.getTime())) {
                error("Please select a valid move-in date");
                return;
            }

            // TODO: Backend integration - uncomment when ready
            // const offerData = {
            //     propertyId,
            //     name: formData.name,
            //     contactNo: formData.contactNo,
            //     rentOffer: formData.rentOffer,
            //     preferredDepositMonths: formData.preferredDepositMonths,
            //     preferredMoveInDate: moveInDate.toISOString(),
            //     additionalNotes: formData.additionalNotes,
            // };
            // await makeOffer(offerData).unwrap();

            success("Offer submitted successfully!");
            dispatch(setMakeAnOffer(false));
        } catch (err: any) {
            error(
                err?.data?.message ||
                    "Failed to submit offer. Please try again."
            );
            console.error("Form submission error:", err);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleOfferSubmit)}
                className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pe-2"
            >
                <div className="grid lg:grid-cols-2 gap-4 items-start">
                    <ControlledInput
                        control={form.control}
                        name="name"
                        label="Name"
                        placeHolder="Enter your name"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="contactNo"
                        label="Contact Number"
                        placeHolder="Enter your contact number"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="rentOffer"
                        label="Rent Offer (&#2547;)"
                        placeHolder="Enter your rent offer"
                        type="number"
                    />
                    <ControlledInput
                        control={form.control}
                        name="preferredDepositMonths"
                        label="Preferred Deposit Months"
                        placeHolder="Enter number of months"
                        type="number"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-normal">
                            Preferred Move-in Date
                        </p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <p className="w-full text-left py-3 px-4 border text-base md:text-sm rounded-md cursor-pointer">
                                    {form.watch("preferredMoveInDate")
                                        ? new Date(
                                              form.watch("preferredMoveInDate")
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
                                        name="preferredMoveInDate"
                                        disabledDates={[]}
                                        calendarMaxWidth="w-full"
                                    />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-normal">
                                    Additional Notes
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter any additional notes or comments..."
                                        className="resize-none min-h-[100px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div></div>
                    <Button
                        type="submit"
                        className="h-fit cursor-pointer bg-[#CBC3E3] text-white border border-primary hover:bg-primary font-normal rounded-lg transition"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin"></Loader2>
                        ) : (
                            "Submit Offer"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
