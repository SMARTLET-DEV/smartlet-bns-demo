import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { RentalProcessStatus } from "@/types/rental-process";

interface TimelineStepProps {
    label: string;
    stepIndex: number;
    currentStatus: RentalProcessStatus;
    activeStatuses: string[];
    completedStatuses: string[];
    children: React.ReactNode;
}

const TimelineStep = ({
    label,
    stepIndex,
    isLast,
    currentStatus,
    activeStatuses,
    completedStatuses,
    children,
}: TimelineStepProps & { isLast: boolean }) => {
    const isCompleted = completedStatuses.includes(currentStatus);
    const isActive = activeStatuses.includes(currentStatus);

    return (
        <div className="relative pl-12 pb-12 last:pb-0 group">
            {/* Dot Section (Centered on the line at left-4) */}
            <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center z-10">
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

            {/* Content Area */}
            <div className="space-y-4">
                <div className="min-h-8 flex flex-col justify-center">
                    <span
                        className={cn(
                            "text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                            isCompleted || isActive ? "text-primary" : "text-gray-400"
                        )}
                    >
                        {label}
                    </span>
                    {isActive && (
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                            </span>
                            <span className="text-[9px] text-primary font-bold italic tracking-wide">In Progress</span>
                        </div>
                    )}
                </div>

                <div className={cn(
                    "transition-all duration-500",
                    isCompleted || isActive ? "opacity-100 translate-y-0" : "opacity-40 pointer-events-none"
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};

interface ProcessTimelineLayoutProps {
    status: RentalProcessStatus;
    children: React.ReactNode[];
}

export function ProcessTimelineLayout({ status, children }: ProcessTimelineLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const springY = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 30,
        restDelta: 0.001
    });


    const STEPS_CONFIG = [
        {
            label: "Documents",
            activeStatuses: ["DOCUMENTS_PENDING", "DOCUMENTS_SUBMITTED", "DOCUMENTS_REJECTED", "INITIATED"],
            completedStatuses: ["DOCUMENTS_VERIFIED", "AWAITING_PAYMENT_INSTRUCTION", "PAYMENT_INSTRUCTION_READY", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_REJECTED", "PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH", "OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED"]
        },
        {
            label: "Payment",
            activeStatuses: ["AWAITING_PAYMENT_INSTRUCTION", "PAYMENT_INSTRUCTION_READY", "AWAITING_PAYMENT_CONFIRMATION", "PAYMENT_REJECTED", "PAYMENT_CONFIRMED", "AWAITING_OWNER_DISPATCH"],
            completedStatuses: ["OWNER_RECEIVED_CONFIRMED", "COMPLETED", "MOVE_IN_SCHEDULED", "PAID"]
        },
        {
            label: "Rental Complete",
            activeStatuses: ["OWNER_RECEIVED_CONFIRMED"],
            completedStatuses: ["COMPLETED", "MOVE_IN_SCHEDULED"]
        }
    ];

    // Determine the fixed progress based on status
    const getFixedProgress = () => {
        const completedCount = STEPS_CONFIG.filter(step => step.completedStatuses.includes(status)).length;
        const activeIndex = STEPS_CONFIG.findIndex(step => step.activeStatuses.includes(status));

        if (completedCount === STEPS_CONFIG.length) return 1;
        if (activeIndex !== -1) {
            // Fill till the start of the active step dot
            return activeIndex / STEPS_CONFIG.length;
        }
        if (completedCount > 0) {
            // Fill till the end of the last completed step dot
            return completedCount / STEPS_CONFIG.length;
        }
        return 0;
    };

    const fixedProgress = getFixedProgress();

    // Use the maximum of fixed progress and scroll progress
    const combinedProgress = useTransform([scrollYProgress], ([latestScroll]) => {
        return Math.max(fixedProgress, Number(latestScroll));
    });

    const springProgress = useSpring(combinedProgress, {
        stiffness: 150,
        damping: 30,
        restDelta: 0.001
    });

    const progressLineHeight = useTransform(springProgress, [0, 1], ["0%", "100%"]);
    const particleTop = useTransform(springProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative">
            {/* Scroll-Responsive Wiring Layer */}
            {/* We start at 16px (center of first dot) and end at the bottom finish dot (center of final 4px segment) */}
            <div className="absolute left-[15px] top-[16px] bottom-4 w-[2px] pointer-events-none">
                {/* Base Track (always visible) */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100" />

                {/* Dynamic "Painted" Progress Line */}
                <motion.div
                    style={{ height: progressLineHeight }}
                    className="absolute top-0 left-0 w-full bg-primary z-10 origin-top"
                />

                {/* Moving Particle on the wire */}
                <motion.div
                    style={{ top: particleTop }}
                    className="absolute left-[-3px] w-2 h-2 bg-primary rounded-full z-20 -translate-y-1/2"
                />
            </div>

            <div className="flex flex-col">
                {STEPS_CONFIG.map((step, index) => (
                    <TimelineStep
                        key={step.label}
                        label={step.label}
                        stepIndex={index}
                        isLast={false}
                        currentStatus={status}
                        activeStatuses={step.activeStatuses}
                        completedStatuses={step.completedStatuses}
                    >
                        {children[index]}
                    </TimelineStep>
                ))}

            </div>
        </div>
    );
}
