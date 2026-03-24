import React from "react";

type BlogCardSkeletonProps = {
  variant?: "default" | "large";
};

export const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  variant = "default",
}) => {
  if (variant === "large") {
    return (
      <div className="w-full flex flex-row rounded-2xl overflow-hidden p-4 h-full animate-pulse">
        {/* Left: Image skeleton */}
        <div className="w-[220px] h-[180px] bg-muted/30 rounded-2xl flex-shrink-0" />
        {/* Right: Content skeleton */}
        <div className="flex flex-col justify-start px-6 py-2 flex-1 space-y-2">
          <div className="h-6 bg-muted/30 rounded w-3/4" />
          <div className="h-4 bg-muted/20 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-muted/20 rounded w-full" />
            <div className="h-3 bg-muted/20 rounded w-[90%]" />
            <div className="h-3 bg-muted/20 rounded w-[85%]" />
          </div>
          <div className="h-4 w-20 bg-muted/30 rounded mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[350px] sm:w-[390px] flex flex-col rounded-t-2xl overflow-hidden h-full animate-pulse">
      <div className="w-full h-[220px] bg-muted/30 rounded-2xl" />
      <div className="pt-4 pr-4 pb-4 space-y-3 flex flex-col flex-1">
        <div className="h-3 w-1/3 bg-muted/30 rounded" />
        <div className="h-5 w-3/4 bg-muted/30 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted/20 rounded" />
          <div className="h-3 w-[95%] bg-muted/20 rounded" />
        </div>
        <div className="h-4 w-20 bg-muted/30 rounded mt-auto" />
      </div>
    </div>
  );
};
