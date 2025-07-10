import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
const CURRENT_USER_ID = 'user-001';

const dummyUsers = [
    { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com' },
];

const dummyEvents = [
    {
        event_id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi',
        posterImageUrl: 'https://placehold.co/400x200/ADD8E6/000000?text=Tech+Summit',
    },
    {
        event_id: 'evt-002',
        name: 'Annual Charity Gala',
        startDate: '2025-10-22T18:00:00Z',
        endDate: '2025-10-22T23:00:00Z',
        location: 'Sarit Centre, Nairobi',
        posterImageUrl: 'https://placehold.co/400x200/F08080/FFFFFF?text=Charity+Gala',
    },
    {
        event_id: 'evt-003', // Past event
        name: 'Summer Music Fest 2024',
        startDate: '2024-07-20T12:00:00Z',
        endDate: '2024-07-21T22:00:00Z',
        location: 'City Park, Nairobi',
        posterImageUrl: 'https://placehold.co/400x200/FFDAB9/000000?text=Music+Fest',
    },
    {
        event_id: 'evt-004', // Very far future event
        name: 'Future Tech Expo 2026',
        startDate: '2026-03-01T09:00:00Z',
        endDate: '2026-03-03T17:00:00Z',
        location: 'Exhibition Grounds, Nairobi',
        posterImageUrl: 'https://placehold.co/400x200/A2D9CE/000000?text=Future+Expo',
    },
];

const dummyTickets = [
    {
        ticket_id: 'tkt-001-A',
        user_id: 'user-001',
        event_id: 'evt-001',
        ticketTypeName: 'Standard Pass',
        quantity: 1,
        purchaseDate: '2025-01-15T10:00:00Z',
        checkInStatus: 'Pending', // 'Pending', 'Checked In', 'Invalid'
        qrCodeData: 'ticket_id=tkt-001-A&event_id=evt-001&user_id=user-001',
    },
    {
        ticket_id: 'tkt-001-B',
        user_id: 'user-001',
        event_id: 'evt-001',
        ticketTypeName: 'VIP Pass',
        quantity: 1,
        purchaseDate: '2025-01-15T10:05:00Z',
        checkInStatus: 'Pending',
        qrCodeData: 'ticket_id=tkt-001-B&event_id=evt-001&user_id=user-001',
    },
    {
        ticket_id: 'tkt-002-A',
        user_id: 'user-001',
        event_id: 'evt-003', // Past event
        ticketTypeName: 'General Admission',
        quantity: 2,
        purchaseDate: '2024-06-01T11:00:00Z',
        checkInStatus: 'Checked In',
        qrCodeData: 'ticket_id=tkt-002-A&event_id=evt-003&user_id=user-001',
    },
    {
        ticket_id: 'tkt-004-A',
        user_id: 'user-001',
        event_id: 'evt-004',
        ticketTypeName: 'Early Bird Pass',
        quantity: 1,
        purchaseDate: '2025-02-20T09:00:00Z',
        checkInStatus: 'Pending',
        qrCodeData: 'ticket_id=tkt-004-A&event_id=evt-004&user_id=user-001',
    },
    { // Ticket for a different user, should not show
        ticket_id: 'tkt-005-A',
        user_id: 'user-002',
        event_id: 'evt-002',
        ticketTypeName: 'Standard Ticket',
        quantity: 1,
        purchaseDate: '2025-03-01T10:00:00Z',
        checkInStatus: 'Pending',
        qrCodeData: 'ticket_id=tkt-005-A&event_id=evt-002&user_id=user-002',
    },
];

// Simulate API calls
const fetchCurrentUser = async (userId) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(dummyUsers.find(u => u.user_id === userId)), 300);
    });
};

const fetchUserTickets = async (userId) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(dummyTickets.filter(t => t.user_id === userId)), 500);
    });
};

