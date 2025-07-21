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

export type AssignedStaff = {
    id: number,
    firstName: string,
    lastName: string,
    email: string
}

export const StaffScannedQuery = createApi({
    reducerPath: 'StaffScannedQuery',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['ScannedEvents', 'AssignedEvents', 'AvailableStaff', 'AssignedStaff'],
    endpoints: (builder) => ({
        getStaffAssignedEvents: builder.query<AssignedEvents[], string>({
            query: (email: string) => ({
                url: `/events/staff/assigned/${email}`,
                method: 'GET'
            }),
            providesTags: ['AssignedEvents']
        }),

        getStaffForAssignedEvent: builder.query<AssignedStaff[], { organizerEmail: string, eventId: number }>({
            query: ({ organizerEmail, eventId }) => ({
                url: `/events/organizer/${organizerEmail}/assigned-staff?eventId=${eventId}`
            }),
            providesTags: [`AssignedStaff`] // Corrected typo and tag type
        }),

        getStaffScannedEvents: builder.query<ScannedEvents[], string>({
            query: (email: string) => ({
                url: `/events/staff/scanned/${email}`,
                method: 'GET'
            })
        }),
        scanTickets: builder.mutation<ScannedEvents, { code: string, userId: number }>({
            query: ({ code, userId }) => ({
                url: `/tickets/${code}/scan`,
                method: 'PUT',
                body: JSON.stringify({ scannedByUser: userId })
            }),
            invalidatesTags: ['ScannedEvents']
        }),

        availableStaff: builder.query<AssignedStaff[], void>({
            query: () => '/events/staff/available',
            providesTags: ['AvailableStaff']
        }),

        assignStaffToEvent: builder.mutation<AssignedStaff, { eventId: number, staffEmail: string, organizerEmail: string }>({
            query: ({ eventId, staffEmail, organizerEmail }) => ({
                url: `/events/organizer/${organizerEmail}/assignStaff`,
                method: 'POST',
                body: { "staffEmails": [staffEmail], "eventId": eventId }
            }),
            invalidatesTags: ['AvailableStaff', 'AssignedEvents', 'AssignedStaff']
        }),
        unassignStaffFromEvent: builder.mutation<AssignedStaff, { eventId: number, staffEmail: string, organizerEmail: string }>({
            query: ({ eventId, staffEmail, organizerEmail }) => ({
                url: `/events/organizer/${organizerEmail}/unassign-staff`,
                method: 'DELETE',
                body: { "staffEmails": staffEmail, "eventId": eventId }
            }),
            invalidatesTags: ['AvailableStaff', 'AssignedEvents', 'AssignedStaff']
        })
    })
})


export const {
    useGetStaffAssignedEventsQuery,
    useGetStaffScannedEventsQuery,
    useScanTicketsMutation,
    useAvailableStaffQuery,
    useAssignStaffToEventMutation,
    useUnassignStaffFromEventMutation,
    useGetStaffForAssignedEventQuery,
} = StaffScannedQuery;