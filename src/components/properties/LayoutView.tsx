"use client";

import { Button } from "@/components/ui/button"; // ShadCN
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { extractFloorOptions, formatFloorName } from "@/utils/floorUtils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FloorPlanModal } from "../property-details/floorPlanModal";

type LayoutViewProps = {
    layout: string[];
};

const LayoutView = ({ layout }: LayoutViewProps) => {
    if (!layout || layout.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-4 w-full sm:max-w-sm xl:px-5 flex flex-col min-h-[150px] justify-center items-center border border-gray-200">
                <h2 className="text-lg sm:text-xl font-light text-gray-700">
                    No layout available
                </h2>
                {/* <p className="text-sm text-gray-500 mt-1 text-center">
          This property doesn't have any floor layout uploaded yet.
        </p> */}
            </div>
        );
    }

    const [selectedFloor, setSelectedFloor] = useState<string>(() => {
        const rawName =
            layout[0]
                ?.split("/")
                .pop()
                ?.replace(/\.[^/.]+$/, "") || "floor1";
        return formatFloorName(rawName);
    });

    const [isOpen, setIsOpen] = useState(false);

    const floorOptions = useMemo(() => extractFloorOptions(layout), [layout]);

    const selectedImageUrl =
        floorOptions.find((f) => f.name === selectedFloor)?.url || layout[0];

    return (
        <>
            <div className="rounded-2xl bg-white p-3 w-full sm:max-w-sm sm:px-9 xl:px-5 flex flex-col h-full border border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-light text-secondary">Layout</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                className="text-sm font-medium bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 shadow-none text-primary flex items-center gap-1"
                            >
                                {selectedFloor}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {floorOptions.map(({ name }) => (
                                <DropdownMenuItem
                                    key={name}
                                    onClick={() => setSelectedFloor(name)}
                                    className="cursor-pointer data-[highlighted]:bg-gray-100 focus:bg-gray-100 hover:bg-gray-100"
                                >
                                    {name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div
                    className="rounded-xl flex-1 overflow-hidden mt-3 mb-3 flex cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <Image
                        src={selectedImageUrl}
                        alt={`OPENDOOR ${selectedFloor} layout`}
                        width={512}
                        height={325}
                        className="w-full h-full object-contain"
                        unoptimized // <-- disables built-in optimization
                    />
                </div>
            </div>

            <FloorPlanModal
                triggerState={isOpen}
                setTriggerState={setIsOpen}
                images={floorOptions.map(({ name, url }) => ({
                    title: name,
                    src: url,
                }))}
            />
        </>
    );
};

export default LayoutView;
