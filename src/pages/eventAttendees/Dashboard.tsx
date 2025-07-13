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
    Avatar,
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
import {useGetTicketsUserQuery} from '../../queries/eventAttendees/TicketQuery.ts';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


// Helper to generate a placeholder QR code image URL
const generateQRCodePlaceholderUrl = (data) => {
    const size = 150; // Size of the QR code image
    const color = '000000'; // Black text
    const bgColor = 'FFFFFF'; // White background
    // Using a more robust placeholder for QR codes from placehold.co
    // In a real app, this would be a server-generated QR code image or a client-side QR library
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


export const Dashboard = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id;
    const navigate = useNavigate(); // Initialize useNavigate

    const { data: ticketsData, isLoading, error } = useGetTicketsUserQuery(userId!, {
        skip: !userId, // Prevent query if userId is undefined
    });

    const [upcomingTickets, setUpcomingTickets] = useState([]);
    const [pastTickets, setPastTickets] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' }); // type: 'info', 'error', 'success'

    useEffect(() => {
        if (!userId) {
            setMessage({ type: "error", text: "User not found. Please log in." });
            setUpcomingTickets([]); // Clear tickets
            setPastTickets([]); // Clear tickets
            return;
        }

        if (isLoading) {
            // While loading, we don't set messages here, the main return handles the spinner.
            return;
        }

        if (error) {
            const apiErrorMessage = (error as any)?.data?.message;
            if (apiErrorMessage && apiErrorMessage.includes("not found")) {
                setMessage({ type: "info", text: "You currently have no tickets. Explore events and purchase your first ticket!" });
            } else {
                setMessage({ type: "error", text: apiErrorMessage || "Failed to fetch tickets. Please try again later." });
            }
            setUpcomingTickets([]); // Clear tickets on error
            setPastTickets([]); // Clear tickets on error
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
            const upcoming: any[] = [];
            const past: any[] = [];

            ticketsData.forEach((item) => {
                const ticket = item.ticket;
                const event = item.event;
                const ticketType = item.ticketType; // Access the ticketType object

                // Derive checkInStatus from isScanned
                const checkInStatus = ticket.isScanned ? 'Checked In' : 'Pending Check-in';

                // Combine eventDate and eventTime for a robust Date object
                const eventDateTimeString = `${event.eventDate}T${event.eventTime}`;
                const eventDateObj = new Date(eventDateTimeString);

                // Add a default posterImageUrl if missing
                const posterImageUrl = event.posterImageUrl || `https://placehold.co/400x200/E0E0E0/000000?text=Event+Poster`;


                const ticketWithEvent = {
                    ...ticket,
                    checkInStatus: checkInStatus, // Add derived checkInStatus
                    ticketTypeName: ticketType?.typeName || 'General Ticket', // Use typeName from ticketType, with fallback
                    quantity: 1, // Assuming each 'ticket' entry represents a quantity of 1
                    eventDetails: {
                        ...event,
                        posterImageUrl: posterImageUrl, // Use the potentially defaulted image URL
                        startDate: eventDateTimeString, // Use combined string for consistency with formatDate
                        endDate: eventDateTimeString, // Assuming end date is same for simplicity or adjust as per API
                    }
                };

                if (now < eventDateObj) {
                    upcoming.push(ticketWithEvent);
                } else {
                    past.push(ticketWithEvent);
                }
            });

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

            // If ticketsData had items but none were categorized (e.g., all invalid dates), show info message
            if (upcoming.length === 0 && past.length === 0) {
                setMessage({ type: "info", text: "No valid tickets could be displayed. You might have no upcoming or past events." });
            } else {
                setMessage({ type: "", text: "" }); // Clear any previous messages on successful data load and categorization
            }
        }
    }, [ticketsData, userId, isLoading, error]);


    if (isLoading) {
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

            {/* Display general messages (e.g., "no tickets found" or API errors) */}
            {message.text && (
                <Alert severity={message.type === 'info' ? 'info' : 'error'} sx={{ mb: 2 }}>
                    {message.text}
                    {message.type === 'info' && ( // Add browse events button only for info message (no tickets)
                        <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/attendee/events')}>Browse Events</Button>
                    )}
                </Alert>
            )}

            {/* Dashboard Summary Cards */}
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

            {/* My Upcoming Tickets */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon /> My Upcoming Tickets
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    {upcomingTickets.length > 0 ? (
                        upcomingTickets.map(ticket => (
                            <Grid item xs={12} md={6} key={ticket.id}> {/* Changed key to ticket.id */}
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1 }}>
                                    <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={generateQRCodePlaceholderUrl(ticket.uniqueCode)} // Use uniqueCode for QR
                                            alt={`QR Code for ${ticket.ticketTypeName}`}
                                            style={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: '8px' }}
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div">{ticket.eventDetails.title}</Typography> {/* Use eventDetails.title */}
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            <TicketIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName || 'Ticket Type'} (x{ticket.quantity || 1}) {/* Default quantity */}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                            {formatDate(ticket.eventDetails.startDate)} - {formatDate(ticket.eventDetails.endDate)} {/* Use formatDate for both */}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                            {ticket.eventDetails.VenueId || 'Venue Not Specified'} {/* Use VenueId for location */}
                                        </Typography>
                                        <Chip
                                            label={ticket.checkInStatus}
                                            color={ticket.checkInStatus === 'Checked In' ? 'success' : 'info'}
                                            icon={ticket.checkInStatus === 'Checked In' ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />}
                                            size="small"
                                        />
                                        <Button variant="outlined" size="small" sx={{ ml: 1 }}>View Ticket</Button>
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

            {/* My Past Events */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon /> My Past Events
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    {pastTickets.length > 0 ? (
                        pastTickets.map(ticket => (
                            <Grid item xs={12} md={6} key={ticket.id}> {/* Changed key to ticket.id */}
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1, opacity: 0.8 }}>
                                    <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={ticket.eventDetails.posterImageUrl} // Now uses the potentially defaulted URL
                                            alt={`Event Poster for ${ticket.eventDetails.title}`}
                                            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px' }}
                                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/E0E0E0/000000?text=Event"; }}
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
                                        <Button variant="text" size="small" sx={{ ml: 1 }}>View Details</Button>
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
