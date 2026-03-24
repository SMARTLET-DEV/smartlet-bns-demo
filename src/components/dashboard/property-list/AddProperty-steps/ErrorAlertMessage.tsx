"use client";

import { cn } from "@/lib/utils";

interface ErrorAlertMessageProps {
  message: string;
  className?: string;
}

export default function ErrorAlertMessage({ message, className }: ErrorAlertMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm",
        className
      )}
    >
      {message}
    </div>
  );
}
