import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { defineStepper } from "../../ui/Stepper";

export type Step = {
    id: string;
    title: string;
    content: React.ReactNode;
};

type TimelineProps = {
  steps: Step[];
  onStepperReady?: (methods: any) => void; // Use `any` to avoid TypeScript error from internal types
};

export function OwnerTimeline({ steps, onStepperReady }: TimelineProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const {
        StepperProvider,
        StepperNavigation,
        StepperStep,
        StepperTitle,
        StepperPanel,
    } = defineStepper(...steps.map(({ id, title }) => ({ id, title })));

    return (
        <StepperProvider
            className="gap-6 flex flex-col"
            labelOrientation={isMobile ? "vertical" : "horizontal"}
        >
            {({ methods }) => {
                // Expose stepper methods
                if (onStepperReady) onStepperReady(methods);

                return (
                    <>
                        <div className="flex justify-center w-full">
                            <StepperNavigation
                                className={cn(
                                    isMobile
                                        ? "w-full flex-wrap justify-center gap-2"
                                        : "w-[70%]"
                                )}
                            >
                                {methods.all.map((step) => (
                                    <StepperStep
                                        key={step.id}
                                        of={step.id}
                                        onClick={() => methods.goTo(step.id)}
                                    >
                                        <StepperTitle
                                            className={cn(
                                                "text-sm",
                                                isMobile &&
                          "text-[10px] whitespace-normal break-words text-center"
                                            )}
                                        >
                                            {step.title}
                                        </StepperTitle>
                                    </StepperStep>
                                ))}
                            </StepperNavigation>
                        </div>

                        {methods.switch(
                            Object.fromEntries(
                                steps.map((step) => [
                                    step.id,
                                    () => (
                                        <StepperPanel
                                            key={step.id}
                                            className="h-fit content-center rounded bg-slate-50"
                                        >
                                            {step.content}
                                        </StepperPanel>
                                    ),
                                ])
                            )
                        )}
                    </>
                );
            }}
        </StepperProvider>
    );
}
