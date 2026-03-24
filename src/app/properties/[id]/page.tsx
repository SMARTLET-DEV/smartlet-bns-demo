import AboutPropertyCard from "@/components/properties/AboutPropertyCard";
import AdditionalFeaturesCard from "@/components/properties/AdditionalFeaturesCard";
import FurnishedFeaturesCard from "@/components/properties/FurnishedFeaturesCard";
import PropertyDetailLayout from "@/components/properties/propertyDetailLayout";
import PropertyDetailsTop from "@/components/properties/propertyDetailsTop";
import PropertyInfoCard from "@/components/properties/PropertyInfoCard";
import PropertyQuickActions from "@/components/properties/PropertyQuickActions";
import SimilarProperties from "@/components/properties/similarProperties";
import QrTracker from "@/components/properties/QrTracker";
import PropertyNotLiveMessage from "@/components/properties/PropertyNotLiveMessage";
import { fetchProperty } from "@/lib/api/properties";

interface Props {
  params: Promise<{ id: string }>; // Type params as a Promise
}

export async function generateMetadata({ params }: Props) {
    try {
        let { id } = await params;
        const propertyData: any = await fetchProperty(id);
        const property = propertyData?.data?.property;

        // Handle missing property data
        if (!property) {
            return {
                title: "Property Not Found | OPENDOOR",
                description: "The requested property could not be found.",
            };
        }

        // Safely handle potentially null/undefined fields
        const title = property.title || "Property Details";
        const description =
      property.description || "Property details not available";
        const price = property.price ? `${property.price} BDT` : "Price not available";

        // Create social media title with bedroom, sqft, and area
        const bedrooms = property.bedrooms || 0;
        const sqft = property.size || 0;
        const area = property.address || property.city || "Dhaka";
        const socialTitle = `${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''} ${sqft} sqft in ${area}`;

        // Prefer thumbnail; fallback to first media image; ensure absolute URL
        const MEDIA_BASE =
      "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";
        const pickImage: string | undefined =
      property?.thumbnail ||
      (Array.isArray(property?.media) && property.media[0]);
        const ogImageUrl = pickImage
            ? pickImage.startsWith("http")
                ? pickImage
                : `${MEDIA_BASE}${pickImage}`
            : "https://opendoor.com.bd/og-image-v2.PNG";

        return {
            title: `${price} | OPENDOOR`,
            description: description.substring(0, 160),
            openGraph: {
                title: socialTitle,
                description: description.substring(0, 160),
                url: `/properties/${property.id}`,
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: socialTitle,
                description: description.substring(0, 160),
                images: [ogImageUrl],
            },
            alternates: {
                canonical: `/properties/${property.id}`,
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Property | OPENDOOR",
            description: "Property details",
        };
    }
}

export default async function PropertyDetailsPage({ params }: any) {
    let { id } = await params;
    const propertyData: any = await fetchProperty(id);
    const property = propertyData?.data?.property;
    const similarProperties = propertyData?.data?.similarProperties || [];

    // Check if property is live
    const isPropertyLive = property?.letAgreed === true || (
        property?.viewStatus === "APPROVED" &&
                         property?.isVisible === true &&
                         property?.isPaused === false
    );

    return (
        <>
            {/* QR Tracker Component */}
            <QrTracker propertyId={property?.id} />

            <main className="w-full container mx-auto sm:px-9 xl:px-5 overflow-x-hidden md:overflow-x-visible">
                {/* Show overlay if property is not live */}
                {!isPropertyLive && <PropertyNotLiveMessage />}

                {/* Always show property content */}
                <>
                    {/* Mobile: PropertyDetailsTop full width */}
                    <div className="block md:hidden overflow-x-hidden">
                        <PropertyDetailsTop property={property} />
                    </div>

                    {/* Medium devices: PropertyDetailsTop and PropertyInfoCard side by side */}
                    <div className="hidden md:flex lg:hidden w-full gap-4 mt-6">
                        {/* PropertyDetailsTop - constrained width on medium devices */}
                        <div className="flex-1 max-w-[calc(100%-360px)]">
                            <PropertyDetailsTop property={property} />
                        </div>

                        {/* PropertyInfoCard - static on medium devices */}
                        <div className="w-[340px] flex-shrink-0">
                            <PropertyInfoCard
                                title={property?.title}
                                location={property?.address}
                                price={parseInt(property?.price)}
                                tags={[property?.propertyType, ...(property?.tags || [])]}
                                availability={new Date(property?.createdAt)}
                                propertyId={property?.id}
                                readablePropertyId={property?.readablePropertyId}
                                packageType={property?.packageType}
                                serviceCharge={property?.serviceCharge}
                                depositRequiredForMonths={property?.depositRequiredForMonths}
                            />
                        </div>
                    </div>

                    {/* Large devices: All content in flex layout for sticky behavior */}
                    <div className="hidden lg:flex w-full gap-4 mt-6">
                        {/* Left content column */}
                        <div className="flex-1 space-y-6">
                            <PropertyDetailsTop property={property} />
                            <PropertyQuickActions
                                media={property?.media}
                                video={property?.video}
                                virtualTour={property?.virtualTour}
                                title={property?.title}
                                location={property?.location}
                                label={property?.label}
                            />
                            <AboutPropertyCard property={property} />
                            <PropertyDetailLayout property={property} />
                            {property?.additionalFeatures &&
              property.additionalFeatures.length > 0 && (
                                <AdditionalFeaturesCard property={property} />
                            )}
                            {property?.furnishedFeatures &&
              property.furnishedFeatures.length > 0 && (
                                <FurnishedFeaturesCard property={property} />
                            )}
                        </div>

                        {/* Right sticky column */}
                        <div className="w-[410px] flex-shrink-0">
                            <PropertyInfoCard
                                title={property?.title}
                                location={property?.address}
                                price={parseInt(property?.price)}
                                tags={[property?.propertyType, ...(property?.tags || [])]}
                                availability={new Date(property?.createdAt)}
                                propertyId={property?.id}
                                readablePropertyId={property?.readablePropertyId}
                                packageType={property?.packageType}
                                serviceCharge={property?.serviceCharge}
                                depositRequiredForMonths={property?.depositRequiredForMonths}
                            />
                        </div>
                    </div>

                    {/* Content sections for mobile and medium devices */}
                    <div className="w-full space-y-6 md:mt-6 lg:hidden overflow-x-hidden px-5 md:px-0">
                        {/* PropertyInfoCard - Mobile only */}
                        <div className="block md:hidden -mx-5">
                            <PropertyInfoCard
                                title={property?.title}
                                location={property?.address}
                                price={parseInt(property?.price)}
                                tags={[property?.propertyType, ...(property?.tags || [])]}
                                availability={new Date(property?.createdAt)}
                                propertyId={property?.id}
                                readablePropertyId={property?.readablePropertyId}
                                packageType={property?.packageType}
                                serviceCharge={property?.serviceCharge}
                                depositRequiredForMonths={property?.depositRequiredForMonths}
                            />
                        </div>

                        <PropertyQuickActions
                            media={property?.media}
                            video={property?.video}
                            virtualTour={property?.virtualTour}
                            title={property?.title}
                            location={property?.location}
                            label={property?.label}
                        />
                        <AboutPropertyCard property={property} />
                        <PropertyDetailLayout property={property} />
                        {property?.additionalFeatures &&
            property.additionalFeatures.length > 0 && (
                            <AdditionalFeaturesCard property={property} />
                        )}
                        {property?.furnishedFeatures &&
            property.furnishedFeatures.length > 0 && (
                            <FurnishedFeaturesCard property={property} />
                        )}
                    </div>

                    {/* Similar Properties Section */}
                    {similarProperties.length > 0 ? (
                        <div className="mt-10 px-5 md:px-0">
                            <SimilarProperties
                                similarProperties={similarProperties}
                                currentPropertyId={property?.id}
                            />
                        </div>
                    ) : (
                        <div className="mt-10 mb-10"></div>
                    )}
                </>
            </main>
        </>
    );
}
