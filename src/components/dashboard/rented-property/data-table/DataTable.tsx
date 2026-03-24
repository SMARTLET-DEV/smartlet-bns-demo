"use client";

import { Button } from "@/components/ui/button";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowSelectionState,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { baseApi } from "@/redux/api/baseAPi";
import {
    setPaymentStatus,
    setPaymentSuccess,
} from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import {
    PaymentSchedule,
    useGetPaymentHistoryMutation,
    useRentPaymentMutation,
} from "@/redux/reducers/rented-property/RentedPropertyApi";
import { setPaymentHistoryModal } from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

interface DataTableProps<PaymentSchedule, TValue> {
    columns: ColumnDef<PaymentSchedule, TValue>[];
    data: PaymentSchedule[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<PaymentSchedule, TValue> & {}) {
    const dispatch = useDispatch();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleRowSelectionChange = (
        updaterOrValue:
            | RowSelectionState
            | ((old: RowSelectionState) => RowSelectionState)
    ) => {
        const newSelection =
            typeof updaterOrValue === "function"
                ? updaterOrValue(rowSelection)
                : updaterOrValue;

        // Get all row indices that were selected before
        const previousSelectedIndices = Object.keys(rowSelection)
            .map((index) => parseInt(index))
            .sort((a, b) => a - b);

        // Get all row indices that are selected now
        const newSelectedIndices = Object.keys(newSelection)
            .map((index) => parseInt(index))
            .sort((a, b) => a - b);

        // Find the first deselected index
        const firstDeselectedIndex = previousSelectedIndices.find(
            (index) => !newSelectedIndices.includes(index)
        );

        // If a previous month was deselected, deselect all subsequent months
        if (firstDeselectedIndex !== undefined) {
            const updatedSelection = { ...newSelection };
            // Remove all selections after the deselected index
            Object.keys(updatedSelection).forEach((key) => {
                const index = parseInt(key);
                if (index > firstDeselectedIndex) {
                    delete updatedSelection[key];
                }
            });
            setRowSelection(updatedSelection);
        } else {
            setRowSelection(newSelection);
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: handleRowSelectionChange,
        state: {
            rowSelection,
        },
    });

    const selectedRows = table.getSelectedRowModel().rows;
    const hasSelectedRows = selectedRows.length > 0;

    const [payRent, { isLoading: isPaying }] = useRentPaymentMutation();
    const rentedProperty = useSelector(
        (state: RootState) => state.rentedProperty.rentedProperty
    );
    const [isLoading, setIsLoading] = useState(false);
    const [getPaymentHistory] = useGetPaymentHistoryMutation();
    const [err, setErr] = useState<string | null>(null);

    const handlePayMultipleMonths = async () => {
        if (selectedRows.length > 0) {
            const months = selectedRows.map((row) => row.original.forMonth);
            const id = rentedProperty.id;

            try {
                setErr(null);
                setIsLoading(true);
                const response = await payRent({ id: id, months: months });
                if (response.error) {
                    const { data } = response.error;
                    setErr(data.data.message);
                    setIsLoading(false);
                    return;
                }
                const { data } = response;
                console.log(data.data.paymentLink);
                const paymentWindow = window.open(
                    data.data.paymentLink,
                    "_blank"
                );

                const timer = setInterval(() => {
                    if (paymentWindow?.closed) {
                        clearInterval(timer);
                        setIsLoading(false);
                        dispatch(setPaymentStatus("failed"));
                    }
                }, 1000);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        // Listen for payment success message from the payment window
        const handleMessage = async (event: MessageEvent) => {
            if (event.data.type === "PAYMENT_SUCCESS") {
                dispatch(
                    baseApi.util.invalidateTags([
                        { type: "RentedProperty", id: "LIST" },
                    ])
                );
                dispatch(setPaymentStatus("paid"));
                dispatch(setPaymentHistoryModal(false));
                dispatch(setPaymentSuccess(true));
                if (rentedProperty?.id) {
                    getPaymentHistory({ id: rentedProperty?.id });
                }
            }
            if (event.data.type === "PAYMENT_FAILED") {
                dispatch(setPaymentStatus("failed"));
            }
            setIsLoading(false);
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <div className="rounded-md">
            <div className="max-h-[500px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-muted"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="hover:bg-transparent data-[state=selected]:bg-transparent"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="border-black"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {err && <p className="text-red-500 mt-2">{err}</p>}
            {hasSelectedRows && (
                <div className="flex justify-end mt-4">
                    <Button
                        disabled={isLoading || isPaying}
                        onClick={handlePayMultipleMonths}
                        className="bg-primary text-white hover:bg-primary/90 "
                    >
                        {isLoading && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
                        Pay {selectedRows.length} Month
                        {selectedRows.length > 1 ? "s" : ""} Rent
                    </Button>
                </div>
            )}
        </div>
    );
}
