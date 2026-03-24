import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCcwIcon } from "lucide-react";

interface BlogLoadErrorProps {
  onRetry: () => void;
}

export default function BlogLoadError({ onRetry }: BlogLoadErrorProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
      <AlertTriangleIcon className="w-10 h-10 text-primary" />
      <h2 className="text-xl sm:text-2xl font-light">Failed to load properties</h2>
      <p className="text-sm max-w-md">
        Something went wrong while trying to load the listings. Please check
        your internet connection or try again.
      </p>
      <Button
        onClick={onRetry}
        variant="default"
        className="flex items-center gap-2 px-4"
      >
        <RefreshCcwIcon className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );
}
