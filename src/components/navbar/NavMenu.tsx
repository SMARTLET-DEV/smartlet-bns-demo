import { ChevronDownIcon, ChevronupIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// -----------------------------
// Types
// -----------------------------

type DropdownKey = "findOpen" | "learnOpen" | "servicesOpen";

type NavLink = {
    label: string;
    href: string;
    disabled?: boolean;
};

type NavItem =
    | {
          label: string;
          type: "link" | "button";
          href: string;
          isLoginRequired?: boolean;
          onClick?: () => void;
      }
    | {
          label: string;
          type: "dropdown";
          stateKey: DropdownKey;
          isLoginRequired?: boolean;
          links: NavLink[];
      };

interface NavMenuProps {
    navItems: NavItem[];
    dropdownState: Record<DropdownKey, boolean>;
    handleDropdown: (key: DropdownKey, open: boolean) => void;
    textColorClass: string;
    handleCustomLinkClick?: (label: string) => void;
}

// -----------------------------
// Component
// -----------------------------

export const NavMenu: React.FC<NavMenuProps> = ({
    navItems,
    dropdownState,
    handleDropdown,
    textColorClass,
    handleCustomLinkClick,
}) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <div className="flex gap-1 items-center">
            {navItems.map((item) =>
                item.type === "dropdown" ? (
                    <DropdownMenu
                        key={item.label}
                        onOpenChange={(open) =>
                            handleDropdown(item.stateKey, open)
                        }
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    textColorClass,
                                    "text-sm hover:text-primary hover:no-underline hover:bg-transparent focus:outline-none focus-visible:ring-0 data-[state=open]:bg-white data-[state=open]:text-primary data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none"
                                )}
                            >
                                {item.label}
                                {dropdownState[item.stateKey] ? (
                                    <ChevronupIcon className="ml-1" />
                                ) : (
                                    <ChevronDownIcon className="ml-1" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="bottom"
                            align="start"
                            className="min-w-48 rounded-tl-none rounded-tr-md rounded-br-md rounded-bl-md border-none"
                        >
                            {item.links.map((subItem) =>
                                subItem.disabled ? (
                                    <DropdownMenuItem
                                        key={subItem.label}
                                        disabled
                                        className="text-sm text-gray-400 cursor-not-allowed"
                                    >
                                        {subItem.label}
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        asChild
                                        key={subItem.label}
                                    >
                                        <Link
                                            href={subItem.href}
                                            className="text-sm text-muted hover:cursor-pointer"
                                        >
                                            {subItem.label}
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : item.type === "link" ? (
                    <Button
                        key={item.label}
                        variant="link"
                        className={cn(
                            textColorClass,
                            "text-sm hover:text-primary hover:no-underline"
                        )}
                        asChild
                    >
                        <Link
                            href={item.href}
                            onClick={(e) => {
                                if (item.isLoginRequired && !user) {
                                    e.preventDefault();
                                    dispatch(changeLoginModalOpen(true));
                                } else if (
                                    item.label === "Add a property" &&
                                    handleCustomLinkClick
                                ) {
                                    e.preventDefault(); // Prevent navigation
                                    handleCustomLinkClick(item.label); // Trigger modal from parent
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        key={item.label}
                        onClick={item.onClick}
                        variant="link"
                        className={cn(
                            textColorClass,
                            "text-sm hover:text-primary hover:no-underline"
                        )}
                    >
                        {item.label}
                    </Button>
                )
            )}
        </div>
    );
};
