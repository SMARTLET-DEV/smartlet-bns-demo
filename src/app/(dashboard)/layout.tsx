"use client";

import { CalendarBookingIcon, HeartIcon, UserIcon } from "@/assets/icons";
import { SidebarMenu } from "@/components/dashboard/SidebarMenu";
import { logout } from "@/redux/reducers/auth/authSlice";
import { RootState } from "@/redux/store";
import { HouseIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../layoutWrapper";

const navItems = {
    RENTER: [
        {
            label: "Appointments",
            icon: <CalendarBookingIcon className="w-6 h-6" />,
            path: "/appointments",
        },
        {
            label: "Favorites",
            icon: <HeartIcon className="w-6 h-6" />,
            path: "/favorites",
        },
        {
            label: "Rented Property",
            icon: <HouseIcon className="w-6 h-6" />,
            path: "/rented-property",
        },
        {
            label: "Profile",
            icon: <UserIcon className="w-6 h-6" />,
            path: "/profile",
        },
    ],
    OWNER: [
        {
            label: "Property List",
            icon: <HouseIcon className="w-6 h-6" />,
            path: "/property-list",
        },
        {
            label: "Profile",
            icon: <UserIcon className="w-6 h-6" />,
            path: "/profile",
        },
    ],
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter(); 
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.replace("/");
        } else {
            setIsLoading(false);
        }
    }, [user, router]);

    // Show loading state or nothing while checking auth
    if (isLoading || !user) {
        return null; // or return a loading spinner if you prefer
    }

    return (
        <>
            <div className="bg-white">
                <div className="container mx-auto py-5 flex gap-x-8 px-5 lg:px-0">
                    <SidebarMenu
                        navItems={navItems[user.role as keyof typeof navItems] || []}
                        user={user}
                        onLogout={() => {
                            dispatch(logout());
                            router.replace("/");
                            // Refresh the web app after logout
                            window.location.reload();
                        }}
                    />
                    {children}
                </div>
            </div>
        </>
    );
}
