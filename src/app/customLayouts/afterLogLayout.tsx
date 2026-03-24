"use client";

import Footer from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface AfterLogLayoutProps {
    children: React.ReactNode;
    variant?: "default" | "home"; // or string if open-ended
}

export default function AfterLogLayout({
    children,
    variant = "default",
}: AfterLogLayoutProps) {
    const user: any = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar isLoggedIn={true} variant={variant} />{" "}
            {/* Pass it to Navbar */}
            {/* <header className="p-4">
                {user && <p>Welcome, {user?.name}!</p>}
            </header> */}
            <main className="flex-grow">{children}</main>
            <Toaster />
            <Footer />
        </div>
    );
}
