import { Button } from "@/components/ui/button";

export function FilterFooter({
    onCancel,
    onApply,
}: {
    onCancel: () => void;
    onApply: () => void;
}) {
    return (
        <div className="mt-4 px-3 flex justify-between gap-3">
            <Button
                variant="outline"
                className="w-1/2 h-12 sm:h-10 hover:bg-transparent bg-transparent border-none shadow-none font-normal"
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                variant="outline"
                className="w-1/2 h-12 sm:h-10 font-normal bg-transparent border-primary text-primary hover:text-white hover:bg-primary duration-150"
                onClick={onApply}
            >
                Apply
            </Button>
        </div>
    );
}
