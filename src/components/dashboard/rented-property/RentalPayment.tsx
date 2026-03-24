"use client";

import { RentStatus } from "@/assets/enumerators";
import { StepperMethods } from "@/components/properties/apply-for-rent/RenterTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseApi } from "@/redux/api/baseAPi";
import { useGetPaymentInvoiceMutation } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import {
    setPaymentStatus,
    setPaymentSuccess,
    setRentalApplicationModal,
} from "@/redux/reducers/rental-applications/RentalApplicationSlice";
import { RootState } from "@/redux/store";
import { AlertCircle, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type PaymentSummaryProps = {
    stepperMethods: StepperMethods;
};

export type Coupon = {
    code: string;
    discount: number;
};

type PaymentInvoice = {
    monthlyRent: number;
    depositAmount: number;
    otherCharges?: number;
    isPaid: boolean;
    propertyTitle: string;
    paymentLink: string;
};

const couponList: Coupon[] = [
    {
        code: "SUMMER10",
        discount: 10,
    },
];

const RentalPayment = ({ stepperMethods }: PaymentSummaryProps) => {
    const [counponCodeInput, setCounponCodeInput] = useState("");
    const [couponHidden, setCouponHidden] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [paymentInvoice, setPaymentInvoice] = useState<PaymentInvoice | null>(
        null
    );

    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );

    // Check if payment step should be disabled
    const isPaymentDisabled =
        !application || application.status !== RentStatus.APPROVED;

    if (isPaymentDisabled) {
        return (
            <div className="w-full flex flex-col items-center justify-center text-secondary p-8">
                <AlertCircle className="w-16 h-16 text-muted mb-4" />
                <h3 className="text-xl font-light mb-2">
                    Payment Not Available
                </h3>
                <p className="text-center text-muted">
                    {!application
                        ? "Application not found"
                        : application.status !== RentStatus.APPROVED
                        ? "Application must be approved before payment"
                        : "Contract must be signed before payment"}
                </p>
            </div>
        );
    }

    const [getPaymentInvoice, { isLoading }] = useGetPaymentInvoiceMutation();

    useEffect(() => {
        if (application?.id) {
            getPaymentInvoice({ id: application.id }).then((res) => {
                setPaymentInvoice(res.data.invoice);
                if (res.data.invoice.isPaid) {
                    dispatch(setPaymentStatus("paid"));
                    dispatch(setRentalApplicationModal(false));
                    dispatch(setPaymentSuccess(true));
                }
            });
        }
    }, [application?.id]);

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
    const paymentStatus = useSelector(
        (state: RootState) => state.rentalApplication.paymentStatus
    );

    useEffect(() => {
        // Listen for payment success message from the payment window
        const handleMessage = async (event: MessageEvent) => {
            if (event.data.type === "PAYMENT_SUCCESS") {
                dispatch(setPaymentStatus("paid"));
                dispatch(
                    baseApi.util.invalidateTags([
                        { type: "RentedProperty", id: "LIST" },
                    ])
                );
                dispatch(setRentalApplicationModal(false));
                dispatch(setPaymentSuccess(true));
            }
            if (event.data.type === "PAYMENT_FAILED") {
                dispatch(setPaymentStatus("failed"));
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    async function handlePayNow() {
        if (application?.id) {
            dispatch(setPaymentStatus("pending"));

            const paymentWindow = window.open(
                paymentInvoice?.paymentLink,
                "_blank"
            );

            const timer = setInterval(() => {
                if (paymentWindow?.closed) {
                    clearInterval(timer);
                    dispatch(setPaymentStatus("failed"));
                }
            }, 1000);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const total = Number(paymentInvoice?.depositAmount);

    return (
        <div className="w-full flex flex-col  text-secondary py-5 max-h-[60vh] overflow-y-auto pe-2">
            <p className="text-2xl font-light text-secondary">Payment Summary</p>
            <div className="flex flex-col gap-3 my-5 pb-5 border-b text-lg">
                <div className="grid grid-cols-2 gap-3">
                    <p>Security Deposit</p>
                    <p className="text-right">
                        ৳
                        {Number(paymentInvoice?.depositAmount).toLocaleString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <p>Other Charges</p>
                    <p className="text-right">
                        ৳
                        {paymentInvoice?.otherCharges
                            ? Number(
                                  paymentInvoice?.otherCharges
                              ).toLocaleString()
                            : 0}
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
                                total *
                                (appliedCoupon.discount / 100)
                            ).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xl font-light pb-5 border-b">
                <p>Total</p>
                {appliedCoupon ? (
                    <p className="text-right">
                        ৳
                        {(
                            total *
                            (1 - appliedCoupon.discount / 100)
                        ).toLocaleString()}
                    </p>
                ) : (
                    <p className="text-right">৳{total.toLocaleString()}</p>
                )}
            </div>

            <p className="text-2xl font-light text-secondary mt-5">
                Bank Account Details
            </p>
            <p className="mt-1">
                To complete your payment via bank transfer, please use the
                following account details:
            </p>
            <div className="grid grid-cols-3 gap-3 my-5 text-lg font-normal">
                <div className="flex flex-col gap-2">
                    <p>Bank Name</p>
                    <p>Account Name</p>
                    <p>Account Number</p>
                    <p>Branch</p>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                    <p>
                        <span className="me-1">:</span>Demo Bank LTD.
                    </p>
                    <p>
                        <span className="me-1">:</span>John Doe
                    </p>
                    <p>
                        <span className="me-1">:</span>1234567890
                    </p>
                    <p>
                        <span className="me-1">:</span>Dhaka
                    </p>
                </div>
            </div>
            <p>
                After completing the transfer, kindly send the payment slip or
                transaction reference number to our support team for
                verification.
            </p>
            <p className="text-sm italic mt-2 mb-4">
                Note: Please ensure the exact rental amount is transferred to
                avoid processing delays.
            </p>

            <div className="justify-end mt-5 w-full grid grid-cols-2 gap-4">
                <div className=""></div>
                <Button
                    disabled={paymentStatus === "pending"}
                    variant={"outline"}
                    onClick={() => {
                        dispatch(setRentalApplicationModal(false));
                    }}
                >
                    Close
                </Button>
                {/* <Button
                    disabled={paymentStatus === "pending"}
                    onClick={handlePayNow}
                >
                    {paymentStatus === "pending" ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        "Pay Now"
                    )}
                </Button> */}
            </div>
        </div>
    );
};

export default RentalPayment;
