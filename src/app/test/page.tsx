"use client";

import { ControlledInput } from "@/components/common/ControlledInput";
import { ControlledPasswordInput } from "@/components/common/ControlledPassword-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/responsive-dialog-v2";
import LoaderAnimation from "@/components/utils/LoaderAnimation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <LoaderAnimation style={{ width: 300, height: 300 }} />
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <TestModal isOpen={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}

function TestModal({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange: (state: boolean) => void;
}) {
    const form = useForm();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(state) => {
                onOpenChange(state);
            }}
        >
            <DialogContent className="rounded-[16px] lg:rounded-[30px] ">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-normal">
                        Login
                    </DialogTitle>
                    <DialogDescription className="text-muted font-medium border-b border-card pb-3">
                        Log in to your account
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-6">
                        <ControlledInput
                            control={form.control}
                            name="email"
                            label="Email"
                            placeHolder="Enter your email address"
                        />
                        <ControlledPasswordInput
                            control={form.control}
                            name="password"
                            label="Password"
                            placeHolder="Enter your password"
                        />
                    </form>
                    <Button
                        asChild
                        variant="ghost"
                        className="hover:bg-transparent hover:underline w-fit h-fit cursor-pointer ms-auto p-0 font-normal"
                    >
                        <p>Forgot Password?</p>
                    </Button>
                </Form>

                <DialogFooter className="mt-4 w-full">
                    <div className="flex flex-col w-full">
                        <Button
                            type="submit"
                            className="w-full py-3 h-fit cursor-pointer"
                        >
                            Login
                        </Button>
                        <p className="text-muted font-medium text-center mt-3">
                            Don't have an account?{" "}
                            <Button
                                type="button"
                                variant="ghost"
                                className="font-normal p-0 w-fit h-fit text-secondary text-base cursor-pointer hover:underline"
                            >
                                Sign up
                            </Button>
                        </p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
