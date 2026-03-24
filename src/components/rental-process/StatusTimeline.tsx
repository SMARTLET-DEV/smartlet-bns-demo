import { Check, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusTimelineProps {
    status: string;
}

// Define the steps and their corresponding statuses
const STEPS = [
    {
        id: "documents",
        label: "Documents",
        activeStatuses: ["DOCUMENTS_PENDING", "DOCUMENTS_SUBMITTED", "DOCUMENTS_VERIFIED"],
        completedStatuses: ["DOCUMENTS_VERIFIED", "PAYMENT_INSTRUCTION_READY", "PAYMENT_PROOF_SUBMITTED", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH", "OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED"]
    },
    {
        id: "payment",
        label: "Payment",
        activeStatuses: ["PAYMENT_INSTRUCTION_READY", "PAYMENT_PROOF_SUBMITTED", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH"],
        completedStatuses: ["OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED", "PAID"]
    },
    {
        id: "confirmation",
        label: "Rental Complete",
        activeStatuses: ["OWNER_RECEIVED_CONFIRMED"],
        completedStatuses: ["COMPLETED", "MOVE_IN_SCHEDULED", "OWNER_RECEIVED_CONFIRMED"]
    }
];

export function StatusTimeline({ status }: StatusTimelineProps) {
    // Helper to determine step state
    const getStepState = (stepIndex: number) => {
        const step = STEPS[stepIndex];
        if (step.completedStatuses.includes(status)) return "completed";
        if (step.activeStatuses.includes(status)) return "active";

        const isPast = STEPS.slice(stepIndex + 1).some(s => s.activeStatuses.includes(status) || s.completedStatuses.includes(status));
        if (isPast) return "completed";

        return "pending";
    };

    return (
        <div className="w-full py-8 px-6 bg-white rounded-2xl border border-gray-200">
            <div className="relative">
                {/* Continuous Vertical Line Background */}
                <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-100 -z-10" />

                {/* Progress Line */}
                <div
                    className="absolute left-[14px] top-2 w-[2px] bg-primary transition-all duration-500 -z-10"
                    style={{
                        height: (() => {
                            const activeIndex = STEPS.findIndex(s => s.activeStatuses.includes(status) || s.completedStatuses.includes(status));
                            const completedCount = STEPS.filter(s => s.completedStatuses.includes(status)).length;
                            if (completedCount === STEPS.length) return "100%";
                            if (activeIndex === -1) return "0%";
                            // Align height to the middle of the active dot
                            // 3 steps, 2 gaps. gap = space-y-16 (64px) + step height (~20px)
                            return `${(activeIndex / (STEPS.length - 1)) * 95}%`;
                        })()
                    }}
                />

                <div className="flex flex-col space-y-16">
                    {STEPS.map((step, index) => {
                        const state = getStepState(index);
                        const isCompleted = state === "completed";
                        const isActive = state === "active";

                        return (
                            <div key={step.id} className="relative pl-12 flex flex-col items-start group">
                                {/* Concentric Dot Section (Centered on the line at 15px) */}
                                <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center -translate-x-0.5">
                                    {/* Outer Circle */}
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-4 transition-all duration-300 bg-white flex items-center justify-center",
                                        isCompleted || isActive
                                            ? "border-primary/20 scale-110 shadow-[0_0_8px_rgba(239,68,68,0.1)]"
                                            : "border-gray-50 scale-100"
                                    )}>
                                        {/* Inner Focal Point Dot */}
                                        <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            isCompleted || isActive
                                                ? "bg-primary shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                                : "bg-gray-300"
                                        )} />
                                    </div>
                                </div>

                                {/* Label Section */}
                                <div className="min-h-8 flex flex-col justify-center space-y-0.5">
                                    <span
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                                            isCompleted || isActive ? "text-primary" : "text-gray-400"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                    {isActive && (
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                            </span>
                                            <span className="text-[9px] text-primary font-bold italic tracking-wide">In Progress</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
