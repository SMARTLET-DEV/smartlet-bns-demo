"use client";

import { ChevronRightIcon } from "@/assets/icons";
import Link from "next/link";

export default function PropertyListDashboardHeader({ userRole }: { userRole: string }) {
  return (
    <div className="ml-1">
      <h1 className="text-xl font-light">{userRole} Dashboard</h1>
      <div className="flex items-center gap-4 mt-4 hidden sm:flex">
        <Link href="/" className="text-muted text-sm">
          Home
        </Link>
        <ChevronRightIcon className="w-3 h-3" />
        <p>{userRole} Dashboard</p>
      </div>
    </div>
  );
}
