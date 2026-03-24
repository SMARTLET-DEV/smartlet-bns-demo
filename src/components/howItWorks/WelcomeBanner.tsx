"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";

export default function WelcomeBanner() {
    const user: any = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    return (
        <section className="w-full bg-[#f9f9f9] py-20 text-center">
            <div className="container mx-auto px-5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4">
          Welcome to Smarter Renting
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Smart, simple, and stress-free — that&apos;s what OPENDOOR is all
          about.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/residential/apartments-for-rent">
                        <Button className="bg-[#EB5C60] hover:bg-red-600 text-white text-sm sm:text-base px-6 py-2">
              Start Searching Now
                        </Button>
                    </Link>
                    {!user && (
                        <Button
                            variant="outline"
                            className="text-sm sm:text-base border-black hover:bg-gray-100"
                            onClick={() => dispatch(changeLoginModalOpen(true))}
                            disabled={user}
                        >
              Register as a Renter
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
