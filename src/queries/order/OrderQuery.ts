import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TOrder = {
    id: number;
    userId: number;
    totalAmount: number; // bigint in DB, but often handled as number in JS
    status: 'in_progress' | 'pending' | 'completed' | 'cancelled';
    paymentMethod: 'stripe' | 'paypal' | 'card';
    transactionId?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type TOrderItem = {
    id: number;
    orderId: number;
    ticketTypeId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
};

export type TOrderWithItems = {
    order: TOrder;
    orderItems: TOrderItem[];
};

export const OrderQuery = createApi({
    reducerPath: 'OrderQuery',
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
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getAllOrders: builder.query<TOrderWithItems[], void>({
            query: () => '/api/orders',
            providesTags: ['Orders']
        }),
        getOrderById: builder.query<TOrderWithItems, number>({
            query: (id) => `/api/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
        createOrder: builder.mutation<TOrderWithItems, { order: Partial<TOrder>; orderItems: Partial<TOrderItem>[] }>({
            query: (data) => ({
                url: '/api/orders',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Orders']
        }),
        updateOrder: builder.mutation<TOrderWithItems, Partial<TOrder> & { id: number }>({
            query: (order) => ({
                url: `/api/orders/${order.id}`,
                method: 'PATCH',
                body: order,
            }),
            invalidatesTags: (result, error, { id }) => ['Orders', { type: 'Orders', id }],
        }),
        deleteOrder: builder.mutation<{ message: string; deletedOrder: TOrderWithItems }, number>({
            query: (id) => ({
                url: `/api/orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Orders', { type: 'Orders', id }],
        }),
    })
})

export const {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = OrderQuery;
