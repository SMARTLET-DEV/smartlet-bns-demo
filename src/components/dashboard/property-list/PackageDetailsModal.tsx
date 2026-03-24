"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface PackageDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

type FeatureKey =
  | "propertyAd"
  | "smartView"
  | "requestLog"
  | "viewingRequest"
  | "tenantRefer"
  | "renterVerification"
  | "rentCollection"
  | "homeInspection";

  type FeatureValue = { value: string; includes: boolean };

  type Package = {
  id: string;
  title: string;
  values: Record<FeatureKey, FeatureValue>;
};


export default function PackageDetailsModal({ open, onClose }: PackageDetailsModalProps) {
  const FEATURES: { key: FeatureKey; label: string }[] = [
    { key: "propertyAd", label: "Property Ad Posting" },
    { key: "smartView", label: "smartView (Virtual Tour + Photos)" },
    { key: "requestLog", label: "Viewing Request Log Dashboard" },
    { key: "viewingRequest", label: "Viewing Request Management" },
    { key: "tenantRefer", label: "Tenant Referencing" },
    { key: "renterVerification", label: "Renter  Verification" },
    { key: "rentCollection", label: "Automated Rent Collection" },
    { key: "homeInspection", label: "Home Inspection" },
    ];

    const PACKAGE_COMPARISON: Package[] = [
    {
        id: "BASIC",
        title: "Basic",
        values: {
        propertyAd: { value: "", includes: true },
        smartView: { value: "", includes: true },
        requestLog: { value: "", includes: false },
        viewingRequest: { value: "", includes: false },
        tenantRefer: { value: "", includes: false },
        renterVerification: { value: "", includes: false },
        rentCollection: { value: "", includes: false },
        homeInspection: { value: "", includes: false },
        },
    },
    {
        id: "SMART",
        title: "Smart",
        values: {
        propertyAd: { value: "", includes: true },
        smartView: { value: "", includes: true },
        requestLog: { value: "", includes: true },
        viewingRequest: { value: "", includes: true },
        tenantRefer: { value: "", includes: true },
        renterVerification: { value: "", includes: true },
        rentCollection: { value: "", includes: false },
        homeInspection: { value: "", includes: false },
        },
    },
    {
        id: "SMARTPLUS",
        title: "Smart Plus",
        values: {
        propertyAd: { value: "", includes: true },
        smartView: { value: "", includes: true },
        requestLog: { value: "", includes: true },
        viewingRequest: { value: "", includes: true },
        tenantRefer: { value: "", includes: true },
        renterVerification: { value: "", includes: true },
        rentCollection: { value: "", includes: true },
        homeInspection: { value: "", includes: true },
        },
    },
    ];


  return (
    <Dialog open={open} onOpenChange={(val) => val || onClose()}>
      <DialogContent className="min-w-full sm:min-w-[600px] px-5 py-6 rounded-2xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-normal text-left mb-4">
            Compare Package Features
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm sm:text-base border-muted">
            <thead>
              <tr className="bg-muted/30 text-left">
                <th className="p-3 border-b">Feature</th>
                {PACKAGE_COMPARISON.map((pkg) => (
                  <th key={pkg.id} className="p-3 border-b text-center">{pkg.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
                {FEATURES.map(({ key, label }) => (
                    <tr key={key} className="border-t">
                    <td className="p-3 font-medium text-xs sm:text-sm">{label}</td>
                    {PACKAGE_COMPARISON.map((pkg) => {
                        const item = pkg.values[key];
                        return (
                        <td
                            key={pkg.id + key}
                            className={cn("p-3 text-center text-xs sm:text-sm", item?.includes ? "text-green-600" : "text-muted")}
                        >
                            {item?.includes ? (
                            <span className="flex items-center justify-center gap-1 font-normal">
                                <CheckCircle className="w-4 h-4" />
                                {item.value}
                            </span>
                            ) : (
                            <span className="flex items-center justify-center gap-1 italic">
                                <XCircle className="w-4 h-4 text-primary" />
                                {item?.value}
                            </span>
                            )}
                        </td>
                        );
                    })}
                    </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="default" className="text-sm font-medium">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
