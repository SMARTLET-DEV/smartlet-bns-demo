import { RentedPropertyState } from "@/assets/enumerators";
import {
    BathIcon,
    BedIcon,
    CalendarIcon,
    GeoAltIcon,
    OptionsIcon,
    SizeIcon,
} from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    useGetPaymentScheduleQuery,
    useGetSecurityDepositReceiptMutation,
} from "@/redux/reducers/rented-property/RentedPropertyApi";
import {
    setContractCancellationModal,
    setDueDateExtensionModal,
    setPaymentHistoryModal,
} from "@/redux/reducers/rented-property/RentedPropertySlice";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const options = [
    {
        paymentStatus: "DUE",
        options: [
            {
                text: "Payment History",
                dispatchFn: setPaymentHistoryModal(true),
                disabled: true,
            },
        ],
    },
    {
        paymentStatus: "OVERDUE",
        options: [
            {
                text: "Extend Due Date",
                dispatchFn: setDueDateExtensionModal(true),
                disabled: true,
            },
            {
                text: "Payment History",
                dispatchFn: setPaymentHistoryModal(true),
                disabled: true,
            },
            {
                text: "Contract Cancellation",
                dispatchFn: setContractCancellationModal(true),
            },
        ],
    },
    {
        paymentStatus: "PAID",
        options: [
            {
                text: "Payment History",
                dispatchFn: setPaymentHistoryModal(true),
                disabled: true,
            },
            {
                text: "Contract Cancellation",
                dispatchFn: setContractCancellationModal(true),
            },
        ],
    },
];

const serverURL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

