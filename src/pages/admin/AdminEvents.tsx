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
    Tab,
    Tabs,
    useTheme // Keep useTheme hook for other MUI components if needed, though direct palette access will be removed
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
import { styled, alpha } from '@mui/material/styles'; // alpha will be removed for direct CSS var usage
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

// --- START: Uncomment and import RTK Query hooks and types ---
import {
    useGetDetailedUpcomingOrganizerEventsQuery,
    useGetDetailedCurrentOrganizerEventsQuery,
    useGetDetailedPastOrganizerEventsQuery,
    type OrganizerEventDetails // Import the type for better type safety
} from '../../queries/general/EventQuery.ts';
// --- END: Uncomment and import RTK Query hooks and types ---


// Styled Search Bar (reused from AdminLayout)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    // Using direct CSS variables for background and hover
    backgroundColor: 'var(--color-my-base-100)', // Equivalent to theme.palette.background.paper
    '&:hover': {
        backgroundColor: 'var(--color-my-base-200)', // A slightly darker base for hover
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    border: `1px solid var(--color-my-base-300)`, // Using base-300 for divider
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-my-base-content)', // Themed color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'var(--color-my-base-content)', // Themed color
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
    const theme = useTheme(); // Keep useTheme hook for spacing, breakpoints, etc.
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'current' | 'past'>('upcoming');

    const user = useSelector((state: RootState) => state.user.user);
    const organizerEmail = user?.email; // Safely get the email

    // --- START: Use RTK Query hooks ---
    // Pass organizerEmail if it exists, otherwise skip query
    const {
        data: upcomingEvents = [], // Default to empty array
        isLoading: isLoadingUpcoming,
        isError: isErrorUpcoming,
        error: errorUpcoming
    } = useGetDetailedUpcomingOrganizerEventsQuery(organizerEmail!, {
        skip: !organizerEmail, // Skip query if email is not available
    });

    const {
        data: currentEvents = [],
        isLoading: isLoadingCurrent,
        isError: isErrorCurrent,
        error: errorCurrent
    } = useGetDetailedCurrentOrganizerEventsQuery(organizerEmail!, {
        skip: !organizerEmail,
    });

    const {
        data: pastEvents = [],
        isLoading: isLoadingPast,
        isError: isErrorPast,
        error: errorPast
    } = useGetDetailedPastOrganizerEventsQuery(organizerEmail!, {
        skip: !organizerEmail,
    });
    // --- END: Use RTK Query hooks ---


    // Determine which events to display based on the selected tab
    // Now directly use the data from RTK Query hooks
    let eventsToDisplay: OrganizerEventDetails[] = [];
    let currentIsLoading = false;
    let currentError: string | null = null;

    if (selectedTab === 'upcoming') {
        eventsToDisplay = upcomingEvents;
        currentIsLoading = isLoadingUpcoming;
        currentError = isErrorUpcoming ? (errorUpcoming as any)?.data?.message || 'Failed to load upcoming events.' : null;
    } else if (selectedTab === 'current') {
        eventsToDisplay = currentEvents;
        currentIsLoading = isLoadingCurrent;
        currentError = isErrorCurrent ? (errorCurrent as any)?.data?.message || 'Failed to load current events.' : null;
    } else if (selectedTab === 'past') {
        eventsToDisplay = pastEvents;
        currentIsLoading = isLoadingPast;
        currentError = isErrorPast ? (errorPast as any)?.data?.message || 'Failed to load past events.' : null;
    }

    // Filter events based on search term
    const filterEvents = (events: OrganizerEventDetails[]) => {
        if (!searchTerm) return events;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return events.filter(event =>
            event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            (event.venueName && event.venueName.toLowerCase().includes(lowerCaseSearchTerm)) || // Check for null/undefined
            (event.venueAddress && event.venueAddress.toLowerCase().includes(lowerCaseSearchTerm)) || // Check for null/undefined
            event.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const handleCreateEventClick = () => {
        navigate('/organizer/create-event');
    };

    const handleViewDetails = (eventId: number) => {
        navigate(`/organizer/my-events/${eventId}`);
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
        <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', height: 'auto', backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom component="h1" sx={{ color: 'var(--color-my-primary)' }}>
                    My Events
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Search sx={{ backgroundColor: 'var(--color-my-base-100)', border: `1px solid var(--color-my-base-300)` }}>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ color: 'var(--color-my-base-content)' }}/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search events..."
                            inputProps={{ 'aria-label': 'search events' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ color: 'var(--color-my-base-content)' }}
                        />
                    </Search>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateEventClick}
                        sx={{
                            backgroundColor: 'var(--color-my-primary)',
                            color: 'var(--color-my-primary-content)',
                            '&:hover': {
                                backgroundColor: 'var(--color-my-primary-focus)',
                            }
                        }}
                    >
                        Create New Event
                    </Button>
                </Box>
            </Box>

            {/* Tabs for Event Categories */}
            <Tabs
                value={selectedTab}
                onChange={(event, newValue) => setSelectedTab(newValue)}
                sx={{
                    mb: 3,
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'var(--color-my-primary)', // Indicator color
                    },
                }}
            >
                <Tab
                    label="Upcoming Events"
                    value="upcoming"
                    icon={<EventAvailableIcon />}
                    iconPosition="start"
                    sx={{
                        color: selectedTab === 'upcoming' ? 'var(--color-my-primary)' : 'var(--color-my-base-content)',
                        '&.Mui-selected': {
                            color: 'var(--color-my-primary)',
                        },
                    }}
                />
                <Tab
                    label="Current Events"
                    value="current"
                    icon={<EventAvailableIcon />}
                    iconPosition="start"
                    sx={{
                        color: selectedTab === 'current' ? 'var(--color-my-primary)' : 'var(--color-my-base-content)',
                        '&.Mui-selected': {
                            color: 'var(--color-my-primary)',
                        },
                    }}
                />
                <Tab
                    label="Past Events"
                    value="past"
                    icon={<EventBusyIcon />}
                    iconPosition="start"
                    sx={{
                        color: selectedTab === 'past' ? 'var(--color-my-primary)' : 'var(--color-my-base-content)',
                        '&.Mui-selected': {
                            color: 'var(--color-my-primary)',
                        },
                    }}
                />
            </Tabs>

            {currentIsLoading && ( // Use currentIsLoading
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress sx={{ color: 'var(--color-my-primary)' }}/>
                    <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading events...</Typography>
                </Box>
            )}

            {currentError && ( // Use currentError
                <Alert severity="error" sx={{ mt: 2, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{currentError}</Alert>
            )}

            {!currentIsLoading && !currentError && ( // Use currentIsLoading and currentError
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
                                        backgroundColor: 'var(--color-my-base-100)', // Card background
                                        color: 'var(--color-my-base-content)', // Card text color
                                        border: `1px solid var(--color-my-base-300)` // Card border
                                    }}
                                    onClick={() => handleViewDetails(event.eventId)}
                                >
                                    <Box sx={{ height: 180, overflow: 'hidden' }}>
                                        {/* Use event.posterImageUrl if available, otherwise fallback to placeholder */}
                                        <img
                                            src={event.posterImageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(event.title)}`}
                                            alt={event.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x200/E0E0E0/000000?text=No+Image"; }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: 'var(--color-my-base-content)' }}>
                                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'var(--color-my-base-content)' }} /> {formatDate(event.eventDate)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: 'var(--color-my-base-content)' }}>
                                            <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'var(--color-my-base-content)' }} /> {formatTime(event.eventTime)}
                                        </Typography>
                                        {/* Improved venue display logic */}
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'var(--color-my-base-content)' }}>
                                            <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'var(--color-my-base-content)' }} />
                                            {event.venueName && event.venueAddress
                                                ? `${event.venueName}, ${event.venueAddress}`
                                                : event.venueName || event.venueAddress || 'Venue Not Specified'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'var(--color-my-primary)' }}>
                                            <SellIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18, color: 'var(--color-my-primary)' }} /> Tickets Sold: {event.ticketsSold}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'var(--color-my-base-content)' }}>
                                            Tickets Scanned: {event.ticketsScanned}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'var(--color-my-base-content)' }}>
                                            Attendance Rate: {event.attendanceRate}%
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={(e) => { e.stopPropagation(); handleViewDetails(event.eventId); }}
                                            sx={{ color: 'var(--color-my-secondary)' }} // Button color
                                        >
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ backgroundColor: 'var(--color-my-info)', color: 'var(--color-my-info-content)' }}>
                                No {selectedTab} events found.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};
