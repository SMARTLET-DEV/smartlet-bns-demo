"use client";

import { CloseIcon, FloorPlanPlaceholderIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import FloorUploadSection from "./FloorUploadSection";

interface FloorPlansSectionProps {
  onUpload: (section: string, files: File[]) => void;
  initialLayoutUrls?: string[];
}

export default function FloorPlansSection({
  onUpload,
  initialLayoutUrls = [],
}: FloorPlansSectionProps) {
  const [floors, setFloors] = useState<number[]>([]);
  const [floorFiles, setFloorFiles] = useState<Record<number, File[]>>({});
  const [floorStatuses, setFloorStatuses] = useState<Record<number, Record<string, "uploading" | "uploaded">>>({});
  const [floorWarnings, setFloorWarnings] = useState<Record<number, string>>({});
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (initialLayoutUrls.length > 0 && floors.length === 0) {
      const initialFloors = initialLayoutUrls.map((_, i) => Date.now() + i);
      setFloors(initialFloors);
    }
  }, [initialLayoutUrls, floors]);

  const addNewFloor = () => {
    const newId = Date.now();
    setFloors((prev) => [...prev, newId]);
    setActiveFloor(newId);
  };

  const removeFloor = (floorId: number) => {
    setFloors((prev) => prev.filter((id) => id !== floorId));
    setFloorFiles((prev) => {
      const updated = { ...prev };
      delete updated[floorId];
      return updated;
    });
    setFloorStatuses((prev) => {
      const updated = { ...prev };
      delete updated[floorId];
      return updated;
    });
    setFloorWarnings((prev) => {
      const updated = { ...prev };
      delete updated[floorId];
      return updated;
    });
    if (activeFloor === floorId) setActiveFloor(null);
  };

  const handleFloorUpload = (floor: number, newFiles: File[]) => {
    const existing = floorFiles[floor] || [];
    const unique = newFiles.filter((f) => !existing.some((e) => e.name === f.name));
    const duplicateCount = newFiles.length - unique.length;

    if (duplicateCount > 0) {
      setFloorWarnings((prev) => ({
        ...prev,
        [floor]: `${duplicateCount} duplicate file${duplicateCount > 1 ? "s" : ""} skipped.`,
      }));
      setTimeout(() => {
        setFloorWarnings((prev) => {
          const updated = { ...prev };
          delete updated[floor];
          return updated;
        });
      }, 10000);
    }

    if (unique.length === 0) return;

    setFloorFiles((prev) => ({
      ...prev,
      [floor]: [...existing, ...unique],
    }));

    onUpload?.(`floor-${floors.indexOf(floor) + 1}`, unique);

    setFloorStatuses((prev) => {
      const updated = { ...(prev[floor] || {}) };
      unique.forEach((file) => {
        updated[file.name] = "uploading";
        setTimeout(() => {
          setFloorStatuses((prev2) => ({
            ...prev2,
            [floor]: {
              ...(prev2[floor] || {}),
              [file.name]: "uploaded",
            },
          }));
        }, 1000);
      });
      return { ...prev, [floor]: updated };
    });
  };

  const handleFloorDelete = (floor: number, fileName: string) => {
    setFloorFiles((prev) => ({
      ...prev,
      [floor]: (prev[floor] || []).filter((file) => file.name !== fileName),
    }));
    setFloorStatuses((prev) => {
      const updated = { ...(prev[floor] || {}) };
      delete updated[fileName];
      return { ...prev, [floor]: updated };
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-medium text-base flex flex-row gap-1">
          <FloorPlanPlaceholderIcon /> Upload Floor Plans <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs px-3 py-1 rounded-md"
          >
            {showAll ? "Show One" : "Show All"}
          </Button>
          {floors.length > 0 && !showAll && (
            <select
              value={activeFloor ?? ""}
              onChange={(e) => setActiveFloor(Number(e.target.value))}
              className="border rounded-md p-2 text-sm"
            >
              <option disabled value="">
                Select Floor
              </option>
              {floors.map((id, index) => (
                <option key={id} value={id}>
                  Floor {index + 1}
                </option>
              ))}
            </select>
          )}
          <Button
            type="button"
            variant={"outline"}
            onClick={addNewFloor}
            className="text-sm text-primary border border-primary rounded-sm px-3 hover:bg-red-5 hover:text-primary"
          >
            + Add
          </Button>
        </div>
      </div>

      {(showAll ? floors : activeFloor ? [activeFloor] : []).map((floorId) => (
        <div key={floorId} className="border rounded-lg p-3 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal">Floor {floors.indexOf(floorId) + 1}</span>
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => removeFloor(floorId)}
              className="text-secondary text-xs flex items-center gap-1 hover:underline"
            >
              <CloseIcon className="w-4 h-4" />
            </Button>
          </div>

          <FloorUploadSection
            floor={floorId}
            files={floorFiles[floorId] || []}
            statuses={floorStatuses[floorId] || {}}
            onUpload={handleFloorUpload}
            onDelete={handleFloorDelete}
            warning={floorWarnings[floorId]}
            initialUrls={
              initialLayoutUrls[floors.indexOf(floorId)]
                ? [initialLayoutUrls[floors.indexOf(floorId)]]
                : []
            }
          />
        </div>
      ))}
    </section>
  );
}
