import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    CircularProgress,
    Alert,
    Card,
    Chip,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useGetTicketsUserQuery } from '../../queries/eventAttendees/TicketQuery.ts';
import { useNavigate } from 'react-router-dom';

// --- Type Definitions ---

// Define the structure of a Ticket as it comes from the API
interface Ticket {
    id: number; // Changed from string to number to match actual API response
    uniqueCode: string;
    isScanned: boolean;
    // Add any other properties of the raw ticket object here
}

// Define the structure of an Event as it comes from the API
interface Event {
    id: string; // Assuming 'id' is the unique identifier for an event
    title: string;
    eventDate: string; // e.g., "YYYY-MM-DD"
    eventTime: string; // e.g., "HH:MM:SS"
    posterImageUrl?: string; // Optional, as you provide a fallback
    VenueId?: string; // Optional, or specify its actual type if always present
    // Add any other properties of the raw event object here
}

// Define the structure of a TicketType as it comes from the API
interface TicketType {
    id: string; // Assuming 'id' is the unique identifier for a ticket type
    typeName: string;
    // Add any other properties of the raw ticket type object here
}

// Define the structure of an item in the `ticketsData` array from RTK Query
interface TicketApiResponseItem {
    ticket: Ticket;
    event: Event;
    ticketType: TicketType;
}

// Define the structure of a processed ticket, combining data for display
interface ProcessedTicket extends Ticket {
    checkInStatus: 'Checked In' | 'Pending Check-in';
    ticketTypeName: string;
    quantity: number; // Assuming 1 per entry, but good to be explicit
    eventDetails: {
        id: string;
        title: string;
        posterImageUrl: string;
        startDate: string; // Combined date-time string
        endDate: string;   // Combined date-time string (or actual end date if different)
        VenueId?: string;
    };
}

// --- Helper Functions ---
const generateQRCodePlaceholderUrl = (data: string): string => {
    const size = 150;
    const color = '000000';
    const bgColor = 'FFFFFF';
    return `https://placehold.co/${size}x${size}/${bgColor}/${color}?text=QR+Code%0A${encodeURIComponent(data.substring(0, 30))}...`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const optionsDate: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

    return `${formattedDate} ${formattedTime}`;
};

const formatOnlyDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const optionsDate: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, optionsDate);
};

