import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";
import type {RegisterRequest, TLoginResponse, TRegisterResponse} from "../general/AuthQuery.ts";


export const TicketQuery = createApi({
    reducerPath: 'TicketQuery',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['UserTickets', 'TicketDetails'],
    endpoints: (builder) => ({
        getTicketsUser: builder.mutation<>({
            query: () => ({
                url: '/api/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        }),

        getTicketById: builder.mutation<>({
            query: (registerData) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: registerData
            }),
            invalidatesTags: ['Register']
        })
    })
})

export const {
    useLoginUserMutation,
    useRegisterUserMutation
} = TicketQuery