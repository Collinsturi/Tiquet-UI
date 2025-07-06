import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TEvent = {
    id: number;
    title: string;
    Description: string;
    VenueId: number;
    Category: string;
    eventDate: string;
    eventTime: string;
    // createdAt?: string;
    // updatedAt?: string;
};

export const EventQuery = createApi({
    reducerPath: 'EventQuery',
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
    tagTypes: ['Events'],
    endpoints: (builder) => ({
        createEvent: builder.mutation<TEvent, Partial<TEvent>>({
            query: (newEvent) => ({
                url: '/api/events',
                method: 'POST',
                body: newEvent
            }),
            // Invalidate 'Events' tag to refetch all events after creation
            invalidatesTags: ['Events']
        }),
        getEvents: builder.query<TEvent[], { venueId?: number; category?: string; date?: string } | void>({
            query: (params) => {
                const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
                return `/api/events${queryString ? `?${queryString}` : ''}`;
            },
            // Provides 'Events' tag for caching
            providesTags: ['Events']
        }),
        getEventById: builder.query<TEvent, number>({
            query: (id) => `/api/events/${id}`,
            providesTags: (result, error, id) => [{ type: 'Events', id }],
        }),
        updateEvent: builder.mutation<TEvent, Partial<TEvent> & { id: number }>({
            query: (event) => ({
                url: `/api/events/${event.id}`,
                method: 'PUT',
                body: event,
            }),
            // Invalidate 'Events' tag (all events) and the specific event by ID after update
            invalidatesTags: (result, error, { id }) => ['Events', { type: 'Events', id }],
        }),
        deleteEvent: builder.mutation<TEvent, number>({
            query: (id) => ({
                url: `/api/events/${id}`,
                method: 'DELETE',
            }),
            // Invalidate 'Events' tag (all events) and the specific event by ID after deletion
            invalidatesTags: (result, error, id) => ['Events', { type: 'Events', id }],
        }),
    })
})

export const {
    useCreateEventMutation,
    useGetEventsQuery,
    useGetEventByIdQuery,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = EventQuery;
