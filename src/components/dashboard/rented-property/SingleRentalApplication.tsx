import { PropertyState, RentStatus } from "@/assets/enumerators";
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
import {
    setApplicationCancellationModal,
    setRentalApplicationModal,
    setRentalApplicationProperty,
} from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

const options = [
    {
        status: RentStatus.PENDING,
        options: [
            {
                text: "Cancel Application",
                applicationNeeded: true,
                dispatchFn: setApplicationCancellationModal(true),
            },
        ],
    },
    {
        status: RentStatus.REJECTED,
        options: [
            {
                text: "View Issue",
                applicationNeeded: true,
                dispatchFn: setRentalApplicationModal(true),
            },
            {
                text: "Apply Again",
                applicationNeeded: true,
                dispatchFn: setRentalApplicationModal(true),
            },
            {
                text: "Cancel Application",
                applicationNeeded: true,
                dispatchFn: setApplicationCancellationModal(true),
            },
        ],
    },
    {
        status: RentStatus.APPROVED,
        options: [
            {
                text: "View Agent Request",
                applicationNeeded: false,
                dispatchFn: () => {},
            },
        ],
    },
];

const serverURL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

export default function SingleRentalApplication({
    application,
}: {
    application: PropertyState & { id: string; contractSigned?: boolean };
}) {
    const options = useMemo(() => getOptions(application), [application]);
    const dispatch = useDispatch();

    function handleViewApplication() {
        // if (application?.contractSigned === true) {
        //     return dispatch(setContractSignSuccess(true));
        // }
        dispatch(setRentalApplicationProperty(application));
        dispatch(setRentalApplicationModal(true));
    }

    return (
        <div className="w-full lg:flex-row flex-col border border-card rounded-2xl p-4 flex gap-4 justify-between overflow-auto">
            <div className="flex gap-4 ">
                <img
                    src={
                        application?.property.media[0]
                            ? `${serverURL}${application?.property.media[0]}`
                            : "/property-img.png"
                    }
                    alt={application?.property.title}
                    className="max-w-[80px] lg:max-w-[214px] h-full rounded-lg object-cover"
                />
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2 text-secondary lg:mb-6">
                        <div className="flex items-center gap-6">
                            <h3 className="lg:text-xl text-lg font-light">
                                {application?.property.title}
                            </h3>
                            <Badge
                                variant={
                                    application.status === RentStatus.PENDING
                                        ? "warning"
                                        : application.status ===
                                          RentStatus.REJECTED
                                        ? "destructive"
                                        : application.status ===
                                          RentStatus.APPROVED
                                        ? "success"
                                        : application.status ===
                                          RentStatus.RENTED
                                        ? "default"
                                        : "default"
                                }
                                className="capitalize text-sm hidden lg:block"
                            >
                                {application?.status.toLowerCase()}
                            </Badge>
                        </div>
                        <p className="text-base text-muted flex items-center gap-1 capitalize">
                            <span>
                                <GeoAltIcon className="w-5 h-5" />
                            </span>
                            {`${application?.property.area}, ${application?.property.city}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-muted text-base">
                            <p className="flex items-center gap-1">
                                <span>
                                    <BedIcon className="w-4 h-4" />
                                </span>
                                {application?.property.bedrooms} Beds
                            </p>
                            <p className="flex items-center gap-1">
                                <span>
                                    <BathIcon className="w-4 h-4" />
                                </span>
                                {application?.property.bathrooms} Baths
                            </p>
                            <p className="flex items-center gap-1">
                                <span>
                                    <SizeIcon className="w-4 h-4" />
                                </span>
                                {application?.property.size} Sq
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center mb-2">
                        <p className="text-primary text-xl font-light">
                            ৳{application?.property.price}
                        </p>
                        <p className="text-muted text-base ms-1">per month</p>
                        <p className="font-light ms-2">24 Months Contract</p>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <p className="text-muted flex items-center gap-1">
                            <span>
                                <CalendarIcon className="w-4 h-4 text-secondary" />
                            </span>
                            {new Date(
                                application?.preferredMoveInMonth
                            ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <p className="mx-2">to</p>
                        <p className="text-muted flex items-center gap-1">
                            <span>
                                <CalendarIcon className="w-4 h-4 text-secondary" />
                            </span>
                            {new Date(
                                (() => {
                                    const date = new Date(
                                        application?.preferredMoveInMonth
                                    );
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
                        {new Date(
                            application?.preferredMoveInMonth
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                    <p className="mx-2">to</p>
                    <p className="text-muted flex items-center gap-1">
                        <span>
                            <CalendarIcon className="w-4 h-4 text-secondary" />
                        </span>
                        {new Date(
                            application?.preferredMoveInMonth
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <Badge
                    variant={
                        application?.status === RentStatus.PENDING
                            ? "warning"
                            : application?.status === RentStatus.REJECTED
                            ? "destructive"
                            : application?.status === RentStatus.APPROVED
                            ? "success"
                            : application?.status === RentStatus.RENTED
                            ? "default"
                            : "default"
                    }
                    className="capitalize text-sm lg:hidden h-fit"
                >
                    {application?.status.toLowerCase()}
                </Badge>
            </div>

            <div className="flex lg:flex-col flex-wrap gap-2 items-center lg:items-end justify-between lg:text-right">
                <div className="flex flex-col gap-1">
                    {/* <p className="text-muted text-sm hidden lg:block">
                        Agent Number
                    </p>
                    <p className="text-secondary text-sm font-normal flex items-center gap-1 lg:ms-auto">
                        <span className="me-2">
                            <TelephoneIcon className="w-4 h-4" />
                        </span>
                        {property?.agentNumber}
                    </p> */}
                    <p className="text-muted text-base hidden lg:flex flex-col">
                        Agent not assigned yet
                        <span>{application?.id}</span>
                    </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                    {application?.status === RentStatus.APPROVED && (
                        <div className="flex gap-1 text-muted">
                            <p className="font-normal">Next Step:</p>
                            <p className="font-normal text-secondary">
                                {application?.contractSigned
                                    ? "Payment"
                                    : "Contract Signing"}
                            </p>
                        </div>
                    )}
                    <div className="hidden lg:flex gap-5">
                        <Button 
                            onClick={handleViewApplication}
                            className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition"
                        >
                            View Application
                        </Button>
                        <OptionsDropdown
                            options={options?.options || []}
                            application={application}
                        />
                    </div>
                </div>
            </div>

            <div className="flex lg:hidden flex-wrap justify-between pt-4 border-t mt-4">
                <div className="flex items-center mb-2">
                    <p className="text-primary text-xl font-normal">
                        ৳{application?.property.price}
                    </p>
                    <p className="text-muted text-base ms-1">per month</p>
                </div>
                <div className="flex gap-5">
                    <Button 
                        onClick={handleViewApplication}
                        className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition"
                    >
                        View Application
                    </Button>
                    <OptionsDropdown
                        options={options?.options || []}
                        application={application}
                    />
                </div>
            </div>
        </div>
    );
}

function OptionsDropdown({
    options,
    application,
}: {
    options: { text: string; applicationNeeded: boolean; dispatchFn: any }[];
    application: PropertyState & { id: string; contractSigned?: boolean };
}) {
    const dispatch = useDispatch();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <OptionsIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option) => (
                    <DropdownMenuItem key={`option-${option.text}`} asChild>
                        <Button
                            variant="ghost"
                            className="w-full cursor-pointer justify-start hover:outline-none"
                            onClick={() => {
                                if (option.applicationNeeded) {
                                    dispatch(
                                        setRentalApplicationProperty(
                                            application
                                        )
                                    );
                                }
                                dispatch(option.dispatchFn);
                            }}
                        >
                            {option.text}
                        </Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function getOptions(property: PropertyState) {
    return options.find((option) => {
        return option.status === property.status;
    });
}
