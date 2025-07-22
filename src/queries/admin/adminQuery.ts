import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";
import type {RootState} from "../../redux/store.ts";

export type AdminDashboardAnalytics = {
    totalEvents: number,
    totalTicketsSold: number,
    totalRevenue: number,
    upcomingEvents: {
        id: number,
        title: string,
        date: Date,
        time: string
    }[],
    recentActivity: {
        ticketId: number,
        buyerId: number,
        eventId: number,
        eventTitle: string,
        createdAt: Date
    }[],
    monthlySales: {
        month: string,           // e.g. '2025-07-01T00:00:00.000Z'
        ticket_count: string     // or number, depending on driver
    }[],
    ticketTypeDistribution: {
        ticketType: string,
        sold: number
    }[]
}


export type platformSummary = {
    totalEvents: number,
    totalTicketsSold: number,
    totalRevenue: number,
    avgTicketsPerEvent: number
}

export type monthlySalesTrend = {
    month: string,         // 'YYYY-MM'
    ticketsSold: number,
    totalRevenue: number
};

export type TopSellingEvents = {
    eventName: string,
    totalTicketsSold: number
};

export type OverallTicketScanStatus = {
    eventName: string,
    totalTicketsSold: number
}

export type EventTicketSummary = {
    ticketType: string,
    totalAvailable: number,
    totalSold: number,
    totalRevenue: number,
    totalScanned: number
};

type DailyScans = {
    scanDate: string,   // 'YYYY-MM-DD'
    scanCount: number
};

export type EventScanLog = {
    totalScanned: number,
    dailyScans: DailyScans[]
};

export type TicketTypeDistribution = {
    ticketType: string,
    countSold: number,
    revenue: number
}

export type EventScanStatus = {
    scannedCount: number,
    notScannedCount: number
}

export type OrganizerEarningSummary = {
    totalEarnings: number,
    totalWithdrawn: number,      // currently hardcoded to 0
    availableBalance: number     // equals totalEarnings
}

export type RevenueSummaryPerEvent = {
    eventName: string,
    revenue: number
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

export const AdminQuery = createApi({
    reducerPath: 'AdminQuery',
    baseQuery: staggeredBaseQuery,
    tagTypes: [
        'Events',
        'FeaturedEventsList',
        'CategorizedEventsList',
        'AdminDashboard',
        'PlatformSummary',
        'MonthlyTrends',
        'TopSellingEvents',
        'TicketScanStatus',
        'EventSummary',
        'EventScanLog',
        'EventScanStatus',
        'TicketDistribution',
        'EarningsSummary',
        'RevenuePerEvent'
    ],
    endpoints: (builder) => ({
        getAdminDashboardSummary: builder.query<AdminDashboardAnalytics, string>({
            query: (email: string) => `/admin/summary/${email}`,
            providesTags: ['AdminDashboard'],
        }),

        getPlatformSummary: builder.query<platformSummary, void>({
            query: () => '/platform/summary',
            providesTags: ['PlatformSummary'],
        }),

        getMonthlySalesTrends: builder.query<monthlySalesTrend[], void>({
            query: () => '/platform/monthly-trends',
            providesTags: ['MonthlyTrends'],
        }),

        getTopSellingEvents: builder.query<TopSellingEvents[], void>({
            query: () => '/platform/top-events',
            providesTags: ['TopSellingEvents'],
        }),

        getOverallTicketScanStatus: builder.query<{ scanned: number, notScanned: number }, void>({
            query: () => '/platform/ticket-scan-status',
            providesTags: ['TicketScanStatus'],
        }),

        getEventTicketSummary: builder.query<EventTicketSummary[], number>({
            query: (eventId) => `/event/${eventId}/summary`,
            providesTags: (result, error, eventId) => [{ type: 'EventSummary', id: eventId }],
        }),

        getEventScanLog: builder.query<EventScanLog, number>({
            query: (eventId) => `/event/${eventId}/scan-log`,
            providesTags: (result, error, eventId) => [{ type: 'EventScanLog', id: eventId }],
        }),

        getEventScanStatus: builder.query<EventScanStatus, number>({
            query: (eventId) => `/event/${eventId}/scan-status`,
            providesTags: (result, error, eventId) => [{ type: 'EventScanStatus', id: eventId }],
        }),

        getTicketTypeDistribution: builder.query<TicketTypeDistribution[], number>({
            query: (eventId) => `/event/${eventId}/ticket-distribution`,
            providesTags: (result, error, eventId) => [{ type: 'TicketDistribution', id: eventId }],
        }),

        getOrganizerEarningsSummary: builder.query<OrganizerEarningSummary, number>({
            query: (organizerId) => `/organizer/wallet/${organizerId}`,
            providesTags: ['EarningsSummary'],
        }),

        getRevenuePerEvent: builder.query<RevenueSummaryPerEvent[], number>({
            query: (organizerEmail) => `/organizer/revenue/${organizerEmail}`,
            providesTags: ['RevenuePerEvent'],
        }),
    }),
});


export const {
    useGetAdminDashboardSummaryQuery,
    useGetPlatformSummaryQuery,
    useGetMonthlySalesTrendsQuery,
    useGetTopSellingEventsQuery,
    useGetOverallTicketScanStatusQuery,
    useGetEventTicketSummaryQuery,
    useGetEventScanLogQuery,
    useGetEventScanStatusQuery,
    useGetTicketTypeDistributionQuery,
    useGetOrganizerEarningsSummaryQuery,
    useGetRevenuePerEventQuery
} = AdminQuery;
