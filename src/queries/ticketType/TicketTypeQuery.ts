import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TTicketType = {
    id: number;
    eventId?: number;
    typeName: string;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
};

export const TicketTypeQuery = createApi({
    reducerPath: 'TicketTypeQuery',
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
    tagTypes: ['TicketTypes'],
    endpoints: (builder) => ({
        getAllTicketTypes: builder.query<TTicketType[], { eventId?: number } | void>({
            query: (params) => {
                const queryString = params && params.eventId ? `?eventId=${params.eventId}` : '';
                return `/api/ticket-types${queryString}`;
            },
            providesTags: ['TicketTypes']
        }),
        getTicketTypeById: builder.query<TTicketType, number>({
            query: (id) => `/api/ticket-types/${id}`,
            providesTags: (result, error, id) => [{ type: 'TicketTypes', id }],
        }),
        createTicketType: builder.mutation<TTicketType, Partial<TTicketType>>({
            query: (newTicketType) => ({
                url: '/api/ticket-types',
                method: 'POST',
                body: newTicketType
            }),
            invalidatesTags: ['TicketTypes']
        }),
        updateTicketType: builder.mutation<TTicketType, Partial<TTicketType> & { id: number }>({
            query: (ticketType) => ({
                url: `/api/ticket-types/${ticketType.id}`,
                method: 'PATCH',
                body: ticketType,
            }),
            invalidatesTags: (result, error, { id }) => ['TicketTypes', { type: 'TicketTypes', id }],
        }),
        deleteTicketType: builder.mutation<{ message: string; ticket: TTicketType }, number>({
            query: (id) => ({
                url: `/api/ticket-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['TicketTypes', { type: 'TicketTypes', id }],
        }),
    })
})

export const {
    useGetAllTicketTypesQuery,
    useGetTicketTypeByIdQuery,
    useCreateTicketTypeMutation,
    useUpdateTicketTypeMutation,
    useDeleteTicketTypeMutation,
} = TicketTypeQuery;
