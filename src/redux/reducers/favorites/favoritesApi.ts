import { baseApi } from "@/redux/api/baseAPi";

const favoritesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllFavorites: builder.query<any, void>({
            query: () => ({
                url: `/favorite-listings`,
                method: "GET",
            }),
            providesTags: [{ type: "Favorites", id: "LIST" }],
        }),
        getAllFavoritesByPropertyId: builder.query<any, void>({
            query: (propertyId) => ({
                url: `/favorite-listings/property/${propertyId}`,
                method: "GET",
            }),
            // providesTags: [{ type: "Favorites", id: "LIST" }],
        }),
        createFavoriteListing: builder.mutation<any, any>({
            query: (favoriteListing) => ({
                url: "/favorite-listings",
                method: "POST",
                body: favoriteListing,
            }),
            invalidatesTags: [{ type: "Favorites", id: "LIST" }],
        }),
        deleteFavoriteListing: builder.mutation<any, any>({
            query: (id) => ({
                url: `/favorite-listings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Favorites", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllFavoritesQuery,
    useGetAllFavoritesByPropertyIdQuery,
    useCreateFavoriteListingMutation,
    useDeleteFavoriteListingMutation,
} = favoritesApi;
