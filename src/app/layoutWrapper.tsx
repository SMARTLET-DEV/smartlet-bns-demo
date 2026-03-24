"use client";
import { useAppSelector } from "@/redux/hook";
import AfterLogLayout from "./customLayouts/afterLogLayout";
import BeforeLogLayout from "./customLayouts/beforeLogLayout";
import "./globals.css";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import LoaderAnimation from "@/components/utils/LoaderAnimation";


interface LayoutWrapperProps {
  children: React.ReactNode;
  variant?: "default" | "home"; // or a specific type like "default" | "minimal" etc.
}

export default function LayoutWrapper({ children, variant }: LayoutWrapperProps) {
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  const loading = useSessionCheck(isAuthenticated);
    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAnimation/>
      </div>
    );
  }
  return isAuthenticated ? (
    <AfterLogLayout variant={variant}>{children}</AfterLogLayout>
  ) : (
    <BeforeLogLayout variant={variant}>{children}</BeforeLogLayout>
  );
}

