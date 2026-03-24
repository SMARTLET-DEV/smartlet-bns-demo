import PropertyQuickActionsSkeleton from "@/components/skeleton/PropertyQuickActionsSkeleton";
import PropetyDetailsTopSkeleton from "@/components/skeleton/PropetyDetailsTopSkeleton";
import AboutPropertyCardSkeleton from "@/components/skeleton/AboutPropertySkeleton";
import PropertyDetailLayoutSkeleton from "@/components/skeleton/PropertyDetailLayoutSkeleton";
import AdditionalFeaturesCardSkeleton from "@/components/skeleton/AdditionalFeatureSkeleton";

export default function Loading(){
    return (
        <div className="w-full container mx-auto space-y-5">
            <PropetyDetailsTopSkeleton />
            <PropertyQuickActionsSkeleton/>
            <AboutPropertyCardSkeleton/>
            <PropertyDetailLayoutSkeleton/>
            <AdditionalFeaturesCardSkeleton/>
        </div> 
    )
}