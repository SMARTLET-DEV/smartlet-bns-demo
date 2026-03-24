import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { defineStepper } from "../../ui/Stepper";

export type Step = {
    id: string;
    title: string;
    content: React.ReactNode | ((methods: StepperMethods) => React.ReactNode);
    disabled?: boolean;
};

type StepperStep = {
    id: string;
    title: string;
    disabled?: boolean;
};

export type StepperMethods = {
    all: StepperStep[];
    current: StepperStep;
    isFirst: boolean;
    isLast: boolean;
    next: () => void;
    prev: () => void;
    goTo: (id: string) => void;
    switch: (panels: Record<string, () => React.ReactNode>) => React.ReactNode;
};

type TimelineProps = {
    steps: Step[];
    children?: (methods: StepperMethods) => React.ReactNode;
};

export function RenterTimeline({ steps, children }: TimelineProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // Set initial value on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const {
        StepperProvider,
        StepperNavigation,
        StepperStep,
        StepperTitle,
        StepperPanel,
    } = defineStepper(
        ...steps.map(({ id, title, disabled }) => ({ id, title, disabled }))
    );

    return (
        <StepperProvider
            className="gap-6 flex flex-col"
            labelOrientation={isMobile ? "vertical" : "horizontal"}
        >
            {({ methods }) => (
                <>
                    <div className="flex justify-center w-full">
                        <StepperNavigation
                            className={cn(
                                isMobile
                                    ? "w-full flex-wrap justify-center gap-2"
                                    : "w-[85%]"
                            )}
                        >
                            {methods.all.map((step) => (
                                <StepperStep
                                    key={step.id}
                                    of={step.id}
                                    onClick={() => methods.goTo(step.id)}
                                    disabled={step.disabled || false}
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
                                        className="h-fit content-center rounded"
                                    >
                                        {typeof step.content === "function"
                                            ? step.content(methods)
                                            : step.content}
                                    </StepperPanel>
                                ),
                            ])
                        )
                    )}
                    {/* <StepperControls
                        // ref={stepperControlsRef}
                        className="hidden"
                    >
                        <Button className="min-w-25" onClick={methods.next}>
                            {methods.isLast ? "Reset" : "Next"}
                        </Button>
                    </StepperControls> */}
                    {children?.(methods)}
                </>
            )}
        </StepperProvider>
    );
}
