"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Key, useEffect, useState} from "react";
import UploadIconPlaceholder from "./UploadIconPlaceholder";

interface FloorPreviewProps {
  floorPlans: Record<number, string[]>; // { 1: [url1, url2], 2: [url3] }
}

export function FloorPreview({floorPlans}: FloorPreviewProps) {
  const floorNumbers = Object.keys(floorPlans).map(Number).sort((a, b) => a - b);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (floorNumbers.length > 0 && selectedFloor === null) {
      setSelectedFloor(floorNumbers[0]);
    }
  }, [floorNumbers, selectedFloor]);

  return (
      <div className="space-y-1">
        <div className="flex justify-between items-center relative">
          <span className="text-sm font-normal text-muted">Floor Plan</span>
          <div>
            <Button
                variant="ghost"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm text-muted font-normal"
            >
              Floor {selectedFloor ?? "--"}
              <ChevronDown className="w-4 h-4"/>
            </Button>

            {isDropdownOpen && (
                <div className="absolute right-0 z-10 bg-white border rounded-md shadow-md mt-1">
                  {floorNumbers.map((floor) => (
                      <Button
                          key={floor}
                          variant="ghost"
                          onClick={() => {
                            setSelectedFloor(floor);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full font-normal text-left px-3 py-1 text-sm text-muted hover:bg-muted/5 hover:rounded-none"
                      >
                        Floor {floor}
                      </Button>
                  ))}
                </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {((selectedFloor && floorPlans[selectedFloor]) as string[])?.map((url: string | undefined, idx: Key | null | undefined) => (
          <UploadIconPlaceholder key={idx} url={url} />
        ))}
      </div>
    </div>
  );

}
