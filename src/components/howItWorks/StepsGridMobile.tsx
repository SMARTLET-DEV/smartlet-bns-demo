"use client"

type Step = {
  number: number;
  title: string;
  subtitle: string;
  image: string;
};

interface StepsGridMobileProps {
  steps: Step[];
}

export default function StepsGridMobile({ steps }: StepsGridMobileProps) {
  return (
    <section className="w-full py-8 bg-white">
      <div className="container mx-auto px-5">
        <div className="flex flex-col gap-10 w-full max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <StepCard step={step} isEven={i % 2 === 1} key={step.number} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, isEven }: { step: Step; isEven: boolean }) {
  return (
    <div
      className={`flex w-full items-center justify-between ${
        isEven ? "flex-row-reverse" : "flex-row"
      } gap-4 sm:gap-8`}
    >
      {/* Image */}
      <div className="w-24 sm:w-40 flex-shrink-0 flex justify-center items-center bg-gray-50">
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-[150px] object-cover object-top"
        />
      </div>

      {/* Text */}
      <div
        className={`flex flex-col justify-center ${
          isEven ? "items-end text-right" : "items-start text-left"
        } max-w-[60%]`}
      >
        {/* Number + Title (title flush left/right) */}
        <div className="mb-2">
          <span className="text-3xl sm:text-4xl font-light text-[#F1AEB3] select-none">
            {step.number}
          </span>
          <span className="text-lg sm:text-2xl font-light text-neutral-900 leading-snug break-words">
            {step.title}
          </span>
        </div>

        {/* Subtitle flush with title */}
        <p className="text-sm sm:text-lg text-gray-500 break-words leading-snug">
          {step.subtitle}
        </p>
      </div>
    </div>
  );
}
