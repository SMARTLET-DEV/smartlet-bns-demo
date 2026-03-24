import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const BlogCardSkeleton = () => {
    return (
        <div className="w-[350px] sm:w-[390px] flex flex-col rounded-t-2xl overflow-hidden bg-transparent h-full">
            {/* Image skeleton */}
            <div className="w-full h-[220px] rounded-2xl overflow-hidden">
                <Skeleton height={220} width="100%" borderRadius={16} />
            </div>

            {/* Content area */}
            <div className="pt-4 pr-4 pb-4 space-y-3 flex flex-col flex-1">
                {/* Date & duration */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-light">
                    <Skeleton height={14} width={60} borderRadius={4} />
                    <span className="text-muted">—</span>
                    <Skeleton height={14} width={50} borderRadius={4} />
                </div>

                {/* Title skeleton - two lines */}
                <div className="space-y-2">
                    <Skeleton height={24} width="90%" borderRadius={4} />
                    <Skeleton height={24} width="70%" borderRadius={4} />
                </div>

                {/* Description skeleton - two lines */}
                <div className="space-y-1">
                    <Skeleton height={16} width="100%" borderRadius={4} />
                    <Skeleton height={16} width="80%" borderRadius={4} />
                </div>

                {/* Read More link skeleton */}
                <div className="mt-auto">
                    <Skeleton height={18} width={80} borderRadius={4} />
                </div>
            </div>
        </div>
    );
};
