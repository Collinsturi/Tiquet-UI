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

// Dummy data for demonstration
const totalEvents = 15;
const upcomingEvents = 5;
const totalTicketsSold = 1250;
const totalRevenue = 75000; // USD

const salesData = [
    { month: 'Jan', tickets: 200 },
    { month: 'Feb', tickets: 250 },
    { month: 'Mar', tickets: 300 },
    { month: 'Apr', tickets: 280 },
    { month: 'May', tickets: 350 },
    { month: 'Jun', tickets: 400 },
];

// const ticketTypeData = [
//     { name: 'Standard', value: 400 },
//     { name: 'VIP', value: 250 },
//     { name: 'Early Bird', value: 150 },
//     { name: 'Student', value: 50 },
// ];


// Colors for the Pie Chart slices (matching Material-UI palette somewhat)
const PIE_COLORS = ['#1976d2', '#ff9800', '#4caf50', '#9c27b0']; // Example: Primary, Orange, Green, Purple

const recentActivities = [
    "Sold 5 'Concert Live' tickets.",
    "New event 'Tech Summit 2025' created.",
    "Received payout for 'Art Exhibition' ($1,200).",
    "Customer 'Alice Smith' refunded ticket for 'Comedy Night'.",
    "Updated 'Festival Vibes' event details.",
];

const upcomingEventsList = [
    {
        id: 1,
        name: 'Summer Music Festival',
        date: '2025-07-20',
        time: '18:00',
        location: 'Central Park',
        ticketsSold: 120,
        totalTickets: 500,
    },
    {
        id: 2,
        name: 'Startup Pitch Day',
        date: '2025-08-05',
        time: '10:00',
        location: 'Innovation Hub',
        ticketsSold: 45,
        totalTickets: 100,
    },
    {
        id: 3,
        name: 'Community Art Fair',
        date: '2025-08-15',
        time: '14:00',
        location: 'Old Town Square',
        ticketsSold: 80,
        totalTickets: 200,
    },
];

export const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);
    const { data, isLoading, isError } = useGetAdminDashboardSummaryQuery(user.email);

    const {
        totalEvents = 0,
        totalTicketsSold = 0,
        totalRevenue = 0,
        upcomingEvents = [],
        recentActivity = [],
        monthlySales = [],
        ticketTypeDistribution = [],
    } = data ?? {};

    const salesData = monthlySales.map((item) => ({
        month: new Date(item.month).toLocaleString('default', { month: 'short' }),
        tickets: item.ticket_count,
    }));

    const ticketTypeData = ticketTypeDistribution.map((item) => ({
        name: item.ticketType,
        value: item.sold,
    }));



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

            ---

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                        <CardHeader title="Recent Activity" />
                        <List>
                            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                                <Box key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Buyer ${activity.buyerId} purchased ticket #${activity.ticketId} for "${activity.eventTitle}"`}
                                            secondary={new Date(activity.createdAt).toLocaleString()}
                                        />
                                    </ListItem>
                                    {index < recentActivity.length - 1 && <Divider component="li" />}
                                </Box>
                            )) : (
                                <ListItem><ListItemText primary="No recent activity." /></ListItem>
                            )}
                        </List>
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
                                onClick={() => navigate('/admin/create-event')}
                            >
                                Create New Event
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<SellIcon />}
                                sx={{ mb: 2, width: '80%' }}
                                onClick={() => navigate('/admin/my-events')}
                            >
                                Manage My Events
                            </Button>
                            <Button
                                variant="outlined"
                                color="info"
                                startIcon={<PeopleIcon />}
                                sx={{ width: '80%' }}
                                onClick={() => navigate('/admin/attendees')}
                            >
                                View Attendees
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sales Overview Chart (Recharts) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <CardHeader title="Monthly Ticket Sales Overview" />
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
                    </Paper>
                </Grid>

                {/* Ticket Type Distribution Chart (Recharts) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <CardHeader title="Ticket Type Distribution" />
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
                    </Paper>
                </Grid>

                ---

                {/* Upcoming Events List */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        {/* Upcoming Events List */}
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <CardHeader title="Your Upcoming Events" />
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
                                                    onClick={() => navigate(`/admin/my-events/${event.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </ListItem>
                                            <Divider component="li" sx={{ my: 1 }} />
                                        </Box>
                                    ))}
                                </List>
                                <Box sx={{ mt: 2, textAlign: 'right' }}>
                                    <Button variant="text" onClick={() => navigate('/admin/my-events')}>View All Events</Button>
                                </Box>
                            </Paper>
                        </Grid>
                        {/*<Box sx={{ mt: 2, textAlign: 'right' }}>*/}
                        {/*    <Button variant="text" onClick={() => navigate('/admin/my-events')}>View All Events</Button>*/}
                        {/*</Box>*/}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};