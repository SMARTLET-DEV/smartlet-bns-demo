"use client";

import { PinpointIcon } from "@/assets/icons";
import { Minus, Plus } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface InteractiveMapProps {
  onLocationChange?: (lng: number, lat: number) => void;
  initialCoordinates?: {
    lat: number;
    lng: number;
  };
}

export default function InteractiveMap({
  onLocationChange,
  initialCoordinates,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const lastManualCenterRef = useRef<[number, number] | null>(null);

  const [center, setCenter] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (initialCoordinates?.lat && initialCoordinates?.lng) {
      setCenter([initialCoordinates.lng, initialCoordinates.lat]);
      setLoading(false);
    } else if ("geolocation" in navigator) {
      // Fallback after 3 seconds
      timeoutId = setTimeout(() => {
        //console.warn("Geolocation timed out, using static default");
        setCenter([90.41424888168754, 23.79485047909494]);
        setLoading(false);
      }, 3000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          //console.log("Using user's current location");
          setCenter([longitude, latitude]);
          setLoading(false);
        },
        (error) => {
          clearTimeout(timeoutId);
          //console.warn("Geolocation error:", error.message);
          setCenter([90.41424888168754, 23.79485047909494]);
          setLoading(false);
        }
      );
    } else {
      setCenter([90.41424888168754, 23.79485047909494]);
      setLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [initialCoordinates]);


  // Initialize map once center is determined
  useEffect(() => {
    if (!center || !mapContainerRef.current || mapRef.current) return;

    const [lng, lat] = center;
    if (isNaN(lng) || isNaN(lat)) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom: 15,
      attributionControl: false,
    });

    map.on("moveend", () => {
      const newCenter = map.getCenter();
      const lng = newCenter.lng;
      const lat = newCenter.lat;
      const coords: [number, number] = [lng, lat];
      lastManualCenterRef.current = coords;
      onLocationChange?.(lng, lat);
    });

    mapRef.current = map;
  }, [center]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // React to coordinate changes (external)
  useEffect(() => {
    if (
      initialCoordinates &&
      mapRef.current &&
      lastManualCenterRef.current?.[0] !== initialCoordinates.lng &&
      lastManualCenterRef.current?.[1] !== initialCoordinates.lat
    ) {
      const newCenter: [number, number] = [
        initialCoordinates.lng,
        initialCoordinates.lat,
      ];
      mapRef.current.setCenter(newCenter);
      lastManualCenterRef.current = newCenter;
    }
  }, [initialCoordinates]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    mapRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-47 sm:h-57 sm:max-h-57 rounded-lg border border-border overflow-hidden">
      {center && !loading ? (
        <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <span className="text-sm text-muted">Loading map...</span>
        </div>
      )}
      {!loading && (
      <> 
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
          <PinpointIcon />
        </div>

        <div className="absolute bottom-2 right-2 z-20 flex flex-col items-center gap-1 bg-white rounded-md shadow-md p-1">
          <button onClick={handleZoomIn} className="w-5 h-5 flex items-center justify-center rounded">
            <Plus className="w-4 h-4 text-foreground" />
          </button>
          <div className="h-px w-6 bg-border my-1" />
          <button onClick={handleZoomOut} className="w-5 h-5 flex items-center justify-center rounded">
            <Minus className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </>
      )}
    </div>
  );
}
