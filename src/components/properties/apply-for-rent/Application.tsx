import { ControlledFileInput } from "@/components/common/ControlledFileInput";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";
import { useCreateApplyForRentMutation } from "@/redux/reducers/property/propertyApi";
import {
    setApplyForRent,
    setApplyForRentSuccess,
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
import { Form } from "../../ui/form";
import AppointmentBookingCalendar from "../appointment-booking/AppointmentBookingCalendar";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const fileSchema = z.custom<File>(
    (file) => {
        if (!file) {
            return false;
        }
        if (!(file instanceof File)) {
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            return false;
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            return false;
        }
        return true;
    },
    {
        message: "Please upload a valid PDF file under 5MB",
    }
);

const applicationSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Please enter a valid email address"),
    identityDocument: fileSchema.refine((file) => !!file, {
        message: "Identity document is required",
    }),
    financialDocument: fileSchema.refine((file) => !!file, {
        message: "Financial document is required",
    }),
    preferredMoveInMonth: z.string().refine((date) => {
        try {
            const d = new Date(date);
            return !isNaN(d.getTime()) && d.toISOString() === date;
        } catch {
            return false;
        }
    }, "Please select a valid date in ISO format"),
    profession: z.string().min(1, "Profession is required"),
    familySize: z.coerce.number().min(1, "Family size is required"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function Application() {
    const user = useSelector((state: any) => state.auth.user);

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            firstName: user?.name?.split(" ")[0] || "",
            lastName: user?.name?.split(" ").slice(1).join(" ") || "",
            phone: user?.phone || "",
            email: user?.email || "",
            profession: "",
            familySize: 1,
            identityDocument: undefined,
            financialDocument: undefined,
            preferredMoveInMonth: new Date().toISOString(),
        },
    });

    if (!user) return null;

    const { id: propertyId } = useParams();

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user?.name?.split(" ")[0] || "",
                lastName: user?.name?.split(" ").slice(1).join(" ") || "",
                phone: user?.phone || "",
                email: user?.email || "",
                profession: "",
                familySize: 1,
                identityDocument: undefined,
                financialDocument: undefined,
                preferredMoveInMonth: new Date().toISOString(),
            });
        }
    }, [user]);

    const [applyForRent, { isLoading }] = useCreateApplyForRentMutation();
    const dispatch = useDispatch();
    const { success, error } = useToast();

    const handleApplicationSubmit = async (formData: ApplicationFormData) => {
        try {
            if (!propertyId) {
                error("Property ID is missing");
                return;
            }

            const moveInDate = new Date(formData.preferredMoveInMonth);
            if (isNaN(moveInDate.getTime())) {
                error("Please select a valid move-in date");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("propertyId", propertyId.toString());
            formDataToSend.append(
                "preferredMoveInMonth",
                moveInDate.toISOString()
            );
            formDataToSend.append(
                "identityDocument",
                formData.identityDocument
            );
            formDataToSend.append(
                "financialDocument",
                formData.financialDocument
            );
            await applyForRent(formDataToSend).unwrap();
            success("Application submitted successfully!");
            dispatch(setApplyForRent(false));
            dispatch(setApplyForRentSuccess(true));
        } catch (err: any) {
            error(
                err?.data?.message ||
                    "Failed to submit application. Please try again."
            );
            console.error("Form submission error:", err);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleApplicationSubmit)}
                className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pe-2"
            >
                <div className="grid lg:grid-cols-2 gap-4 items-start">
                    <ControlledInput
                        control={form.control}
                        name="firstName"
                        label="First Name"
                        placeHolder="Who"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="lastName"
                        label="Last Name"
                        placeHolder="this?"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="phone"
                        label="Contact Number"
                        placeHolder="1234556788"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="email"
                        label="Email"
                        placeHolder="tamimikbal@gmail.com"
                        type="email"
                        disabled={true}
                    />
                    <ControlledInput
                        control={form.control}
                        name="profession"
                        label="Profession"
                        placeHolder="Enter your profession"
                    />
                    <ControlledInput
                        control={form.control}
                        name="familySize"
                        label="No of family member"
                        placeHolder="1"
                        type="number"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-normal">
                            Preferred Move-in Month
                        </p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <p className="w-full text-left py-3 px-4 border text-base md:text-sm rounded-md cursor-pointer">
                                    {form.watch("preferredMoveInMonth")
                                        ? new Date(
                                              form.watch("preferredMoveInMonth")
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
                                        name="preferredMoveInMonth"
                                        disabledDates={[]}
                                        calendarMaxWidth="w-full"
                                    />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div>
                    <ControlledFileInput
                        control={form.control}
                        name="identityDocument"
                        label="Identity Verification Document (NID/Passport)"
                        accept={ACCEPTED_FILE_TYPES.join(",")}
                    />
                </div>
                <div>
                    <ControlledFileInput
                        control={form.control}
                        name="financialDocument"
                        label="Financial Eligibility Document"
                        accept={ACCEPTED_FILE_TYPES.join(",")}
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
                            "Submit"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
