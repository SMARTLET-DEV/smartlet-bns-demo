"use client";

import {
    LogoutIcon,
    UserIcon,
} from "@/assets/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/reducers/auth/authSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/reducers/auth/authApi";
import { useToast } from "@/hooks/useToast";

// --------------------
// Menu item type
// --------------------
type AvatarMenuItem =
    | {
          label: string;
          type: "link";
          href: string;
          icon: JSX.Element;
      }
    | {
          label: string;
          type: "action";
          onClick: () => void;
          icon: JSX.Element;
      };

// --------------------
// Menu items array
// --------------------
const getAvatarMenuItems = (
    logoutHandler: () => void,
    user: any
): AvatarMenuItem[] => [
    {
        label: "Logout",
        type: "action",
        onClick: logoutHandler,
        icon: <LogoutIcon className="w-4 h-4" />,
    },
];

type AvatarButtonProps = {
    variant?: "default" | "home";
};

// --------------------
// AvatarButton Component
// --------------------
export function AvatarButton({ variant = "default" }: AvatarButtonProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const [logoutMutation] = useLogoutMutation();
    const { success, error } = useToast();
    // console.log("user: ", user);
    const handleLogout = async () => {
        try {
            await logoutMutation({}).unwrap();
            dispatch(logout());
            localStorage.setItem("triggerReload", Date.now().toString());
            success("Logged out successfully");
            // Refresh the web app after logout
            window.location.reload(); 
        } catch (err: any) {
            // Even if logout API fails, we should still clear local state
            dispatch(logout());
            localStorage.setItem("triggerReload", Date.now().toString());
            error("Logout completed but there was an issue with the server");
            // Refresh the web app after logout
            window.location.reload();
        }
    };

    const avatarMenuItems = getAvatarMenuItems(handleLogout, user);
    

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <UserIcon
                        className={cn(
                            "w-8 h-8 cursor-pointer",
                            variant === "default"
                                ? "text-secondary"
                                : "text-primary-foreground"
                        )}
                    />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl rounded-tr-none border-none"
            >
                {avatarMenuItems.map((item, index) =>
                    item.type === "link" ? (
                        <DropdownMenuItem asChild key={index}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-2 w-full text-muted cursor-pointer"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            key={index}
                            onClick={item.onClick}
                            className="flex items-center gap-2 text-muted cursor-pointer"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </DropdownMenuItem>
                    )
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
