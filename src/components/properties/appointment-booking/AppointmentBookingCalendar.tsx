import { Control, Path } from "react-hook-form";
import { Calendar } from "../../ui/calendar";
import { FormField, FormItem, FormMessage } from "../../ui/form";

interface AppointmentBookingCalendarProps<T extends Record<string, any>> {
    control: Control<T>;
    disabledDates: Date[];
    name: Path<T>;
    calendarMaxWidth?: string;
}

const AppointmentBookingCalendar = <T extends Record<string, any>>({
    control,
    disabledDates,
    name,
    calendarMaxWidth = "w-[80%]",
}: AppointmentBookingCalendarProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Convert string to Date for the calendar if needed
                const selectedDate = field.value
                    ? new Date(field.value)
                    : undefined;

                return (
                    <FormItem className={calendarMaxWidth}>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    // Always store as ISO string in the form
                                    field.onChange(date.toISOString());
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

export default AppointmentBookingCalendar;
