import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CircularProgress,
    Alert,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SellIcon from '@mui/icons-material/Sell';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Recharts imports
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// --- RTK Query Imports ---
import {
    useGetAdminDashboardSummaryQuery,
    useGetPlatformSummaryQuery,
    useGetMonthlySalesTrendsQuery,
    useGetTopSellingEventsQuery,
    useGetOverallTicketScanStatusQuery,
    useGetEventTicketSummaryQuery,
    useGetEventScanLogQuery,
    useGetEventScanStatusQuery,
    useGetTicketTypeDistributionQuery,
} from '../../queries/admin/adminQuery.ts';

// Redux imports for user email
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store'; // Adjust path as necessary

// Component to display when there's no data for a chart
const NoDataOverlay = ({ message }: { message: string }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'var(--color-my-base-100)', // Using custom theme base color
                color: 'var(--color-my-base-content)', // Using custom theme text color
                borderRadius: 'var(--rounded-box, 0.5rem)', // Fallback if --rounded-box is not defined
                textAlign: 'center',
                p: 2,
                flexDirection: 'column',
                boxSizing: 'border-box',
                zIndex: 10,
            }}
        >
            <Typography variant="h6" sx={{ color: 'inherit' }}>
                {message}
            </Typography>
            <Typography variant="body2" sx={{ color: 'inherit' }}>
                Check back later!
            </Typography>
        </Box>
    );
};

