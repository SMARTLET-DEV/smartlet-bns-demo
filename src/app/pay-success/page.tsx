import PaymentSuccess, {
    PaymentSuccessProps,
} from "@/components/payment/PaymentSuccess";

const paymentSuccessData: PaymentSuccessProps = {
    totalAmount: 1000,
    paymentDate: new Date(),
    invoiceNo: "1234567890",
    userName: "John Doe",
    userAddress: "123 Main St, Anytown, USA",
};

const Page = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <PaymentSuccess {...paymentSuccessData} />
        </div>
    );
};

export default Page;