const fetchEventDetails = async (eventId) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(dummyEvents.find(e => e.event_id === eventId)), 200);
    });
};

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
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [upcomingTickets, setUpcomingTickets] = useState([]);
    const [pastTickets, setPastTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [tabValue, setTabValue] = useState(0); // 0 for Upcoming, 1 for Past

    useEffect(() => {
        const loadTicketsData = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });

                const currentUser = await fetchCurrentUser(CURRENT_USER_ID);
                if (!currentUser) {
                    setMessage({ type: 'error', text: 'User not found. Please log in.' });
                    setLoading(false);
                    return;
                }
                setUser(currentUser);

                const userTickets = await fetchUserTickets(CURRENT_USER_ID);
                setTickets(userTickets);

                const fetchedUpcomingTickets = [];
                const fetchedPastTickets = [];
                const now = new Date();

                for (const ticket of userTickets) {
                    const event = await fetchEventDetails(ticket.event_id);
                    if (event) {
                        const ticketWithEvent = { ...ticket, eventDetails: event };
                        const eventEndDate = new Date(event.endDate);

                        if (now < eventEndDate) {
                            fetchedUpcomingTickets.push(ticketWithEvent);
                        } else {
                            fetchedPastTickets.push(ticketWithEvent);
                        }
                    }
                }

                // Sort upcoming tickets by event start date (soonest first)
                fetchedUpcomingTickets.sort((a, b) => new Date(a.eventDetails.startDate).getTime() - new Date(b.eventDetails.startDate).getTime());
                // Sort past tickets by event end date (most recent first)
                fetchedPastTickets.sort((a, b) => new Date(b.eventDetails.endDate).getTime() - new Date(a.eventDetails.endDate).getTime());

                setUpcomingTickets(fetchedUpcomingTickets);
                setPastTickets(fetchedPastTickets);

            } catch (err) {
                console.error("Failed to load ticket data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load ticket information.' });
            } finally {
                setLoading(false);
            }
        };

        loadTicketsData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // New function to navigate to ticket details
    const handleViewTicketDetails = (ticketId) => {
        navigate(`/attendee/tickets/${ticketId}`);
    };


    if (loading || user === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading your tickets...</Typography>
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
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
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
                                <Grid item xs={12} md={6} key={ticket.ticket_id}>
                                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1 }}>
                                        <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={generateQRCodePlaceholderUrl(ticket.qrCodeData)}
                                                alt={`QR Code for ${ticket.ticketTypeName}`}
                                                style={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: '8px' }}
                                            />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{ticket.eventDetails.name}</Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {formatDate(ticket.eventDetails.startDate)} - {new Date(ticket.eventDetails.endDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {ticket.eventDetails.location}
                                            </Typography>
                                            <Chip
                                                label={ticket.checkInStatus === 'Checked In' ? 'Checked In' : 'Pending Check-in'}
                                                color={ticket.checkInStatus === 'Checked In' ? 'success' : 'info'}
                                                icon={ticket.checkInStatus === 'Checked In' ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />}
                                                size="small"
                                            />
                                            {/* Updated Button to navigate */}
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleViewTicketDetails(ticket.ticket_id)}
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
                                <Button variant="contained" sx={{ mt: 2 }}>Browse Events</Button> {/* Placeholder for link to event Browse */}
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
                                <Grid item xs={12} md={6} key={ticket.ticket_id}>
                                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1, opacity: 0.8 }}>
                                        <Box sx={{ flexShrink: 0, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={ticket.eventDetails.posterImageUrl}
                                                alt={`Event Poster for ${ticket.eventDetails.name}`}
                                                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/E0E0E0/000000?text=Event"; }}
                                            />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div">{ticket.eventDetails.name}</Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {formatOnlyDate(ticket.eventDetails.startDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                {ticket.eventDetails.location}
                                            </Typography>
                                            <Chip
                                                label={`Status: ${ticket.checkInStatus}`}
                                                color={ticket.checkInStatus === 'Checked In' ? 'success' : 'default'}
                                                size="small"
                                            />
                                            {/* Updated Button to navigate */}
                                            <Button
                                                variant="text"
                                                size="small"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleViewTicketDetails(ticket.ticket_id)}
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