import { Button } from "@/components/ui/button";

export function FilterHeader({
    onReset,
    onClose,
}: {
    onReset: () => void;
    onClose: () => void;
}) {
    return (
        <div className="flex justify-between items-center mb-3">
            <Button
                variant="ghost"
                size="sm"
                className="text-primary font-normal px-0 hover:text-red-500 hover:bg-transparent"
                onClick={onReset}
            >
                Reset all
            </Button>
            <Button
                variant="ghost"
                onClick={onClose}
                size={"icon"}
                className="text-muted text-xl font-normal hover:bg-transparent"
                aria-label="Close"
            >
                ✕
            </Button>
        </div>
    );
}
