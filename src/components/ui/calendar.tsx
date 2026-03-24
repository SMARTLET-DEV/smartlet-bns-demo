"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("", className)}
            classNames={{
                months: "flex flex-col gap-2 w-full",
                month: "flex flex-col gap-4",
                caption:
                    "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-x-1",
                head_row: "grid grid-cols-7",
                head_cell:
                    "text-muted-foreground rounded-md w-full text-center font-normal text-[0.8rem]",
                row: "flex w-full mt-2 grid grid-cols-7",
                cell: cn(
                    "relative p-0 size-8 m-auto text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([disabled])]:cursor-not-allowed",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md"
                ),
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 m-auto p-0 font-normal aria-selected:opacity-100 cursor-pointer  disabled:opacity-[0.4] disabled:bg-card "
                ),
                day_range_start:
                    "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
                day_range_end:
                    "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground aria-selected:text-muted-foreground",
                day_disabled: "text-muted-foreground ",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            // components={{
            //     IconLeft: ({ className, ...props }) => (
            //         <ChevronLeft
            //             className={cn("size-4", className)}
            //             {...props}
            //         />
            //     ),
            //     IconRight: ({ className, ...props }) => (
            //         <ChevronRight
            //             className={cn("size-4", className)}
            //             {...props}
            //         />
            //     ),
            // }}
            {...props}
        />
    );
}

export { Calendar };
