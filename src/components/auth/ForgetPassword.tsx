import { useForgetPasswordMutation } from "@/redux/reducers/auth/authApi";
import {
    changeForgetPasswordModalOpen,
    changeLoginModalOpen,
} from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { ControlledInput } from "../common/ControlledInput";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";

const forgetPasswordSchema = z.object({
    email: z.string().email().min(1, "Email is required"),
});

export default function ForgetPasswordModal() {
    const form = useForm<z.infer<typeof forgetPasswordSchema>>({
        defaultValues: {
            email: "",
        },
        resolver: zodResolver(forgetPasswordSchema),
    });
    const dispatch = useDispatch();
    const isForgetPasswordModalOpen = useSelector(
        (state: RootState) => state.authModals.forgetPasswordModalOpen
    );
    const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();
    const { success, error: showError } = useToast();

    const handleSubmitEmail = async (
        formData: z.infer<typeof forgetPasswordSchema>
    ) => {
        try {
            const result = await forgetPassword(formData).unwrap();
            if (result.success) {
                success("Password reset link sent to your email");
                setIsSuccess(true);
            }
        } catch (error: any) {
            showError(error?.data?.message || "Failed to send password reset email. Please try again.");
        }
    };
    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <Dialog
            open={isForgetPasswordModalOpen}
            onOpenChange={(state) => {
                form.reset();
                setIsSuccess(false);
                dispatch(changeForgetPasswordModalOpen(state));
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] ">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-light">
                        Forget Password
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmitEmail)}
                        className="flex flex-col gap-6"
                    >
                        <ControlledInput
                            control={form.control}
                            name="email"
                            label="Email"
                            placeHolder="Enter your email address"
                        />
                    </form>
                    {isSuccess && form.watch("email") && !isLoading && (
                        <p className="text-sm font-medium text-center">
                            An email will be sent to you to reset your password.
                        </p>
                    )}
                </Form>
                <DialogFooter className="mt-3 w-full">
                    <div className="flex flex-col w-full">
                        <Button
                            type="submit"
                            className="w-full py-3 h-fit cursor-pointer"
                            disabled={isLoading}
                            onClick={() =>
                                form.handleSubmit(handleSubmitEmail)()
                            }
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Send Email"
                            )}
                        </Button>
                        <p className="text-muted font-medium text-center mt-3">
                            Remember your password?{" "}
                            <Button
                                onClick={() => {
                                    form.reset();
                                    setIsSuccess(false);
                                    dispatch(
                                        changeForgetPasswordModalOpen(false)
                                    );
                                    dispatch(changeLoginModalOpen(true));
                                }}
                                type="button"
                                variant="ghost"
                                className="font-normal p-0 w-fit h-fit text-secondary text-base cursor-pointer hover:underline"
                            >
                                Sign in
                            </Button>
                        </p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
