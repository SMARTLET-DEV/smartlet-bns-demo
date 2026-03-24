"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIsMobile } from "@/hooks/useIsMobile";

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function AboutPropertyCardSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row w-full container mx-auto sm:px-9 xl:px-5 gap-4">
      <div className="bg-white text-muted font-light p-5 rounded-2xl flex flex-col gap-6 w-full sm:max-w-[816px]">
        <p className="text-2xl font-normal text-secondary">
          <Skeleton width={180} />
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Skeleton for Bedroom */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Bathroom */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Size */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Balcony */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Facing */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Parking */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Elevator */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for Floor Level */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={70} />
          </div>

          {/* Skeleton for features */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={100} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton circle height={20} width={20} />
            <Skeleton height={16} width={100} />
          </div>

          {/* Skeleton for Description */}
          <div className="flex items-center gap-2">
            <Skeleton height={16} width={250} />
          </div>
        </div>

        {/* Skeleton for Property Description */}
        <Skeleton count={1} />
      </div>
    </div>
  );
}
