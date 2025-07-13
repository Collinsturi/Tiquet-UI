import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query";
import { BASE_URL } from "../APIConfiguration";
import type {RootState} from "../../redux/store.ts";

export type Event = {
    id: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    price: string;
    image: string;
    organizer: string;
};

const staggeredBaseQuery = retry(
    fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    {
        maxRetries: 5,
    }
);

export const EventQuery = createApi({
    reducerPath: 'api',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList'], // More specific list tags
    endpoints: (builder) => ({
        // Get Featured Events Collection
        getFeaturedEvents: builder.query<Event[], void>({
            query: () => '/events/featured',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id })), { type: 'FeaturedEventsList' }]
                    : [{ type: 'FeaturedEventsList' }],
        }),

        // Get Categorized Events Collection
        getCategorizedEvents: builder.query<Event[], void>({
            query: () => '/events/category',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id })), { type: 'CategorizedEventsList' }]
                    : [{ type: 'CategorizedEventsList' }],
        }),

        // Get a single Event by ID (can be used for both featured and categorized)
        getEventById: builder.query<Report, number>({
            query: (id) => `/events/${id}`,
            providesTags: (result, error, id) => [{ type: 'Events' as const, id }], // Consistent with general 'Events' tag
        }),

    })
});

// Export hooks for convenience
export const {
    useGetFeaturedEventsQuery,
    useGetCategorizedEventsQuery,
    useGetEventByIdQuery,
} = EventQuery;