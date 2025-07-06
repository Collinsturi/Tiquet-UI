import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TVenue = {
    id: number;
    name: string;
    addresses: string;
    capacity: number;
    // createdAt?: string;
    // updateAt?: string;
};

export const VenueQuery = createApi({
    reducerPath: 'VenueQuery',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            // Retrieve the authentication token from the Redux store
            const token = (getState() as RootState).user.token;
            if (token) {
                // If a token exists, set the Authorization header
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Venues'],
    endpoints: (builder) => ({
        getAllVenues: builder.query<TVenue[], void>({
            query: () => '/api/venues',
            providesTags: ['Venues']
        }),
        getVenueById: builder.query<TVenue, number>({
            query: (id) => `/api/venues/${id}`,
            providesTags: (result, error, id) => [{ type: 'Venues', id }],
        }),
        // Endpoint to create a new venue
        createVenue: builder.mutation<TVenue, Partial<TVenue>>({
            query: (newVenue) => ({
                url: '/api/venues',
                method: 'POST',
                body: newVenue
            }),
            invalidatesTags: ['Venues']
        }),
        updateVenue: builder.mutation<TVenue, Partial<TVenue> & { id: number }>({
            query: (venue) => ({
                url: `/api/venues/${venue.id}`,
                method: 'PATCH',
                body: venue,
            }),
            invalidatesTags: (result, error, { id }) => ['Venues', { type: 'Venues', id }],
        }),
        // Endpoint to delete a venue
        deleteVenue: builder.mutation<TVenue, number>({
            query: (id) => ({
                url: `/api/venues/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Venues', { type: 'Venues', id }],
        }),
    })
})

export const {
    useGetAllVenuesQuery,
    useGetVenueByIdQuery,
    useCreateVenueMutation,
    useUpdateVenueMutation,
    useDeleteVenueMutation,
} = VenueQuery;
