import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert, Button, Card, CardContent, Divider, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BarcodeScannerIcon from '@mui/icons-material/QrCodeScanner'; // Icon for scanning
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts"; // For navigation
import {useGetStaffAssignedEventsQuery, useGetStaffScannedEventsQuery} from "../../queries/checkInStaff/StaffScannedQuery.ts"

// --- Dummy Data Simulation ---
// In a real app, this would come from an API based on staff ID
const DUMMY_STAFF_ID = 'staff-001';

const dummyStaffAssignments = [
    { staff_id: 'staff-001', event_id: 'evt-001' }, // Tech Innovators Summit
    { staff_id: 'staff-001', event_id: 'evt-003' }, // Summer Music Fest (past event)
    { staff_id: 'staff-001', event_id: 'evt-004' }, // Future Tech Expo (upcoming)
    { staff_id: 'staff-001', event_id: 'evt-005' },
];

const dummyEvents = [
    {
        event_id: 'evt-005',
        name: 'Tech Innovators Summit 2025',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi',
        totalTicketsSold: 1500,
    },
    {
        event_id: 'evt-003',
        name: 'Summer Music Fest 2024',
        startDate: '2024-07-20T12:00:00Z',
        endDate: '2024-07-21T22:00:00Z',
        location: 'City Park, Nairobi',
        totalTicketsSold: 2500,
    },
    {
        event_id: 'evt-004',
        name: 'Future Tech Expo 2026',
        startDate: '2026-03-01T09:00:00Z',
        endDate: '2026-03-03T17:00:00Z',
        location: 'Exhibition Grounds, Nairobi',
        totalTicketsSold: 800,
    },
    {
        event_id: 'evt-001',
        name: 'Live Test Event 2025',
        startDate: '2025-07-02T07:00:00Z', // Already started
        endDate: '2025-07-03T23:59:00Z', // Ends later today
        location: 'Test Venue, Nairobi',
        totalTicketsSold: 500,
    }
];
//
// // Simulate check-in records for staff-001
// const dummyCheckInRecords = [
//     { checkin_id: 'chk-001', staff_id: 'staff-001', event_id: 'evt-001', ticket_id: 'tkt-001-A', timestamp: '2025-09-10T09:30:00Z' },
//     { checkin_id: 'chk-002', staff_id: 'staff-001', event_id: 'evt-001', ticket_id: 'tkt-001-C', timestamp: '2025-09-10T09:35:00Z' },
//     { checkin_id: 'chk-003', staff_id: 'staff-001', event_id: 'evt-003', ticket_id: 'tkt-002-A', timestamp: '2024-07-20T13:00:00Z' },
//     // Add more check-ins for evt-001 for staff-001 to show 'Tickets Scanned'
//     { checkin_id: 'chk-004', staff_id: 'staff-001', event_id: 'evt-001', ticket_id: 'tkt-001-D', timestamp: '2025-09-10T09:40:00Z' },
//     { checkin_id: 'chk-005', staff_id: 'staff-001', event_id: 'evt-001', ticket_id: 'tkt-001-E', timestamp: '2025-09-10T09:45:00Z' },
// ];
//
// // --- Simulate API Calls ---
// const fetchAssignedEvents = async (staffId) => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const assignedEventIds = dummyStaffAssignments
//                 .filter(assignment => assignment.staff_id === staffId)
//                 .map(assignment => assignment.event_id);
//             const events = dummyEvents.filter(event => assignedEventIds.includes(event.event_id));
//             resolve(events);
//         }, 500);
//     });
// };

// const fetchCheckInCounts = async (eventId, staffId) => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const scannedByThisStaff = dummyCheckInRecords.filter(
//                 record => record.event_id === eventId && record.staff_id === staffId
//             ).length;
//
//             const totalScannedForEvent = dummyCheckInRecords.filter(
//                 record => record.event_id === eventId
//             ).length;
//
//             const eventDetails = dummyEvents.find(e => e.event_id === eventId);
//             const totalExpectedAttendees = eventDetails ? eventDetails.totalTicketsSold : 0;
//             const ticketsRemaining = totalExpectedAttendees - totalScannedForEvent;
//
//             resolve({
//                 scannedByThisStaff,
//                 totalScannedForEvent,
//                 totalExpectedAttendees,
//                 ticketsRemaining: Math.max(0, ticketsRemaining) // Ensure not negative
//             });
//         }, 400);
//     });
// };

