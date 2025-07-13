import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration";
import type { RootState } from "../../redux/store";

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
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList'],
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
    }),
});

// === Export Hooks ===
export const {
    useGetFeaturedEventsQuery,
    useGetCategorizedEventsQuery,
    useGetEventByIdQuery,
    useGetAllEventsQuery,
} = EventQuery;
