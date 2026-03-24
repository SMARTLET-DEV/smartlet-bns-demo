"use client";


import ListingFilter from "@/components/listing-filter/ListingFilter";
import ListedPropertiesContentContainer from "@/components/properties/ListedPropertiesContentContainer";
import useScreenWidth from "@/hooks/useScreenWidth";


export default function UnlistedPage() {
    const screenWidth = useScreenWidth();
    const isSmallScreen = screenWidth < 640;
    const sidePadding = isSmallScreen
        ? Math.max((screenWidth - 302) / 2, 12)
        : 24;


    return (
        <>
            <div className="max-h-[52px]">
                <ListingFilter />
            </div>
            <div className="bg-background">
                <div
                    className={`w-full ${!isSmallScreen ? "px-[24px]" : ""}`}
                    style={undefined}
                >
                    <ListedPropertiesContentContainer />
                </div>
            </div>
        </>
    );
}
