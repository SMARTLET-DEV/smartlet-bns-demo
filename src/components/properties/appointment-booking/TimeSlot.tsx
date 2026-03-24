import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Control, Path } from "react-hook-form";

// Function to generate time slots from 2:00 PM to 8:00 PM with 30-minute gaps
const generateTimeSlots = () => {
    const slots = [];
    const startHour = 14; // 2:00 PM
    const endHour = 20; // 8:00 PM

    for (let hour = startHour; hour <= endHour; hour++) {
        // Add full hour slot
        slots.push({
            value: `${hour.toString().padStart(2, "0")}:00`,
            label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"
            }`,
        });

        // Add half hour slot (except for the last hour to end at 8:00 PM)
        if (hour < endHour) {
            slots.push({
                value: `${hour.toString().padStart(2, "0")}:30`,
                label: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? "PM" : "AM"
                }`,
            });
        }
    }

    return slots;
};

const timeSlots = generateTimeSlots();

// Function to extract time from ISO string
const extractTimeFromISO = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

interface TimeSlotProps<T extends Record<string, any>> {
    control: Control<T>;
    name: Path<T>;
    unavailableSlots?: string[] | "ALL";
}

function TimeSlot<T extends Record<string, any>>({
    control,
    name,
    unavailableSlots = [], // Array of ISO date strings or "ALL"
}: TimeSlotProps<T>) {
    // If unavailableSlots is "ALL", all slots are disabled
    const isAllDisabled = unavailableSlots === "ALL";

    // Convert ISO strings to time strings for comparison if unavailableSlots is an array
    const unavailableTimes = Array.isArray(unavailableSlots)
        ? unavailableSlots.map(extractTimeFromISO)
        : [];

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3 flex-grow w-full">
                    <FormControl>
                        <div className="flex flex-col">
                            <p className="mb-2 font-normal">Select a Time Slot</p>
                            <div className="max-h-[150px] overflow-y-auto">
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-3 gap-2"
                                >
                                    {timeSlots.map((item, index) => {
                                        // A slot is disabled if all slots are disabled or if it's in the unavailableTimes array
                                        const isDisabled =
                                            isAllDisabled ||
                                            unavailableTimes.includes(
                                                item.value
                                            );

                                        return (
                                            <FormItem
                                                key={index}
                                                className={`font-normal flex items-center justify-center cursor-pointer rounded-md has-[input:checked]:bg-primary has-[input:checked]:text-white w-full border border-card has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input:disabled]:bg-card ${isDisabled
                                                    ? "opacity-50 cursor-not-allowed bg-card"
                                                    : ""
                                                }`}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={item.value}
                                                        className="hidden"
                                                        disabled={isDisabled}
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    className={cn(
                                                        "w-full h-full py-3 px-3 cursor-pointer justify-center",
                                                        isDisabled &&
                                                        "opacity-50 cursor-not-allowed bg-card"
                                                    )}
                                                >
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default TimeSlot;
