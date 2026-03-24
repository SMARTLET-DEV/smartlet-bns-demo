"use client";

import { DelteCircleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function DeletePropertyDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Property
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90%] p-6 text-center space-y-1 rounded-xl">
          <div className="flex justify-center">
            <DelteCircleIcon className="h-16 w-16 mt-3" />
          </div>
          <h3 className="text-lg font-normal text-foreground">
            Are you sure you want to remove this property permanently?
          </h3>
          <p className="text-sm text-muted">
            Once removed, you won’t be able to recover it. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              className="w-1/2"
              onClick={() => {
                // TODO: Implement delete logic
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