export default function SingleRentedProperty({
    property,
}: {
    property: RentedPropertyState;
}) {
    const dispatch = useDispatch();
    const { data: paymentSchedule } = useGetPaymentScheduleQuery({
        id: property.id,
    });
    const options = useMemo(() => {
        const options = getOptions(paymentSchedule?.schedule[0]?.status || "");
        return options;
    }, [paymentSchedule]);

    function handlePayRent() {
        dispatch(setPaymentHistoryModal(true));
    }

    return (
        <div className="w-full lg:flex-row flex-col border border-card rounded-2xl p-4 flex gap-4 justify-between overflow-auto">
            <div className="flex gap-4 ">
                <img
                    src={
                        property?.property.media[0]
                            ? `${serverURL}${property?.property.media[0]}`
                            : "/property-img.png"
                    }
                    alt={property?.property.title}
                    className="max-w-[80px] lg:max-w-[214px] h-full rounded-lg object-cover"
                />
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 text-secondary lg:mb-6">
                        <div className="flex items-center gap-6">
                            <h3 className="lg:text-xl text-lg font-light">
                                {property?.property.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={"success"}
                                    className="capitalize text-sm hidden lg:block"
                                >
                                    Rented
                                </Badge>
                                {property.rentalType === "SMARTPLUS" && (
                                    <PaymentStatusBadge
                                        status={
                                            paymentSchedule?.schedule[0]
                                                ?.status || ""
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <p className="text-base text-muted flex items-center gap-1 capitalize">
                            <span>
                                <GeoAltIcon className="w-5 h-5" />
                            </span>
                            {`${property?.property.area}, ${property?.property.city}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-muted text-base">
                            <p className="flex items-center gap-1">
                                <span>
                                    <BedIcon className="w-4 h-4" />
                                </span>
                                {property?.property.bedrooms} Beds
                            </p>
                            <p className="flex items-center gap-1">
                                <span>
                                    <BathIcon className="w-4 h-4" />
                                </span>
                                {property?.property.bathrooms} Baths
                            </p>
                            <p className="flex items-center gap-1">
                                <span>
                                    <SizeIcon className="w-4 h-4" />
                                </span>
                                {property?.property.size} Sq
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center mb-2">
                        <p className="text-primary text-xl font-light">
                            ৳{property?.property.price}
                        </p>
                        <p className="text-muted text-base ms-1">per month</p>
                        <p className="font-light ms-2">24 Months Contract</p>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <p className="text-muted flex items-center gap-1">
                            <span>
                                <CalendarIcon className="w-4 h-4 text-secondary" />
                            </span>
                            {new Date(property?.startDate).toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>
                        <p className="mx-2">to</p>
                        <p className="text-muted flex items-center gap-1">
                            <span>
                                <CalendarIcon className="w-4 h-4 text-secondary" />
                            </span>
                            {new Date(
                                (() => {
                                    const date = new Date(property?.startDate);
                                    date.setMonth(date.getMonth() + 24);
                                    date.setDate(0);
                                    return date;
                                })()
                            ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between lg:hidden">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-muted flex items-center gap-1">
                        <span>
                            <CalendarIcon className="w-4 h-4 text-secondary" />
                        </span>
                        {new Date(property?.startDate).toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </p>
                    <p className="mx-2">to</p>
                    <p className="text-muted flex items-center gap-1">
                        <span>
                            <CalendarIcon className="w-4 h-4 text-secondary" />
                        </span>
                        {new Date(
                            (() => {
                                const date = new Date(property?.startDate);
                                date.setMonth(date.getMonth() + 24);
                                date.setDate(0);
                                return date;
                            })()
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <Badge
                    variant={"success"}
                    className="capitalize text-sm lg:hidden h-fit"
                >
                    Rented
                </Badge>
            </div>

            <div className="flex lg:flex-col flex-wrap gap-2 items-center lg:items-end justify-between lg:text-right">
                <div className="flex flex-col gap-1">
                    <p className="text-muted text-base hidden lg:flex flex-col">
                        Agent not assigned yet
                        <span>{property?.id}</span>
                    </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                    <div className="hidden lg:flex gap-5">
                        {paymentSchedule?.schedule && (
                            <Button
                                onClick={handlePayRent}
                                disabled={property.rentalType !== "SMARTPLUS"}
                            >
                                Payment History
                            </Button>
                        )}
                        <OptionsDropdown
                            options={options?.options || []}
                            dispatch={dispatch}
                            rentalId={property.id}
                        />
                    </div>
                </div>
            </div>

            <div className="flex lg:hidden flex-wrap justify-between pt-4 border-t mt-4">
                <div className="flex items-center mb-2">
                    <p className="text-primary text-xl font-normal">
                        ৳{property?.property.price}
                    </p>
                    <p className="text-muted text-base ms-1">per month</p>
                </div>
                <div className="flex gap-5 ms-auto">
                    {paymentSchedule?.schedule && (
                        <Button
                            onClick={handlePayRent}
                            disabled={property.rentalType !== "SMARTPLUS"}
                        >
                            Payment History
                        </Button>
                    )}
                    <OptionsDropdown
                        options={options?.options || []}
                        dispatch={dispatch}
                        rentalId={property.id}
                    />
                </div>
            </div>
        </div>
    );
}

function OptionsDropdown({
    options,
    dispatch,
    rentalId,
}: {
    options: { text: string; dispatchFn: any; disabled?: boolean }[];
    dispatch: any;
    rentalId: string;
}) {
    const [getSecurityDepositReceipt, { isLoading }] =
        useGetSecurityDepositReceiptMutation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <OptionsIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option, index) => (
                    <DropdownMenuItem key={index} asChild>
                        <Button
                            variant="ghost"
                            className="w-full cursor-pointer justify-start hover:outline-none"
                            onClick={() => {
                                dispatch(option.dispatchFn);
                            }}
                            disabled={option.disabled}
                        >
                            {option.text}
                        </Button>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full cursor-pointer justify-start hover:outline-none"
                        onClick={async () => {
                            try {
                                const response =
                                    await getSecurityDepositReceipt({
                                        rentalId: rentalId,
                                    });
                                if (response.error) {
                                    toast.error(response.error.data.message);
                                } else {
                                    const receiptUrl =
                                        response.data.data.receiptUrl;
                                    if (receiptUrl) {
                                        window.open(receiptUrl, "_blank");
                                    }
                                }
                            } catch (error) {
                                console.log("error:", error);
                            }
                        }}
                    >
                        Download Security Deposit Receipt
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function getOptions(paymentStatus: string) {
    return options.find((option) => {
        return option.paymentStatus === paymentStatus;
    });
}

export function PaymentStatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    return (
        <Badge
            variant={status.includes("DUE") ? "warning" : "success"}
            className={cn("capitalize text-sm hidden lg:block", className)}
        >
            {status.toLowerCase()}
        </Badge>
    );
}
