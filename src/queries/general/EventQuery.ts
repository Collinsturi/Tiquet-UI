import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration";
import type { RootState } from "../../redux/store";
import type {AssignedEvents} from "../checkInStaff/StaffScannedQuery.ts";

// === Type Definitions ===
export type Venue = {
    id: number;
    name: string;
    addresses: string;
    capacity: number;
    createdAt: string;
    updateAt: string;
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
    typeName: string;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
};

export type Event = {
    id: number;
    title: string;
    Description: string;
    VenueId: number;
    Category: string;
    eventDate: string;
    eventTime: string;
    createdAt: string;
    updatedAt: string;
    posterImageUrl?: string; // Added for display in UI
};

type RawEventRow = {
    event: Event;
    venue: Venue;
    ticketTypes: TicketType; // Note: 'ticket' is not always present in /events query, only in /tickets/user
    ticket?: Ticket; // Make optional as per /events data
};

export type NormalizedEvent = {
    event: Event;
    venue: Venue;
    ticket?: Ticket; // Make optional
    ticketTypes: TicketType[];
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


// === Helper to normalize raw rows ===
// This function takes an array of rows that all belong to the SAME event
const normalizeEventData = (rows?: RawEventRow[]): NormalizedEvent | null => {
    if (!Array.isArray(rows) || rows.length === 0) return null;

    // All rows for a single event should have the same event and venue details
    const { event, venue } = rows[0];
    // The 'ticket' object might be present or not depending on the specific API endpoint.
    // For /events, it might not be relevant per row, or might be the first ticket associated.
    // We'll take the first ticket if it exists, or leave it undefined.
    const ticket = rows[0].ticket;

    const ticketTypeMap = new Map<number, TicketType>();

    for (const row of rows) {
        if (row.ticketTypes && !ticketTypeMap.has(row.ticketTypes.id)) {
            ticketTypeMap.set(row.ticketTypes.id, row.ticketTypes);
        }
    }

    return {
        event,
        venue,
        ticket, // This will be the ticket from the first row of the group
        ticketTypes: Array.from(ticketTypeMap.values()),
    };
};

// === Base Query with Auth Header & Retry ===
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
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList', 'Venues'],
    endpoints: (builder) => ({
        // 1. Featured Events
        getFeaturedEvents: builder.query<Event[], void>({
            query: () => '/events/featured',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id })), { type: 'FeaturedEventsList' }]
                    : [{ type: 'FeaturedEventsList' }],
        }),

        // 2. Categorized Events
        getCategorizedEvents: builder.query<Event[], void>({
            query: () => '/events/category',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Events' as const, id })), { type: 'CategorizedEventsList' }]
                    : [{ type: 'CategorizedEventsList' }],
        }),

        // 3. Get Event by ID and normalize
        getEventById: builder.query<NormalizedEvent | null, number>({
            query: (id) => `/events/${id}`,
            transformResponse: (response: RawEventRow[]) => normalizeEventData(response),
            providesTags: (result, error, id) => [{ type: 'Events', id }],
            // Realtime polling every 60s (optional)
            pollingInterval: 60000,
        }),

        // 4. All Events with Pagination and optional Category Filtering
        getAllEvents: builder.query<NormalizedEvent[], { page?: number; limit?: number; category?: string }>({
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
            // Corrected transformResponse to handle flat array of RawEventRow
            transformResponse: (response: RawEventRow[]) => {
                if (!Array.isArray(response) || response.length === 0) {
                    return []; // Return empty array if no data
                }

                const groupedByEventId = new Map<number, RawEventRow[]>();
                response.forEach(row => {
                    if (row.event?.id) { // Ensure event.id exists before grouping
                        if (!groupedByEventId.has(row.event.id)) {
                            groupedByEventId.set(row.event.id, []);
                        }
                        groupedByEventId.get(row.event.id)!.push(row);
                    }
                });

                // Map each group of rows to a NormalizedEvent and filter out any nulls
                return Array.from(groupedByEventId.values())
                    .map(rowsForOneEvent => normalizeEventData(rowsForOneEvent))
                    .filter(Boolean) as NormalizedEvent[];
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ event }) => ({ type: 'Events' as const, id: event.id }))]
                    : [],
        }),
        getOrganizerEvents: builder.query<AssignedEvents[], string>({
            query: (email) => BASE_URL + `/events/organizer/past/${email}`,
            providesTags: ['AssignedEvents']
        }),
        getDetailedUpcomingOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/${organizerEmail}/upcoming`, // Matches route
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        getDetailedCurrentOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/${organizerEmail}/current`, // Matches route
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        getDetailedPastOrganizerEvents: builder.query<OrganizerEventDetails[], string>({
            query: (organizerEmail: string) => ({
                url: `/events/organizer/${organizerEmail}/past`, // Matches route
                method: 'GET'
            }),
            providesTags: ['DetailedOrganizerEvents'],
        }),
        // New endpoint to get all venues
        getAllVenues: builder.query<Venue[], void>({
            query: () => '/venues', // Assuming a /venues endpoint
            providesTags: ['Venues'],
        }),
        createEvent: builder.mutation<CreateEventResponse, { CreateEventRequest: CreateEventRequest, organizerEmail: string }>({
            // Corrected query parameters: Destructure the single argument
            query: ({ CreateEventRequest: eventDataForApi, organizerEmail: apiOrganizerEmail }) => {
                // eventDataForApi now correctly holds the CreateEventRequest object
                // apiOrganizerEmail now correctly holds the organizerEmail string

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
                    // Important: Use the organizerEmail passed in the mutation args
                    organizerEmail: apiOrganizerEmail, // Use the destructured email here
                    ticketTypes: eventDataForApi.ticketTypes,
                };

                // This logic is correct as long as eventDataForApi holds the correct data
                if (eventDataForApi.venueId) {
                    // Existing venue selected
                    body.venueId = eventDataForApi.venueId;
                } else if (eventDataForApi.address && eventDataForApi.city && eventDataForApi.country) {
                    // New venue to be created
                    body.address = eventDataForApi.address;
                    body.city = eventDataForApi.city;
                    body.country = eventDataForApi.country;
                } else {
                    throw new Error("Either 'venueId' or 'address', 'city', and 'country' must be provided for event creation.");
                }

                return {
                    url: `/events/${apiOrganizerEmail}`, // Use the destructured email in the URL
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
    useGetAllVenuesQuery, // Export the new hook
} = EventQuery;