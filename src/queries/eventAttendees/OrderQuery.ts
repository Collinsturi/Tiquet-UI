import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../APIConfiguration.ts";
import type { RootState } from "../../redux/store.ts";

// Enums from your Drizzle schema
export type OrderStatus = 'completed' | 'in_progress';

// UPDATED: Using the exact paymentMethods array from your Drizzle schema
export const paymentMethods = ['mpesa', 'paystack'] as const;
export type PaymentMethod = typeof paymentMethods[number];


// Type for a single order item in the request body
export type OrderItemRequest = {
    ticketTypeId: number;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
    // Add any other fields your backend expects for creating an order item
};

// Type for the main order data in the request body
export type OrderRequest = {
    userId: number;
    // eventId is now likely part of OrderItem, removed from main OrderRequest
    totalAmount: number; // mode: 'number' in Drizzle
    status: OrderStatus; // Using the defined enum type
    paymentMethod: PaymentMethod; // Using the defined enum type
    transactionId?: string | null; // Optional, as it might be set after payment
};

// Combined type for the create order request body
// export type APICreateOrderRequest = {
//     userId: number;
//     orderItems: {
//         ticketTypeId: number;
//         quantity: number;
//     }[];
// };

// Type for a single order item in the response (might include an ID)
export type OrderItemResponse = {
    id: number;
    orderId: number;
    ticketTypeId: number;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
    // Add any other fields your backend returns for an order item
};

// Type for the main order data in the response (might include an ID and timestamps)
export type OrderResponse = {
    order: {
        id: number;
        userId: number;
        totalAmount: number; // mode: 'number' in Drizzle
        status: OrderStatus;
        paymentMethod: PaymentMethod;
        transactionId: string | null;
        createdAt: string; // Or Date
        updatedAt: string; // Or Date
    }
};

export type SimpleOrderItemRequest = {
    ticketTypeId: number;
    quantity: number;
};

// Final shape sent to the backend
export type APICreateOrderRequest = {
    userId: number;
    orderItems: SimpleOrderItemRequest[];
};

// Combined type for the full order response (order details + items)
export type APIOrderResponseItem = {
    order: OrderResponse;
    orderItems: OrderItemResponse[];
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


export const OrderQuery = createApi({
    reducerPath: 'OrderQuery',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        // Get all orders
        getAllOrders: builder.query<APIOrderResponseItem[], void>({
            query: () => "/orders",
            providesTags: ['Orders'],
        }),
        // Get order by ID
        getOrderById: builder.query<APIOrderResponseItem, number>({
            query: (id) => `/orders/${id}`,
        }),
        // Create a new order
        createOrder: builder.mutation<APIOrderResponseItem, APICreateOrderRequest>({
            query: (body) => ({
                url: "/orders",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Orders'],
        }),
        // Update an existing order
        updateOrder: builder.mutation<APIOrderResponseItem, { id: number; data: Partial<OrderRequest> }>({
            query: ({ id, data }) => ({
                url: `/orders/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),
        // Delete an order
        deleteOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = OrderQuery;
