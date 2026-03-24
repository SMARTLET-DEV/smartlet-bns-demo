"use client"
import { useState, useEffect } from "react";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

interface StepsGridProps {
  steps: Step[];
}

export default function StepsGrid({ steps }: StepsGridProps) {
  const [activeStep, setActiveStep] = useState(0);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    const element = document.getElementById(steps[index].id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeIndex = -1;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            const stepIndex = steps.findIndex(
              (step) => step.id === entry.target.id
            );
            if (stepIndex !== -1) {
              maxRatio = entry.intersectionRatio;
              activeIndex = stepIndex;
            }
          }
        });

        if (activeIndex !== -1) {
          setActiveStep(activeIndex);
        }
      },
      {
        threshold: [
          0, 0.1, 0.2, 0.3, 0.4,
          0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
        ],
        rootMargin: "0px",
      }
    );

    steps.forEach((step) => {
      const element = document.getElementById(step.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [steps]);

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="flex gap-12 max-w-6xl">
          {/* Left Navigation + Divider */}
          <div className="flex-shrink-0">
            <div className="sticky top-[100px] flex relative">
              {/* Navigation */}
              <nav>
                <ul className="space-y-10 w-48">
                  {steps.map((step, index) => (
                    <li key={step.id}>
                      <div className="flex flex-col items-start text-left select-none">
                        {/* Number + Title Row */}
                        <div className="flex items-center gap-3">
                          {/* Number Circle */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-normal
                              ${
                                activeStep === index
                                  ? "bg-[#EB5C60] text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                          >
                            {index + 1}
                          </div>

                          <span
                            className={`text-base font-normal whitespace-nowrap ${
                              activeStep === index
                                ? "text-black"
                                : "text-gray-800"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>

                        {/* {activeStep === index && (
                          <p className="ml-10 mt-2 text-sm text-gray-600 leading-snug break-words">
                            {step.subtitle}
                          </p>
                        )} */}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Divider */}
              <div className="w-px bg-gray-200 ml-8 lg:ml-44 h-[400px] flex-shrink-0"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="sticky top-[100px] flex items-center justify-center"
                  style={{
                    zIndex: i + 1,
                  }}
                >
                  <StepCard step={step} isEven={i % 2 === 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  isEven,
}: {
  step: { id: string; title: string; subtitle: string; image: string };
  isEven: boolean;
}) {
  return (
    <div
      id={step.id}
      className="flex w-full items-center justify-center relative bg-white"
    >
      {/* Left side content for odd steps */}
      {!isEven && (
        <div className="flex-1 flex justify-end pr-16">
          <div className="max-w-sm">
            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">
              {step.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {step.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Phone mockup */}
      <div className="flex-shrink-0 relative">
        <div className="w-72 h-[650px] relative overflow-hidden">
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-[500px] object-cover object-top"
          />
        </div>
      </div>

      {/* Right side content for even steps */}
      {isEven && (
        <div className="flex-1 flex justify-start pl-16">
          <div className="max-w-sm">
            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">
              {step.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {step.subtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
