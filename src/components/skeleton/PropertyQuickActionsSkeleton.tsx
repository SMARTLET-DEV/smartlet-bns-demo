"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function PropertyQuickActionsSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
      <div className="flex flex-nowrap gap-4 px-4 sm:px-9 xl:px-5">
        {/* Skeleton for Gallery Button */}
        <div
          className={`rounded-xl px-4 py-2.5 bg-white shrink-0 snap-start flex items-center gap-2 ${isMobile ? 'h-12 !px-6' : 'h-10'}`}
        >
          <Skeleton circle height={20} width={20} />
          <Skeleton height={16} width={60} />
        </div>

        {/* Skeleton for smartVIEW Button */}
        <div
          className={`rounded-xl px-4 py-2.5 bg-white shrink-0 snap-start flex items-center gap-2 ${isMobile ? 'h-12 !px-6' : 'h-10'}`}
        >
          <Skeleton circle height={20} width={20} />
          <Skeleton height={16} width={90} />
        </div>

        {/* Skeleton for Video Button */}
        <div
          className={`rounded-xl px-4 py-2.5 bg-white shrink-0 snap-start flex items-center gap-2 ${isMobile ? 'h-12 !px-6' : 'h-10'}`}
        >
          <Skeleton circle height={20} width={20} />
          <Skeleton height={16} width={60} />
        </div>

        {/* Skeleton for Layout Button */}
        <div
          className={`rounded-xl px-4 py-2.5 bg-white shrink-0 snap-start flex items-center gap-2 ${isMobile ? 'h-12 !px-6' : 'h-10'}`}
        >
          <Skeleton circle height={20} width={20} />
          <Skeleton height={16} width={60} />
        </div>

        {/* Skeleton for Additional Features Button */}
        <div
          className={`rounded-xl px-4 py-2.5 bg-white shrink-0 snap-start flex items-center gap-2 ${isMobile ? 'h-12 !px-6' : 'h-10'}`}
        >
          <Skeleton circle height={20} width={20} />
          <Skeleton height={16} width={120} />
        </div>
      </div>
    </div>
  );
}
