import {
    Box,
    Grid,
    Typography,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    useTheme,
    CircularProgress,
    Alert,
    alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

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
    PieChart,
    Pie,
    Cell,
    type PieLabelRenderProps,
} from 'recharts';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";
import { useGetAdminDashboardSummaryQuery } from '../../queries/admin/adminQuery.ts';

// --- Type Definitions ---

interface MonthlySale {
    month: string;
    ticket_count: string;
}

interface TicketTypeDistribution {
    ticketType: string;
    sold: number;
}

// Updated to match actual API response structure
interface UpcomingEvent {
    id: number; // Changed from string to number
    title: string;
    date: Date; // Changed from string to Date
    time: string;
    // Removed location as it's not in the actual API response
}

// Updated to match actual API response structure
interface RecentActivity {
    ticketId: number;
    buyerId: number;
    eventId: number;
    eventTitle: string;
    createdAt: Date;
}

// Props for NoDataOverlay
interface NoDataOverlayProps {
    message?: string;
}

// Colors for the Pie Chart slices (matching Material-UI palette somewhat)
const PIE_COLORS: string[] = [];

export const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Populate PIE_COLORS using theme palette colors
    PIE_COLORS[0] = theme.palette.primary.main;
    PIE_COLORS[1] = theme.palette.secondary.main;
    PIE_COLORS[2] = theme.palette.success.main;
    PIE_COLORS[3] = theme.palette.info.main;
    PIE_COLORS[4] = theme.palette.warning.main;
    PIE_COLORS[5] = theme.palette.error.main;
    PIE_COLORS[6] = theme.palette.primary.light;
    PIE_COLORS[7] = theme.palette.secondary.light;

    const user = useSelector((state: RootState) => state.user.user);
    // Type the data returned by the query
    const { data, isLoading, isError } = useGetAdminDashboardSummaryQuery(user?.email || '', {
        skip: !user?.email, // Skip query if user email is not available
    });

    // Destructure data with default empty arrays for safe access
    const {
        totalEvents = 0,
        totalTicketsSold = 0,
        totalRevenue = 0,
        upcomingEvents = [],
        recentActivity = [],
        monthlySales = [],
        ticketTypeDistribution = [],
    } = data ?? {}; // Use nullish coalescing to ensure data is an object

    // Prepare data for charts
    const salesData = monthlySales.map((item: MonthlySale) => ({
        month: new Date(item.month).toLocaleString('default', { month: 'short' }),
        tickets: parseInt(item.ticket_count, 10),
    }));

    const ticketTypeData = ticketTypeDistribution.map((item: TicketTypeDistribution) => ({
        name: item.ticketType,
        value: item.sold,
    }));

    // Helper component for "No Data" overlay
    const NoDataOverlay = ({ message = "No data available right now. Please check back later." }: NoDataOverlayProps) => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: '200px',
                width: '100%',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.secondary,
                borderRadius: theme.shape.borderRadius,
                textAlign: 'center',
                p: 2,
                boxSizing: 'border-box'
            }}
        >
            <Typography variant="body1">{message}</Typography>
        </Box>
    );

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: theme.palette.background.default }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading dashboard data...</Typography>
            </Box>
        );
    }

    // Handle case where user is not logged in or email is missing
    if (!user?.email) {
        return (
            <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Admin user not found. Please log in as an administrator to view the dashboard.
                    <Button variant="contained" sx={{ ml: 2 }} onClick={() => navigate('/login')}>Go to Login</Button>
                </Alert>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading dashboard data. Please try again later.
                    <Button variant="contained" sx={{ ml: 2 }} onClick={() => navigate('/')}>Go to Home</Button>
                </Alert>
            </Box>
        );
    }

    // Determine if sales data is meaningful (has at least one entry with tickets > 0)
    const hasMeaningfulSalesData = salesData && salesData.length > 0 && salesData.some(item => item.tickets > 0);

    // Determine if ticket type data is meaningful (has at least one entry with value > 0)
    const hasMeaningfulTicketTypeData = ticketTypeData && ticketTypeData.length > 0 && ticketTypeData.some(item => item.value > 0);

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)', minHeight: '100vh', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>
                Welcome, {user.first_name} {user.last_name}!
            </Typography>

            {/* Quick Stats Section */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                        <EventIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Total Events</Typography>
                            <Typography variant="h4" color="primary">{totalEvents}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}>
                        <SellIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Tickets Sold</Typography>
                            <Typography variant="h4" color="secondary">{totalTicketsSold}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                        <AttachMoneyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                            <Typography variant="h4" color="success">KES {totalRevenue.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
                        <CalendarTodayIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Upcoming Events</Typography>
                            <Typography variant="h4" color="info">{upcomingEvents.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-my-base-100)' }}>
                        <CardHeader title="Recent Activity" sx={{ color: 'var(--color-my-base-content)' }}/>
                        {recentActivity && recentActivity.length > 0 ? (
                            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                {/* Slice to show only the recent 5 activities */}
                                {recentActivity.slice(0, 5).map((activity: RecentActivity, index: number) => (
                                    <Box key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={<Typography sx={{ color: 'var(--color-my-base-content)' }}>{`Buyer ${activity.buyerId} purchased ticket ${activity.ticketId} for "${activity.eventTitle}"`}</Typography>}
                                                secondary={<Typography sx={{ color: 'var(--color-my-base-content)' }}>{new Date(activity.createdAt).toLocaleString()}</Typography>}
                                            />
                                        </ListItem>
                                        {index < recentActivity.slice(0, 5).length - 1 && <Divider component="li" sx={{ borderColor: 'var(--color-my-base-300)' }}/>}
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <NoDataOverlay message="No recent activity to display. Check back later." />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="text" onClick={() => navigate('/admin/reports')} sx={{ color: 'var(--color-my-primary)' }}>View All Activity</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Actions / Event Creation */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-my-base-100)' }}>
                        <CardHeader title="Quick Actions" sx={{ color: 'var(--color-my-base-content)' }}/>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{ mb: 2, width: '80%', backgroundColor: 'var(--color-my-primary)', color: 'var(--color-my-primary-content)', '&:hover': { backgroundColor: 'var(--color-my-primary-focus)' } }}
                                onClick={() => navigate('/organizer/create-event')}
                            >
                                Create New Event
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<SellIcon />}
                                sx={{ mb: 2, width: '80%', color: 'var(--color-my-secondary)', borderColor: 'var(--color-my-secondary)', '&:hover': { backgroundColor: 'var(--color-my-secondary)', color: 'var(--color-my-secondary-content)' } }}
                                onClick={() => navigate('/organizer/my-events')}
                            >
                                Manage My Events
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sales Overview Chart (Recharts) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.paper }}>
                        <CardHeader title="Monthly Ticket Sales Overview" sx={{ color: theme.palette.text.primary }}/>
                        {hasMeaningfulSalesData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={salesData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                                    <YAxis label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} stroke={theme.palette.text.secondary} />
                                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                    <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                                    <Bar dataKey="tickets" fill={theme.palette.primary.main} name="Tickets Sold" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoDataOverlay message="No monthly sales data available. Tickets might not have been sold yet." />
                        )}
                    </Paper>
                </Grid>

                {/* Ticket Type Distribution Chart (Recharts) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.paper }}>
                        <CardHeader title="Ticket Type Distribution" sx={{ color: theme.palette.text.primary }}/>
                        {hasMeaningfulTicketTypeData ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={ticketTypeData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={false}
                                        label={(props: PieLabelRenderProps) => {
                                            const { name, percent } = props;
                                            return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`;
                                        }}
                                    >
                                        {ticketTypeData.map((_entry: { name: string; value: number }, index: number) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }} />
                                    <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoDataOverlay message="No ticket type distribution data available. Tickets might not have been sold yet or ticket types have no sales." />
                        )}
                    </Paper>
                </Grid>

                {/* Upcoming Events List */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 2, backgroundColor: 'var(--color-my-base-100)' }}>
                        <CardHeader title="My Events" sx={{ color: 'var(--color-my-base-content)' }}/>
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            <List>
                                {upcomingEvents.map((event: UpcomingEvent) => (
                                    <Box key={event.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" component="div" sx={{ color: 'var(--color-my-base-content)' }}>
                                                        {event.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>
                                                            <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: 'var(--color-my-base-content)' }} /> {new Date(event.date).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>
                                                            <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: 'var(--color-my-base-content)' }} /> {event.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/organizer/my-events/${event.id}`)}
                                                sx={{ color: 'var(--color-my-secondary)', borderColor: 'var(--color-my-secondary)', '&:hover': { backgroundColor: 'var(--color-my-secondary)', color: 'var(--color-my-secondary-content)' } }}
                                            >
                                                View Details
                                            </Button>
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1, borderColor: 'var(--color-my-base-300)' }} />
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <NoDataOverlay message="No upcoming events to display. Start by creating a new event!" />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="text" onClick={() => navigate('/organizer/my-events')} sx={{ color: 'var(--color-my-primary)' }}>View All Events</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};