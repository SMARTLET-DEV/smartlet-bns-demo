import { createSlice } from "@reduxjs/toolkit";

const getSinglePropertyInitialState = {
  property: null as any,
};

const getSinglePropertySlice = createSlice({
  name: "getSingleProperty",
  initialState: getSinglePropertyInitialState,
  reducers: {
    setFetchedProperty: (_state, action) => {
      const property = action.payload;
      // console.log("📦 Fetched Property in Slice payload:", property);
      return {
        property: {
          ...property,
          media: property.media ?? [],
          layout: property.layout ?? [],
          video: property.video ?? "",
          virtualTour: property.virtualTour ?? "",
          titleDeed: property.titleDeed ?? "",
          utilityBill: property.utilityBill ?? "",
          nearbyLocations: property.nearbyLocations ?? "",
          address: property.address ?? "",
          latitude: property.latitude ?? null,
          longitude: property.longitude ?? null,
        },
      };
    },
    clearFetchedProperty: () => ({
      property: null,
    }),
  },
});

export const { setFetchedProperty, clearFetchedProperty } =
  getSinglePropertySlice.actions;

export default getSinglePropertySlice.reducer;
