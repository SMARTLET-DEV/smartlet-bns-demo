"use client";

import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export type PaymentSummaryProps = {
    rent: number;
    securityDeposit: number;
    otherCharges: number;
    total: number;
};

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

const PaymentSummary = ({
    rent,
    securityDeposit,
    otherCharges,
    total,
}: PaymentSummaryProps) => {
    const [counponCodeInput, setCounponCodeInput] = useState("");
    const [couponHidden, setCouponHidden] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

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

    return (
        <div className="w-full flex flex-col  text-secondary p-4">
            <p className="text-2xl font-light text-secondary">Payment Summary</p>
            <div className="flex flex-col gap-3 my-5 pb-5 border-b text-lg">
                <div className="grid grid-cols-2 gap-3">
                    <p>Rent</p>
                    <p className="text-right">৳{rent.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <p>Security Deposit</p>
                    <p className="text-right">
                        ৳{securityDeposit.toLocaleString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <p>Other Charges</p>
                    <p className="text-right">
                        ৳{otherCharges.toLocaleString()}
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
                        <p className="flex flex-col gap-1">
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
                        </p>
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

            <div className="grid grid-cols-2 gap-3 text-xl font-light">
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
            <div className="justify-end mt-5 w-full grid grid-cols-2 gap-4">
                <Button variant={"outline"}>Back</Button>
                <Button>Pay Now</Button>
            </div>
        </div>
    );
};

export default PaymentSummary;
