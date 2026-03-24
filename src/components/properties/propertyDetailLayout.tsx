"use client";
import { MarkerIcon } from "@/assets/icons";
import MapboxCircle from "../mapbox/MapboxCircle";
import LayoutView from "./LayoutView";

const PropertyDetailLayout = ({ property }: any) => {
    return (
        <>
            <div
                className="flex flex-col md:flex-row w-full gap-4 md:h-[380px] scroll-mt-24"
                id="layoutView"
            >
                <LayoutView layout={property?.layout} />
                {property?.latitude && property?.longitude && (
                    <section className="rounded-2xl bg-white border border-gray-200 w-full sm:max-w-[417px] flex flex-col overflow-hidden">
                        {/* Apply padding only to the content block */}
                        <div className="mt-4 px-4 sm:px-6 xl:px-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-light text-foreground">
                                    Location
                                </h2>
                                <span className="text-sm text-muted font-light flex items-center gap-1">
                                    <MarkerIcon className="w-4 h-4" />
                                    {property?.address}
                                </span>
                            </div>
                        </div>

                        {/* Remove all padding from this */}
                        <div className="flex-1 w-full h-[320px]">
                            <MapboxCircle
                                latitude={property?.latitude + 0.0001}
                                longitude={property?.longitude + 0.0001}
                                radiusMeters={150}
                            />
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default PropertyDetailLayout;
