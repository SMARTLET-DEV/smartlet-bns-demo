// reducers/property/editRequestPropertySlice.ts
import { createSlice } from "@reduxjs/toolkit";

const BASE_MEDIA_URL = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

const initialState = {
  id: "",
  title: "",
  rent: null,
  serviceCharge: null, // NEW
  bedrooms: null,
  bathrooms: null,
  amenities: [] as string[],
  propertyType: "",
  ownerId: "",
  address: "",
  nearbyLocations: "",
  popularLandmarks:"",
  viewStatus: "",
  area: "",
  city: "",
  latitude: null as number | null,
  longitude: null as number | null,
  description: "",
  media: [] as string[],
  layout: [] as string[],
  video: "",
  virtualTour: "",
  titleDeed: "",
  utilityBill: "",
  size: "",
  balcony: "",
  facing: "",   
  floor: "",
  parking: "",
  elevators: "",
  availableFrom: "", // NEW
  additionalFeatures: [] as string[], // NEW
};

const editRequestPropertySlice = createSlice({
  name: "editRequestProperty",
  initialState,
  reducers: {
    setEditRequestProperty: (state, action) => {
      const {
        id,
        title,
        price,
        serviceCharge,
        bedrooms,
        bathrooms,
        gym,
        furnished,
        swimmingPool,
        propertyType,
        ownerId,
        address,
        area,
        city,
        size,
        balcony,
        facing,
        floor,
        parking,
        elevators,  
        nearbyLocations,
        popularLandmarks,
        latitude,
        longitude,
        description,
        media,
        layout,
        virtualTour,
        video,
        titleDeed,
        utilityBill,
        viewStatus,
        availableFrom, // NEW
        additionalFeatures, // NEW
      } = action.payload;

      state.id = id;
      state.title = title;
      state.rent = price;
      state.serviceCharge = serviceCharge; // NEW
      state.bedrooms = bedrooms;
      state.bathrooms = bathrooms;
      state.amenities = [];
      if (gym) state.amenities.push("gym");
      if (furnished) state.amenities.push("furnished");
      if (swimmingPool) state.amenities.push("swimmingPool");
      state.propertyType = propertyType;
      state.ownerId = ownerId;
      state.address = address;
      state.size = size;
      state.balcony = balcony;
      state.facing = facing;
      state.floor = floor;
      state.parking = parking;
      state.elevators = elevators;
      state.nearbyLocations = nearbyLocations;
      state.popularLandmarks = popularLandmarks;
      state.area = area;
      state.city = city;
      state.availableFrom = availableFrom; // NEW
      state.additionalFeatures = additionalFeatures;
      state.latitude = latitude;
      state.longitude = longitude;
      state.description = description || "";
      state.viewStatus = viewStatus || "PENDING";
      state.media = (media || []).map((url: string) =>
        url.startsWith("http") ? url : BASE_MEDIA_URL + url
      );
      state.layout = (layout || []).map((url: string) =>
        url.startsWith("http") ? url : BASE_MEDIA_URL + url
      );
      state.video = video || "";
      state.virtualTour = virtualTour || "";
      state.titleDeed = titleDeed || "";
      state.utilityBill = utilityBill || "";
    },
    clearEditRequestProperty: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setEditRequestProperty, clearEditRequestProperty } =
  editRequestPropertySlice.actions;

export default editRequestPropertySlice.reducer;
