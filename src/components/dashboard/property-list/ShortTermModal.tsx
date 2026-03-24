// src/components/dashboard/property-list/ShortTermModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/ResponsiveDialog";
import { useAppDispatch } from "@/redux/hook";
import { setShortTerm } from "@/redux/reducers/shortTermModal/shortTermSlice";

interface ShortTermModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function ShortTermModal({ open, onClose, onContinue }: ShortTermModalProps) {
  const dispatch = useAppDispatch();

  const handleAnswer = (answer: boolean) => {
    dispatch(setShortTerm(answer));
    console.log("ShortTerm Redux state set to:", answer);
    onClose();
    onContinue();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl w-full sm:w-[60%]">
        <DialogHeader>
          <DialogTitle className="text-base text-center mt-5 font-normal">
            Would you consider to rent your property out on short terms in near future?
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center gap-3 mt-4">
          <Button
            variant="ghost"
            className="w-[50%] sm:font-normal"
            onClick={() => handleAnswer(false)}
          >
            No
          </Button>
          <Button
            variant="default" // primary button
            className="w-[50%] sm:font-normal bg-primary/90 hover:bg-primary"
            onClick={() => handleAnswer(true)}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
