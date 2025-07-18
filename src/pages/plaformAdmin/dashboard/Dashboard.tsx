import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, purple, grey } from '@mui/material/colors';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';

// Define a custom Material-UI theme for consistent styling
const theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
        secondary: {
            main: green[500],
        },
        error: {
            main: red[500],
        },
        warning: {
            main: orange[500],
        },
        info: {
            main: purple[500], // Added for new users
        },
        success: {
            main: green[600], // Adjusted for new organizers
        },
        text: {
            secondary: grey[600], // Adjusted for site traffic
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif', // Use Inter font
        h4: {
            fontWeight: 700,
            fontSize: '2rem', // Larger for main title
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#6b7280', // Tailwind gray-500
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem', // Rounded corners
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Tailwind shadow-md
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem', // Rounded corners
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Tailwind shadow-md
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem', // Rounded corners for buttons
                    textTransform: 'none', // Prevent uppercase text
                },
            },
        },
    },
});

// Sample Data for Dashboard
const kpis = [
    { title: 'Total Revenue', value: '$1,234,567', trend: '+12% from last month', color: 'primary.main' },
    { title: 'Tickets Sold', value: '87,654', trend: '+8% from last month', color: 'secondary.main' },
    { title: 'Active Events', value: '1,230', trend: 'Currently Running', color: 'warning.main' },
    { title: 'New Users', value: '567', trend: '+15% this week', color: 'info.main' },
    { title: 'New Organizers', value: '45', trend: '+10% this week', color: 'success.main' },
    { title: 'Site Traffic', value: '250,000', trend: '+5% daily average', color: 'text.secondary' },
];

const recentActivities = [
    { id: 1, type: 'Organizer Registration', description: 'New organizer "EventMasters" awaiting approval.', time: '2 minutes ago' },
    { id: 2, type: 'Payout Processed', description: 'Payout of $5,000 processed for "Music Fest 2024".', time: '1 hour ago' },
    { id: 3, type: 'System Error', description: 'Critical database connection error detected.', time: '3 hours ago' },
    { id: 4, type: 'Event Cancellation', description: '"Summer Art Fair" cancelled by organizer.', time: 'Yesterday' },
    { id: 5, type: 'Admin Action', description: 'User "John Doe" account suspended by admin.', time: '2 days ago' },
    { id: 6, type: 'Organizer Registration', description: 'New organizer "TechCon Events" awaiting approval.', time: '3 days ago' },
    { id: 7, type: 'Payout Processed', description: 'Payout of $1,500 processed for "Local Market".', time: '4 days ago' },
];

const topCategories = [
    { name: 'Music Concerts', sales: '35,000 tickets' },
    { name: 'Sports Events', sales: '28,000 tickets' },
    { name: 'Art & Culture', sales: '15,000 tickets' },
    { name: 'Workshops & Classes', sales: '10,000 tickets' },
];

const topEvents = [
    { name: 'Global Music Fest 2025', revenue: '$500,000', tickets: '20,000' },
    { name: 'Annual Tech Summit', revenue: '$300,000', tickets: '10,000' },
    { name: 'City Marathon', revenue: '$150,000', tickets: '8,000' },
];

const pendingOrganizers = [
    { id: 1, name: 'Creative Minds Agency', date: '2025-07-01' },
    { id: 2, name: 'Local Community Events', date: '2025-06-28' },
    { id: 3, name: 'Digital Innovators Inc.', date: '2025-06-25' },
];

export const PlatformDashboard = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">

                {/* Overview & analytics Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Overview & Analytics
                    </Typography>
                    <Grid container spacing={4}>
                        {kpis.map((kpi, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card className="h-full flex flex-col justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent>
                                        <Typography variant="h6" component="div" className="text-gray-600 mb-2">
                                            {kpi.title}
                                        </Typography>
                                        <Typography variant="h4" component="div" sx={{ color: kpi.color }} className="font-extrabold mb-2">
                                            {kpi.value}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {kpi.trend}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Event Performance Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Event Performance
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card className="h-full p-4 bg-white rounded-xl shadow-lg">
                                <CardContent>
                                    <Typography variant="h6" className="mb-3 flex items-center">
                                        <CategoryIcon className="mr-2" color="primary" /> Top Performing Categories
                                    </Typography>
                                    <List dense>
                                        {topCategories.map((category, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem className="py-2">
                                                    <ListItemText
                                                        primary={<Typography variant="body1" className="font-medium">{category.name}</Typography>}
                                                        secondary={<Typography variant="body2" color="text.secondary">{category.sales}</Typography>}
                                                    />
                                                </ListItem>
                                                {index < topCategories.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                    <Box className="mt-4 text-right">
                                        <Button variant="outlined" color="primary">
                                            View All Categories
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card className="h-full p-4 bg-white rounded-xl shadow-lg">
                                <CardContent>
                                    <Typography variant="h6" className="mb-3 flex items-center">
                                        <EventIcon className="mr-2" color="secondary" /> Top Performing Events
                                    </Typography>
                                    <List dense>
                                        {topEvents.map((event, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem className="py-2">
                                                    <ListItemText
                                                        primary={<Typography variant="body1" className="font-medium">{event.name}</Typography>}
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary">
                                                                Revenue: {event.revenue} | Tickets: {event.tickets}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < topEvents.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                    <Box className="mt-4 text-right">
                                        <Button variant="outlined" color="secondary">
                                            View All Events
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Management Overviews Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Management Overviews
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card className="h-full p-4 bg-white rounded-xl shadow-lg">
                                <CardContent>
                                    <Typography variant="h6" className="mb-3 flex items-center">
                                        <CheckCircleOutlineIcon className="mr-2" color="warning" /> Pending Organizer Approvals
                                    </Typography>
                                    <List dense>
                                        {pendingOrganizers.map((organizer, index) => (
                                            <React.Fragment key={organizer.id}>
                                                <ListItem className="py-2">
                                                    <ListItemText
                                                        primary={<Typography variant="body1" className="font-medium">{organizer.name}</Typography>}
                                                        secondary={<Typography variant="body2" color="text.secondary">Registered: {organizer.date}</Typography>}
                                                    />
                                                    <Button size="small" variant="contained" color="primary" className="ml-4">
                                                        Review
                                                    </Button>
                                                </ListItem>
                                                {index < pendingOrganizers.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                    <Box className="mt-4 text-right">
                                        <Button variant="outlined" color="warning">
                                            View All Pending
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card className="h-full p-4 bg-white rounded-xl shadow-lg">
                                <CardContent>
                                    <Typography variant="h6" className="mb-3 flex items-center">
                                        <PersonAddIcon className="mr-2" color="info" /> Quick Links
                                    </Typography>
                                    <Box className="flex flex-col space-y-3">
                                        <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}>
                                            Manage Users
                                        </Button>
                                        <Button variant="contained" color="secondary" startIcon={<EventIcon />}>
                                            Manage Events
                                        </Button>
                                        <Button variant="contained" color="warning" startIcon={<CheckCircleOutlineIcon />}>
                                            Manage Organizers
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Recent Activity Log Section */}
                <Box>
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Recent Activity Log
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <List>
                            {recentActivities.map((activity, index) => (
                                <React.Fragment key={activity.id}>
                                    <ListItem alignItems="flex-start" className="py-3">
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="subtitle1"
                                                    className="font-semibold text-gray-800"
                                                >
                                                    {activity.type}
                                                </Typography>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className="inline text-gray-600"
                                                    >
                                                        {activity.description}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        className="text-gray-500"
                                                    >
                                                        {activity.time}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    {index < recentActivities.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PlatformDashboard; // Export as default for easier use in other files