// --- React Component ---
export const AdminReports = () => {
    const theme = useTheme(); // Use theme for palette colors where requested

    // Fixed: Use proper type definition for color objects
    const PIE_COLORS_TICKET_TYPES: string[] = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.error.main,
    ];

    // Fixed: Use proper object type instead of string[]
    const PIE_COLORS_SCAN_STATUS: Record<string, string> = {
        scanned: theme.palette.success.main, // Green
        notScanned: theme.palette.error.main, // Red
    };

    // Get current organizer email from Redux store
    const user = useSelector((state: RootState) => state.user.user);
    // Fixed: Add null check for user
    const currentOrganizerEmail = user?.email || '';

    // --- RTK Query Hooks ---
    const {
        data: adminDashboardSummary,
        isLoading: isLoadingDashboard,
        isError: isErrorDashboard,
        error: errorDashboard,
    } = useGetAdminDashboardSummaryQuery(currentOrganizerEmail);

    const {
        data: platformSummaryData,
        isLoading: isLoadingPlatformSummary,
        isError: isErrorPlatformSummary,
        error: errorPlatformSummary,
    } = useGetPlatformSummaryQuery();

    const {
        data: monthlySalesTrends,
        isLoading: isLoadingMonthlySales,
        isError: isErrorMonthlySales,
        error: errorMonthlySales,
    } = useGetMonthlySalesTrendsQuery();

    const {
        data: topSellingEvents,
        isLoading: isLoadingTopSelling,
        isError: isErrorTopSelling,
        error: errorTopSelling,
    } = useGetTopSellingEventsQuery();

    const {
        data: overallTicketScanStatus,
        isLoading: isLoadingOverallScanStatus,
        isError: isErrorOverallScanStatus,
        error: errorOverallScanStatus,
    } = useGetOverallTicketScanStatusQuery();

    const [selectedEventId, setSelectedEventId] = useState<number | string>('');

    // Dynamically fetch event-specific data based on selectedEventId
    const {
        data: eventTicketSummary,
        isLoading: isLoadingEventTicketSummary,
        isError: isErrorEventTicketSummary,
        error: errorEventTicketSummary,
    } = useGetEventTicketSummaryQuery(selectedEventId as number, { skip: !selectedEventId || isNaN(Number(selectedEventId)) });

    const {
        data: eventScanLog,
        isLoading: isLoadingEventScanLog,
        isError: isErrorEventScanLog,
        error: errorEventScanLog,
    } = useGetEventScanLogQuery(selectedEventId as number, { skip: !selectedEventId || isNaN(Number(selectedEventId)) });

    const {
        data: eventScanStatus,
        isLoading: isLoadingEventScanStatus,
        isError: isErrorEventScanStatus,
        error: errorEventScanStatus,
    } = useGetEventScanStatusQuery(selectedEventId as number, { skip: !selectedEventId || isNaN(Number(selectedEventId)) });

    const {
        data: ticketTypeDistribution,
        isLoading: isLoadingTicketTypeDistribution,
        isError: isErrorTicketTypeDistribution,
        error: errorTicketTypeDistribution,
    } = useGetTicketTypeDistributionQuery(selectedEventId as number, { skip: !selectedEventId || isNaN(Number(selectedEventId)) });

    // Combine all loading and error states for overall analytics
    const overallLoading = isLoadingDashboard || isLoadingPlatformSummary || isLoadingMonthlySales || isLoadingTopSelling || isLoadingOverallScanStatus;
    const overallError = isErrorDashboard || isErrorPlatformSummary || isErrorMonthlySales || isErrorTopSelling || isErrorOverallScanStatus;
    const overallErrorMessage =
        (errorDashboard as any)?.message ||
        (errorPlatformSummary as any)?.message ||
        (errorMonthlySales as any)?.message ||
        (errorTopSelling as any)?.message ||
        (errorOverallScanStatus as any)?.message ||
        'Failed to load overall reports.';

    // Combine all loading and error states for event-specific analytics
    const eventSpecificLoading = isLoadingEventTicketSummary || isLoadingEventScanLog || isLoadingEventScanStatus || isLoadingTicketTypeDistribution;
    const eventSpecificError = isErrorEventTicketSummary || isErrorEventScanLog || isErrorEventScanStatus || isErrorTicketTypeDistribution;
    const eventSpecificErrorMessage =
        (errorEventTicketSummary as any)?.message ||
        (errorEventScanLog as any)?.message ||
        (errorEventScanStatus as any)?.message ||
        (errorTicketTypeDistribution as any)?.message ||
        'Failed to load event specific reports.';

    // Prepare data for charts from RTK Query responses
    const monthlySalesChartData = monthlySalesTrends?.map(item => ({
        month: item.month,
        tickets: Number(item.ticketsSold), // Ensure conversion to number
        revenue: Number(item.totalRevenue), // Ensure conversion to number
    })) || [];

    const topSellingEventsChartData = topSellingEvents?.map(item => ({
        name: item.eventName,
        ticketsSold: Number(item.totalTicketsSold), // Ensure conversion to number
    })) || [];

    const overallTicketScanStatusPieData = overallTicketScanStatus ? [
        { name: 'scanned', value: Number(overallTicketScanStatus.scanned) }, // Ensure conversion to number
        { name: 'notScanned', value: Number(overallTicketScanStatus.notScanned) }, // Ensure conversion to number
    ] : [];

    // This will be used to populate the dropdown for event selection
    const eventOptions = adminDashboardSummary?.upcomingEvents?.map(event => ({
        id: event.id,
        name: event.title, // Map 'title' to 'name' for consistency
        // Safely create Date object if 'event.date' is a string, then format
        startDate: new Date(event.date).toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi' }),
    })) || [];

    const handleEventChange = (event: { target: { value: string | number; }; }) => {
        setSelectedEventId(event.target.value);
    };

    // Process event-specific chart data
    const dailyScansChartData = eventScanLog?.dailyScans?.map(item => ({
        date: item.scanDate,
        scans: Number(item.scanCount), // Ensure conversion to number
    })) || [];

    const eventTicketTypePieData = ticketTypeDistribution?.map(item => ({
        name: item.ticketType,
        value: Number(item.countSold), // Ensure conversion to number
    })) || [];

    const eventScanStatusPieData = eventScanStatus ? [
        { name: 'scanned', value: Number(eventScanStatus.scannedCount) }, // Ensure conversion to number
        { name: 'notScanned', value: Number(eventScanStatus.notScannedCount) }, // Ensure conversion to number
    ] : [];

    // Calculate event-specific key metrics from eventTicketSummary
    const eventSpecificTicketsSold = eventTicketSummary?.reduce((acc, curr) => acc + Number(curr.totalSold), 0) || 0;
    const eventSpecificTotalRevenue = eventTicketSummary?.reduce((acc, curr) => acc + Number(curr.totalRevenue), 0) || 0;
    const eventSpecificAttendeesCheckedIn = eventTicketSummary?.reduce((acc, curr) => acc + Number(curr.totalScanned), 0) || 0;
    const eventSpecificRefundsIssued = 0; // Placeholder for refunds, as it's not in provided data

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)', minHeight: '100vh', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>
                Analytics & Reports
            </Typography>

            {overallLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress sx={{ color: 'var(--color-my-primary)' }} />
                    <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading overall reports data...</Typography>
                </Box>
            )}

            {overallError && (
                <Alert severity="error" sx={{ mt: 2, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{overallErrorMessage}</Alert>
            )}

            {!overallLoading && !overallError && adminDashboardSummary && platformSummaryData && (
                <>
                    {/* Overall Account analytics Section */}
                    <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }} id="overall-reports-section">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2" sx={{ color: 'var(--color-my-base-content)' }}>
                                Overall Account Analytics
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: 'var(--color-my-base-300)' }} />

                        {/* Overall Key Metrics */}
                        <Grid container spacing={3} mb={4}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                    <EventIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Events</Typography>
                                    <Typography variant="h4" color="primary">{platformSummaryData.totalEvents}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}>
                                    <SellIcon color="secondary" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Tickets Sold</Typography>
                                    <Typography variant="h4" color="secondary">{platformSummaryData.totalTicketsSold}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                                    <AttachMoneyIcon color="success" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                                    <Typography variant="h4" color="success">${platformSummaryData.totalRevenue.toLocaleString()}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
                                    <CheckCircleOutlineIcon color="info" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Avg. Tickets/Event</Typography>
                                    <Typography variant="h4" color="info">{platformSummaryData.avgTicketsPerEvent}</Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            {/* Monthly Sales Trend */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Monthly Sales Trend (Tickets & Revenue)</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <LineChart data={monthlySalesChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                                            <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} />
                                            <YAxis yAxisId="right" orientation="right" stroke={theme.palette.success.main} label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight' }} />
                                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="tickets" stroke={theme.palette.primary.main} name="Tickets Sold" />
                                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={theme.palette.success.main} name="Revenue" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Top Selling Events */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Top Selling Events (Tickets)</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <BarChart data={topSellingEventsChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} stroke={theme.palette.text.secondary} />
                                            <YAxis label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} stroke={theme.palette.text.secondary} />
                                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                            <Legend />
                                            <Bar dataKey="ticketsSold" fill={theme.palette.secondary.main} name="Tickets Sold" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Overall Ticket Status Distribution */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Overall Ticket Scan Status Distribution</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <PieChart>
                                            <Pie
                                                data={overallTicketScanStatusPieData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                                labelLine={false}
                                            >
                                                {overallTicketScanStatusPieData.map((entry, index) => (
                                                    <Cell key={`cell-overall-${index}`} fill={PIE_COLORS_SCAN_STATUS[entry.name] || '#CCCCCC'} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                            <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Event-Specific Analytics Section */}
                    <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--color-my-base-100)' }} id="event-specific-reports-section">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2" sx={{ color: 'var(--color-my-base-content)' }}>
                                Event-Specific Analytics
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: 'var(--color-my-base-300)' }} />

                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel id="select-event-report-label" sx={{ color: 'var(--color-my-base-content)' }}>Select Event for Details</InputLabel>
                            <Select
                                labelId="select-event-report-label"
                                id="select-event-report"
                                value={selectedEventId}
                                label="Select Event for Details"
                                onChange={handleEventChange}
                                sx={{
                                    color: 'var(--color-my-base-content)',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-base-300)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: 'var(--color-my-base-content)',
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'var(--color-my-base-100)',
                                            color: 'var(--color-my-base-content)',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="" sx={{ color: 'var(--color-my-base-content)' }}>
                                    <em>None Selected</em>
                                </MenuItem>
                                {eventOptions.map((event) => (
                                    <MenuItem key={event.id} value={event.id} sx={{ color: 'var(--color-my-base-content)' }}>
                                        {event.name} ({event.startDate})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedEventId && eventSpecificLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress sx={{ color: 'var(--color-my-primary)' }} />
                                <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading event-specific data...</Typography>
                            </Box>
                        )}

                        {selectedEventId && eventSpecificError && (
                            <Alert severity="error" sx={{ mt: 2, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{eventSpecificErrorMessage}</Alert>
                        )}

                        {selectedEventId && !eventSpecificLoading && !eventSpecificError && eventTicketSummary && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>
                                    Analytics for: {eventOptions.find(e => e.id === selectedEventId)?.name}
                                </Typography>
                                <Grid container spacing={3} mb={4}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                            <SellIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Tickets Sold</Typography>
                                            <Typography variant="h4" color="primary">{eventSpecificTicketsSold}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                                            <AttachMoneyIcon color="success" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                                            <Typography variant="h4" color="success">${eventSpecificTotalRevenue.toLocaleString()}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
                                            <CheckCircleOutlineIcon color="info" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Attendees Checked In</Typography>
                                            <Typography variant="h4" color="info">{eventSpecificAttendeesCheckedIn}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.error.main, 0.1) }}>
                                            <CancelOutlinedIcon color="error" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Refunds Issued</Typography>
                                            <Typography variant="h4" color="error">{eventSpecificRefundsIssued}</Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    {/* Daily Scans Trend */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400, position: 'relative' }}>
                                            <Typography variant="h6" gutterBottom>Daily Scans Trend</Typography>
                                            {dailyScansChartData && dailyScansChartData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="80%">
                                                    <LineChart data={dailyScansChartData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                                                        <YAxis label={{ value: 'Scans', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} stroke={theme.palette.text.secondary} />
                                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="scans" stroke={theme.palette.primary.main} name="Daily Scans" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <NoDataOverlay message="No daily scan data available for this event." />
                                            )}
                                        </Paper>
                                    </Grid>

                                    {/* Event Ticket Type Distribution */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400, position: 'relative' }}>
                                            <Typography variant="h6" gutterBottom>Event Ticket Type Sales Distribution</Typography>
                                            {eventTicketTypePieData && eventTicketTypePieData.some(data => data.value > 0) ? (
                                                <ResponsiveContainer width="100%" height="80%">
                                                    <PieChart>
                                                        <Pie
                                                            data={eventTicketTypePieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={120}
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                                            labelLine={false}
                                                        >
                                                            {eventTicketTypePieData.map((_, index) => (
                                                                <Cell key={`cell-event-type-${index}`} fill={PIE_COLORS_TICKET_TYPES[index % PIE_COLORS_TICKET_TYPES.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                                        <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <NoDataOverlay message="No ticket type sales data available for this event." />
                                            )}
                                        </Paper>
                                    </Grid>

                                    {/* Event Scan Status Distribution */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400, position: 'relative' }}>
                                            <Typography variant="h6" gutterBottom>Event Ticket Scan Status</Typography>
                                            {eventScanStatusPieData && eventScanStatusPieData.some(data => data.value > 0) ? (
                                                <ResponsiveContainer width="100%" height="80%">
                                                    <PieChart>
                                                        <Pie
                                                            data={eventScanStatusPieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={120}
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                                            labelLine={false}
                                                        >
                                                            {eventScanStatusPieData.map((entry, index) => (
                                                                <Cell key={`cell-event-scan-${index}`} fill={PIE_COLORS_SCAN_STATUS[entry.name] || '#CCCCCC'} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                                        <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <NoDataOverlay message="No ticket scan status data available for this event." />
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        {selectedEventId && !eventSpecificLoading && !eventSpecificError && !eventTicketSummary && (
                            <Alert severity="info" sx={{ mt: 2, backgroundColor: 'var(--color-my-info)', color: 'var(--color-my-info-content)' }}>
                                No specific analytics data available for the selected event.
                            </Alert>
                        )}
                        {!selectedEventId && (
                            <Alert severity="info" sx={{ backgroundColor: 'var(--color-my-info)', color: 'var(--color-my-info-content)' }}>Please select an event from the dropdown above to view its specific analytics.</Alert>
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};