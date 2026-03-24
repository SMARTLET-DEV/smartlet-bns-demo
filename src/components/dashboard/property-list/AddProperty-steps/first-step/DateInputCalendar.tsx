"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, Path } from "react-hook-form";

interface DateInputCalendarProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabledDates?: Date[];
  required?: boolean;
}

export default function DateInputCalendar<T extends Record<string, any>>({
  control,
  name,
  label = "Pick a date",
  disabledDates = [],
  required = false,
}: DateInputCalendarProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = field.value ? new Date(field.value) : undefined;

        return (
          <FormItem>
            {label && (
              <FormLabel className="text-base font-normal data-[error=true]:text-secondary">
                {label}
                {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl className="py-3 px-3 h-fit placeholder:text-muted">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size={"lg"}
                    className={cn(
                      "py-5 w-full justify-start text-left font-normal",
                      !field.value && "text-muted"
                    )}
                  >
                    <CalendarIcon className="ml-0 mr-0 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value), "PPP")
                      : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                  className="p-3"
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) field.onChange(date.toISOString());
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        date < today ||
                        disabledDates.some((d) => {
                          const disabled = new Date(d);
                          disabled.setHours(0, 0, 0, 0);
                          return (
                            date.getDate() === disabled.getDate() &&
                            date.getMonth() === disabled.getMonth() &&
                            date.getFullYear() === disabled.getFullYear()
                          );
                        })
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        );
      }}
    />
  );
}
