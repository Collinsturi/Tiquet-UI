import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration";
import type { RootState } from "../../redux/store";
import type { AssignedEvents } from "../checkInStaff/StaffScannedQuery.ts";

// === Type Definitions (Keep these as they are or adjust slightly if needed based on the new structure) ===
export type Venue = {
    id: number;
    name: string;
    // Your API response now has 'address' instead of 'addresses'
    address: string; // Changed from 'addresses'
    capacity: number;
    createdAt?: string; // Made optional if not always present in nested venue
    updateAt?: string;  // Made optional if not always present in nested venue
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
    typeName: string | null; // Changed to 'string | null' based on your JSON sample
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    description?: string | null; // Added 'description' as per your JSON sample, made optional/nullable
};

// This type directly matches the objects in the array returned by your API
export type APIEventResponseItem = {
    id: number;
    title: string;
    description: string; // Lowercase 'd'
    eventDate: string;
    eventTime: string;
    category: string;
    organizerId: number;
    venueId: number;
    venueName: string;
    venueAddress: string;
    venueCapacity: number;
    totalTicketsSold: string;
    totalTicketsAvailable: string;
    ticketsRemaining: string; // Added based on your provided JSON
    venue: Venue; // Nested venue object matching the 'Venue' type above
    ticketTypes: TicketType[]; // Array of ticket types matching the 'TicketType' type above
    tickets?: Ticket[]; // Array of tickets (optional, as not always present or might be empty)
    posterImageUrl?: string;
    thumbnailImageUrl?: string;
    latitude?: number | null;
    longitude?: number | null;
};


// What your `getAllEvents` query should now return.
// It can directly return `APIEventResponseItem[]` because each item is a complete event.
// You might also consider renaming `NormalizedEvent` to `EventDetail` or similar
// if it's meant to be the single source of truth for a detailed event view.
// For the UpcomingEvents list, the `EventType` from Event.ts is still relevant.
export type NormalizedEventForUI = { // Renamed for clarity vs. original NormalizedEvent
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    category: string;
    venueName: string;
    venueAddress: string;
    posterImageUrl?: string;
    // Add other fields you need for the UI, e.g., for filters or display
};


export type OrganizerEventDetails = {
    eventId: number;
    title: string;
    eventDate: string; // "YYYY-MM-DD"
    eventTime: string; // "HH:MM:SS"
    category: string;
    venueName: string;
    venueAddress: string;
    ticketsSold: string; // These are strings in your example JSON, consider making them numbers
    ticketsScanned: string; // Consider making them numbers
    attendanceRate: string; // Consider making it a number (float)
};

export type CreateEventRequest = {
    category: string;
    name: string;
    description: string;
    startDate: string; // ISO string, maps to eventDate and eventTime on backend
    endDate: string;   // ISO string, may be used for event duration
    address?: string; // Made optional for existing venue
    city?: string;    // Made optional for existing venue
    country?: string; // Made optional for existing venue
    venueId?: number; // Optional if selecting an existing venue
    latitude?: number | null;
    longitude?: number | null;
    posterImageUrl?: string;
    thumbnailImageUrl?: string;
    organizerEmail: string; // Taken from logged-in user's state
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


// === Base Query with Auth Header & Retry (No changes here) ===
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

// === Event API with Pagination, Category Filter, and Realtime Support ===
export const EventQuery = createApi({
    reducerPath: 'eventApi',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList', 'Venues', 'DetailedOrganizerEvents', 'AssignedEvents'],
    endpoints: (builder) => ({
        // ... (other endpoints remain the same) ...

        // 3. Get Event by ID and normalize (No change, as it expects similar detailed response)
        getEventById: builder.query<APIEventResponseItem | null, number>({ // Changed return type
            query: (id) => `/events/${id}`,
            transformResponse: (response: APIEventResponseItem) => {
                console.log("Raw API response for getEventById:", response); // For debugging
                return response;
            },
            providesTags: (result, error, id) => [{ type: 'Events', id }],
            pollingInterval: 60000,
        }),

        // 4. All Events with Pagination and optional Category Filtering
        getAllEvents: builder.query<APIEventResponseItem[], { page?: number; limit?: number; category?: string }>({ // Changed return type
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
            // CORRECTED transformResponse:
            transformResponse: (response: APIEventResponseItem[]) => { // Expect array of APIEventResponseItem
                console.log("getAllEvents transformResponse: Incoming API response:", response); // Debugging
                // The API already returns the data in the desired format (array of events)
                // You just need to ensure the types are correct.
                // No grouping or complex normalization is needed here based on the JSON you provided.

                // Filter for upcoming events based on eventDate
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize to start of today

                const upcomingEvents = response.filter(event => {
                    const eventDate = new Date(event.eventDate);
                    // Include events that are today or in the future
                    return eventDate >= today;
                });

                console.log("getAllEvents transformResponse: Filtered upcoming events:", upcomingEvents); // Debugging
                return upcomingEvents; // Return the filtered data directly
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id }))]
                    : [],
        }),
        // ... (rest of the endpoints remain the same) ...
        getOrganizerEvents: builder.query<AssignedEvents[], string>({
            query: (email) => BASE_URL + `/events/organizer/past/${email}`,
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
                const body: any = {
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
                'FeaturedEventsList',
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