import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PropertyLoadErrorProps {
  onRetry: () => void;
}

export default function NoPropertyFoundError({ onRetry }: PropertyLoadErrorProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
      {/* Illustration instead of icon */}
      <div className="w-48 h-48 relative mb-0">
        <Image
          src="/listingpage/No Properties Found Illustration.png"
          alt="No Properties Found"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h2 className="text-xl font-light text-[#191919]">
        No properties found
      </h2>
      <p className="text-sm max-w-md text-[#666]">
        Please try again with different filters
      </p>

        <Button
            onClick={() => {
                document.getElementById("reset-filters-button")?.click();
            }}
            variant="outline"
            className="flex items-center gap-2 px-4 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
            <RefreshCcwIcon className="w-4 h-4" />
            Reset Filters
        </Button>
    </div>
  );
}
