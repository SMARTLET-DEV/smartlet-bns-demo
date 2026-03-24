"use client";
import { useGetSinglePropertyQuery } from "@/redux/reducers/property/propertyApi";
import { useParams } from "next/navigation";
import { camelToReadable } from "@/utils/camelToReadable";

export default function AdditionalFeaturesCard({ property }: any) {
  const features = (property?.additionalFeatures || []).filter(
    (feature: string) => feature.toLowerCase() !== "lawn"
  );
  return (
    <div
      className="flex flex-col md:flex-row w-full gap-4 scroll-mt-24"
      id="AdditionalFeaturesView"
    >
      <div className="rounded-2xl bg-white border border-gray-200 p-6 w-full sm:max-w-[816px]">
        <h2 className="text-lg sm:text-xl font-light text-secondary mb-4">
          Additional Features
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          {features.map((feature: string, index: number) => (
            <li
              key={index}
              className="flex items-start gap-2 text-muted font-light"
            >
              <span className="mt-2 mr-0.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span>{camelToReadable(feature)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
