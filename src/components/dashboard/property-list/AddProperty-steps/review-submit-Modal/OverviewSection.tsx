interface OverviewSectionProps {
  property: any;
}


export default function OverviewSection({ property }: OverviewSectionProps) {
  const overviewItems = [
    { label: "Property Name", value: property?.title || "-" },
    { label: "Property Type", value: property?.propertyType || "-" },
    { label: "Bedrooms", value: `${property?.bedrooms || 0} Bed` },
    { label: "Bathrooms", value: `${property?.bathrooms || 0} Bath` },
    { label: "Size", value: `${property?.size || 0} sqft.` },
    { label: "Balcony", value: `${property?.balcony || 0}` },
    { label: "Rent", value: `${property?.price || 0} BDT /month` },
    {
      label: "Service Charge",
      value: `${property?.serviceCharge ? parseFloat(property.serviceCharge) : 0} BDT /month`,
    },
    { label: "Address", value: property?.address || "-" },
    {
      label: "Nearby Locations",
      value: property?.nearbyLocations || "-",
    },
    { label: "Area", value: property?.area || "-" },
    { label: "City", value: property?.city || "-" },
    {
      label: "Popular Landmarks",
      value: property?.popularLandmarks || "-",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-secondary font-normal">
      {overviewItems.map((item) => (
        <div key={item.label} className={`space-y-1 py-1 ${item.label === "Popular Landmarks" ? "col-span-2" : ""}`}>
          <div className="font-normal text-muted">{item.label}</div>
          <div className="line-clamp-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
