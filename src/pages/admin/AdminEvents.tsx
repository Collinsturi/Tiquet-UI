import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardActions,
    InputBase,
    IconButton,
    CircularProgress,
    Alert,
    Tab, // Added Tab and Tabs for categorization
    Tabs,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SellIcon from '@mui/icons-material/Sell';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

// REMOVED: RTK Query imports, as we're using placeholders for now
// Keeping types if they are still useful for structuring dummy data
// import { OrganizerEventDetails } from '../../queries/general/EventQuery.ts';


// --- Placeholder Data Structure mimicking backend response ---
// This data will act as if it came from your RTK Queries
const placeholderUpcomingEvents: any[] = [ // Use 'any[]' for flexibility with placeholder
    {
        "eventId": 4,
        "title": "Future Tech Expo",
        "eventDate": "2025-10-20",
        "eventTime": "09:00:00",
        "category": "Technology",
        "venueName": "Innovation Hub",
        "venueAddress": "101 Future Rd, Nairobi",
        "ticketsSold": 50,
        "ticketsScanned": 0,
        "attendanceRate": 0.00
    },
    {
        "eventId": 5,
        "title": "Next Gen Music Festival",
        "eventDate": "2025-11-05",
        "eventTime": "14:00:00",
        "category": "Music",
        "venueName": "Open Air Arena",
        "venueAddress": "202 Festival Grounds, Kisumu",
        "ticketsSold": 150,
        "ticketsScanned": 0,
        "attendanceRate": 0.00
    }
];

const placeholderCurrentEvents: any[] = [
    {
        "eventId": 6,
        "title": "Art & Culture Fair",
        "eventDate": "2025-07-21", // Today's date (relative to the context)
        "eventTime": "10:00:00", // Has already started
        "category": "Arts",
        "venueName": "City Exhibition Hall",
        "venueAddress": "303 Culture Ave, Mombasa",
        "ticketsSold": 200,
        "ticketsScanned": 50,
        "attendanceRate": 25.00
    }
];

const placeholderPastEvents: any[] = [
    {
        "eventId": 3,
        "title": "Local Food Festival",
        "eventDate": "2024-07-01",
        "eventTime": "11:00:00",
        "category": "Food & Drink",
        "venueName": "Outdoor Amphitheater",
        "venueAddress": "300 Green Park, Kisumu",
        "ticketsSold": 4180,
        "ticketsScanned": 4,
        "attendanceRate": 0.10
    },
    {
        "eventId": 2,
        "title": "Jazz Fusion Night",
        "eventDate": "2024-06-20",
        "eventTime": "19:30:00",
        "category": "Music",
        "venueName": "City Auditorium",
        "venueAddress": "200 Performance Blvd, Mombasa",
        "ticketsSold": 1060,
        "ticketsScanned": 2,
        "attendanceRate": 0.19
    },
    {
        "eventId": 1,
        "title": "Tech Innovators Summit 2024",
        "eventDate": "2024-05-15",
        "eventTime": "09:00:00",
        "category": "Technology",
        "venueName": "Grand Convention Center",
        "venueAddress": "100 Exhibition Way, Nairobi",
        "ticketsSold": 2096,
        "ticketsScanned": 4,
        "attendanceRate": 0.19
    }
];


// Styled Search Bar (reused from AdminLayout)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    border: `1px solid ${theme.palette.divider}`,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export const AdminEvents = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'current' | 'past'>('upcoming');

    // Simulate loading states without actual RTK Query
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = useSelector((state: RootState) => state.user.user);
    // const organizerEmail = user.email; // We won't use this directly for placeholder data

    // Simulate data fetching with useEffect and dummy data
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        // Simulate a network delay
        const timer = setTimeout(() => {
            // No actual API calls, just "load" the placeholder data
            setIsLoading(false);
        }, 500); // Adjust delay as needed

        return () => clearTimeout(timer); // Cleanup timer
    }, [selectedTab]); // Re-run effect when tab changes

    // Determine which events to display based on the selected tab
    let eventsToDisplay: any[] = []; // Use 'any[]' for placeholder
    if (selectedTab === 'upcoming') {
        eventsToDisplay = placeholderUpcomingEvents;
    } else if (selectedTab === 'current') {
        eventsToDisplay = placeholderCurrentEvents;
    } else if (selectedTab === 'past') {
        eventsToDisplay = placeholderPastEvents;
    }


    // Filter events based on search term
    const filterEvents = (events: any[]) => { // Use 'any[]' for placeholder
        if (!searchTerm) return events;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return events.filter(event =>
            event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.venueName.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.venueAddress.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const handleCreateEventClick = () => {
        navigate('/admin/create-event');
    };

    const handleViewDetails = (eventId: number) => {
        navigate(`/admin/my-events/${eventId}`);
    };

    // Helper to format dates (assuming backend returns "YYYY-MM-DD")
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            console.error("Invalid date string:", dateString);
            return dateString;
        }
    };

    const formatTime = (timeString: string) => { // Assuming backend returns "HH:MM:SS"
        if (!timeString) return '';
        try {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const dummyDate = new Date();
            dummyDate.setHours(hours, minutes, seconds || 0);
            return dummyDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            console.error("Invalid time string:", timeString);
            return timeString;
        }
    };


    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', height: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom component="h1">
                    My Events
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search events..."
                            inputProps={{ 'aria-label': 'search events' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Search>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateEventClick}
                    >
                        Create New Event
                    </Button>
                </Box>
            </Box>

            {/* Tabs for Event Categories */}
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Upcoming Events" value="upcoming" icon={<EventAvailableIcon />} iconPosition="start" />
                <Tab label="Current Events" value="current" icon={<EventAvailableIcon />} iconPosition="start" />
                <Tab label="Past Events" value="past" icon={<EventBusyIcon />} iconPosition="start" />
            </Tabs>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading events...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error || "Failed to load events. Please try again later."}</Alert>
            )}

            {!isLoading && !error && (
                <Grid container spacing={3}>
                    {filterEvents(eventsToDisplay).length > 0 ? (
                        filterEvents(eventsToDisplay).map((event) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={event.eventId}>
                                <Card
                                    elevation={selectedTab === 'past' ? 1 : 3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        opacity: selectedTab === 'past' ? 0.8 : 1,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                        },
                                    }}
                                    onClick={() => handleViewDetails(event.eventId)}
                                >
                                    <Box sx={{ height: 180, overflow: 'hidden' }}>
                                        <img
                                            src={`https://via.placeholder.com/400x200?text=${encodeURIComponent(event.title)}`}
                                            alt={event.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x200/E0E0E0/000000?text=No+Image"; }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} /> {formatDate(event.eventDate)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} /> {formatTime(event.eventTime)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} /> {event.venueName}, {event.venueAddress}
                                        </Typography>
                                        <Typography variant="body1" color="primary">
                                            <SellIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} /> Tickets Sold: {event.ticketsSold}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Tickets Scanned: {event.ticketsScanned}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Attendance Rate: {event.attendanceRate}%
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(event.eventId); }}>
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No {selectedTab} events found.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};