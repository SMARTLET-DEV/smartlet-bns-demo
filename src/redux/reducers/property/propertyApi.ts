// redux/reducers/property/propertyApi.ts
import { baseApi } from "@/redux/api/baseAPi";
import {
  setCreatedProperty,
  setLastSuccessfulAppointment,
  setRentalApplication,
} from "./propertySlice";
import { PropertyFilters } from "@/lib/urlService";
import { filtersToApiQuery } from "@/lib/urlService";

const APPOINTMENT_TAG = "AppointmentBooking" as const;
const RENTAL_APPLICATION_TAG = "RentalApplication" as const;

export interface ViewingAppointment {
  id: string;
  createdAt: string;
  date: string;
  agentAssignment: string;
  property: {
    area: string;
    city: string;
    id: string;
    media: string[];
    title: string;
  };
  propertyId: string;
  renterId: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

interface AppointmentResponse {
  success: boolean;
  viewingAppointments: ViewingAppointment[];
}

interface AppointmentBookingRequest {
  date: string;
  status: "SCHEDULED";
  property: {
    connect: { id: string };
  };
}

interface ApplyForRentRequest {
  propertyId: string;
  preferredMoveInMonth: string;
  identityDocument: File;
  financialDocument: File;
}

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
  }
];

const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProperties: builder.query<
      any,
      { skip?: number; take?: number; sort?: string }
    >({
      queryFn: () => ({ data: { properties: dummyProperties, pagination: { totalCount: dummyProperties.length } } }),
    }),
    getSingleProperty: builder.query<any, string>({
      queryFn: (id) => ({ data: { property: dummyProperties.find(p => p.id === id) || dummyProperties[0], similarProperties: [] } }),
    }),
    getPropertiesByOwner: builder.query<
      { properties: any[]; pagination: { totalCount: number } },
      { ownerId: string; skip: number; take: number }
    >({
      queryFn: () => ({ data: { properties: dummyProperties, pagination: { totalCount: dummyProperties.length } } }),
    }),
    getPriceRange: builder.query<{ success: boolean; minPrice: number; maxPrice: number }, void>({
      queryFn: () => ({ data: { success: true, minPrice: 10000, maxPrice: 500000 } }),
    }),
    submitDeleteRequest: builder.mutation<
      any,
      { propertyId: string; ownerId: string; reason: string }
    >({
      query: ({ propertyId, ownerId, reason }) => ({
        url: `/properties-removal-requests/${propertyId}/removal-requests`,
        method: "POST",
        body: {
          owner: {
            connect: {
              id: ownerId,
            },
          },
          reason,
        },
      }),
    }),

    getReceipt: builder.query<
      { success: boolean; data: { receiptUrl: string } },
      { serviceRequestId: string; transactionId: string }
    >({
      query: ({ serviceRequestId, transactionId }) => {
        //console.log("🔁 Calling GET receipt endpoint:", serviceRequestId, transactionId);
        return {
          url: `/properties/${serviceRequestId}/receipt/${transactionId}`,
          method: "GET",
        };
      },
    }),
    getServiceReceipt: builder.mutation<
      { success: boolean; data: { receiptUrl: string } },
      { serviceRequestId: string; transactionId: string }
    >({
      query: ({ serviceRequestId, transactionId }) => ({
        url: `/properties/${serviceRequestId}/receipt/${transactionId}`,
        method: "GET",
      }),
    }),

    submitEditRequest: builder.mutation<
      any,
      { id: string; changes: Record<string, any> }
    >({
      query: ({ id, changes }) => ({
        url: `/properties-edit-requests/${id}/edit-requests`,
        method: "POST",
        body: { changes },
      }),
    }),
    getFilteredProperties: builder.query<any, PropertyFilters>({
      queryFn: (filters) => {
        let filtered = dummyProperties;
        if (filters.propertyType) {
          filtered = filtered.filter(p => p.propertyType === filters.propertyType);
        }
        return { data: { properties: filtered, pagination: { totalCount: filtered.length } } };
      },
    }),
    getFilteredPropertiesWithQuery: builder.query<any, string>({
      queryFn: (queryString) => {
        let filtered = dummyProperties;
        if (queryString.includes("COMMERCIAL")) {
           filtered = filtered.filter(p => p.propertyType === "COMMERCIAL");
        } else if (queryString.includes("RESIDENTIAL")) {
           filtered = filtered.filter(p => p.propertyType === "RESIDENTIAL");
        }
        return { data: { properties: filtered, pagination: { totalCount: filtered.length } } };
      },
    }),
    getAllUnlistedProperties: builder.query<any, PropertyFilters>({
      queryFn: () => ({ data: { properties: dummyProperties, pagination: { totalCount: dummyProperties.length } } }),
    }),
    // Geo list for map markers by search keyword (independent of pagination)
    getGeoListBySearch: builder.query<
      {
        id: string;
        area: string;
        city: string;
        latitude: number;
        longitude: number;
      }[],
      string
    >({
      queryFn: () => ({ data: dummyProperties }),
    }),
    // Geo list for map markers by city (fallback when no search keyword)
    getGeoListByCity: builder.query<
      {
        id: string;
        area: string;
        city: string;
        latitude: number | null;
        longitude: number | null;
      }[],
      string
    >({
      queryFn: () => ({ data: dummyProperties }),
    }),
    getAllAppointmentBooking: builder.query<ViewingAppointment[], string>({
      query: (propertyId) => ({
        url: `/viewing-appointments`,
        method: "GET",
      }),
      providesTags: [{ type: APPOINTMENT_TAG, id: "LIST" }],
      transformResponse: (response: AppointmentResponse, _, arg) => {
        const filteredAppointments = response.viewingAppointments.filter(
          (appointment) => appointment.propertyId === arg
        );
        return filteredAppointments;
      },
    }),
    getUserRentalApplications: builder.query<any, string>({
      query: (propertyId) => ({
        url: `/rental-applications`,
        method: "GET",
      }),
      providesTags: [{ type: RENTAL_APPLICATION_TAG, id: "LIST" }],
      transformResponse: (response: any, _, arg) => {
        const applications = response.applications;

        if (applications) {
          const filteredApplications = applications.filter(
            (application: any) =>
              application.propertyId === arg &&
              application.status !== "CANCELLED"
          );
          return filteredApplications;
        }
      },
    }),
    createAppointmentBooking: builder.mutation<any, AppointmentBookingRequest>({
      query: (appointment) => ({
        url: "/viewing-appointments",
        method: "POST",
        body: appointment,
      }),
      invalidatesTags: [{ type: APPOINTMENT_TAG, id: "LIST" }],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.success) {
          dispatch(setLastSuccessfulAppointment(data?.viewingAppointment));
        }
      },
    }),
    createApplyForRent: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/rental-applications",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: RENTAL_APPLICATION_TAG, id: "LIST" }],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        const data = await queryFulfilled;
        // console.log("data: ", data.data);
        if (data.data.success) {
          dispatch(setRentalApplication(data?.data?.application));
        }
      },
    }),
    createProperty: builder.mutation<any, any>({
      query: (body) => ({
        url: "/properties",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if (response.data.success) {
            dispatch(setCreatedProperty(response.data.property));
          }
        } catch (err) {
          console.error("Failed to update property with documents:", err);
        }
      },
    }),
    getPendingEditRequest: builder.query({
      query: (propertyId) =>
        `properties-edit-requests/${propertyId}/pending-edit-request`,
    }),
    deletePropertyFiles: builder.mutation<
      any,
      { id: string; body: { media?: string[]; layout?: string[] } }
    >({
      query: ({ id, body }) => ({
        url: `/properties/${id}/delete-files`,
        method: "PATCH",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if (response.data?.success) {
            dispatch(setCreatedProperty(response.data.property));
          }
        } catch (err) {
          console.error("Failed to delete property files:", err);
        }
      },
    }),

    getPropertyReceipt: builder.query<
      {
        success: boolean;
        data?: {
          receiptUrl: string;
        };
        message?: string;
      },
      string // propertyId
    >({
      query: (propertyId) => ({
        url: `properties/property/${propertyId}/receipt`,
        method: "GET",
      }),
    }),

    updateProperty: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => {
        //console.log("🚨 updateProperty triggered with ID:", id);
        // Optional for deeper trace
        //console.trace("🚨 updateProperty call stack");

        return {
          url: `/properties/${id}`,
          method: "PUT",
          body: data,
          formData: true,
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if (response.data.success) {
            dispatch(setCreatedProperty(response.data.property));
          }
        } catch (err) {
          console.error("Failed to update property with documents:", err);
        }
      },
    }),

    updatePropertyStatus: builder.mutation<
      any,
      { id: string; data: { isPaused: boolean } }
    >({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: data, // send as JSON
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if (response.data.success) {
            dispatch(setCreatedProperty(response.data.property));
          }
        } catch (err) {
          console.error("Failed to update property status:", err);
        }
      },
    }),
    incrementQrVisitCount: builder.mutation<
      { success: boolean; message?: string },
      string // propertyId
    >({
      query: (propertyId) => ({
        url: `/properties/${propertyId}/qr-visit`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetAllPropertiesQuery,
  useGetSinglePropertyQuery,
  useLazyGetSinglePropertyQuery,
  useGetFilteredPropertiesQuery,
  useGetFilteredPropertiesWithQueryQuery,
  useGetAllUnlistedPropertiesQuery,
  useGetGeoListBySearchQuery,
  useGetGeoListByCityQuery,
  useGetAllAppointmentBookingQuery,
  useCreateAppointmentBookingMutation,
  useCreateApplyForRentMutation,
  useGetUserRentalApplicationsQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetPropertiesByOwnerQuery,
  useUpdatePropertyStatusMutation,
  useSubmitDeleteRequestMutation,
  useGetReceiptQuery,
  useLazyGetReceiptQuery,
  useSubmitEditRequestMutation,
  useDeletePropertyFilesMutation,
  useGetPendingEditRequestQuery,
  useLazyGetPendingEditRequestQuery,
  useGetServiceReceiptMutation,
  useLazyGetPropertyReceiptQuery,
  useIncrementQrVisitCountMutation,
  useGetPriceRangeQuery,
} = propertyApi;
