"use client";

import { FileIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentSchedule } from "@/redux/reducers/rented-property/RentedPropertyApi";
import {
    setDueDateExtensionData,
    setDueDateExtensionModal,
    setPaymentHistoryModal,
    setRentPaymentData,
    setRentPaymentModal,
} from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaymentStatusBadge } from "../SingleRentedProperty";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<PaymentSchedule>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                    // Only allow selecting all if all rows are selectable
                    const allSelectable = table
                        .getRowModel()
                        .rows.every((row, index) => {
                            if (index === 0) return true; // First month is always selectable
                            // Check if all previous months are either paid or can't be paid
                            return table
                                .getRowModel()
                                .rows.slice(0, index)
                                .every(
                                    (prevRow) =>
                                        prevRow.original.status === "PAID" ||
                                        !prevRow.original.canPay
                                );
                        });
                    if (allSelectable) {
                        table.toggleAllPageRowsSelected(!!value);
                    }
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row, table }) => {
            const rowIndex = table
                .getRowModel()
                .rows.findIndex((r) => r.id === row.id);

            // Check if all previous months are either paid or selected
            const isSelectable =
                rowIndex === 0 || // First month is always selectable
                table
                    .getRowModel()
                    .rows.slice(0, rowIndex)
                    .every((prevRow) => {
                        const isPaid = prevRow.original.status === "PAID";
                        const isSelected = prevRow.getIsSelected();
                        return isPaid || isSelected;
                    });

            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        if (isSelectable) {
                            row.toggleSelected(!!value);
                        }
                    }}
                    disabled={!isSelectable}
                    aria-label="Select row"
                    className={`${
                        isSelectable
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                    }`}
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "forMonth",
        header: "Invoice",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <FileIcon className="size-4" />
                    Invoice -{" "}
                    {new Date(row.original.forMonth).toLocaleDateString(
                        "en-US",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
            return <div>{row.original.dueDate}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <PaymentStatusBadge status={row.original.status} />;
        },
    },
    {
        accessorKey: "totalDue",
        header: "Amount",
        cell: ({ row }) => {
            return <div>{Number(row.original.totalDue).toLocaleString()}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const dispatch = useDispatch();
            const currentDate = new Date();
            const rowDate = new Date(row.original.forMonth);
            const isCurrentMonth =
                currentDate.getMonth() === rowDate.getMonth() &&
                currentDate.getFullYear() === rowDate.getFullYear();
            const isSelected = row.getIsSelected();

            const rowIndex = table
                .getRowModel()
                .rows.findIndex((r) => r.id === row.id);

            // Check if all previous months are either paid or selected
            const isPrevPaid = table
                .getRowModel()
                .rows.slice(0, rowIndex)
                .every((prevRow) => {
                    const isPaid = prevRow.original.status === "PAID";

                    return isPaid;
                });

            const paymentHistory = useSelector(
                (state: RootState) => state.rentedProperty.paymentHistory
            );
            const [hasPayment, setHasPayment] = useState<any>(false);

            useEffect(() => {
                const hasPayment = paymentHistory.payments.find((payment) => {
                    const paymentDate = new Date(payment.forMonth);
                    const rowDate = new Date(row.original.forMonth);
                    return (
                        paymentDate.getMonth() === rowDate.getMonth() &&
                        paymentDate.getFullYear() === rowDate.getFullYear()
                    );
                });
                setHasPayment(hasPayment);
            }, [paymentHistory, row.original.forMonth]);

            return (
                <div className="flex items-center gap-0">
                    {!isSelected && row.original.status.includes("DUE") && (
                        <div className="flex items-center gap-3">
                            {isCurrentMonth && (
                                <>
                                    <Button
                                        variant="ghost"
                                        disabled={
                                            !row.original.status.includes("DUE")
                                        }
                                        className="p-0 rounded-none w-fit min-w-fit underline"
                                        onClick={() => {
                                            console.log(row.original);
                                            dispatch(
                                                setDueDateExtensionData(
                                                    row.original
                                                )
                                            );
                                            dispatch(
                                                setPaymentHistoryModal(false)
                                            );
                                            dispatch(
                                                setDueDateExtensionModal(true)
                                            );
                                        }}
                                    >
                                        {row.original.status.includes("DUE") &&
                                            "Due Extension"}
                                    </Button>
                                    <div className="h-7 w-[1px] bg-gray-200"></div>
                                </>
                            )}

                            {(isPrevPaid || isCurrentMonth) && (
                                <Button
                                    variant="ghost"
                                    disabled={
                                        !row.original.status.includes("DUE")
                                    }
                                    className="p-0 w-fit min-w-fit underline text-primary"
                                    onClick={() => {
                                        dispatch(
                                            setRentPaymentData(row.original)
                                        );
                                        dispatch(setPaymentHistoryModal(false));
                                        dispatch(setRentPaymentModal(true));
                                    }}
                                >
                                    Pay Now
                                </Button>
                            )}
                        </div>
                    )}
                    {!row.original.status.includes("DUE") && (
                        <Button
                            variant="ghost"
                            className="p-0 w-fit min-w-fit text-primary underline"
                            asChild
                        >
                            <a
                                href={hasPayment?.receiptPdfUrl}
                                target="_blank"
                                download
                            >
                                Download
                            </a>
                        </Button>
                    )}
                </div>
            );
        },
    },
];
