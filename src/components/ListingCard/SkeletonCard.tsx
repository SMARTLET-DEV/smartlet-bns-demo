export const SkeletonCard = ({
    mobileLayout = "fixed",
}: {
  mobileLayout?: "fixed" | "full";
}) => {
    return (
        <div
            className={`flex flex-col ${mobileLayout === "full" ? "w-full sm:w-fit" : "w-fit"
            } items-center animate-pulse`}
        >
            {/* Image Skeleton */}
            <div
                className={`${mobileLayout === "full" ? "w-full sm:w-[302px]" : "w-[317px] sm:w-[302px]"
                } h-[218px] bg-gray-200 rounded-t-2xl rounded-b-none`}
            />

            {/* Content Skeleton - matching ListingcardBottom */}
            <div
                className={`${mobileLayout === "full" ? "w-full sm:w-[302px]" : "w-[317px] sm:w-[302px]"
                } bg-white rounded-b-2xl rounded-t-none p-4 sm:p-2 flex flex-col justify-between shadow-sm border border-gray-100 border-t-0`}
            >
                <div className="space-y-2 mt-1">
                    {/* Price */}
                    <div className="h-7 bg-gray-200 rounded w-1/2" />

                    {/* Location */}
                    <div className="flex items-center gap-1 mt-3">
                        <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>

                    {/* Specs */}
                    <div className="flex items-center justify-between pt-2 mb-3.5 mr-1 text-gray-200">
                        {/* Bed/Room */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-12" />
                        </div>
                        {/* Bath */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-12" />
                        </div>
                        {/* Size */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};