"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingcardcontainerSkeleton() {
    return (
        <div className="relative w-full rounded-xl overflow-hidden">
            {/* Main Image Skeleton */}
            <Skeleton height={500} width="100%" />

            {/* Heart Icon (top-left) */}
            <div className="absolute top-4 left-4">
                <Skeleton circle height={40} width={40} />
            </div>

            {/* smartVIEW badge (top-right) */}
            <div className="absolute top-4 right-4">
                <Skeleton height={28} width={90} borderRadius={8} />
            </div>

            {/* Left Arrow */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Skeleton circle height={40} width={40} />
            </div>

            {/* Right Arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Skeleton circle height={40} width={40} />
            </div>
        </div>
    );
}