// --- Helper Functions ---
const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };

    const formattedStartDate = start.toLocaleDateString(undefined, optionsDate);
    const formattedStartTime = start.toLocaleTimeString(undefined, optionsTime);
    const formattedEndDate = end.toLocaleDateString(undefined, optionsDate);
    const formattedEndTime = end.toLocaleTimeString(undefined, optionsTime);

    if (start.toDateString() === end.toDateString()) {
        return `${formattedStartDate} from ${formattedStartTime} to ${formattedEndTime}`;
    }
    return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`;
};

const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) {
        return { label: 'Upcoming', color: 'info', icon: <HourglassEmptyIcon fontSize="small" /> };
    } else if (now >= start && now <= end) {
        return { label: 'Active', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> };
    } else {
        return { label: 'Completed', color: 'default', icon: <EventIcon fontSize="small" /> };
    }
};

export const CheckInStaffDashboard = () => {
    const navigate = useNavigate();

    // Get user email from Redux root state
    // Assuming RootState and user slice are correctly configured in Redux
    // For demonstration, if user.user or user.user.email is null, a default will be used.
    const userEmail = useSelector((state) => state.user.user?.email); // Replace with your actual RootState type if needed

    // State for managing selected event and its summary
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [currentEventSummary, setCurrentEventSummary] = useState(null);

    // Fetch assigned events using RTK Query
    const { data: assignedEventsData, isLoading: isLoadingAssignedEvents, isError: isErrorAssignedEvents, error: errorAssignedEvents } = useGetStaffAssignedEventsQuery(userEmail);

    // Fetch scanned events using RTK Query
    const { data: scannedEventsData, isLoading: isLoadingScannedEvents, isError: isErrorScannedEvents, error: errorScannedEvents } = useGetStaffScannedEventsQuery(userEmail);

    // Combine loading and error states
    const isLoading = isLoadingAssignedEvents || isLoadingScannedEvents;
    const error = isErrorAssignedEvents ? errorAssignedEvents : isErrorScannedEvents ? errorScannedEvents : null;

    // Effect to set initial selected event and update assigned events list
    useEffect(() => {
        if (assignedEventsData && assignedEventsData.length > 0) {
            // Automatically select the first upcoming/active event, or just the first event
            const now = new Date();
            const activeOrUpcomingEvent = assignedEventsData.find(event => {
                const endDate = new Date(event.endDate);
                return now < endDate; // Event is not yet over
            });

            if (activeOrUpcomingEvent) {
                setSelectedEventId(activeOrUpcomingEvent.eventId);
            } else {
                setSelectedEventId(assignedEventsData[0].eventId); // Fallback to first event
            }
        } else if (assignedEventsData && assignedEventsData.length === 0) {
            setSelectedEventId(null); // No events assigned
        }
    }, [assignedEventsData]); // Re-run when assignedEventsData changes

    // Effect to load current event summary based on selected event and fetched data
    useEffect(() => {
        if (selectedEventId && assignedEventsData && scannedEventsData) {
            const selectedEvent = assignedEventsData.find(event => event.eventId === selectedEventId);
            const scannedDataForSelectedEvent = scannedEventsData.find(scanned => scanned.eventId === selectedEventId);

            if (selectedEvent) {
                setCurrentEventSummary({
                    name: selectedEvent.title,
                    totalExpectedAttendees: selectedEvent.ticketsSold,
                    totalScannedForEvent: scannedDataForSelectedEvent?.ticketScanned || 0,
                    // scannedByThisStaff: 'N/A', // This data is not available from the new API structure
                    ticketsRemaining: selectedEvent.ticketsRemaining,
                });
            } else {
                setCurrentEventSummary(null);
            }
        } else {
            setCurrentEventSummary(null); // Clear summary if no event is selected or data not ready
        }
    }, [selectedEventId, assignedEventsData, scannedEventsData]); // Re-run when dependencies change

    const handleStartScanning = (eventId) => {
        navigate(`/staff/checkin/${eventId}`); // Navigate to the check-in scanning page
    };

    const handleEventSelection = (eventId) => {
        setSelectedEventId(eventId);
    };

    const sortedAssignedEvents = assignedEventsData ? [...assignedEventsData].sort((a, b) => {
        const statusA = getEventStatus(a).label;
        const statusB = getEventStatus(b).label;

        // Prioritize Active > Upcoming > Completed
        const order = { 'Active': 1, 'Upcoming': 2, 'Completed': 3 };
        if (order[statusA] !== order[statusB]) {
            return order[statusA] - order[statusB];
        }
        // For same status, sort by date
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }) : [];

    if (isLoading && !assignedEventsData) { // Only show full-screen loader on initial data fetch
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <EventIcon fontSize="large" /> Staff Dashboard
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load data: {error.message || 'Unknown error'}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Left Column: Assigned Events Overview */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon /> Assigned Events
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {sortedAssignedEvents.length === 0 ? (
                            <Alert severity="info">No events assigned to you yet.</Alert>
                        ) : (
                            <Box>
                                {sortedAssignedEvents.map(event => {
                                    const status = getEventStatus(event);
                                    const isSelected = selectedEventId === event.eventId;
                                    return (
                                        <Card
                                            key={event.eventId}
                                            variant="outlined"
                                            sx={{
                                                mb: 2,
                                                borderColor: isSelected ? 'primary.main' : 'divider',
                                                borderWidth: isSelected ? 2 : 1,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    boxShadow: 3,
                                                }
                                            }}
                                            onClick={() => handleEventSelection(event.eventId)}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" component="div">{event.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {event.location}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {formatDateRange(event.startDate, event.endDate)}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Chip label={status.label} color={status.color} size="small" icon={status.icon} />
                                                    {status.label === 'Active' && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<BarcodeScannerIcon />}
                                                            onClick={(e) => { e.stopPropagation(); handleStartScanning(event.eventId); }}
                                                        >
                                                            Start Scanning
                                                        </Button>
                                                    )}
                                                    {status.label === 'Upcoming' && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<BarcodeScannerIcon />}
                                                            disabled // Disable scanning for upcoming events
                                                        >
                                                            Scan (Starts {formatDateRange(event.startDate).split(' ')[0]})
                                                        </Button>
                                                    )}
                                                    {status.label === 'Completed' && (
                                                        <Button
                                                            variant="text"
                                                            size="small"
                                                            disabled
                                                        >
                                                            Event Completed
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Right Column: Current Event Summary */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ConfirmationNumberIcon /> Current Event Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {isLoading && selectedEventId && !currentEventSummary ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Loading summary...</Typography>
                            </Box>
                        ) : selectedEventId && currentEventSummary ? (
                            <>
                                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                    {currentEventSummary.name}
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" color="text.secondary">Total Expected Attendees:</Typography>
                                                <Typography variant="h5" color="primary.main">
                                                    {currentEventSummary.totalExpectedAttendees}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" color="text.secondary">Total Tickets Scanned:</Typography>
                                                <Typography variant="h5" color="success.main">
                                                    {currentEventSummary.totalScannedForEvent}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    {/* Removed "Scanned by You" as this data is not provided by the new API structure */}
                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" color="text.secondary">Tickets Remaining:</Typography>
                                                <Typography variant="h5" color="warning.main">
                                                    {currentEventSummary.ticketsRemaining}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<BarcodeScannerIcon />}
                                    fullWidth
                                    sx={{ mt: 'auto' }} // Push button to bottom
                                    onClick={() => handleStartScanning(selectedEventId)}
                                    disabled={getEventStatus(assignedEventsData.find(e => e.eventId === selectedEventId)).label !== 'Active'}
                                >
                                    Continue Scanning for {currentEventSummary.name}
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexDirection: 'column' }}>
                                <HourglassEmptyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" align="center">
                                    Select an event from the left to view its summary.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Or, if no events are assigned, contact your administrator.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
