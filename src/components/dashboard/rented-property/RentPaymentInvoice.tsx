"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseApi } from "@/redux/api/baseAPi";
import {
    setPaymentRejectedModal,
    setPaymentSuccess,
} from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import {
    useGetPaymentHistoryMutation,
    useRentPaymentMutation,
} from "@/redux/reducers/rented-property/RentedPropertyApi";
import {
    setRentPaymentModal,
    setRentPaymentStatus,
} from "@/redux/reducers/rented-property/RentedPropertySlice";
import { RootState } from "@/redux/store";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type Coupon = {
    code: string;
    discount: number;
};

const couponList: Coupon[] = [
    {
        code: "SUMMER10",
        discount: 10,
    },
];

const RentPaymentInvoice = ({
    baseRent,
    lateFee,
    totalDue,
    dueDate,
}: {
    baseRent: number;
    lateFee: number;
    totalDue: number;
    dueDate: string;
}) => {
    const [counponCodeInput, setCounponCodeInput] = useState("");
    const [couponHidden, setCouponHidden] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const rentedProperty = useSelector(
        (state: RootState) => state.rentedProperty.rentedProperty
    );
    const rentPaymentStatus = useSelector(
        (state: RootState) => state.rentedProperty.rentPaymentStatus
    );
    const [getPaymentHistory] = useGetPaymentHistoryMutation();

    function applyCoupon() {
        const coupon = couponList.find(
            (coupon) =>
                coupon.code.toLowerCase() === counponCodeInput.toLowerCase()
        );
        if (coupon) {
            setAppliedCoupon(coupon);
            setCounponCodeInput("");
            setCouponHidden(true);
        }
    }
    const dispatch = useDispatch();
    const [rentPay, { isLoading: isPaying }] = useRentPaymentMutation();

    async function handlePayNow() {
        dispatch(setRentPaymentStatus("pending"));
        const { data } = await rentPay({
            id: rentedProperty?.id,
            months: [dueDate],
        });
        const paymentWindow = window.open(data.data.paymentLink, "_blank");

        const timer = setInterval(() => {
            if (paymentWindow?.closed) {
                clearInterval(timer);
                dispatch(setRentPaymentStatus("failed"));
            }
        }, 1000);
    }

    useEffect(() => {
        // Listen for payment success message from the payment window
        const handleMessage = async (event: MessageEvent) => {
            console.log("event data: ", event.data);
            if (event.data.type === "PAYMENT_SUCCESS") {
                dispatch(setRentPaymentStatus("paid"));
                dispatch(
                    baseApi.util.invalidateTags([
                        { type: "RentedProperty", id: "LIST" },
                    ])
                );
                dispatch(setRentPaymentModal(false));
                dispatch(setPaymentSuccess(true));
                if (rentedProperty?.id) {
                    getPaymentHistory({ id: rentedProperty?.id });
                }
            }
            if (event.data.type === "PAYMENT_FAILED") {
                dispatch(setRentPaymentStatus("failed"));
                dispatch(setRentPaymentModal(false));
                dispatch(setPaymentRejectedModal(true));
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <div className="w-full flex flex-col  text-secondary p-4">
            <p className="text-2xl font-light text-secondary">Payment Summary</p>
            <div className="flex flex-col gap-3 my-5 pb-5 border-b text-lg">
                <div className="grid grid-cols-2 gap-3">
                    <p>Rent</p>
                    <p className="text-right">
                        ৳{Number(baseRent).toLocaleString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <p>Late Fee</p>
                    <p className="text-right">
                        ৳{Number(lateFee).toLocaleString()}
                    </p>
                </div>
                {!appliedCoupon && (
                    <div className="flex flex-col gap-3">
                        <p
                            className="underline cursor-pointer w-fit text-sm"
                            onClick={() => setCouponHidden(!couponHidden)}
                        >
                            Do you have a coupon?
                        </p>
                        {!couponHidden && (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={counponCodeInput}
                                    onChange={(e) =>
                                        setCounponCodeInput(e.target.value)
                                    }
                                    placeholder="Enter coupon code"
                                    className="placeholder:text-base"
                                />
                                <Button onClick={applyCoupon}>Apply</Button>
                            </div>
                        )}
                    </div>
                )}
                {appliedCoupon && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-4">
                                Coupon Applied
                                <p
                                    className="text-xs bg-destructive-foreground text-destructive font-normal cursor-pointer px-2 py-1 rounded-md"
                                    onClick={() => setAppliedCoupon(null)}
                                >
                                    <TrashIcon className="size-3" />
                                </p>
                            </span>
                            <span className="text-xs text-primary font-normal">
                                ({appliedCoupon.code} - {appliedCoupon.discount}
                                % off)
                            </span>
                        </div>
                        <p className="text-right text-primary">
                            -৳
                            {(
                                Number(totalDue) *
                                (appliedCoupon.discount / 100)
                            ).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xl font-light border-b">
                <p>Total</p>
                {appliedCoupon ? (
                    <p className="text-right">
                        ৳
                        {(
                            Number(totalDue) *
                            (1 - appliedCoupon.discount / 100)
                        ).toLocaleString()}
                    </p>
                ) : (
                    <p className="text-right">
                        ৳{Number(totalDue).toLocaleString()}
                    </p>
                )}
            </div>

            <div className="justify-end mt-5 w-full grid grid-cols-2 gap-4">
                <div className=""></div>
                <Button
                    variant={"outline"}
                    onClick={() => {
                        dispatch(setRentPaymentModal(false));
                    }}
                >
                    Cancel
                </Button>
                {/* <Button
                    disabled={isPaying || rentPaymentStatus === "pending"}
                    onClick={handlePayNow}
                >
                    {isPaying || rentPaymentStatus === "pending" ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        "Pay Now"
                    )}
                </Button> */}
            </div>
        </div>
    );
};

export default RentPaymentInvoice;
