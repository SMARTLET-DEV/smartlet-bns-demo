import { PauseGreenIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PauseListingDialog({
  open,
  onClose,
  onConfirm,
  mode = "pause", // "pause" | "unpause"
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode?: "pause" | "unpause";
}) {
  const isPauseMode = mode === "pause";
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90%] p-5 text-center space-y-1 rounded-xl">
        <div className="flex justify-center">
          <PauseGreenIcon className="h-16 w-16 mt-1" />
        </div>
        <h3 className="text-lg font-normal text-secondary -mt-2">
          {isPauseMode
            ? "Are you sure you want to pause this listing?"
            : "Do you want to unpause this listing?"}
        </h3>
        <p className="text-sm text-muted">
          {isPauseMode
            ? "It will no longer be visible to potential tenants, but you can reactivate it at any time."
            : "It will become visible to tenants again immediately."}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={onClose} className="w-1/2">
            Cancel
          </Button>
          <Button className="w-1/2" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
