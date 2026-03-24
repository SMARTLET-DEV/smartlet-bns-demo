"use client";

import { usePathname } from "next/navigation";
import AppWrapper from "./appWrapper";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant = pathname === "/" ? "home" : "default";

  return <AppWrapper variant={variant}>{children}</AppWrapper>;
}
