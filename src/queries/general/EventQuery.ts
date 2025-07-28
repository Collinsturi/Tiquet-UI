import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration";
import type { RootState } from "../../redux/store";
import type { AssignedEvents } from "../checkInStaff/StaffScannedQuery.ts";

// === Type Definitions (Keep these as they are or adjust slightly if needed based on the new structure) ===
export type Venue = {
    id: number;
    name: string;
    address: string; // Changed from 'addresses' based on common API patterns
    capacity: number;
    createdAt?: string;
    updatedAt?: string; // Changed from 'updateAt' for consistency
};

export type Ticket = {
    id: number;
    orderItemId: number;
    userId: number;
    eventId: number;
    ticketTypeId: number;
    uniqueCode: string;
    isScanned: boolean;
    scannedAt: string | null;
    scannedByUser: number | null;
};

export type TicketType = {
    id: number;
    eventId: number;
    typeName: string | null;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    description?: string | null;
};

// This type directly matches the objects in the array returned by your API
export type APIEventResponseItem = {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    category: string;
    organizerId: number;
    venueId: number;
    venueName: string;
    venueAddress: string;
    venueCapacity: number;
    totalTicketsSold: string; // Keep as string if API returns string, convert in UI if needed for math
    totalTicketsAvailable: string; // Keep as string
    ticketsRemaining: string;
    venue: Venue;
    ticketTypes: TicketType[];
    tickets?: Ticket[];
    posterImageUrl?: string;
    thumbnailImageUrl?: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type NormalizedEventForUI = {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    category: string;
    venueName: string;
    venueAddress: string;
    posterImageUrl?: string;
};

export type OrganizerEventDetails = {
    eventId: number;
    title: string;
    eventDate: string;
    eventTime: string;
    category: string;
    venueName: string;
    posterImageUrl: string;
    thumbnailImageUrl: string;
    venueAddress: string;
    ticketsSold: string;
    ticketsScanned: string;
    attendanceRate: string;
};

export type CreateEventRequest = {
    category: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    address?: string;
    city?: string;
    country?: string;
    venueId?: number;
    latitude?: number | null;
    longitude?: number | null;
    posterImageUrl?: string;
    thumbnailImageUrl?: string;
    organizerEmail: string;
    ticketTypes: NewTicketTypeInput[];
};

export type NewTicketTypeInput = {
    typeName: string;
    price: number;
    quantityAvailable: number;
    description?: string;
};

export type CreateEventResponse = {
    success: boolean;
    message: string;
    eventId: number;
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
    { maxRetries: 5 }
);

export const EventQuery = createApi({
    reducerPath: 'eventApi',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList', 'Venues', 'DetailedOrganizerEvents', 'AssignedEvents'],
    endpoints: (builder) => ({
        getEventById: builder.query<APIEventResponseItem | null, number>({
            query: (id) => `/events/${id}`,
            transformResponse: (response: APIEventResponseItem) => {
                console.log("Raw API response for getEventById:", response);
                return response;
            },
            // Fixed providesTags: use the result (not arg) and extract the id property
            providesTags: (result, _error, arg) =>
                result ? [{ type: 'Events', id: result.id }] : [{ type: 'Events', id: arg }],
        }),

        getAllEvents: builder.query<APIEventResponseItem[], { page?: number; limit?: number; category?: string }>({
            query: ({ page = 1, limit = 10, category }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                if (category) {
                    params.append('category', category);
                }
                return `/events?${params.toString()}`;
            },
            transformResponse: (response: APIEventResponseItem[]) => {
                console.log("getAllEvents transformResponse: Incoming API response:", response);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const upcomingEvents = response.filter(event => {
                    const eventDate = new Date(event.eventDate);
                    return eventDate >= today;
                });

                console.log("getAllEvents transformResponse: Filtered upcoming events:", upcomingEvents);
                return upcomingEvents;
            },
            // Corrected providesTags: map over the result to get individual event IDs
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id }))]
                    : [],
        }),
        getOrganizerEvents: builder.query<AssignedEvents[], string>({
            query: (email) => `/events/organizer/current/${email}`, // Removed BASE_URL prefix as it's already in fetchBaseQuery
            providesTags: ['AssignedEvents']
        }),
        getDetailedUpcomingOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/${organizerEmail}/upcoming`,
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        getDetailedCurrentOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/current/${organizerEmail}`,
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        getDetailedPastOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/past/${organizerEmail}`,
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        getAllVenues: builder.query<Venue[], void>({
            query: () => '/venues',
            providesTags: ['Venues'],
        }),
        createEvent: builder.mutation<CreateEventResponse, { CreateEventRequest: CreateEventRequest, organizerEmail: string }>({
            query: ({ CreateEventRequest: eventDataForApi, organizerEmail: apiOrganizerEmail }) => {
                const body: any = { // Using 'any' here for flexibility with conditional properties
                    category: eventDataForApi.category,
                    name: eventDataForApi.name,
                    description: eventDataForApi.description,
                    startDate: eventDataForApi.startDate,
                    endDate: eventDataForApi.endDate,
                    latitude: eventDataForApi.latitude,
                    longitude: eventDataForApi.longitude,
                    posterImageUrl: eventDataForApi.posterImageUrl,
                    thumbnailImageUrl: eventDataForApi.thumbnailImageUrl,
                    organizerEmail: apiOrganizerEmail,
                    ticketTypes: eventDataForApi.ticketTypes,
                };

                if (eventDataForApi.venueId) {
                    body.venueId = eventDataForApi.venueId;
                } else if (eventDataForApi.address && eventDataForApi.city && eventDataForApi.country) {
                    body.address = eventDataForApi.address;
                    body.city = eventDataForApi.city;
                    body.country = eventDataForApi.country;
                } else {
                    // This error should ideally be handled by form validation before calling the mutation
                    throw new Error("Either 'venueId' or 'address', 'city', and 'country' must be provided for event creation.");
                }

                return {
                    url: `/events/${apiOrganizerEmail}`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: [
                'Events',
                'FeaturedEventsList', // Assuming these tags are used elsewhere for invalidation
                'CategorizedEventsList',
                'DetailedOrganizerEvents',
                'Venues',
            ],
        }),
    }),
});

export const {
    useGetOrganizerEventsQuery,
    useGetDetailedUpcomingOrganizerEventsQuery,
    useGetDetailedCurrentOrganizerEventsQuery,
    useGetDetailedPastOrganizerEventsQuery,
    useGetEventByIdQuery,
    useGetAllEventsQuery,
    useCreateEventMutation,
    useGetAllVenuesQuery,
} = EventQuery;