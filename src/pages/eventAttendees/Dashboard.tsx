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
    CardContent,
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

// --- No more dayjs imports or extends ---

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// Simulating the currently logged-in attendee
const CURRENT_USER_ID = 'user-001';

const dummyUsers = [
    { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com', phone: '+254712345001' },
    { user_id: 'user-002', name: 'Bob Participant', email: 'bob.p@example.com', phone: '+254712345002' },
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
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [upcomingTickets, setUpcomingTickets] = useState([]);
    const [pastTickets, setPastTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadDashboardData = async () => {
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
                const now = new Date(); // Native Date object

                // Fetch event details for each ticket and categorize
                for (const ticket of userTickets) {
                    const event = await fetchEventDetails(ticket.event_id);
                    if (event) {
                        const ticketWithEvent = { ...ticket, eventDetails: event };
                        const eventEndDate = new Date(event.endDate); // Native Date object

                        if (now < eventEndDate) { // Compare Date objects directly
                            fetchedUpcomingTickets.push(ticketWithEvent);
                        } else { // Event has passed
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
                console.error("Failed to load dashboard data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load dashboard information.' });
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading || user === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading your dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Welcome, {user.name}!
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            {/* Quick Profile Overview */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                    <Button variant="text" size="small" sx={{ mt: 1 }}>Manage Profile</Button> {/* Placeholder for profile management link */}
                </Box>
            </Paper>

            {/* Dashboard Summary Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <TicketIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                            <Typography variant="h6" color="text.secondary">Total Tickets</Typography>
                            <Typography variant="h4" color="primary">{tickets.length}</Typography>
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
                                            <TicketIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
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
                                        <Button variant="outlined" size="small" sx={{ ml: 1 }}>View Ticket</Button>
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
                                            <TicketIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {ticket.ticketTypeName} (x{ticket.quantity})
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