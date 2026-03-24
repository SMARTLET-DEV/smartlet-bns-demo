"use client";

import {
    useForgotPasswordMutation,
    useGetProfileDataQuery,
    useUpdateProfileDataMutation,
} from "@/redux/reducers/profile/profileApi";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { ControlledInput } from "../../common/ControlledInput";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { ProfileImageInput } from "./ProfileImageInput";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg"];

const fileSchema = z.custom<File | null>(
    (file) => {
        // If no file is provided, that's valid (optional field)
        if (!file || typeof file === "string") {
            return true;
        }
        // If file is provided, validate it
        if (!(file instanceof File)) {
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            return false;
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            return false;
        }
        return true;
    },
    {
        message: "Please upload a valid image file under 5MB",
    }
);

const profileInfoSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    avatar: fileSchema.optional(),
});

const ProfileInfoForm = () => {
    const form = useForm<z.infer<typeof profileInfoSchema>>({
        resolver: zodResolver(profileInfoSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            avatar: undefined,
        },
    });
    const user = useSelector((state: RootState) => state.auth.user);

    const { data: profileData, isFetching } = useGetProfileDataQuery(
        user?.id || ""
    );
    const [updateProfileData, { isLoading }] = useUpdateProfileDataMutation();
    const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
        useForgotPasswordMutation();
    const { success, error } = useToast();
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (profileData) {
            const { firstName, lastName, email, phone, avatar } =
                profileData.profile;
            form.reset({
                firstName: firstName || "",
                lastName: lastName || "",
                email: email || "",
                phone: phone || "",
                avatar: avatar || "",
            });
        }
    }, [profileData]);

    const handleUpdateUserInfo = async (
        data: z.infer<typeof profileInfoSchema>
    ) => {
        if (!user || !user.id) return;
        // console.log("data.avatar: ", data.avatar);

        const formDataToSend = new FormData();
        formDataToSend.append("firstName", data.firstName || "");
        formDataToSend.append("lastName", data.lastName || "");
        formDataToSend.append("email", data.email || "");
        formDataToSend.append("phone", data.phone || "");
        if (form.getFieldState("avatar").isDirty && data.avatar) {
            formDataToSend.append("avatar", data.avatar);
        }

        // console.log("Form Data to Send: ");
        // for (const [key, value] of formDataToSend.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        try {
            const { data } = await updateProfileData({
                profileId: user.id,
                data: formDataToSend,
            }).unwrap();
            success("Profile updated successfully!");
            console.log(data);
        } catch (err: any) {
            error(err?.data?.message || "Failed to update profile. Please try again.");
            console.error("Profile update error:", err);
        }
    };

    const handleCancelClick = () => {
        if (!profileData) return;

        const { firstName, lastName, email, phone, avatar } =
            profileData.profile;
        form.reset({
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            phone: phone || "",
            avatar: avatar || "",
        });
    };

    const handleForgotPassword = async () => {
        if (!user || !user.email) return;
        try {
            const { data } = await forgotPassword({
                email: user?.email,
            }).unwrap();

            success("Password reset link sent to your email");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        } catch (err: any) {
            error(err?.data?.message || "Failed to send password reset email. Please try again.");
            console.error("Forgot password error:", err);
        }
    };

    return (
        <div className="w-full">
            <div className="border-b pb-5 w-full">
                <p className="font-normal text-base sm:text-lg">Personal Info</p>
                <p className="text-muted text-sm">
                    Update your photo and personal details here.
                </p>
            </div>
            <Form {...form}>
                <form
                    className="flex flex-col gap-5 mt-5"
                    onSubmit={form.handleSubmit(handleUpdateUserInfo)}
                >
                    <div className="border-b pb-5">
                        <div className="grid lg:grid-cols-2 lg:max-w-[70%] w-full gap-2">
                            <p className="font-normal text-base sm:text-lg">Name</p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2">
                                <ControlledInput
                                    label=""
                                    name="firstName"
                                    placeholder="First Name"
                                    control={form.control}
                                />
                                <ControlledInput
                                    label=""
                                    name="lastName"
                                    placeholder="Last Name"
                                    control={form.control}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border-b pb-5">
                        <div className="grid lg:grid-cols-2 lg:max-w-[70%] w-full gap-2">
                            <p className="font-normal text-base sm:text-lg">Email</p>
                            <div className="flex flex-col gap-4">
                                <ControlledInput
                                    label=""
                                    name="email"
                                    placeholder="Email"
                                    control={form.control}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border-b pb-5">
                        <div className="grid lg:grid-cols-2 gap-2 lg:max-w-[70%] w-full">
                            <div className="flex flex-col">
                                <p className="font-normal text-base sm:text-lg">Your Photo</p>
                                <p className="text-muted text-sm">
                                    This will be displayed on your profile.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <ProfileImageInput
                                    control={form.control}
                                    name="avatar"
                                    accept="image/png,image/jpeg,image/jpg"
                                    img={
                                        profileData?.profile.avatar ||
                                        "/user-placeholder.png"
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border-b pb-5">
                        <div className="grid lg:grid-cols-2 gap-2 lg:max-w-[70%] w-full">
                            <p className="font-normal text-base sm:text-lg">Phone</p>
                            <div className="flex flex-col gap-4">
                                <ControlledInput
                                    label=""
                                    name="phone"
                                    placeholder="Phone"
                                    control={form.control}
                                />
                            </div>
                        </div>
                    </div>
                    {form.formState.isDirty && (
                        <>
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="submit"
                                    variant="outline"
                                    disabled={isLoading}
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" 
                                    variant="outline" 
                                    className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 text-base"
                                    disabled={isLoading}>
                                        {isLoading && (
                                            <Loader2 className="animate-spin" />
                                        )}
                                        Update
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="mt-5 flex justify-between">
                        <p className="font-normal text-base sm:text-lg">Password</p>
                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isForgotPasswordLoading}
                                className="bg-[#e8566f] text-white border border-primary hover:bg-primary font-normal rounded-lg transition w-fit self-end"
                            >
                                {isForgotPasswordLoading
                                    ? "Loading..."
                                    : "Change Password"}
                            </Button>
                            {showNotification && (
                                <p className="text-primary opacity-90 text-sm">
                                    A link has been sent to your email to reset
                                    your password.
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProfileInfoForm;
