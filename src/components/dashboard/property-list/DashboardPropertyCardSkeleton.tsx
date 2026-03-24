import { cn } from "@/lib/utils";

interface DashboardPropertyCardSkeletonProps {
  layout?: "horizontal" | "vertical";
}

export const DashboardPropertyCardSkeleton = ({
  layout = "horizontal",
}: DashboardPropertyCardSkeletonProps) => {
  const isVertical = layout === "vertical";

  return (
    <div
      className={cn(
        "animate-pulse bg-background overflow-hidden transition rounded-2xl border border-border",
        isVertical ? "w-full h-[320px] flex flex-col" : "w-full h-[210px] flex"
      )}
    >
      {/* Image section */}
      <div
        className={cn(
          "rounded-t-2xl bg-muted",
          isVertical ? "w-full h-[150px]" : "w-[215px] h-[150px]"
        )}
      />

      {/* Content section */}
      <div className={cn("p-4 flex flex-col justify-between flex-1", isVertical && "gap-2")}>
        {/* Title & location */}
        <div>
          <div className="h-4 w-3/4 bg-muted rounded mb-2" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>

        {/* Icons row */}
        <div className="flex justify-between items-center text-sm mt-4">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
        </div>

        {/* Bottom: price & button */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
};
