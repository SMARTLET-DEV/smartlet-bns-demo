"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AdditionalFeaturesCardSkeleton() {
    return (
        <div
            className="flex flex-col md:flex-row w-full container mx-auto sm:px-9 xl:px-5 gap-4 scroll-mt-24"
            id="AdditionalFeaturesView"
        >
            <div className="rounded-2xl bg-white p-6 w-full sm:max-w-[816px]">
                {/* Heading Skeleton */}
                <Skeleton width={160} height={24} className="mb-4" />

                {/* Features Grid Skeleton */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {[...Array(8)].map((_, index) => (
                        <li key={index} className="flex items-start gap-2">
                            {/* Bullet dot */}
                            <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                            {/* Single-line skeleton text */}
                            <Skeleton height={16} width="80%" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
