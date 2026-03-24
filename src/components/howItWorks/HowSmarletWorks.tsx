import React from "react";

interface HowOpendoorWorksProps {
  /**
   * Optional additional classes to apply to the section wrapper
   */
  className?: string;
  isOwner?: boolean;
}

export default function HowOpendoorWorks({ className = "", isOwner = false }: HowOpendoorWorksProps) {
    return (
        <section
            id="how-opendoor-works"
            className={`py-12 text-center ${className} bg-white` }
        >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black dark:text-white leading-tight tracking-tight">
          In Five Simple Steps
            </h1>
            <p className="mt-2 text-lg font-normal text-[#5A5A5A]">
        The {isOwner ? "Homeowner's" : "Renter's"} Journey with OPENDOOR
            </p>
        </section>
    );
}
