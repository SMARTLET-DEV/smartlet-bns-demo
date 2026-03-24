import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import MapPropertyPreviewCard from "./MapPropertyPreviewCard";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface PropertyMarkerData {
    id: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    size: string;
    thumbnail: string;
    title: string;
    price: number;
    area?: string;
    city?: string;
}

interface MapboxMapProps {
    height: number;
    boundaryCoordinates: [number, number][];
    markerCoordinates: [number, number][];
    zoomCenter: [number, number];
    propertyData?: PropertyMarkerData[];
}

export default function MapboxListingsMap({
    height,
    boundaryCoordinates,
    markerCoordinates,
    zoomCenter,
    propertyData = [],
}: MapboxMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const hasInitialized = useRef(false);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const popupsRef = useRef<mapboxgl.Popup[]>([]);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const router = useRouter();

    const [isScrolledDown, setIsScrolledDown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolledDown(true);
            } else {
                setIsScrolledDown(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // Optional: Memoization for stability
    const memoizedBoundary = useMemo(
        () => boundaryCoordinates,
        [boundaryCoordinates]
    );
    const memoizedMarkers = useMemo(
        () => markerCoordinates,
        [markerCoordinates]
    );
    const memoizedCenter = useMemo(
        () => zoomCenter,
        [zoomCenter]
    );

    // Generate thumbnail URL with base URL
    const getThumbnailUrl = (thumbnail: string) => {
        if (thumbnail.startsWith("http")) return thumbnail;
        return `https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/${thumbnail}`;
    };

    // Function to add markers to the map
    const addMarkersToMap = (
        map: mapboxgl.Map,
        coordinates: [number, number][],
        properties: PropertyMarkerData[]
    ) => {
        // Clear existing markers and popups
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
        popupsRef.current.forEach((popup) => popup.remove());
        popupsRef.current = [];

        coordinates.forEach((coords, i) => {
            const el = document.createElement("img");
            el.src = "/geolocator.png";
            el.alt = "Geolocator Marker";
            el.style.width = "18px";
            el.style.height = "18px";
            el.style.borderRadius = "50%";
            el.style.objectFit = "contain";
            el.style.cursor = "pointer";

            // Get actual property data or use fallback
            const property = properties[i];
            const propertyInfo = property
                ? {
                    id: property.id,
                    thumbnail: getThumbnailUrl(property.thumbnail),
                    price: property.price,
                    sqft: parseInt(property.size) || 0,
                    beds: property.bedrooms,
                }
                : {
                    id: `property-${i}`,
                    thumbnail:
                          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
                    price: 25000,
                    sqft: 1000,
                    beds: 2,
                };

            // Create popup container
            const popupContainer = document.createElement("div");

            // Create popup
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                closeOnClick: false,
                className: "map-property-popup",
                maxWidth: "240px",
            }).setDOMContent(popupContainer);

            // Render React component into popup
            const root = createRoot(popupContainer);
            root.render(
                <MapPropertyPreviewCard
                    propertyId={propertyInfo.id}
                    thumbnail={propertyInfo.thumbnail}
                    price={propertyInfo.price}
                    sqft={propertyInfo.sqft}
                    beds={propertyInfo.beds}
                    onCardClick={(propertyId) => {
                        window.open(`/properties/${propertyId}`, "_blank");
                    }}
                />
            );

            // Create marker without popup initially
            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat(coords)
                .addTo(map);

            // Detect touch device
            const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

            if (isTouchDevice) {
                // Mobile: Click on geolocator shows popup
                el.addEventListener("click", (e) => {
                    e.stopPropagation();
                    // Close all other popups first
                    popupsRef.current.forEach((p) => p.remove());
                    popup.setLngLat(coords).addTo(map);
                });

                // Close popup when clicking elsewhere on map
                map.on("click", () => {
                    popup.remove();
                });
            } else {
                // Desktop: Click navigates, hover shows popup
                el.addEventListener("click", () => {
                    window.open(`/properties/${propertyInfo.id}`, "_blank");
                });

                // Show popup on hover
                el.addEventListener("mouseenter", () => {
                    popup.setLngLat(coords).addTo(map);
                });

                el.addEventListener("mouseleave", () => {
                    popup.remove();
                });
            }

            markersRef.current.push(marker);
            popupsRef.current.push(popup);
        });
    };

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: "mapbox://styles/mapbox/streets-v12",
            center: memoizedCenter,
            zoom: 9,
        });

        mapRef.current = map;

        map.on("load", () => {
            map.resize();

            // Only do flyTo once on initial load
            map.flyTo({
                center: memoizedCenter,
                zoom: 11.5,
                speed: 1,
                curve: 1,
                easing(t) {
                    return t;
                },
            });

            // Optional: Disable drag on small screens (to prevent accidental flyTo triggers)
            // if (window.innerWidth < 640) {
            //   map.dragPan.disable();
            // }

            const layers = map.getStyle().layers;
            if (layers) {
                layers.forEach((layer) => {
                    const { id, type } = layer;

                    if (
                        type === "symbol" &&
                        !id.includes("road") &&
                        !id.includes("street")
                    ) {
                        map.removeLayer(id);
                    }

                    const landKeywords = [
                        "background",
                        "land",
                        "landcover",
                        "landuse",
                    ];
                    if (
                        landKeywords.some((keyword) => id.includes(keyword)) &&
                        (type === "fill" || type === "background")
                    ) {
                        if (type === "fill") {
                            map.setPaintProperty(
                                id,
                                "fill-color",
                                "rgb(246,246,246)"
                            );
                        }
                        if (type === "background") {
                            map.setPaintProperty(
                                id,
                                "background-color",
                                "rgb(246,246,246)"
                            );
                        }
                    }

                    const roadKeywords = [
                        "road",
                        "bridge",
                        "tunnel",
                        "motorway",
                        "trunk",
                        "primary",
                        "secondary",
                        "tertiary",
                        "express",
                        "flyover",
                    ];

                    const matchKeyword = roadKeywords.some((kw) =>
                        id.toLowerCase().includes(kw)
                    );

                    if (matchKeyword && (type === "line" || type === "fill")) {
                        if (type === "line") {
                            map.setPaintProperty(id, "line-color", "#FFFFFF");
                        }
                        if (type === "fill") {
                            map.setPaintProperty(id, "fill-color", "#FFFFFF");
                        }
                    }
                });
            }

            if (map.getLayer("water")) {
                map.setPaintProperty("water", "fill-color", "rgb(204,218,222)");
            }

            // Boundary rendering temporarily disabled
            // map.addSource("boundary", {
            //     type: "geojson",
            //     data: {
            //         type: "Feature",
            //         properties: {},
            //         geometry: {
            //             type: "Polygon",
            //             coordinates: [memoizedBoundary],
            //         },
            //     },
            // });

            // map.addLayer({
            //     id: "boundary-line",
            //     type: "line",
            //     source: "boundary",
            //     paint: {
            //         "line-color": "#EB5C60",
            //         "line-width": 2,
            //     },
            // });

            // map.addLayer({
            //     id: "boundary-fill",
            //     type: "fill",
            //     source: "boundary",
            //     paint: {
            //         "fill-color": "transparent",
            //         "fill-opacity": 0.4,
            //     },
            // });

            // Add initial markers
            addMarkersToMap(map, memoizedMarkers, propertyData);
            setIsStyleLoaded(true);
        });

        return () => {
            hasInitialized.current = false;
            // Clean up markers and popups
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            popupsRef.current.forEach((popup) => popup.remove());
            popupsRef.current = [];
            map.remove();
        };
    }, []);

    // Effect to update markers when memoizedMarkers changes
    useEffect(() => {
        if (mapRef.current && isStyleLoaded && hasInitialized.current) {
            addMarkersToMap(mapRef.current, memoizedMarkers, propertyData);
        }
    }, [
        memoizedMarkers,
        propertyData,
        mapRef.current,
        hasInitialized.current,
        isStyleLoaded,
    ]);

    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomTo(mapRef.current.getZoom() + 1);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomTo(mapRef.current.getZoom() - 1);
        }
    };

    return (
        <div 
            ref={mapContainerRef}
            className="relative"
            style={{ width: "100%", height: `${height}px` }}
        >
            <div
                className="absolute bottom-4 left-4 z-10 flex flex-col space-y-2 bg-white shadow rounded p-1 
                    transition-all duration-400 ease-in-out"
            >
                <button
                    onClick={handleZoomIn}
                    className="text-xl font-normal w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    className="text-xl font-normal w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                >
                    –
                </button>
            </div>
        </div>
    );
}
