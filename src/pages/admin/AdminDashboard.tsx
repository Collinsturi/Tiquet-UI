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
    alpha,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import SellIcon from '@mui/icons-material/Sell';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
} from 'recharts';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";
import { useGetAdminDashboardSummaryQuery } from '../../queries/admin/adminQuery.ts';

// Colors for the Pie Chart slices (matching Material-UI palette somewhat)
const PIE_COLORS = ['#1976d2', '#ff9800', '#4caf50', '#9c27b0']; // Example: Primary, Orange, Green, Purple

export const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);
    const { data, isLoading, isError } = useGetAdminDashboardSummaryQuery(user.email);

    // Destructure data with default empty arrays for safe access
    const {
        totalEvents = 0,
        totalTicketsSold = 0,
        totalRevenue = 0,
        upcomingEvents = [], // Backend `upcomingEvents` already provides the list directly
        recentActivity = [],
        monthlySales = [],
        ticketTypeDistribution = [],
    } = data ?? {}; // Use nullish coalescing to ensure data is an object

    // Prepare data for charts
    const salesData = monthlySales.map((item) => ({
        month: new Date(item.month).toLocaleString('default', { month: 'short' }),
        tickets: item.ticket_count,
    }));

    const ticketTypeData = ticketTypeDistribution.map((item) => ({
        name: item.ticketType,
        value: item.sold,
    }));

    // Helper component for "No Data" overlay
    const NoDataOverlay = ({ message = "No data available right now. Please check back later." }) => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: '200px', // Ensure it has some height even if content is 0
                width: '100%',
                backgroundColor: theme.palette.background.default, // Or a slightly lighter color
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading dashboard data...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
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
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
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
                            <Typography variant="h4" color="success">${totalRevenue.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
                        <CalendarTodayIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Upcoming Events</Typography>
                            <Typography variant="h4" color="info">{upcomingEvents.length}</Typography>                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader title="Recent Activity" />
                        {recentActivity && recentActivity.length > 0 ? (
                            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                {/* Slice to show only the recent 5 activities */}
                                {recentActivity.slice(0, 5).map((activity, index) => (
                                    <Box key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`User ${activity.user} purchased ${activity.ticketType} ticket for "${activity.eventTitle}"`}
                                                secondary={new Date(activity.createdAt).toLocaleString()}
                                            />
                                        </ListItem>
                                        {index < recentActivity.slice(0, 5).length - 1 && <Divider component="li" />}
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <NoDataOverlay message="No recent activity to display. Check back later." />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="text" onClick={() => navigate('/admin/reports')}>View All Activity</Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Actions / Event Creation */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader title="Quick Actions" />
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                sx={{ mb: 2, width: '80%' }}
                                onClick={() => navigate('/organizer/create-event')}
                            >
                                Create New Event
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<SellIcon />}
                                sx={{ mb: 2, width: '80%' }}
                                onClick={() => navigate('/organizer/my-events')}
                            >
                                Manage My Events
                            </Button>
                            {/*<Button*/}
                            {/* variant="outlined"*/}
                            {/* color="info"*/}
                            {/* startIcon={<PeopleIcon />}*/}
                            {/* sx={{ width: '80%' }}*/}
                            {/* onClick={() => navigate('/organizer/attendees')}*/}
                            {/*>*/}
                            {/* View Attendees*/}
                            {/*</Button>*/}
                        </Box>
                    </Paper>
                </Grid>

                {/* Sales Overview Chart (Recharts) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader title="Monthly Ticket Sales Overview" />
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
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
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
                    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader title="Ticket Type Distribution" />
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
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {ticketTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <NoDataOverlay message="No ticket type distribution data available. Tickets might not have been sold yet or ticket types have no sales." />
                        )}
                    </Paper>
                </Grid>

                {/* Upcoming Events List */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <CardHeader title="My Events" />
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            <List>
                                {upcomingEvents.map((event) => (
                                    <Box key={event.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" component="div">
                                                        {event.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {event.date}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {event.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/organizer/my-events/${event.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <NoDataOverlay message="No upcoming events to display. Start by creating a new event!" />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="text" onClick={() => navigate('/organizer/my-events')}>View All Events</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
