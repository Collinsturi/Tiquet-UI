import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";
import type {RootState} from "../../redux/store.ts";

export interface MpesaStkPushRequest {
    phoneNumber: string;
    amount: number;
    orderId: number | string;
    accountReference: string;
    transactionDesc: string;
}

export interface ManualMpesaVerifyRequest {
    phoneNumber: string;
    amount: number;
    mpesaReceiptNumber: string;
    orderId: number;
}

export interface PaystackInitializeRequest {
    email: string;
    amount: number; // in kobo (e.g., 5000 = 50.00 NGN)
    orderId: number;
}

// ===== Response Types =====
export interface GenericResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        amount: number;
        currency: string;
        status: string;
        reference: string;
        customer: {
            email: string;
        };
        metadata: any;
    };
}

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



export const PaymentQuery = createApi({
    reducerPath: 'PaymentQuery',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['Events', 'FeaturedEventsList', 'CategorizedEventsList', 'Venues', 'DetailedOrganizerEvents', 'AssignedEvents'],
    endpoints: (builder) => ({
        // 1. M-Pesa STK Push
        initiateMpesaStkPush: builder.mutation<GenericResponse, MpesaStkPushRequest>({
            query: (body) => ({
                url: '/payments/mpesa/stkpush',
                method: 'POST',
                body,
            }),
        }),

        // 2. Manual Verify M-Pesa
        manualMpesaVerify: builder.mutation<GenericResponse, ManualMpesaVerifyRequest>({
            query: (body) => ({
                url: '/mpesa/manual-verify',
                method: 'POST',
                body,
            }),
        }),

        // 3. Initialize Paystack
        initializePaystack: builder.mutation<PaystackInitializeResponse, PaystackInitializeRequest>({
            query: (body) => ({
                url: '/payments/paystack/initialize',
                method: 'POST',
                body,
            }),
        }),

        // 4. Verify Paystack Payment
        verifyPaystackPayment: builder.query<PaystackVerifyResponse, string>({
            query: (reference) => `/payments/paystack/verify/${reference}`,
        }),
    })
})


export const {
    useInitiateMpesaStkPushMutation,
    useManualMpesaVerifyMutation,
    useInitializePaystackMutation,
    useVerifyPaystackPaymentQuery,
} = PaymentQuery;