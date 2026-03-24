const dummyProperties = [
  {
    id: "dummy-residential-1",
    title: "Luxury 3BHK Apartment in Banani",
    description: "A beautiful, fully furnished 3-bedroom apartment located in the heart of Banani. Features modern amenities, 24/7 security, and a stunning city view.",
    propertyType: "RESIDENTIAL",
    subType: "APARTMENT",
    price: 85000,
    area: "Banani",
    city: "Dhaka",
    size: 2100,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    floorNo: 5,
    furnishingStatus: "FURNISHED",
    media: ["/property-img.png", "/smartview.png", "/home-inspection.png"],
    status: "AVAILABLE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "dummy-owner",
    features: ["Balcony", "Elevator", "Generator", "Parking"],
    latitude: 23.7940,
    longitude: 90.4043,
    packageType: "PREMIUM",
    viewStatus: "APPROVED",
    isVisible: true,
    isPaused: false,
  },
  {
    id: "dummy-commercial-1",
    title: "Premium Office Space in Gulshan",
    description: "Spacious commercial office space suitable for IT firms or corporate headquarters. Includes central AC, dedicated parking slots, and high-speed internet provisions.",
    propertyType: "COMMERCIAL",
    subType: "OFFICE",
    price: 150000,
    area: "Gulshan",
    city: "Dhaka",
    size: 4500,
    bedrooms: 0,
    bathrooms: 4,
    balconies: 1,
    floorNo: 3,
    furnishingStatus: "SEMI_FURNISHED",
    media: ["/property-img.png", "/smartview.png"],
    status: "AVAILABLE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "dummy-owner",
    features: ["Central AC", "Elevator", "Generator", "Parking", "Security"],
    latitude: 23.7925,
    longitude: 90.4125,
    packageType: "PREMIUM",
    viewStatus: "APPROVED",
    isVisible: true,
    isPaused: false,
  }
];

export async function fetchProperty(id: string) {
  const property = dummyProperties.find(p => p.id === id) || dummyProperties[0];
  return {
    data: {
      property,
      similarProperties: []
    }
  };
}
