'use client';

import MapboxListingsMap, { PropertyMarkerData } from "./MapboxListingsMap";
import { bananiBoundary } from "@/lib/data/mapData";

interface MapExampleProps {
  height: number;
  propertyMarkers: [number, number][];
  zoomCenter: [number, number];
  propertyData?: PropertyMarkerData[];
}

export default function MapExample({ height, propertyMarkers, zoomCenter, propertyData = [] }: MapExampleProps) {
  return (
    <div className="w-full h-full">
      <MapboxListingsMap
        markerCoordinates={propertyMarkers}
        boundaryCoordinates={bananiBoundary}
        height={height}
        zoomCenter={zoomCenter}
        propertyData={propertyData}
      />
    </div>
  );
}
