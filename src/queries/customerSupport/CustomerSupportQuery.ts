import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TCustomerSupportTicket = {
    id: number;
    userId: number
    subject: string;
    description: string;
    status: 'open' | 'closed' | 'in_progress';
    // createdAt?: string;
    // updatedAt?: string;
};

export const CustomerSupportQuery = createApi({
    reducerPath: 'CustomerSupportQuery',
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
    tagTypes: ['CustomerSupportTickets'],
    endpoints: (builder) => ({
        getAllSupportTickets: builder.query<TCustomerSupportTicket[], void>({
            query: () => '/api/support-tickets',
            providesTags: ['CustomerSupportTickets']
        }),
        getSupportTicketById: builder.query<TCustomerSupportTicket, number>({
            query: (id) => `/api/support-tickets/${id}`,
            providesTags: (result, error, id) => [{ type: 'CustomerSupportTickets', id }],
        }),
        createSupportTicket: builder.mutation<TCustomerSupportTicket, Partial<TCustomerSupportTicket>>({
            query: (newTicket) => ({
                url: '/api/support-tickets',
                method: 'POST',
                body: newTicket
            }),
            invalidatesTags: ['CustomerSupportTickets']
        }),
        updateSupportTicket: builder.mutation<TCustomerSupportTicket, Partial<TCustomerSupportTicket> & { id: number }>({
            query: (ticket) => ({
                url: `/api/support-tickets/${ticket.id}`,
                method: 'PUT',
                body: ticket,
            }),
            invalidatesTags: (result, error, { id }) => ['CustomerSupportTickets', { type: 'CustomerSupportTickets', id }],
        }),
        deleteSupportTicket: builder.mutation<{ message: string; ticket: TCustomerSupportTicket }, number>({
            query: (id) => ({
                url: `/api/support-tickets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['CustomerSupportTickets', { type: 'CustomerSupportTickets', id }],
        }),
    })
})

export const {
    useGetAllSupportTicketsQuery,
    useGetSupportTicketByIdQuery,
    useCreateSupportTicketMutation,
    useUpdateSupportTicketMutation,
    useDeleteSupportTicketMutation,
} = CustomerSupportQuery;
