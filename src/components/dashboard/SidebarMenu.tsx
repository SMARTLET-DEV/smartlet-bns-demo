import { LogoutIcon, UserIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/redux/reducers/auth/authSlice";
import { useGetProfileDataQuery } from "@/redux/reducers/profile/profileApi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    path: string;
};

interface SidebarMenuProps {
    navItems: NavItem[];
    user: User;
    onLogout?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
    navItems,
    user,
    onLogout,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const { data: userProfileData } = useGetProfileDataQuery(user?.id);

    useEffect(() => {
        const checkViewport = () => setIsMobile(window.innerWidth <= 768);
        checkViewport();
        window.addEventListener("resize", checkViewport);
        return () => window.removeEventListener("resize", checkViewport);
    }, []);

    return isMobile ? (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 shadow-sm flex justify-around py-2">
            {navItems?.map((item) => (
                <Link
                    key={item.label}
                    href={item.path}
                    className={cn(
                        "flex flex-col items-center text-xs",
                        pathname === item.path
                            ? "text-primary font-normal"
                            : "text-muted"
                    )}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    ) : (
        <aside className="w-[15%] min-w-[260px] min-h-screen rounded-2xl px-4 py-6 bg-background hidden md:flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                {navItems?.map((item) => (
                    <Link
                        key={item.label}
                        href={item.path}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md font-normal transition-colors",
                            pathname === item.path
                                ? "bg-primary text-primary-foreground"
                                : "text-muted hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* User Info + Logout */}
            <div className="pt-4 mt-4 -mb-3">
                <div className="flex items-center gap-3 px-2 mb-3">
                    {userProfileData?.profile?.avatar ? (
                        <img
                            src={userProfileData?.profile?.avatar}
                            alt={user.name || ""}
                            className="w-10 h-10 rounded-full object-cover select-none"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <UserIcon className="text-muted/50" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-secondary font-normal text-sm">
                            {user.name}
                        </span>
                        <span className="text-muted font-light text-xs">
                            {user.email}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full text-base font-normal h-12 justify-start text-secondary hover:text-primary hover:rounded-b-2xl hover:bg-transparent gap-2 px-2 rounded-none border-t border-muted/20"
                >
                    <LogoutIcon className="ml-1" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};
