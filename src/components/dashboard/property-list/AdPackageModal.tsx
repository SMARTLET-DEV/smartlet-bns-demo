"use client";

import { TickSquareIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeAdPackageModal } from "@/redux/reducers/listingModal/listingModalSlice";
import { useState } from "react";

const AD_PLANS = [
  { id: "plan_30", price: "20", label: "30 Days Visibility" },
  { id: "plan_60", price: "35", label: "60 Days Visibility" },
  { id: "plan_90", price: "50", label: "90 Days Visibility" },
  { id: "plan_365", price: "300", label: "One Year Visibility" },
];

export default function AdPackageModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.listingModal.isAdPackageModalOpen
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>("plan_365");

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeAdPackageModal())}>
      <DialogContent
        className={cn(
          "min-w-full sm:min-w-[600px] h-fit sm:max-w-[600px]",
          "rounded-t-2xl rounded-b-none sm:rounded-3xl px-4 sm:px-6 py-5",
          "fixed bottom-0 sm:left-1/2 sm:top-1/2",
          "transition ease-in-out",
          "translate-y-0 sm:translate-y-[-50%] sm:translate-x-[-50%]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-base text-sm sm:text-normal mb-4">
            Choose your ad plan
          </DialogTitle>
        </DialogHeader>

        {/* Options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-1">
          {AD_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative flex-1 border rounded-xl p-4 text-center transition-all shadow-xs",
                  isSelected
                    ? "border-primary"
                    : "border-muted/10",
                  "flex flex-col items-center justify-center"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <TickSquareIcon className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="py-3 sm:py-8">
                  <p
                    className={cn(
                      "font-normal text-base sm:text-normal",
                      isSelected && ""
                    )}
                  >
                    ${plan.price}
                  </p>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    {plan.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sm:mt-3 mb-2">
          <Button
            className="w-full sm:w-fit sm:ml-auto block"
            disabled={!selectedPlan}
            onClick={() => {
              // handle payment initiation here
              dispatch(closeAdPackageModal());
            }}
          >
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
