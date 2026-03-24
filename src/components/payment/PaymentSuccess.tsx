import { CheckCircleIcon, DownloadIcon } from "@/assets/icons";
import { Button } from "../ui/button";

export type PaymentSuccessProps = {
    totalAmount: number;
    paymentDate: Date;
    invoiceNo: string;
    userName: string;
    userAddress: string;
};

const PaymentSuccess = ({
    totalAmount,
    paymentDate,
    invoiceNo,
    userName,
    userAddress,
}: PaymentSuccessProps) => {
    return (
        <div className="w-full flex flex-col max-w-[550px] text-secondary bg-white rounded-2xl p-4">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-[#04DA8D]" />
            <p className="text-2xl font-light text-secondary text-center mt-3">
                Payment Successful
            </p>
            <div className="grid grid-cols-2 gap-5 mt-10 text-xl font-light pb-5 mb-5 border-b">
                <div className="flex flex-col ">
                    <p>Total Amount</p>
                    <p>৳{totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex flex-col text-right">
                    <p>Paid</p>
                    <p className="text-muted font-normal text-base mt-2">
                        {paymentDate
                            .toLocaleDateString("en-UK", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })
                            .replace(/\s(am|pm)/i, (match) =>
                                match.toUpperCase()
                            )}
                    </p>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="mb-5 text-xl font-light">Billed To</p>
                <p className="mb-3">{userName}</p>
                <p>{userAddress}</p>
            </div>

            <div className="mt-10 grid grid-cols-2">
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-light">Invoice No</p>
                    <p>{invoiceNo}</p>
                </div>
                <Button
                    asChild
                    variant="ghost"
                    className="mt-auto ms-auto w-fit bg-transparent text-black"
                >
                    <p>
                        <DownloadIcon className="w-4 h-4" />{" "}
                        <span className="underline">Download Invoice</span>
                    </p>
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
