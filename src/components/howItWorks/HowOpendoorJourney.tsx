import React from "react";

interface Step {
  number: string;
  title: string;
  subtitle: string | React.ReactNode;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const steps: Step[] = [
    {
        number: "1",
        title: "Create Your Account",
        subtitle: (
            <>
      Sign up to get started<br/>instantly.
            </>
        ),
        description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageSrc: "step-register.png",
        imageAlt: "Sign up screen",
    },
    {
        number: "2",
        title: "Search for Properties",
        subtitle: "Find your perfect match with powerful filters",
        description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageSrc: "/how-it-works/image-2.png",
        imageAlt: "Property search screen",
    },
    {
        number: "3",
        title: "Book A Viewing",
        subtitle: "Book appointment to get an in person viewing of the property.",
        description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageSrc: "step-view.png",
        imageAlt: "Apply for rent screen",
    },
    {
        number: "4",
        title: "Apply for Rent",
        subtitle: 
    (
        <>
      No paperwork, <br /> just a few clicks
        </>
    ),
        description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageSrc: "/how-it-works/image-4.png",
        imageAlt: "Agreement signing screen",
    },
    {
        number: "5",
        title: "Pay Deposit",
        subtitle: "Secure your new home by completing the deposit.",
        description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageSrc: "/how-it-works/image-5.png",
        imageAlt: "Agreement signing screen",
    },
];

// Make staircase increments smaller for subtle effect
const marginTops = ["mt-0", "mt-16", "mt-32", "mt-48", "mt-64"];

interface JourneyProps {
  className?: string;
}

export default function HowOpendoorJourney({ className = "" }: JourneyProps) {
    return (
        <section
            id="journey-steps"
            className={`py-16 bg-white text-center ${className}`}
        >
            <div className="container mx-auto px-5 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                {steps.map((step, idx) => (
                    <div
                        key={step.number}
                        className={`flex flex-col items-center h-full ${marginTops[idx]}`}
                    >
                        <div>
                            <div className="inline-flex items-baseline">
                                <span className="text-4xl font-light text-red-100">
                                    {step.number}
                                </span>
                                <h3 className="text-xl font-light text-[#191919]">
                                    {step.title}
                                </h3>
                            </div>
                            <p className="mt-1 text-base text-[#767676] font-normal">
                                {step.subtitle}
                            </p>
                            {/* 
              <p className="mt-2 text-[#5A5A5A] text-sm leading-relaxed">
                {step.description}
              </p> 
              */}
                        </div>
                        <div className="mt-8 w-full h-110 overflow-hidden flex justify-center">
                            <img
                                src={step.imageSrc}
                                alt={step.imageAlt}
                                className="w-full max-w-[240px] h-auto object-cover object-top"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
