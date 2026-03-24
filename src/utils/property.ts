
const BASE_MEDIA_URL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

export function normalizePropertyResponse(res: any) {
    const amenities: string[] = [];
    if (res.swimmingPool) amenities.push("swimmingPool");
    if (res.gym) amenities.push("gym");
    if (res.furnished) amenities.push("furnished");

    const getFullUrl = (value: string | null | undefined): string =>
        value && !value.startsWith("http") ? `${BASE_MEDIA_URL}${value}` : value ?? "";

    return {
        id: res.id,
        title: res.title,
        rent: Number(res.price),         // ✅ for UI
        serviceCharge: Number(res.serviceCharge), // NEW
        price: Number(res.price), 
        bedrooms: res.bedrooms,
        bathrooms: res.bathrooms,
        description: res.description || "",
        amenities,
        gym: res.gym,
        furnished: res.furnished,
        swimmingPool: res.swimmingPool,
        propertyType: res.propertyType,
        ownerId: res.ownerId,
        size: res.size || "",
        balcony: res.balcony || "",
        facing: res.facing || "", 
        floor: res.floor || "",
        parking: res.parking || "",
        elevators: res.elevators || "",
        address: res.address || "",
        nearbyLocations: res.nearbyLocations || "",
        popularLandmarks: res.popularLandmarks || "",
        latitude: res.latitude ?? null,
        longitude: res.longitude ?? null,
        city: res.city || "",
        area: res.area || "",
        media: res.media || [],
        layout: res.layout || [],
        video: res.video || "",
        virtualTour: res.virtualTour || "",
        thumbnail: getFullUrl(res.thumbnail) || "",
        titleDeed: getFullUrl(res.titleDeed) || "",
        utilityBill: getFullUrl(res.utilityBill) || "",
        availableFrom: res.availableFrom || "",
        additionalFeatures: res.additionalFeatures || [],
        tags:res.tags || [],
    };
}
