"use client";

import {
  CalendarIcon,
  CopyIcon,
  GeoAltIcon,
} from "@/assets/icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CheckIcon, FileText } from "lucide-react";
import { useState } from "react";
import SharePropertyDialog from "../property-details/sharePropertyDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import PropertyRentalViewingAppointmentCard from "./PropertyRentalViewingAppointmentCard";
import { Wallet } from "lucide-react";

export interface PropertyInfoCardProps {
  title: string;
  location: string;
  price: number;
  tags: string[];
  availability: Date;
  propertyId: any;
  readablePropertyId: string;
  packageType: string;
  serviceCharge?: number;
  depositRequiredForMonths?: number;
}

export default function PropertyInfoCard({
  title,
  location,
  price,
  tags,
  availability,
  propertyId,
  readablePropertyId,
  packageType,
  serviceCharge,
  depositRequiredForMonths,
}: PropertyInfoCardProps) {
  //console.log("Tags array:", tags);
  const isMobile = useIsMobile();
  const [copiedID, setCopiedID] = useState(false);

  return (
    <div className="w-full max-w-none md:max-w-[340px] lg:max-w-[410px] h-fit flex flex-col text-secondary bg-white rounded-2xl p-4 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-background capitalize text-sm rounded border-none text-muted font-normal"
            >
              {tag?.toLowerCase()}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SharePropertyDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3 text-muted">
        <p className="flex text-xl font-light mt-4 items-center gap-1 text-secondary">
          &#2547;{price.toLocaleString()}{" "}
          <span className="text-muted text-xs font-normal">per month</span>
        </p>
        {serviceCharge && (
          <div className="flex items-center gap-1">
            <FileText className="w-5 h-5" />
            <p>
              Service Charge{" "}
              <span className="font-normal text-secondary">
                &#2547;{Number(serviceCharge).toLocaleString()}
              </span>
            </p>
          </div>
        )}
        {depositRequiredForMonths && (
          <div className="flex items-center gap-1">
            <Wallet className="w-5 h-5" />
            <p>
              Deposit{" "}
              <span className="font-normal text-secondary">
                {depositRequiredForMonths}{" "}
                {depositRequiredForMonths === 1 ? "month" : "months"}
              </span>
            </p>
          </div>
        )}
        <p className="text-xl font-light mt-2 text-secondary hidden">{title}</p>

        <div className="flex items-center gap-1">
          <GeoAltIcon className="w-5 h-5" />
          <p>{location}</p>
        </div>

        <div className="flex items-center gap-1">
          <CalendarIcon className="w-5 h-5" />
          <p>
            Available from{" "}
            <span className="font-normal text-secondary">
              {availability
                .toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
                .replace(/(\w+)\s(\d+)/, "$1, $2")}
            </span>
          </p>
        </div>

        <div className="ms-auto flex items-center gap-2 border-b pb-4 border-background">
          <p>
            Property ID:{" "}
            <span className="text-secondary font-normal">
              {readablePropertyId}
            </span>
          </p>
          <Button
            variant="outline"
            className="bg-background cursor-pointer text-secondary text-sm rounded border-none has-[>svg]:p-[2px] h-fit w-fit"
            onClick={() => {
              navigator.clipboard.writeText(readablePropertyId);
              setCopiedID(true);
              setTimeout(() => setCopiedID(false), 2000);
            }}
          >
            {copiedID ? (
              <CheckIcon className="w-3 h-3 text-black" />
            ) : (
              <CopyIcon className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/*<p className="flex text-xl font-normal mt-4 items-center gap-1">
        &#2547;{price.toLocaleString()}{" "}
        <span className="text-muted text-xs font-normal">per month</span>
      </p>*/}

      <PropertyRentalViewingAppointmentCard
        packageType={packageType}
        propertyID={propertyId}
      />
    </div>
  );
}
