import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration.ts";

export type TicketWithEvent = {
    ticket: {
        id: number;
        orderItemId: number;
        userId: number;
        eventId: number;
        ticketTypeId: number;
        uniqueCode: string;
        isScanned: boolean;
        scannedAt: string | null;
        scannedByUser: number | null;
        purchaseDate?: string;
    };
    event: {
        id: number;
        title: string;
        Description: string;
        VenueId: number;
        Category: string;
        eventDate: string;
        eventTime: string;
        createdAt: string;
        updatedAt: string;
    };
    ticketType: {
        "id": number,
        "eventId": number,
        "typeName": string,
        "price": number,
        "quantityAvailable": number,
        "quantitySold": number
    };
    venue: {
        "id": number,
        "name": string,
        "addresses": string,
        "capacity": number,
        "createdAt": string,
        "updateAt": string
    }
};

export const TicketQuery = createApi({
    reducerPath: 'TicketQuery',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    // Define tagTypes that can be provided or invalidated by endpoints
    tagTypes: ['UserTickets', 'TicketDetails'],
    endpoints: (builder) => ({
        // For queries, use 'providesTags' to indicate what data they provide
        getTicketsUser: builder.query<TicketWithEvent[], number>({
            query: (id: number) => ({
                url: `/tickets/user/${id}`,
                method: 'GET',
            }),
            // This query provides data tagged with 'UserTickets'
            providesTags: ['UserTickets']
        }),

        getTicketById: builder.query<TicketWithEvent, number>({
            query: (id: number) => ({
                url: `/tickets/${id}`,
                method: 'GET',
            }),
            // This query provides data tagged with 'TicketDetails'
            providesTags: ['TicketDetails']
        })
        // If you had mutations (e.g., updateTicket), you would use 'invalidatesTags' there:
        /*
        updateTicket: builder.mutation<TicketWithEvent, Partial<TicketWithEvent>>({
            query: (ticket) => ({
                url: `/tickets/${ticket.ticket.id}`,
                method: 'PUT',
                body: ticket,
            }),
            // This mutation invalidates 'TicketDetails' for the specific ticket and 'UserTickets'
            invalidatesTags: (result, error, arg) => [
                { type: 'TicketDetails', id: arg.ticket.id },
                'UserTickets'
            ],
        }),
        */
    })
})

export const {
    useGetTicketsUserQuery,
    useGetTicketByIdQuery,
} = TicketQuery