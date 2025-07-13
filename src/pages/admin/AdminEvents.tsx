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
    Collapse,
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

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// In a real application, this data would come from Firestore or your backend.

const dummyEvents = [
    {
        id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1',
        startDate: '2025-09-10T09:00:00Z', // Future event
        endDate: '2025-09-12T17:00:00Z',
        location: 'Convention Center',
        description: 'A summit for the brightest minds in technology.',
        ticketsSold: 1250,
        totalTickets: 2000,
        revenue: 75000,
        imageUrl: 'https://placehold.co/400x200/ADD8E6/000000?text=Tech+Summit',
    },
    {
        id: 'evt-002',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        startDate: '2025-10-22T18:00:00Z', // Future event
        endDate: '2025-10-22T23:00:00Z',
        location: 'Grand Ballroom',
        description: 'An evening of elegance for a noble cause.',
        ticketsSold: 800,
        totalTickets: 800, // Sold out
        revenue: 120000,
        imageUrl: 'https://placehold.co/400x200/F08080/FFFFFF?text=Charity+Gala',
    },
    {
        id: 'evt-003',
        name: 'Local Food Festival',
        organizerId: 'organizer-1',
        startDate: '2025-06-15T10:00:00Z', // Ended in the past
        endDate: '2025-06-16T18:00:00Z',
        location: 'City Park',
        description: 'Taste the best local delicacies.',
        ticketsSold: 3000,
        totalTickets: 3000,
        revenue: 45000,
        imageUrl: 'https://placehold.co/400x200/90EE90/000000?text=Food+Festival',
    },
    {
        id: 'evt-004',
        name: 'Winter Wonderland Market',
        organizerId: 'organizer-1',
        startDate: '2025-12-05T10:00:00Z', // Future event
        endDate: '2025-12-07T20:00:00Z',
        location: 'Winter Fairgrounds',
        description: 'Holiday shopping and festivities.',
        ticketsSold: 150,
        totalTickets: 1000,
        revenue: 7500,
        imageUrl: 'https://placehold.co/400x200/ADD8E6/000000?text=Winter+Market',
    },
    {
        id: 'evt-005',
        name: 'Spring Art Exhibition',
        organizerId: 'organizer-1',
        startDate: '2025-05-01T10:00:00Z', // Ended in the past
        endDate: '2025-05-05T17:00:00Z',
        location: 'Art Gallery Downtown',
        description: 'Showcasing local artistic talent.',
        ticketsSold: 500,
        totalTickets: 500,
        revenue: 25000,
        imageUrl: 'https://placehold.co/400x200/E6E6FA/000000?text=Art+Exhibition',
    },
    {
        id: 'evt-006',
        name: 'Summer Marathon',
        organizerId: 'organizer-1',
        startDate: '2025-07-28T07:00:00Z', // Current selling (ends in future)
        endDate: '2025-07-28T12:00:00Z',
        location: 'Riverside Path',
        description: 'Challenge yourself with our annual summer marathon.',
        ticketsSold: 700,
        totalTickets: 1000,
        revenue: 35000,
        imageUrl: 'https://placehold.co/400x200/FFD700/000000?text=Summer+Marathon',
    },
    {
        id: 'evt-007',
        name: 'Community Clean-up Day',
        organizerId: 'organizer-2', // Event by another organizer (won't show for current admin)
        startDate: '2025-08-01T09:00:00Z',
        endDate: '2025-08-01T14:00:00Z',
        location: 'City Park',
        description: 'Help make our city cleaner.',
        ticketsSold: 0,
        totalTickets: 50,
        revenue: 0,
        imageUrl: 'https://placehold.co/400x200/D3D3D3/000000?text=Clean-up+Day',
    },
];

// Current organizer ID (from your authentication context in a real app)
const currentOrganizerId = 'organizer-1';

// Simulate fetching events
const fetchOrganizerEvents = (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const now = new Date();
            const filteredEvents = dummyEvents.filter(event => event.organizerId === organizerId);
            const currentSelling = [];
            const ended = [];

            filteredEvents.forEach(event => {
                const endDate = new Date(event.endDate);
                const startDate = new Date(event.startDate);

                // An event is 'current selling' if its end date is in the future
                // or if it's ongoing (start date <= now and end date >= now)
                if (endDate > now) {
                    currentSelling.push(event);
                } else {
                    ended.push(event);
                }
            });
            resolve({ currentSelling, ended });
        }, 500); // Simulate network delay
    });
};

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
    border: `1px solid ${theme.palette.divider}`, // Added a border for visibility
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
    const [currentSellingEvents, setCurrentSellingEvents] = useState([]);
    const [endedEvents, setEndedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const { currentSelling, ended } = await fetchOrganizerEvents(currentOrganizerId);
                setCurrentSellingEvents(currentSelling);
                setEndedEvents(ended);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getEvents();
    }, []);

    // Filter events based on search term
    const filterEvents = (events) => {
        if (!searchTerm) return events;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return events.filter(event =>
            event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.location.toLowerCase().includes(lowerCaseSearchTerm) ||
            event.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const handleCreateEventClick = () => {
        navigate('/admin/create-event'); // Navigate to the Create Event page
    };

    const handleViewDetails = (eventId) => {
        navigate(`/admin/my-events/${eventId}`); // Navigate to the Event Details page
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 , minHeight: '100vh', height: 'auto'}}>
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

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading events...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}

            {!loading && !error && (
                <>
                    {/* Current Selling Events Section */}
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        <EventAvailableIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Current & Upcoming Events
                    </Typography>
                    <Grid container spacing={3}>
                        {filterEvents(currentSellingEvents).length > 0 ? (
                            filterEvents(currentSellingEvents).map((event) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                            },
                                        }}
                                        onClick={() => handleViewDetails(event.id)}
                                    >
                                        <Box sx={{ height: 180, overflow: 'hidden' }}>
                                            <img
                                                src={event.imageUrl}
                                                alt={event.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/E0E0E0/000000?text=No+Image"; }} // Fallback image
                                            />
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {event.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} /> {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} /> {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} /> {event.location}
                                            </Typography>
                                            <Typography variant="body1" color="primary">
                                                <SellIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} /> Tickets Sold: {event.ticketsSold}/{event.totalTickets}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(event.id); }}>
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    No current or upcoming events found.
                                </Alert>
                            </Grid>
                        )}
                    </Grid>

                    {/* Events That Have Ended Section */}
                    <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
                        <EventBusyIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Events That Have Ended
                    </Typography>
                    <Grid container spacing={3}>
                        {filterEvents(endedEvents).length > 0 ? (
                            filterEvents(endedEvents).map((event) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                                    <Card
                                        elevation={1} // Slightly less elevation for ended events
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            opacity: 0.8, // Slightly faded for ended events
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                            },
                                        }}
                                        onClick={() => handleViewDetails(event.id)}
                                    >
                                        <Box sx={{ height: 180, overflow: 'hidden' }}>
                                            <img
                                                src={event.imageUrl}
                                                alt={event.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/E0E0E0/000000?text=No+Image"; }} // Fallback image
                                            />
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {event.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} /> {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} /> {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} /> {event.location}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                <SellIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} /> Tickets Sold: {event.ticketsSold}/{event.totalTickets}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(event.id); }}>
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    No ended events found.
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
        </Box>
    );
};