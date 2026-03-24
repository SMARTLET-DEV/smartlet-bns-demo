"use client";

import { SuccessIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface DeleteRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitDeleteRequest: (reason: string) => Promise<void>;
}

export default function DeleteRequestModal({
  open,
  onClose,
  onSubmitDeleteRequest,
}: DeleteRequestModalProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason("");
      setIsLoading(false);
      setShowSuccess(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (trimmed.length < 10) return;

    try {
      setIsLoading(true);
      await onSubmitDeleteRequest(trimmed);
      setShowSuccess(true);
    } catch (error) {
      console.error("Delete request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md rounded-2xl p-6 sm:p-8">
        <DialogHeader>
          {!showSuccess && (
            <DialogTitle className="text-xl text-left font-light">
              Request Deletion
            </DialogTitle>
          )}
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
            <SuccessIcon className="w-24 h-24 text-green-600" />
            <p className="text-base font-medium text-green-700">
              Your delete request has been submitted!
            </p>
          </div>
        ) : (
          <>
            <textarea
              placeholder="Please provide us with a reason for deleting this property. This helps us improve our service."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[120px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />

            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant={"default"}
                onClick={handleSubmit}
                disabled={isLoading || reason.trim().length < 10}
                className="px-6"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
