import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";

export default function ScrollToTopButton() {
    return (
        <div className="w-fit mt-auto mb-0 ms-auto lg:relative absolute bottom-[30px] right-0">
            <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll to top"
                variant="outline"
                className="rounded-full cursor-pointer h-fit w-fit has-[>svg]:p-3 sm:has-[>svg]:p-4 bg-white text-black border-black"
            >
                <ArrowUpIcon className="sm:size-6 size-5" />
            </Button>
        </div>
    );
}
