"use client";

import { Button } from "@/components/ui/button";
import { LocateIcon } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapboxCircleProps {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  variant?: "default" | "tall";
}

export default function MapboxCircle({
    latitude,
    longitude,
    radiusMeters = 500,
    variant = "default",
}: MapboxCircleProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [zoom, setZoom] = useState(15);
    const initialCenter = useRef<[number, number]>([longitude, latitude]);
    const initialZoom = useRef<number>(zoom);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: initialZoom.current,
        });

        mapRef.current = map;

        map.on("load", () => {
            // Add circle layer
            map.addSource("circle", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    properties: {},
                },
            });

            map.addLayer({
                id: "circle-layer",
                type: "circle",
                source: "circle",
                paint: {
                    "circle-radius": {
                        stops: [
                            [0, 0],
                            [20, radiusMeters / 0.075],
                        ],
                        base: 2,
                    },
                    "circle-color": "#007cbf",
                    "circle-opacity": 0.2,
                },
            });

            // Add center logo
            map.loadImage("/geolocator.png", (error, image) => {
                if (error) throw error;

                if (!map.hasImage("center-logo")) {
                    map.addImage("center-logo", image!);
                }

                map.addSource("logo-point", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        properties: {},
                    },
                });

                map.addLayer({
                    id: "logo-layer",
                    type: "symbol",
                    source: "logo-point",
                    layout: {
                        "icon-image": "center-logo",
                        "icon-size": 0.03,
                        "icon-allow-overlap": true,
                        "icon-rotate": 180, 
                    },
                });
            });
        });

        return () => map.remove();
    }, [latitude, longitude, radiusMeters]);

    const handleZoomIn = () => {
        if (mapRef.current) {
            const newZoom = mapRef.current.getZoom() + 1;
            mapRef.current.zoomTo(newZoom);
            setZoom(newZoom);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            const newZoom = mapRef.current.getZoom() - 1;
            mapRef.current.zoomTo(newZoom);
            setZoom(newZoom);
        }
    };

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: initialCenter.current,
                zoom: initialZoom.current,
            });
            setZoom(initialZoom.current);
        }
    };

    return (
        <div className={`relative w-full overflow-hidden h-[320px]`}>
            {/* Map container */}
            <div
                ref={mapContainerRef}
                className="absolute inset-0 z-0"
                style={{ width: "100%", height: "100%" }}
            />

            {/* Zoom buttons */}
            <div className="absolute left-4 bottom-4 z-10 bg-white rounded-sm p-2 shadow-md flex flex-col items-center justify-center space-y-1 w-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-xl leading-none text-black hover:bg-transparent"
                    onClick={handleZoomIn}
                >
          +
                </Button>
                <div className="w-full h-[1px] bg-muted/10" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-xl leading-none text-black hover:bg-transparent"
                    onClick={handleZoomOut}
                >
          –
                </Button>
            </div>

            {/* Reset button */}
            <div className="absolute bottom-4 right-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-lg leading-none bg-white text-black shadow-none rounded-full hover:text-primary hover:bg-white"
                    onClick={handleResetView}
                >
                    <LocateIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
