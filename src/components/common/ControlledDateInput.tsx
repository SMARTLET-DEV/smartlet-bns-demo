import { Control, FieldError, Path, UseFormReturn } from "react-hook-form";
import { Calendar } from "../ui/calendar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FormField, FormItem, FormMessage } from "../ui/form";

interface ControlledDateInputProps<T extends Record<string, any>> {
    control: Control<T>;
    name: Path<T>;
    disabledDates?: Date[];
    calendarWidth?: string;
    label?: string;
}

const ControlledCalendar = <T extends Record<string, any>>({
    control,
    disabledDates = [],
    name,
}: ControlledDateInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Convert string to Date for the calendar if needed
                const selectedDate = field.value
                    ? new Date(field.value + "T12:00:00") // Use noon to prevent timezone issues
                    : undefined;

                return (
                    <FormItem className={"w-full"}>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    // Format date as YYYY-MM-DD using local date
                                    const year = date.getFullYear();
                                    const month = String(
                                        date.getMonth() + 1
                                    ).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(
                                        2,
                                        "0"
                                    );
                                    const formattedDate = `${year}-${month}-${day}`;
                                    field.onChange(formattedDate);
                                }
                            }}
                            className="w-full base-calendar"
                            fromMonth={new Date()}
                            toMonth={
                                new Date(
                                    new Date().getFullYear(),
                                    new Date().getMonth() + 2,
                                    0
                                )
                            }
                            disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0); // Reset time to start of day

                                // Get the first day of the current month
                                const currentMonth = new Date(
                                    today.getFullYear(),
                                    today.getMonth(),
                                    1
                                );
                                // Get the last day of the second month from current month
                                const twoMonthsLater = new Date(
                                    today.getFullYear(),
                                    today.getMonth() + 2,
                                    0
                                );

                                // Check if the date is in the disabledDates array
                                const isDisabledDate = disabledDates.some(
                                    (disabledDate) => {
                                        const d = new Date(disabledDate);
                                        d.setHours(0, 0, 0, 0);
                                        return (
                                            date.getDate() === d.getDate() &&
                                            date.getMonth() === d.getMonth() &&
                                            date.getFullYear() ===
                                                d.getFullYear()
                                        );
                                    }
                                );

                                // Disable dates before today, after the end of second month, or in disabledDates
                                return (
                                    date < today ||
                                    date > twoMonthsLater ||
                                    isDisabledDate
                                );
                            }}
                            initialFocus
                        />
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default function ControlledDateInput<T extends Record<string, any>>({
    form,
    control,
    name,
    disabledDates = [],
    calendarWidth,
    label,
    disabled = false,
}: ControlledDateInputProps<T> & {
    form?: UseFormReturn<T>;
    disabled?: boolean;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                disabled={disabled}
                className={
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                }
            >
                <div className="">
                    <p className="w-full text-left py-3 px-4 border text-base md:text-sm rounded-md ">
                        {form?.watch(name)
                            ? new Date(form.watch(name)).toLocaleDateString(
                                  "en-US",
                                  {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                  }
                              )
                            : label || "Select a date"}
                    </p>
                    {form?.formState.errors[name] && (
                        <p className="text-red-500 text-sm">
                            {
                                (form.formState.errors[name] as FieldError)
                                    ?.message
                            }
                        </p>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={calendarWidth}>
                <div className="p-5">
                    <ControlledCalendar
                        control={control}
                        name={name}
                        disabledDates={disabledDates}
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