export const Dashboard = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id;
    const navigate = useNavigate();

    // Type the data property of the RTK Query hook
    const { data: ticketsData, isLoading, error } = useGetTicketsUserQuery(userId!, {
        skip: !userId,
    }) as { data?: TicketApiResponseItem[]; isLoading: boolean; error?: unknown };

    // Type the state variables to hold arrays of ProcessedTicket
    const [upcomingTickets, setUpcomingTickets] = useState<ProcessedTicket[]>([]);
    const [pastTickets, setPastTickets] = useState<ProcessedTicket[]>([]);
    const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });

    useEffect(() => {
        if (!userId) {
            setMessage({ type: "error", text: "User not found. Please log in." });
            setUpcomingTickets([]);
            setPastTickets([]);
            return;
        }

        if (isLoading) {
            return; // Handled by the main return's CircularProgress
        }

        if (error) {
            // Type assertion for the error object from RTK Query
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

        // Ensure ticketsData is an array before processing
        if (ticketsData && Array.isArray(ticketsData)) {
            if (ticketsData.length === 0) {
                setMessage({ type: "info", text: "You currently have no tickets. Explore events and purchase your first ticket!" });
                setUpcomingTickets([]);
                setPastTickets([]);
                return;
            }

            const now = new Date();
            const upcoming: ProcessedTicket[] = []; // Explicitly type arrays
            const past: ProcessedTicket[] = [];

            ticketsData.forEach((item: TicketApiResponseItem) => { // Explicitly type 'item'
                const ticket = item.ticket;
                const event = item.event;
                const ticketType = item.ticketType;

                const checkInStatus: 'Checked In' | 'Pending Check-in' = ticket.isScanned ? 'Checked In' : 'Pending Check-in';

                const eventDateTimeString = `${event.eventDate}T${event.eventTime}`;
                const eventDateObj = new Date(eventDateTimeString);

                const posterImageUrl = event.posterImageUrl || `https://placehold.co/400x200/E0E0E0/000000?text=Event+Poster`;

                const ticketWithEvent: ProcessedTicket = { // Explicitly type the new object
                    ...ticket,
                    checkInStatus: checkInStatus,
                    ticketTypeName: ticketType?.typeName || 'General Ticket',
                    quantity: 1, // Assuming quantity is 1 per unique ticket entry
                    eventDetails: {
                        id: event.id, // Ensure event ID is part of eventDetails
                        title: event.title,
                        posterImageUrl: posterImageUrl,
                        startDate: eventDateTimeString,
                        endDate: eventDateTimeString,
                        VenueId: event.VenueId,
                    }
                };

                if (now < eventDateObj) {
                    upcoming.push(ticketWithEvent);
                } else {
                    past.push(ticketWithEvent);
                }
            });

            // Sort tickets - ensure the comparison function is correctly typed
            upcoming.sort(
                (a, b) =>
                    new Date(a.eventDetails.startDate).getTime() -
                    new Date(b.eventDetails.startDate).getTime()
            );

            past.sort(
                (a, b) =>
                    new Date(b.eventDetails.startDate).getTime() -
                    new Date(a.eventDetails.startDate).getTime()
            );

            setUpcomingTickets(upcoming);
            setPastTickets(past);

            if (upcoming.length === 0 && past.length === 0) {
                setMessage({ type: "info", text: "No valid tickets could be displayed. You might have no upcoming or past events." });
            } else {
                setMessage({ type: "", text: "" });
            }
        }
    }, [ticketsData, userId, isLoading, error]); // Add all relevant dependencies

    const handleViewTicketDetails = (ticketId: number) => { // Changed from string to number
        navigate(`/attendee/tickets/${ticketId}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading your tickets...</Typography>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    User not found. Please log in to view your dashboard.
                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/login')}>Go to Login</Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Welcome, {`${user.first_name} ${user.last_name}`}!
            </Typography>

            {message.text && (
                <Alert severity={message.type === 'info' ? 'info' : 'error'} sx={{ mb: 2 }}>
                    {message.text}
                    {message.type === 'info' && (
                        <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/attendee/events')}>Browse Events</Button>
                    )}
                </Alert>
            )}

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <TicketIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                            <Typography variant="h6" color="text.secondary">Total Tickets</Typography>
                            <Typography variant="h4" color="primary">{upcomingTickets.length + pastTickets.length}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <EventIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                            <Typography variant="h6" color="text.secondary">Upcoming Events</Typography>
                            <Typography variant="h4" color="success">{upcomingTickets.length}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                            <Typography variant="h6" color="text.secondary">Past Events</Typography>
                            <Typography variant="h4" color="info">{pastTickets.length}</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon /> My Upcoming Tickets
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
                                            <TicketIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName || 'Ticket Type'} (x{ticket.quantity || 1})
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
                                        <Button variant="outlined" size="small" sx={{ ml: 1 }} onClick={() => handleViewTicketDetails(ticket.id)}>View Ticket</Button>
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
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon /> My Past Events
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    {pastTickets.length > 0 ? (
                        pastTickets.map(ticket => (
                            <Grid item xs={12} md={6} key={ticket.id}>
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1, opacity: 0.8 }}>
                                    <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={ticket.eventDetails.posterImageUrl}
                                            alt={`Event Poster for ${ticket.eventDetails.title}`}
                                            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px' }}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "https://placehold.co/120x120/E0E0E0/000000?text=Event";
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div">{ticket.eventDetails.title}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            <TicketIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName || 'Ticket Type'} (x{ticket.quantity || 1})
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
                                        <Button variant="text"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleViewTicketDetails(ticket.id)}
                                        >View Details</Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">You haven't attended any past events yet.</Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
};