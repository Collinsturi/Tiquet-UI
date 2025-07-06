import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TTicket = {
    id: number;
    orderItemId: number; // bigint in DB, but often handled as number in JS
    userId: number;
    eventId: number;
    ticketTypeId: number;
    uniqueCode: string;
    isScanned: boolean;
    scannedAt?: string;
    scannedByUser?: number | null;
};

export const TicketQuery = createApi({
    reducerPath: 'TicketQuery',
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
    tagTypes: ['Tickets'],
    endpoints: (builder) => ({
        getAllTickets: builder.query<TTicket[], void>({
            query: () => '/api/tickets',
            providesTags: ['Tickets']
        }),
        getTicketById: builder.query<TTicket, number>({
            query: (id) => `/api/tickets/${id}`,
            providesTags: (result, error, id) => [{ type: 'Tickets', id }],
        }),
        createTicket: builder.mutation<TTicket, Partial<TTicket>>({
            query: (newTicket) => ({
                url: '/api/tickets',
                method: 'POST',
                body: newTicket
            }),
            invalidatesTags: ['Tickets']
        }),
        scanTicket: builder.mutation<TTicket, { id: number; scannedByUser: number }>({
            query: ({ id, scannedByUser }) => ({
                url: `/api/tickets/${id}/scan`,
                method: 'PUT',
                body: { scannedByUser },
            }),
            invalidatesTags: (result, error, { id }) => ['Tickets', { type: 'Tickets', id }],
        }),
        // Endpoint to delete a ticket
        deleteTicket: builder.mutation<TTicket, number>({
            query: (id) => ({
                url: `/api/tickets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Tickets', { type: 'Tickets', id }],
        }),
    })
})

export const {
    useGetAllTicketsQuery,
    useGetTicketByIdQuery,
    useCreateTicketMutation,
    useScanTicketMutation,
    useDeleteTicketMutation,
} = TicketQuery;
