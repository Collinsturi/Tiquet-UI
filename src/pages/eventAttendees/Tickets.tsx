import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Card,
    Chip,
    Button,
    Divider,
    Tabs,
    Tab,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";
import {useGetTicketsUserQuery} from '../../queries/eventAttendees/TicketQuery.ts'; // Import the RTK Query hook

// Helper to generate a placeholder QR code image URL
const generateQRCodePlaceholderUrl = (data) => {
    const size = 150; // Size of the QR code image
    const color = '000000'; // Black text
    const bgColor = 'FFFFFF'; // White background
    return `https://placehold.co/${size}x${size}/${bgColor}/${color}?text=QR+Code%0A${encodeURIComponent(data.substring(0, 30))}...`;
};

// Helper function to format dates using native Date methods
const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

    return `${formattedDate} ${formattedTime}`;
};

// Helper to format only the date part
const formatOnlyDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, optionsDate);
};


export const Tickets = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id; // Get userId from Redux store

    // Use the RTK Query hook
    const { data: ticketsData, isLoading, error } = useGetTicketsUserQuery(userId!, {
        skip: !userId, // Skip the query if userId is not available
    });

    const [upcomingTickets, setUpcomingTickets] = useState([]);
    const [pastTickets, setPastTickets] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [tabValue, setTabValue] = useState(0); // 0 for Upcoming, 1 for Past

    useEffect(() => {
        if (!userId) {
            setMessage({ type: "error", text: "User not found. Please log in." });
            setUpcomingTickets([]);
            setPastTickets([]);
            return;
        }

        // Handle loading state
        if (isLoading) {
            setMessage({ type: '', text: '' }); // Clear messages while loading
            return;
        }

        // Handle error state
        if (error) {
            const apiErrorMessage = (error as any)?.data?.message;
            if (apiErrorMessage && apiErrorMessage.includes("not found")) {
                setMessage({ type: "info", text: "You currently have no tickets. Explore events and purchase your first ticket!" });
            } else {
                setMessage({ type: "error", text: apiErrorMessage || "Failed to fetch tickets. Please try again later." });
            }
            setUpcomingTickets([]);
            setPastTickets([]);
            return;
        }

        // Handle successful data fetch
        if (ticketsData && Array.isArray(ticketsData)) {
            if (ticketsData.length === 0) {
                setMessage({ type: "info", text: "You currently have no tickets. Explore events and purchase your first ticket!" });
                setUpcomingTickets([]);
                setPastTickets([]);
                return;
            }

            const now = new Date();
            const fetchedUpcomingTickets = [];
            const fetchedPastTickets = [];

            ticketsData.forEach((item) => {
                const ticket = item.ticket;
                const event = item.event;
                const ticketType = item.ticketType;

                // Derive checkInStatus from isScanned
                const checkInStatus = ticket.isScanned ? 'Checked In' : 'Pending Check-in';

                // Combine eventDate and eventTime for a robust Date object
                const eventDateTimeString = `${event.eventDate}T${event.eventTime}`;
                const eventDateObj = new Date(eventDateTimeString);

                // Add a default posterImageUrl if missing
                const posterImageUrl = event.posterImageUrl || `https://placehold.co/400x200/E0E0E0/000000?text=Event+Poster`;

                const ticketWithEvent = {
                    ...ticket,
                    checkInStatus: checkInStatus,
                    ticketTypeName: ticketType?.typeName || 'General Ticket', // Get typeName from ticketType
                    quantity: 1, // Assuming quantity is 1 per unique ticket entry
                    eventDetails: {
                        ...event,
                        posterImageUrl: posterImageUrl,
                        startDate: eventDateTimeString,
                        endDate: eventDateTimeString, // Assuming endDate is derived similarly or adjusted as per API
                    }
                };

                if (now < eventDateObj) {
                    fetchedUpcomingTickets.push(ticketWithEvent);
                } else {
                    fetchedPastTickets.push(ticketWithEvent);
                }
            });

            // Sort tickets
            fetchedUpcomingTickets.sort((a, b) => new Date(a.eventDetails.startDate).getTime() - new Date(b.eventDetails.startDate).getTime());
            fetchedPastTickets.sort((a, b) => new Date(b.eventDetails.startDate).getTime() - new Date(a.eventDetails.startDate).getTime());

            setUpcomingTickets(fetchedUpcomingTickets);
            setPastTickets(fetchedPastTickets);
            setMessage({ type: '', text: '' }); // Clear message on successful data load and categorization
        }
    }, [ticketsData, userId, isLoading, error]); // Add all relevant dependencies

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleViewTicketDetails = (ticketId) => {
        navigate(`/attendee/tickets/${ticketId}`);
    };


    if (isLoading || user === null) { // Check for user being null as well
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading your tickets...</Typography>
            </Box>
        );
    }

    // If user is null (not logged in or session expired)
    if (!user) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    User not found. Please log in to view your tickets.
                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/login')}>Go to Login</Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', height: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumberIcon fontSize="large" /> My Tickets
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {message.text && (
                <Alert severity={message.type === 'info' ? 'info' : 'error'} sx={{ mb: 3 }}>
                    {message.text}
                    {message.type === 'info' && (
                        <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/attendee/events')}>Browse Events</Button>
                    )}
                </Alert>
            )}

            <Paper elevation={2} sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="ticket categories tabs" centered>
                    <Tab label={`Upcoming (${upcomingTickets.length})`} />
                    <Tab label={`Past (${pastTickets.length})`} />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Upcoming Events</Typography>
                    <Grid container spacing={3}>
                        {upcomingTickets.length > 0 ? (
                            upcomingTickets.map(ticket => (
                                <Grid item xs={12} md={6} key={ticket.id}>
                                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1 }}>
                                        <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={generateQRCodePlaceholderUrl(ticket.uniqueCode)}
                                                alt={`QR Code for ${ticket.ticketTypeName}`}
                                                style={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: '8px' }}
                                            />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{ticket.eventDetails.title}</Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {formatDate(ticket.eventDetails.startDate)} - {formatDate(ticket.eventDetails.endDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {ticket.eventDetails.VenueId || 'Venue Not Specified'}
                                            </Typography>
                                            <Chip
                                                label={ticket.checkInStatus}
                                                color={ticket.checkInStatus === 'Checked In' ? 'success' : 'info'}
                                                icon={ticket.checkInStatus === 'Checked In' ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />}
                                                size="small"
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleViewTicketDetails(ticket.id)} // Use ticket.id
                                            >
                                                View Ticket
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Alert severity="info">You have no upcoming tickets. Explore events and purchase your first ticket!</Alert>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/attendee/events')}>Browse Events</Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Past Events</Typography>
                    <Grid container spacing={3}>
                        {pastTickets.length > 0 ? (
                            pastTickets.map(ticket => (
                                <Grid item xs={12} md={6} key={ticket.id}> {/* Use ticket.id */}
                                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1, opacity: 0.8 }}>
                                        <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={ticket.eventDetails.posterImageUrl}
                                                alt={`Event Poster for ${ticket.eventDetails.title}`}
                                                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/E0E0E0/000000?text=Event"; }}
                                            />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{ticket.eventDetails.title}</Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {formatOnlyDate(ticket.eventDetails.startDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {ticket.eventDetails.VenueId || 'Venue Not Specified'}
                                            </Typography>
                                            <Chip
                                                label={`Status: ${ticket.checkInStatus}`}
                                                color={ticket.checkInStatus === 'Checked In' ? 'success' : 'default'}
                                                size="small"
                                            />
                                            <Button
                                                variant="text"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleViewTicketDetails(ticket.id)} // Use ticket.id
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Alert severity="info">You have not attended any past events yet.</Alert>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};
