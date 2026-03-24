import { combineReducers, createSlice } from "@reduxjs/toolkit";
import editRequestPropertyReducer from "./editRequestPropertySlice";
import getSinglePropertyReducer from "./getSinglePropertySlice";
import propertyDataReducer from "./propertyDataSlice";

const BASE_MEDIA_URL =
  "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";

const appointmentInitialState = {
  id: "",
  renterId: "",
  propertyId: "",
  date: new Date().toISOString(),
  status: "SCHEDULED",
};

const rentalApplicationInitialState = {
  id: "",
  renterId: "",
  propertyId: "",
  status: "PENDING",
  companyDocuments: null,
  renterDocuments: { identityDocument: "", financialDocument: "" },
  preferredMoveInMonth: "string",
  contractSigned: false,
};

const propertyModalInitialState = {
  appointmentBooking: false,
  applyForRent: false,
  homeFilterOpen: false,
  listingFilterOpen: false,
  appointmentBookingSuccess: false,
  applyForRentSuccess: false,
  callSupportDialog: false,
  phoneNumberModal: false,
  phoneNumber: "",
  makeAnOffer: false,
};

const createdPropertyInitialState = {
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
  city: "",
  area: "",
  nearbyLocations: "",
  popularLandmarks: "",
  viewStatus: "",
  latitude: null as number | null,
  longitude: null as number | null,
  description: "",
  media: [] as string[], // images
  layout: [] as string[], // floorplans
  video: "",
  virtualTour: "",
  titleDeed: "",
  utilityBill: "",
  addPropertyDetailsModal: false,
  size: "",
  balcony: "",
  facing: "",
  floor: "",
  elevators: "",
  parking: "",
  thumbnail: "", // thumbnail image URL
  availableFrom: "", // NEW
  additionalFeatures: [] as string[], // NEW
  tags: [] as string[], // NEW
};

const createdPropertySlice = createSlice({
  name: "createdProperty",
  initialState: createdPropertyInitialState,
  reducers: {
    setAddPropertyDetailsModal: (state, action) => {
      state.addPropertyDetailsModal = action.payload;
    },
    setClearCreatedProperty: (state) => {
      Object.assign(state, createdPropertyInitialState);
    },
    setCreatedProperty: (state, action) => {
      //console.log("setCreatedProperty action.payload: ", action.payload);
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
        tags,
        nearbyLocations,
        popularLandmarks,
        thumbnail,
        size,
        availableFrom,
        additionalFeatures,
        balcony,
        facing,
        floor,
        elevators,
        parking,
        city,
        area,
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
      } = action.payload;

      state.id = id;
      state.title = title;
      state.rent = price;
      state.serviceCharge = serviceCharge;
      state.bedrooms = bedrooms;
      state.bathrooms = bathrooms;
      state.amenities = [];
      if (gym) state.amenities.push("gym");
      if (furnished) state.amenities.push("furnished");
      if (swimmingPool) state.amenities.push("swimmingPool");
      state.propertyType = propertyType;
      state.ownerId = ownerId;
      state.address = address;
      state.city = city;
      state.area = area;
      state.size = size;
      state.balcony = balcony;
      state.availableFrom = availableFrom;
      state.additionalFeatures = additionalFeatures;
      state.tags = tags;
      state.facing = facing;
      state.floor = floor;
      state.elevators = elevators;
      state.parking = parking;
      state.nearbyLocations = nearbyLocations;
      state.popularLandmarks = popularLandmarks;
      state.latitude = latitude;
      state.longitude = longitude;
      state.titleDeed = titleDeed;
      state.utilityBill = utilityBill;
      state.description = description || "";
      state.viewStatus = viewStatus || "PENDING";
      state.media = (media || []).map((url: string) =>
        url.startsWith("http") ? url : BASE_MEDIA_URL + url
      );

      state.thumbnail = thumbnail;

      state.layout = (layout || []).map((url: string) =>
        url.startsWith("http") ? url : BASE_MEDIA_URL + url
      );
      state.video = video || "";
      state.virtualTour = virtualTour || "";
    },
    setMedia: (state, action) => {
      state.media = action.payload;
    },
    clearCreatedProperty: (state) => {
      Object.assign(state, createdPropertyInitialState);
    },
  },
});

const lastSuccessfulAppointmentSlice = createSlice({
  name: "lastSuccessfulAppointment",
  initialState: appointmentInitialState,
  reducers: {
    setLastSuccessfulAppointment: (state, action) => {
      // console.log(action.payload);
      const { id, renterId, propertyId, date, status } = action.payload;
      state.id = id;
      state.renterId = renterId;
      state.propertyId = propertyId;
      state.date = date instanceof Date ? date.toISOString() : date;
      state.status = status;
    },
  },
});

