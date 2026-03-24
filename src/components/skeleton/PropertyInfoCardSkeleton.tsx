"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PropertyInfoCardSkeleton() {
    return (
        <div className="max-w-[410px] w-full h-fit flex flex-col text-secondary bg-white rounded-2xl p-4 shadow">
            {/* Top Row: Label + Share Icon */}
            <div className="flex items-center justify-between mb-3">
                <Skeleton width={80} height={24} borderRadius={8} />
                <Skeleton circle width={32} height={32} />
            </div>

            {/* Price */}
            <div className="mb-1">
                <Skeleton width="60%" height={28} />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-2">
                <Skeleton circle width={20} height={20} />
                <Skeleton width="70%" height={20} />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-2">
                <Skeleton circle width={20} height={20} />
                <Skeleton width="60%" height={20} />
            </div>

            {/* Property ID */}
            <div className="flex items-center justify-between mb-4">
                <Skeleton width="40%" height={20} />
                <Skeleton circle width={18} height={18} />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-2">
                <Skeleton height={42} borderRadius={8} />
                <Skeleton height={42} borderRadius={8} />
            </div>
            <Skeleton height={48} borderRadius={10} />
        </div>
    );
}
