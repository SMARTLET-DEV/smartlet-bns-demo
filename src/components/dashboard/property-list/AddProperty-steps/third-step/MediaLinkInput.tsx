"use client";

import { Input } from "@/components/ui/input";
import React from "react";

interface MediaLinkInputProps {
  label: string;
  placeholder: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
  logo?: React.ReactNode;
}

export default function MediaLinkInput({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  logo,
}: MediaLinkInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-base font-medium flex items-center gap-2">
        {logo && <span className="w-5 h-5">{logo}</span>}
        <span>
          {label} {required && "*"}
        </span>
      </label>
      <Input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