const rentalApplicationSlice = createSlice({
  name: "rentalApplication",
  initialState: rentalApplicationInitialState,
  reducers: {
    setRentalApplication: (state, action) => {
      // console.log("action.payload: ", action.payload);
      const {
        id,
        renterId,
        propertyId,
        status,
        preferredMoveInMonth,
        contractSigned,
      } = action.payload;
      state.id = id;
      state.renterId = renterId;
      state.propertyId = propertyId;
      state.status = status;
      state.contractSigned = contractSigned;
      state.preferredMoveInMonth = preferredMoveInMonth;
      const { identityDocument, financialDocument } = JSON.parse(
        action.payload.renterDocuments
      );
      state.renterDocuments.identityDocument = identityDocument;
      state.renterDocuments.financialDocument = financialDocument;
    },
    clearRentalApplication: (state) => {
      state.id = "";
      state.renterId = "";
      state.propertyId = "";
      state.status = "PENDING";
      state.renterDocuments = {
        identityDocument: "",
        financialDocument: "",
      };
      state.preferredMoveInMonth = "";
    },
  },
});

const propertyModalSlice = createSlice({
  name: "propertyModal",
  initialState: propertyModalInitialState,
  reducers: {
    setAppointmentBooking: (state, action) => {
      state.appointmentBooking = action.payload;
      // When appointment booking is opened, show phone modal if no phone number
      if (action.payload && !state.phoneNumber) {
        state.phoneNumberModal = true;
      }
      // When appointment booking is closed, reset phone states
      if (!action.payload) {
        state.phoneNumberModal = false;
        state.phoneNumber = "";
      }
    },
    setApplyForRent: (state, action) => {
      state.applyForRent = action.payload;
    },
    setMakeAnOffer: (state, action) => {
      state.makeAnOffer = action.payload;
    },
    setAppointmentBookingSuccess: (state, action) => {
      state.appointmentBookingSuccess = action.payload;
      // Reset all states on success
      if (action.payload) {
        state.appointmentBooking = false;
        state.phoneNumberModal = false;
        state.phoneNumber = "";
      }
    },
    setApplyForRentSuccess: (state, action) => {
      state.applyForRentSuccess = action.payload;
    },
    setCallSupportDialog: (state, action) => {
      state.callSupportDialog = action.payload;
    },
    setPhoneNumberModal: (state, action) => {
      state.phoneNumberModal = action.payload;
      // If phone modal is closed without phone number, close appointment booking too
      if (!action.payload && !state.phoneNumber) {
        state.appointmentBooking = false;
      }
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
      // When phone number is set, close phone modal
      if (action.payload) {
        state.phoneNumberModal = false;
      }
    },
    resetAppointmentFlow: (state) => {
      state.appointmentBooking = false;
      state.phoneNumberModal = false;
      state.phoneNumber = "";
      state.appointmentBookingSuccess = false;
    },
    setHomeFilterOpen: (state, action) => {
      state.homeFilterOpen = action.payload;
    },
    setListingFilterOpen: (state, action) => {
      state.listingFilterOpen = action.payload;
    },
  },
});

export const { setRentalApplication, clearRentalApplication } =
  rentalApplicationSlice.actions;

export const { setLastSuccessfulAppointment } =
  lastSuccessfulAppointmentSlice.actions;

export const {
  setCreatedProperty,
  clearCreatedProperty,
  setMedia,
  setAddPropertyDetailsModal,
  setClearCreatedProperty,
} = createdPropertySlice.actions;

export const {
  setApplyForRent,
  setMakeAnOffer,
  setAppointmentBooking,
  setAppointmentBookingSuccess,
  setApplyForRentSuccess,
  setCallSupportDialog,
  setPhoneNumberModal,
  setPhoneNumber,
  resetAppointmentFlow,
  setHomeFilterOpen,
  setListingFilterOpen,
} = propertyModalSlice.actions;

const propertyReducer = combineReducers({
  lastSuccessfulAppointment: lastSuccessfulAppointmentSlice.reducer,
  rentalApplication: rentalApplicationSlice.reducer,
  propertyModal: propertyModalSlice.reducer,
  createdProperty: createdPropertySlice.reducer,
  getSingleProperty: getSinglePropertyReducer,
  editRequestProperty: editRequestPropertyReducer,
  // filters: removed - now using URL-based filtering
  data: propertyDataReducer,
});

export default propertyReducer;
