"use client";
import { useGetSinglePropertyQuery } from "@/redux/reducers/property/propertyApi";
import { useParams } from "next/navigation";

// Predefined order for furniture and appliances (lowercase for comparison)
// Define separate orders
const FURNITURE_ORDER = [
    "sofa",
    "table",
    "shoe cabinet",
    "tea table",
    "book shelf",
    "tv cabinet",
    "dining table",
    "4 seater",
    "6 seater",
    "8 seater",
    "dinner wagon",
    "bed",
    "bed side table",
    "dressing table",
    "study table",
];

const APPLIANCES_ORDER = [
    "tv",
    "crockeries",
    "oven",
    "washing machine",
    "fridge",
    "stove",
    "ac",
    "fan",
];

export default function FurnishedFeaturesCard({ property }: any) {
    const features = property?.furnishedFeatures || [];

    // Filter and sort Furniture
    const furnitureList = features
        .filter((feature: string) =>
            FURNITURE_ORDER.includes(feature.toLowerCase())
        )
        .sort((a: string, b: string) => {
            return (
                FURNITURE_ORDER.indexOf(a.toLowerCase()) -
        FURNITURE_ORDER.indexOf(b.toLowerCase())
            );
        });

    // Filter and sort Appliances
    const appliancesList = features
        .filter((feature: string) =>
            APPLIANCES_ORDER.includes(feature.toLowerCase())
        )
        .sort((a: string, b: string) => {
            return (
                APPLIANCES_ORDER.indexOf(a.toLowerCase()) -
        APPLIANCES_ORDER.indexOf(b.toLowerCase())
            );
        });

    // Don't render section if both lists are empty
    if (furnitureList.length === 0 && appliancesList.length === 0) {
        return null;
    }

    return (
        <div
            className="flex flex-col md:flex-row w-full gap-4 scroll-mt-24"
            id="FurnishedFeaturesView"
        >
            <div className="rounded-2xl bg-white border border-gray-200 p-6 w-full sm:max-w-[816px]">
                <h2 className="text-lg sm:text-xl font-light text-secondary mb-4">
          Furniture and Appliances
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Furniture Column */}
                    {furnitureList.length > 0 && (
                        <div>

                            <ul className="flex flex-col gap-y-2">
                                {furnitureList.map((feature: string, index: number) => (
                                    <li
                                        key={`furn-${index}`}
                                        className="flex items-start gap-2 text-muted font-light"
                                    >
                                        <span className="mt-2 mr-0.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Appliances Column */}
                    {appliancesList.length > 0 && (
                        <div>

                            <ul className="flex flex-col gap-y-2">
                                {appliancesList.map((feature: string, index: number) => (
                                    <li
                                        key={`app-${index}`}
                                        className="flex items-start gap-2 text-muted font-light"
                                    >
                                        <span className="mt-2 mr-0.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}