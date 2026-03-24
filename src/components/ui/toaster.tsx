"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { TickIcon } from "@/assets/icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();
  const isMobile = useIsMobile();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}   className="flex items-center gap-3">
            {variant === "success" && (
              <div className="flex-shrink-0 w-8 h-8 bg-[#CBC3E3] rounded-full flex items-center justify-center">
                <TickIcon className="h-5 w-5 text-white" />
              </div>
            )}
            {variant === "destructive" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CBC3E3' }}>
                <X className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              {title && (
                <ToastTitle className="text-gray-900 font-normal">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription
                  className={cn(
                    "text-gray-700 font-medium leading-relaxed",
                    variant === "success" ? "text-gray-800" : "",
                    variant === "destructive" ? "text-red-800" : ""
                  )}
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            
            {action}
            <ToastClose className="flex-shrink-0" />
          </Toast>

        );
      })}
      <ToastViewport 
        className={cn(
          isMobile 
            ? "fixed top-6 left-4 right-4 z-[100] flex max-h-screen w-auto flex-col gap-3 p-0" 
            : "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-6 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[480px]"
        )}
      />
    </ToastProvider>
  );
}