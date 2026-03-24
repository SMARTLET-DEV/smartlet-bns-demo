"use client";

import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";

import { RootState } from "@/redux/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";

const Footer = () => {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="bg-white">
            <div className="container mx-auto px-5 flex flex-col items-center lg:py-20 py-10 text-center text-secondary">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light">
                    Ready to Find Your Perfect Home?
                </p>
                <p className="lg:text-2xl text-base mt-4">
                    Smart, simple, and stress-free — that's what OPENDOOR is all
                    about.
                </p>
                <div className="flex flex-col lg:flex-row lg:items-center lg:mt-10 mt-6 gap-6">
                    <Button
                        asChild
                        variant={"outline"}
                        className="text-primary border-primary text-lg font-normal px-8 py-5 rounded hover:bg-primary hover:text-white"
                    >
                        <Link href="/properties">Start Searching Now</Link>
                    </Button>
                    <Button
                        variant={"outline"}
                        className="text-lg font-normal px-8 py-5 rounded border-black hover:bg-black hover:text-white"
                        asChild={user ? false : true}
                    >
                        {user ? (
                            <Link
                                href={
                                    user.role === "OWNER"
                                        ? "/property-list"
                                        : user.role === "RENTER"
                                            ? "/appointments"
                                            : "/profile"
                                }
                            >
                                {user.role === "OWNER"
                                    ? "List Your Property"
                                    : user.role === "RENTER"
                                        ? "See Your Appointments"
                                        : "Profile"}
                            </Link>
                        ) : (
                            <span
                                onClick={() =>
                                    dispatch(changeLoginModalOpen(true))
                                }
                            >
                                List Your Property
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Footer;
