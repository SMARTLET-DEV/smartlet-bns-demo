"use client";

import { CareerHero } from "@/components/career/CareerHero";
import { WhyWorkWithUs } from "@/components/career/WhyWorkWithUs";
import { WhatWeExpect } from "@/components/career/WhatWeExpect";
import { AvailablePositions } from "@/components/career/AvailablePositions";

export default function CareerPage() {
  return (
    <div className="bg-[#fff6f6]">
      <CareerHero />
      <WhyWorkWithUs />
      <WhatWeExpect />
      <AvailablePositions />
    </div>
  );
}
