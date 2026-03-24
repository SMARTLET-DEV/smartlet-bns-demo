"use client";

import React from "react";
import { PhoneIcon, EmailIcon } from "@/assets/icons";

export default function ContactCard() {
  return (
    <>
      {/* Phone Card */}
      <div className="w-full sm:max-w-[380px] bg-[#f9f9f9] rounded-lg p-4 flex items-center gap-4 border border-[#E9E9E9]">
        <div className="w-10 h-10 bg-white border border-[#E9E9E9] rounded-sm flex items-center justify-center">
          <PhoneIcon className="w-6 h-6" />
        </div>
        <div>
          <div className="font-normal text-[16px] text-black">Phone</div>
          <a href="tel:+8801335445544" className="text-lg text-black">+8801335445544</a>
        </div>
      </div>

      {/* Email Card */}
      <div className="w-full sm:max-w-[380px] bg-[#f9f9f9] rounded-lg p-4 flex items-center gap-4 border border-[#E9E9E9]">
        <div className="w-10 h-10 bg-white border border-[#E9E9E9] rounded-sm flex items-center justify-center">
          <EmailIcon className="w-6 h-6" />
        </div>
        <div>
          <div className="font-normal text-[16px] text-black">Email</div>
          <a
            href="mailto:info@opendoor.com.bd"
            className="text-lg text-black whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] block"
            title="info@opendoor.com.bd"
          >
            info@opendoor.com.bd
          </a>
        </div>
      </div>
    </>
  );
}
