import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";

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
    tagTypes: ['UserTickets', 'TicketDetails'],
    endpoints: (builder) => ({
        getTicketsUser: builder.query<TicketWithEvent[], number>({
            query: (id : number) => ({
                url: `/tickets/user/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['UserTickets']
        }),

        getTicketById: builder.query<TicketWithEvent, number>({
            query: (id : number) => ({
                url: `/tickets/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['TicketDetails']
        })
    })
})

export const {
    useGetTicketsUserQuery,
    useGetTicketByIdQuery,
} = TicketQuery