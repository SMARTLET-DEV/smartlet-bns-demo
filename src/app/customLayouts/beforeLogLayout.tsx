"use client";

import ForgetPasswordModal from "@/components/auth/ForgetPassword";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import Footer from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

interface BeforeLogLayoutProps {
    children: React.ReactNode;
    variant?: "default" | "home";
}

export default function BeforeLogLayout({
    children,
    variant = "default",
}: BeforeLogLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar isLoggedIn={false} variant={variant} />

            <main className="flex-grow">{children}</main>
            <LoginModal />
            <SignupModal />
            <ForgetPasswordModal />
            <Toaster />
            
            <Footer />
        </div>
    );
}
