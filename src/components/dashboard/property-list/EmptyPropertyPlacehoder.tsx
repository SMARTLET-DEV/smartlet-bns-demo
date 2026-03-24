"use client";

import { EmptyStateIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

export default function EmptyPropertyState({
  onStartClick,
}: {
  onStartClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full lg:mt-50">
      <EmptyStateIcon className="w-24 h-24 text-muted mb-4" />
      <h2 className="text-sm lg:text-xl font-light mb-2">
        You don't have any properties listed yet
      </h2>
      <p className="text-xs lg:text-sm text-muted font-light max-w-md mb-4">
        Start showcasing your properties and reach a wider audience. Add your property now to manage appointments, track your listings, and attract potential tenants.
      </p>
      <Button
        variant="link"
        className="underline text-xs lg:text-sm hover:text-red-600 transition"
        onClick={onStartClick}
      >
        It only takes a few minutes to get started
      </Button>
    </div>
  );
}
