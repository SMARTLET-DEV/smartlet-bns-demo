"use client";

import { TickcircleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function ListingSubmittedDialog() {
  const [open, setOpen] = useState(true);

  const handleRefresh = () => {
    setOpen(false);
    window.location.reload(); // Refresh the page
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] p-6 text-center space-y-4 rounded-xl">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Listing Submission Confirmation</DialogTitle>
        <div className="flex justify-center">
          <TickcircleIcon className="h-16 w-16 mt-2" />
        </div>
        <p className="text-base font-normal -mt-3">
          Your listing has been submitted.</p>
        <p className="text-muted font-normal -mt-7">
          Upon approval, Our Content team will reach out to you within 48 hours.
        </p>
        <div className="flex flex-row justify-center gap-2 pt-2">
          <Button variant="outline" onClick={handleRefresh} className="sm:w-1/2 w-2/5 hover:border-primary hover:text-primary">
            Close
          </Button>
          <Button onClick={handleRefresh} className="sm:w-1/2 w-3/5">
            <span className="sm:hidden">Owner Dashboard</span>
            <span className="hidden sm:inline">Back to Owner Dashboard</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
