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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";
import { useGetTicketsUserQuery } from '../../queries/eventAttendees/TicketQuery.ts';
import React from 'react'; // Import React for SyntheticEvent

// --- Type Definitions ---
// Define the structure of a Ticket
interface Ticket {
    id: number;
    uniqueCode: string;
    isScanned: boolean;
    // Add other ticket properties as they exist in your API response
}

// Define the structure of an Event
interface Event {
    id: number; // Changed from string to number to match API response
    title: string;
    eventDate: string;
    eventTime: string;
    posterImageUrl?: string; // Make it optional as per your logic
    VenueId?: number; // Changed from string to number | undefined to match API response
    // Add other event properties
}

// Define the structure of a TicketType
interface TicketType {
    id: number; // Changed from string to number to match API response
    typeName: string;
    // Add other ticket type properties
}

// Define the combined structure returned by the API for each ticket entry
interface TicketApiResponse {
    ticket: Ticket;
    event: Event;
    ticketType: TicketType;
}

// Define the structure for a processed ticket with event details
interface ProcessedTicket extends Ticket {
    checkInStatus: 'Checked In' | 'Pending Check-in';
    ticketTypeName: string;
    quantity: number; // Assuming quantity is always 1 per unique ticket entry here
    eventDetails: {
        id: number; // Changed from string to number to match Event.id
        title: string;
        posterImageUrl: string;
        startDate: string;
        endDate: string;
        VenueId?: number; // Changed from string to number | undefined to match Event.VenueId
    };
}

// --- Helper Functions ---
const generateQRCodePlaceholderUrl = (data: string): string => {
    const size = 150; // Size of the QR code image
    const color = '000000'; // Black text
    const bgColor = 'FFFFFF'; // White background
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

// --- React Component ---
export const Tickets = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id; // Get userId from Redux store

    // Use the RTK Query hook with specific types for data
    const { data: ticketsData, isLoading, error } = useGetTicketsUserQuery(userId!, {
        skip: !userId,
    });

    const [upcomingTickets, setUpcomingTickets] = useState<ProcessedTicket[]>([]);
    const [pastTickets, setPastTickets] = useState<ProcessedTicket[]>([]);
    const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });
    const [tabValue, setTabValue] = useState<number>(0);

    useEffect(() => {
        if (!userId) {
            setMessage({ type: "error", text: "User not found. Please log in." });
            setUpcomingTickets([]);
            setPastTickets([]);
            return;
        }

        if (isLoading) {
            setMessage({ type: '', text: '' });
            return;
        }

        if (error) {
            // Type assertion for error object
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

        if (ticketsData && Array.isArray(ticketsData)) {
            if (ticketsData.length === 0) {
                setMessage({ type: "info", text: "You currently have no tickets. Explore events and purchase your first ticket!" });
                setUpcomingTickets([]);
                setPastTickets([]);
                return;
            }

            const now = new Date();
            const fetchedUpcomingTickets: ProcessedTicket[] = [];
            const fetchedPastTickets: ProcessedTicket[] = [];

            // Ensure ticketsData is correctly typed as TicketApiResponse[]
            ticketsData.forEach((item: TicketApiResponse) => {
                const ticket = item.ticket;
                const event = item.event;
                const ticketType = item.ticketType;

                // Ensure checkInStatus matches the literal union type
                const checkInStatus: 'Checked In' | 'Pending Check-in' = ticket.isScanned ? 'Checked In' : 'Pending Check-in';

                const eventDateTimeString = `${event.eventDate}T${event.eventTime}`;
                const eventDateObj = new Date(eventDateTimeString);

                const posterImageUrl = event.posterImageUrl || `https://placehold.co/400x200/E0E0E0/000000?text=Event+Poster`;

                const ticketWithEvent: ProcessedTicket = {
                    ...ticket,
                    checkInStatus: checkInStatus, // Now strictly typed
                    ticketTypeName: ticketType?.typeName || 'General Ticket',
                    quantity: 1,
                    eventDetails: {
                        id: event.id, // Ensure event.id is passed
                        title: event.title,
                        posterImageUrl: posterImageUrl,
                        startDate: eventDateTimeString,
                        endDate: eventDateTimeString,
                        VenueId: event.VenueId,
                    }
                };

                if (now < eventDateObj) {
                    fetchedUpcomingTickets.push(ticketWithEvent);
                } else {
                    fetchedPastTickets.push(ticketWithEvent);
                }
            });

            fetchedUpcomingTickets.sort((a, b) => new Date(a.eventDetails.startDate).getTime() - new Date(b.eventDetails.startDate).getTime());
            fetchedPastTickets.sort((a, b) => new Date(b.eventDetails.startDate).getTime() - new Date(a.eventDetails.startDate).getTime());

            setUpcomingTickets(fetchedUpcomingTickets);
            setPastTickets(fetchedPastTickets);
            setMessage({ type: '', text: '' });
        }
    }, [ticketsData, userId, isLoading, error]);

    // Corrected handleTabChange signature to match MUI Tabs onChange prop, and removed unused 'event' parameter
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleViewTicketDetails = (ticketId: number) => { // Changed ticketId type to number
        navigate(`/attendee/tickets/${ticketId}`);
    };

    if (isLoading || user === null) {
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
                                                onClick={() => handleViewTicketDetails(ticket.id)}
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
                                <Grid item xs={12} md={6} key={ticket.id}>
                                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1, opacity: 0.8 }}>
                                        <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={ticket.eventDetails.posterImageUrl}
                                                alt={`Event Poster for ${ticket.eventDetails.title}`}
                                                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px' }}
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, globalThis.Event>) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/120x120/E0E0E0/000000?text=Event"; }}
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
                                                onClick={() => handleViewTicketDetails(ticket.id)}
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
