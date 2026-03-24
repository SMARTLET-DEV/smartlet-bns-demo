"use client";

import { Logo } from "@/components/common/Logo";
import { AvatarButton } from "@/components/navbar/Avatarbutton";
import { LoginButton } from "@/components/navbar/LoginButton";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { NavMenu } from "@/components/navbar/NavMenu";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListingRequestModal from "./ListingRequestModal";

type DropdownKey = "findOpen" | "learnOpen" | "servicesOpen";

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
      links: {
        label: string;
        href: string;
        disabled?: boolean;
      }[];
    };

type NavbarProps = {
  isLoggedIn: boolean;
  variant?: "default" | "home";
};

export function Navbar({ isLoggedIn, variant = "home" }: NavbarProps) {
  const textColorClass =
    variant === "default"
      ? "text-secondary border-secondary"
      : "text-primary-foreground";

  const user = useSelector((state: RootState) => state.auth.user);

  // Extract first name or first part of full name
  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "";
  };

  const displayName = getDisplayName();

  const [showListingRequestModal, setShowListingRequestModal] = useState(false);

  const [dropdownState, setDropdownState] = useState<
    Record<DropdownKey, boolean>
  >({
    findOpen: false,
    learnOpen: false,
    servicesOpen: false,
  });

  const handleDropdown = (key: DropdownKey, isOpen: boolean) => {
    setDropdownState((prev) => ({ ...prev, [key]: isOpen }));
  };
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const [isHomePage, setIsHomePage] = useState<boolean>(false);
  const [scrollActive, setScrollActive] = useState<boolean>(false);

  // Track previous pathname to detect navigation away from property pages
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > 100) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  // Reset property filters when navigating away from residential/commercial pages
  useEffect(() => {
    // Check if current page is a property listing page
    const isPropertyPage =
      pathname.includes("/residential") || pathname.includes("/commercial");

    // Check if previous page was a property listing page
    const wasPrevPropertyPage =
      prevPathnameRef.current.includes("/residential") ||
      prevPathnameRef.current.includes("/commercial");

    // If we were on a property page and now we're not, filters will be reset by URL
    // No action needed - URL-based filtering handles this automatically
    if (wasPrevPropertyPage && !isPropertyPage) {
      // console.log("Navigating away from property pages (URL-based filtering)");
    }

    // Update the ref with current pathname for next comparison
    prevPathnameRef.current = pathname;
  }, [pathname, dispatch]);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: "Find Properties",
        type: "dropdown",
        stateKey: "findOpen",
        links: [
          {
            label: "Residential",
            href: "/residential/apartments-for-rent",
          },
          {
            label: "Commercial",
            href: "/commercial/space-for-rent",
          },
        ],
      },
      {
        label: "Add a Property",
        type: "button",
        href: "/add",
        isLoginRequired: false,
        onClick: () => setShowListingRequestModal(true),
      },
      {
        label: "How It Works",
        type: "link",
        href: "/how-it-works-renter",
        isLoginRequired: false,
      },
      {
        label: "Learn More",
        type: "dropdown",
        stateKey: "learnOpen",
        links: [
          { label: "About OPENDOOR", href: "/about-us" },
          {
            label: "Why Choose OPENDOOR",
            href: "/why-choose-opendoor",
          },
          // { label: "smartMOVE", href: "/smartMOVE", disabled: true },
          // {
          //     label: "Property Inspection",
          //     href: "/property-inspection",
          //     disabled: true,
          // },
          { label: "FAQs", href: "/faq" },
        ],
      },
      {
        label: "Contact Us",
        type: "link",
        href: "/contact",
      },
    ],
    []
  );

  const isCareerPage = pathname.startsWith("/career");

  return (
    <nav
      className={
        pathname.startsWith("/residential") || pathname.startsWith("/commercial")
          ? "navbarPropertyContainer"
          : isHomePage && !scrollActive
          ? "navbarHomeContainer"
          : "navbarContainer"
      }
      style={{
        transition: "background-color 0.3s",
        backgroundColor: isCareerPage ? "#ffffff" : undefined,
      }}
    >
      {/* <nav className="relative w-full py-3 bg-white/10 backdrop-blur-md"> */}
      <div
        className={`px-5 ${
          pathname.startsWith("/residential") || pathname.startsWith("/commercial")
            ? "propertyContainer"
            : "container"
        } mx-auto flex flex-col relative`}

              >
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Left: Logo */}
          {/* this version caused issues in safari*/}
          {/* <div className="h-7 w-fit">
                        <Logo variant={isHomePage && !scrollActive} />
                    </div> */}
          <div className="h-7 w-[160px] shrink-0 flex items-center justify-center overflow-hidden">
            <Logo variant={isHomePage && !scrollActive} />
          </div>

          {/* Center: Nav Links */}
          <NavMenu
            navItems={navItems}
            dropdownState={dropdownState}
            handleDropdown={handleDropdown}
            textColorClass={textColorClass}
            handleCustomLinkClick={(label) => {
              if (label === "Add A Property") {
                setShowListingRequestModal(true);
              }
            }}
          />
          {showListingRequestModal && (
            <ListingRequestModal
              open={showListingRequestModal}
              onClose={() => setShowListingRequestModal(false)}
            />
          )}
          {/* Right: Login */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {displayName && (
                <span className={`font-normal text-base ${textColorClass}`}>
                  Hi, {displayName}
                </span>
              )}
              <AvatarButton variant={variant} />
            </div>
          ) : (
            <LoginButton
              className={textColorClass}
              onClick={() => dispatch(changeLoginModalOpen(true))}
            />
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <MobileMenu
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        variant={variant}
        scrolling={isHomePage && !scrollActive}
      />
    </nav>
  );
}
