import { ChevronDownIcon, ChevronupIcon, HamburgerIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { AvatarButton } from "./Avatarbutton";
import ListingRequestModal from "./ListingRequestModal";
import { LoginButton } from "./LoginButton";
import { Menu } from "lucide-react";

import { useDispatch } from "react-redux";

import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DropdownKey = "findOpen" | "learnOpen" | "servicesOpen";

type NavItem =
    | {
        label: string;
        type: "link" | "button";
        href: string;
        onClick?: () => void;
    }
    | {
        label: string;
        type: "dropdown";
        stateKey: DropdownKey;
        links: {
            label: string;
            href: string;
            disabled?: boolean;
        }[];
    };

interface MobileMenuProps {
    navItems: NavItem[];
    isLoggedIn: boolean;
    variant?: "default" | "home";
    scrolling?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    navItems,
    isLoggedIn,
    variant,
    scrolling,
}) => {
    const [mobileDropdownOpen, setMobileDropdownOpen] =
        useState<DropdownKey | null>(null);

    const [showListingRequestModal, setShowListingRequestModal] =
        useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const dispatch = useDispatch();

    const textColorClass =
        variant === "default"
            ? "text-secondary border-secondary"
            : "text-primary-foreground";

    useEffect(() => {
        setIsOpen(false);
        setMobileDropdownOpen(null);
    }, [pathname]);

    return (
        <>
            <div className="flex lg:hidden items-center justify-between w-full relative">
                {/* Hamburger (Left) */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    {/* <SheetTrigger className="ml-3" asChild>
                        <Button variant="ghost" size="icon" className="border border-blue-600">
                            <HamburgerIcon
                                className={`w-16 h-16 border border-red-500 ${
                                    variant === "default"
                                        ? "text-secondary"
                                        : "text-primary-foreground"
                                }`}
                            />
                        </Button>
                    </SheetTrigger> */}


                    <SheetTrigger asChild>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-4 flex items-center justify-start h-10 w-20 bg-transparent border-none outline-none"
                        >
                            <Menu
                                className={`w-6 h-6 ${variant === "default"
                                        ? "text-secondary"
                                        : "text-primary-foreground"
                                    }`}
                                strokeWidth={1.5}
                            />
                        </button>
                    </SheetTrigger>


                    <SheetContent
                        side="left"
                        className="w-[280px] px-3 z-[50] pt-0 pb-0 lg:hidden bg-white/10 backdrop-blur-lg border-white/10 text-white"
                    >
                        <div className="relative flex items-center justify-center h-[64px] ">
                            <span className="text-xl font-bold tracking-wider text-white">OPENDOOR</span>
                        </div>
                        <SheetTitle className="sr-only">
                            Main Navigation
                        </SheetTitle>
                        <div className="space-y-1 mt-2 text-white">
                            {navItems.map((item) => {
                                if (item.type === "dropdown") {
                                    return (
                                        <div key={item.label}>
                                            <button
                                                onClick={() =>
                                                    setMobileDropdownOpen(
                                                        (prev) =>
                                                            prev ===
                                                                item.stateKey
                                                                ? null
                                                                : item.stateKey
                                                    )
                                                }
                                                className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-normal transition-colors ${mobileDropdownOpen ===
                                                        item.stateKey
                                                        ? "bg-primary"
                                                        : " hover:bg-gray-100"
                                                    }`}
                                            >
                                                {item.label}
                                                {mobileDropdownOpen ===
                                                    item.stateKey ? (
                                                    <ChevronupIcon className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                            {mobileDropdownOpen ===
                                                item.stateKey && (
                                                    <div className="pl-4 py-2 mt-1 space-y-2 bg-white/10 backdrop-blur-lg rounded-sm">
                                                        {item.links.map((link) =>
                                                            link.disabled ? (
                                                                <span
                                                                    key={link.label}
                                                                    className="block text-base text-gray-400 cursor-not-allowed"
                                                                >
                                                                    {link.label}
                                                                </span>
                                                            ) : (
                                                                <Link
                                                                    key={link.label}
                                                                    href={link.href}
                                                                    className="block text-base hover:no-underline"
                                                                >
                                                                    {link.label}
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    );
                                }

                                if (item.type === "button") {
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={item.onClick}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base hover:bg-gray-100"
                                        >
                                            {item.label}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="block px-3 py-2 rounded-md text-base hover:bg-gray-100"
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Center Logo */}
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
                >
                    <span className={`text-xl font-bold tracking-wider ${scrolling ? "text-white" : "text-primary"}`}>OPENDOOR</span>
                </Link>
                <div className="pr-5">
                    {isLoggedIn ? (
                        <AvatarButton variant={variant} />
                    ) : (
                        <LoginButton
                            className={textColorClass}
                            onClick={() => dispatch(changeLoginModalOpen(true))}
                        />
                    )}
                </div>
            </div>
            {/* ✅ Modal Instance */}
            {showListingRequestModal && (
                <ListingRequestModal
                    open={showListingRequestModal}
                    onClose={() => setShowListingRequestModal(false)}
                />
            )}
        </>
    );
};
