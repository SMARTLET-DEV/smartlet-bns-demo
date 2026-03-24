"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PropertyDetailLayoutSkeleton = () => {
    return (
        <div
            className="flex flex-col md:flex-row w-full container mx-auto sm:px-9 xl:px-5 gap-4 min-h-[380px] scroll-mt-24"
            id="layoutView"
        >
            {/* Layout Card Skeleton */}
            <div className="rounded-2xl bg-white p-3 w-full sm:max-w-sm sm:px-9 xl:px-5 flex flex-col h-[380px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Skeleton width={80} height={24} />
                    <Skeleton width={60} height={20} />
                </div>

                {/* Floorplan Skeleton */}
                <div className="rounded-xl flex-1 overflow-hidden border border-gray-200 mt-3 mb-3 flex">
                    <Skeleton width="100%" height="100%" />
                </div>
            </div>

            {/* Location Card Skeleton */}
            <section className="rounded-2xl bg-white w-full sm:max-w-[417px] flex flex-col h-[380px] overflow-hidden">
                {/* Header section */}
                <div className="px-4 sm:px-6 xl:px-6 mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton width={80} height={20} />
                        <div className="flex items-center gap-2">
                            <Skeleton circle width={16} height={16} />
                            <Skeleton width={160} height={16} />
                        </div>
                    </div>
                </div>

                {/* Map skeleton (fills remaining space) */}
                <div className="flex-1 w-full">
                    <Skeleton width="100%" height="100%" />
                </div>
            </section>
        </div>
    );
};

export default PropertyDetailLayoutSkeleton;
