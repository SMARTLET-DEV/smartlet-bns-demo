"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useGetActiveJobsQuery } from "@/redux/reducers/career/careerApi";
import { Loader2 } from "lucide-react";

export function AvailablePositions() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { data: jobs, isLoading, isError } = useGetActiveJobsQuery();

  const handleCardClick = (id: string) => {
    setActiveCard(activeCard === id ? null : id);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-[#fff6f6] pt-8 sm:pt-10 pb-16 sm:pb-20 min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="w-full bg-[#fff6f6] pt-8 sm:pt-10 pb-16 sm:pb-20">
        <div className="container mx-auto px-5 text-center">
          <p className="text-red-500">Unable to load job openings. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!jobs || jobs.length === 0) {
    return (
      <section className="w-full bg-[#fff6f6] pt-8 sm:pt-10 pb-16 sm:pb-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center text-gray-900 mb-8">
            Available Positions
          </h2>
          <p className="text-gray-600">No open positions at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#fff6f6] pt-8 sm:pt-10 pb-16 sm:pb-20">
      <div className="container mx-auto px-5">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center text-gray-900 mb-16">
          Available Positions
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {jobs.map((position) => (
            <Link
              href={`/career/${position.slug}`}
              key={position.id}
              className="bg-white rounded-2xl p-6 sm:p-8 text-left aspect-[1/0.8] flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer relative group w-full sm:max-w-[calc(50%-1rem)] lg:max-w-[calc(33.333%-1.5rem)]"
              onClick={() => handleCardClick(position.id)}
            >
              <p className="text-primary text-sm sm:text-base font-medium mb-3">
                {position.team}
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-auto leading-tight">
                {position.title.includes("(") ? (
                  <>
                    {position.title.split("(")[0].trim()}
                    <br />
                    <span className="text-lg sm:text-xl lg:text-2xl">({position.title.split("(")[1]}</span>
                  </>
                ) : (
                  position.title
                )}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-light mt-4">
                Start
                <br />
                Immediately
              </p>
              {/* Arrow - shows on hover (desktop) or click (mobile) */}
              <div
                className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 transition-opacity duration-300 ${activeCard === position.id
                    ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    : "opacity-0 sm:group-hover:opacity-100"
                  }`}
              >
                <Image
                  src="/careers/Available Position Arrow.png"
                  alt="View position"
                  width={100}
                  height={100}
                  className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
