import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";

export type ScannedEvents = {
    eventId: number,
    title: string,
    ticketsSold: number,
    ticketScanned: number,
}

export type AssignedEvents = {
    eventId: number,
    title: string,
    ticketsSold: number,
    ticketsRemaining: number,
}

export const StaffScannedQuery = createApi({
    reducerPath: 'StaffScannedQuery',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['ScannedEvents', 'AssignedEvents'],
    endpoints: (builder) => ({
        getStaffAssignedEvents: builder.query<AssignedEvents, string>({
            query: (email: string) => ({
                url: BASE_URL + `/events/staff/assigned/${email}`,
                method: 'GET'
            }),
            invalidateTags: ['AssignedEvents']
        }),

        getStaffScannedEvents: builder.query<ScannedEvents, string>({
            query: (email: string) => ({
                url: BASE_URL + `/events/staff/scanned/${email}`,
                method: 'GET'
            })
        })
    })
})


export const {
    useGetStaffAssignedEventsQuery,
    useGetStaffScannedEventsQuery,
} = StaffScannedQuery;