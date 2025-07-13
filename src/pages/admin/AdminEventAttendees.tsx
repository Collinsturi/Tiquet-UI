import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    FormControl, // New import for dropdown
    InputLabel,   // New import for dropdown
    Select,       // New import for dropdown
    MenuItem,     // New import for dropdown
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote'; // New icon for dropdown label

// Recharts components for charts
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Bar
} from 'recharts';
import dayjs from 'dayjs';

// --- Dummy Data Simulation ---
// Re-using and slightly adjusting dummyEvents to have organizerId if needed
const dummyEvents = [
    {
        id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1', // Assuming current admin is this organizer
        ticketTypes: [
            { id: 'ticket-001-A', name: 'Standard Pass', price: 50.00 },
            { id: 'ticket-001-B', name: 'VIP Pass', price: 150.00 },
            { id: 'ticket-001-C', name: 'Student Discount', price: 25.00 },
        ],
    },
    {
        id: 'evt-002',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        ticketTypes: [
            { id: 'ticket-002-A', name: 'General Admission', price: 100.00 },
            { id: 'ticket-002-B', name: 'Premium Seat', price: 250.00 },
        ],
    },
    {
        id: 'evt-003',
        name: 'Local Music Festival',
        organizerId: 'organizer-2', // Event by a different organizer, should not appear for organizer-1
        ticketTypes: [
            { id: 'ticket-003-A', name: 'Day Pass', price: 30.00 },
        ],
    },
];

const dummyAttendees = [
    // Attendees for Tech Innovators Summit 2025 (evt-001)
    {
        id: 'att-001', eventId: 'evt-001', firstName: 'Alice', lastName: 'Smith', email: 'alice.s@example.com', phone: '254711223344',
        ticketTypeId: 'ticket-001-A', quantity: 1, purchaseDate: '2025-01-15T10:30:00Z', checkInStatus: 'Checked In', gender: 'Female', ageGroup: '25-34', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-002', eventId: 'evt-001', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', phone: '254711223345',
        ticketTypeId: 'ticket-001-B', quantity: 1, purchaseDate: '2025-01-20T11:00:00Z', checkInStatus: 'Not Checked In', gender: 'Male', ageGroup: '35-44', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-003', eventId: 'evt-001', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.b@example.com', phone: '254711223346',
        ticketTypeId: 'ticket-001-A', quantity: 2, purchaseDate: '2025-02-01T14:15:00Z', checkInStatus: 'Checked In', gender: 'Male', ageGroup: '25-34', city: 'Mombasa', country: 'Kenya',
    },
    {
        id: 'att-004', eventId: 'evt-001', firstName: 'Diana', lastName: 'Prince', email: 'diana.p@example.com', phone: '254711223347',
        ticketTypeId: 'ticket-001-C', quantity: 1, purchaseDate: '2025-02-10T09:00:00Z', checkInStatus: 'Not Checked In', gender: 'Female', ageGroup: '18-24', city: 'Kisumu', country: 'Kenya',
    },
    {
        id: 'att-005', eventId: 'evt-001', firstName: 'Eve', lastName: 'Adams', email: 'eve.a@example.com', phone: '254711223348',
        ticketTypeId: 'ticket-001-A', quantity: 1, purchaseDate: '2025-03-05T16:00:00Z', checkInStatus: 'Checked In', gender: 'Female', ageGroup: '45-54', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-006', eventId: 'evt-001', firstName: 'Frank', lastName: 'White', email: 'frank.w@example.com', phone: '254711223349',
        ticketTypeId: 'ticket-001-B', quantity: 1, purchaseDate: '2025-03-10T12:00:00Z', checkInStatus: 'Checked In', gender: 'Male', ageGroup: '35-44', city: 'Eldoret', country: 'Kenya',
    },
    // Attendees for Annual Charity Gala (evt-002)
    {
        id: 'att-007', eventId: 'evt-002', firstName: 'Grace', lastName: 'Lee', email: 'grace.l@example.com', phone: '254722334455',
        ticketTypeId: 'ticket-002-A', quantity: 2, purchaseDate: '2025-08-01T10:00:00Z', checkInStatus: 'Checked In', gender: 'Female', ageGroup: '55+', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-008', eventId: 'evt-002', firstName: 'Harry', lastName: 'Potter', email: 'harry.p@example.com', phone: '254722334456',
        ticketTypeId: 'ticket-002-B', quantity: 1, purchaseDate: '2025-08-05T11:30:00Z', checkInStatus: 'Not Checked In', gender: 'Male', ageGroup: '45-54', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-009', eventId: 'evt-002', firstName: 'Grace', lastName: 'Lee', email: 'grace.l@example.com', phone: '254722334455',
        ticketTypeId: 'ticket-002-A', quantity: 1, purchaseDate: '2025-08-02T10:00:00Z', checkInStatus: 'Not Checked In', gender: 'Female', ageGroup: '55+', city: 'Nairobi', country: 'Kenya',
    },
    {
        id: 'att-010', eventId: 'evt-002', firstName: 'Harry', lastName: 'Potter', email: 'harry.p@example.com', phone: '254722334456',
        ticketTypeId: 'ticket-002-A', quantity: 1, purchaseDate: '2025-08-06T11:30:00Z', checkInStatus: 'Checked In', gender: 'Male', ageGroup: '45-54', city: 'Nairobi', country: 'Kenya',
    },
];

// Current logged-in admin's organizer ID (for filtering events)
const CURRENT_ORGANIZER_ID = 'organizer-1';

// Simulate fetching ALL events for the dropdown
const fetchAllEventsForOrganizer = async (organizerId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredEvents = dummyEvents.filter(e => e.organizerId === organizerId);
            resolve(filteredEvents.map(event => ({ id: event.id, name: event.name, ticketTypes: event.ticketTypes })));
        }, 500); // Simulate network delay
    });
};


// Simulate fetching attendees data for a SPECIFIC event
const fetchAttendeesData = async (eventId, allAvailableEvents) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const event = allAvailableEvents.find(e => e.id === eventId);
            if (!event) {
                reject(new Error("Selected event not found."));
                return;
            }

            const attendeesForEvent = dummyAttendees.filter(a => a.eventId === eventId).map(attendee => {
                const ticketType = event.ticketTypes.find(t => t.id === attendee.ticketTypeId);
                return {
                    ...attendee,
                    ticketTypeName: ticketType ? ticketType.name : 'Unknown Ticket Type',
                };
            });
            resolve({
                eventDetails: { id: event.id, name: event.name, ticketTypes: event.ticketTypes },
                attendees: attendeesForEvent,
            });
        }, 800); // Simulate network delay
    });
};

// Colors for Pie Chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0'];

export const AdminEventAttendees = () => {
    // State to hold all events for the dropdown
    const [availableEvents, setAvailableEvents] = useState([]);
    // State for the currently selected event ID from the dropdown
    const [selectedEventId, setSelectedEventId] = useState('');

    const [attendeesData, setAttendeesData] = useState([]);
    const [eventDetails, setEventDetails] = useState(null);
    const [loadingEvents, setLoadingEvents] = useState(true); // New loading state for events dropdown
    const [loadingAttendees, setLoadingAttendees] = useState(false); // Loading state for attendees data
    const [message, setMessage] = useState({ type: '', text: '' });
    const [reportGenerating, setReportGenerating] = useState(false);
    const [demographics, setDemographics] = useState({
        totalAttendees: 0,
        ticketTypeDistribution: [],
        genderDistribution: [],
        ageGroupDistribution: [],
        checkInStatusDistribution: [],
        attendanceOverTime: [],
        cityDistribution: [],
    });

    // Effect to fetch all events for the dropdown when the component mounts
    useEffect(() => {
        const getAvailableEvents = async () => {
            try {
                setLoadingEvents(true);
                setMessage({ type: '', text: '' });
                const events = await fetchAllEventsForOrganizer(CURRENT_ORGANIZER_ID); // Fetch events for the current admin
                setAvailableEvents(events);
                if (events.length > 0) {
                    setSelectedEventId(events[0].id); // Automatically select the first event
                } else {
                    setMessage({ type: 'info', text: 'No events found for this organizer.' });
                }
            } catch (err) {
                console.error("Failed to fetch available events:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load events for selection.' });
            } finally {
                setLoadingEvents(false);
            }
        };
        getAvailableEvents();
    }, []); // Run only once on component mount

    // Effect to fetch attendees data when selectedEventId changes
    useEffect(() => {
        const getAttendees = async () => {
            if (!selectedEventId) {
                setAttendeesData([]);
                setEventDetails(null);
                setDemographics({ // Reset demographics
                    totalAttendees: 0, ticketTypeDistribution: [], genderDistribution: [],
                    ageGroupDistribution: [], checkInStatusDistribution: [], attendanceOverTime: [], cityDistribution: [],
                });
                return; // No event selected
            }

            try {
                setLoadingAttendees(true);
                setMessage({ type: '', text: '' });
                // Pass availableEvents to fetchAttendeesData so it can find the event's ticket types
                const { eventDetails: fetchedEventDetails, attendees: fetchedAttendees } = await fetchAttendeesData(selectedEventId, availableEvents);
                setEventDetails(fetchedEventDetails);
                setAttendeesData(fetchedAttendees);
                processDemographics(fetchedAttendees);
            } catch (err) {
                console.error("Failed to fetch attendees data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load attendees data for selected event.' });
            } finally {
                setLoadingAttendees(false);
            }
        };

        // Only run if events have been loaded and an event is selected
        if (!loadingEvents && selectedEventId) {
            getAttendees();
        }
    }, [selectedEventId, loadingEvents, availableEvents]); // Rerun when selectedEventId or availableEvents changes

    const processDemographics = (attendees) => {
        const total = attendees.length;

        // Ticket Type Distribution
        const ticketTypeMap = attendees.reduce((acc, att) => {
            acc[att.ticketTypeName] = (acc[att.ticketTypeName] || 0) + att.quantity; // Sum by quantity purchased
            return acc;
        }, {});
        const ticketTypeDist = Object.keys(ticketTypeMap).map(name => ({
            name,
            value: ticketTypeMap[name],
        }));

        // Gender Distribution
        const genderMap = attendees.reduce((acc, att) => {
            acc[att.gender || 'Not Specified'] = (acc[att.gender || 'Not Specified'] || 0) + 1;
            return acc;
        }, {});
        const genderDist = Object.keys(genderMap).map(name => ({
            name,
            value: genderMap[name],
        }));

        // Age Group Distribution
        const ageGroupMap = attendees.reduce((acc, att) => {
            acc[att.ageGroup || 'Unknown'] = (acc[att.ageGroup || 'Unknown'] || 0) + 1;
            return acc;
        }, {});
        const ageGroupOrder = ['18-24', '25-34', '35-44', '45-54', '55+', 'Unknown']; // Define order
        const ageGroupDist = Object.keys(ageGroupMap)
            .map(name => ({ name, value: ageGroupMap[name] }))
            .sort((a, b) => ageGroupOrder.indexOf(a.name) - ageGroupOrder.indexOf(b.name));

        // Check-in Status Distribution
        const checkInStatusMap = attendees.reduce((acc, att) => {
            acc[att.checkInStatus || 'Unknown'] = (acc[att.checkInStatus || 'Unknown'] || 0) + 1;
            return acc;
        }, {});
        const checkInStatusDist = Object.keys(checkInStatusMap).map(name => ({
            name,
            value: checkInStatusMap[name],
        }));

        // City Distribution
        const cityMap = attendees.reduce((acc, att) => {
            acc[att.city || 'Unknown'] = (acc[att.city || 'Unknown'] || 0) + 1;
            return acc;
        }, {});
        const cityDist = Object.keys(cityMap).map(name => ({
            name,
            value: cityMap[name],
        }));

        // Attendance Over Time (e.g., daily purchases)
        const attendanceOverTimeMap = attendees.reduce((acc, att) => {
            const date = dayjs(att.purchaseDate).format('YYYY-MM-DD');
            acc[date] = (acc[date] || 0) + att.quantity;
            return acc;
        }, {});
        const attendanceOverTimeData = Object.keys(attendanceOverTimeMap)
            .sort() // Sort dates chronologically
            .map(date => ({
                date,
                ticketsSold: attendanceOverTimeMap[date],
            }));

        setDemographics({
            totalAttendees: total,
            ticketTypeDistribution: ticketTypeDist,
            genderDistribution: genderDist,
            ageGroupDistribution: ageGroupDist,
            checkInStatusDistribution: checkInStatusDist,
            attendanceOverTime: attendanceOverTimeData,
            cityDistribution: cityDist,
        });
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]); // Get headers from the first object
        const csvRows = [];
        csvRows.push(headers.join(',')); // Add header row

        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                // Handle commas within data by quoting them
                return `"${String(val).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const handleGenerateReport = () => {
        setReportGenerating(true);
        setMessage({ type: '', text: '' });
        try {
            const reportData = attendeesData.map(attendee => ({
                'Attendee ID': attendee.id,
                'First Name': attendee.firstName,
                'Last Name': attendee.lastName,
                'Email': attendee.email,
                'Phone': attendee.phone,
                'Ticket Type': attendee.ticketTypeName,
                'Quantity': attendee.quantity,
                'Purchase Date': dayjs(attendee.purchaseDate).format('YYYY-MM-DD HH:mm:ss'),
                'Check-in Status': attendee.checkInStatus,
                'Gender': attendee.gender,
                'Age Group': attendee.ageGroup,
                'City': attendee.city,
                'Country': attendee.country,
            }));

            const csv = convertToCSV(reportData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) { // Feature detection for download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${eventDetails.name.replace(/\s+/g, '-')}-attendees-report-${dayjs().format('YYYYMMDD')}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url); // Clean up
                setMessage({ type: 'success', text: 'Report downloaded successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Your browser does not support downloading files directly.' });
            }
        } catch (error) {
            console.error("Error generating report:", error);
            setMessage({ type: 'error', text: 'Failed to generate report.' });
        } finally {
            setReportGenerating(false);
        }
    };

    const handleEventChange = (event) => {
        setSelectedEventId(event.target.value);
    };

    if (loadingEvents) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading events...</Typography>
            </Box>
        );
    }

    if (availableEvents.length === 0) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    <PeopleIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Attendees Report
                </Typography>
                <Alert severity="info" sx={{ mt: 3 }}>
                    No events found for this organizer to view attendees.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    <PeopleIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Attendees Report
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleGenerateReport}
                    disabled={reportGenerating || attendeesData.length === 0}
                >
                    {reportGenerating ? <CircularProgress size={24} color="inherit" /> : 'Download Report (CSV)'}
                </Button>
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="event-select-label">Select Event</InputLabel>
                            <Select
                                labelId="event-select-label"
                                value={selectedEventId}
                                onChange={handleEventChange}
                                label="Select Event"
                                startAdornment={<InputLabel htmlFor="event-select-label"><EventNoteIcon sx={{ mr: 1 }} /></InputLabel>}
                            >
                                {availableEvents.map((event) => (
                                    <MenuItem key={event.id} value={event.id}>
                                        {event.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {eventDetails && (
                            <Typography variant="h6" color="text.secondary">
                                Currently showing attendees for: <strong>{eventDetails.name}</strong>
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {loadingAttendees ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading attendees data for {eventDetails?.name || 'selected event'}...</Typography>
                </Box>
            ) : attendeesData.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No attendees found for "{eventDetails?.name || 'the selected event'}" yet.
                </Alert>
            ) : (
                <>
                    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" gutterBottom>Demographics & Overview</Typography>
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary">Total Attendees (Unique)</Typography>
                                    <Typography variant="h4" color="primary">{demographics.totalAttendees}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary">Total Tickets Sold</Typography>
                                    <Typography variant="h4" color="primary">
                                        {attendeesData.reduce((sum, att) => sum + att.quantity, 0)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            {/* Ticket Type Distribution */}
                            {demographics.ticketTypeDistribution.length > 0 && (
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Tickets by Type</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={demographics.ticketTypeDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {demographics.ticketTypeDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Gender Distribution */}
                            {demographics.genderDistribution.length > 0 && (
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Attendees by Gender</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={demographics.genderDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {demographics.genderDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Age Group Distribution */}
                            {demographics.ageGroupDistribution.length > 0 && (
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Attendees by Age Group</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={demographics.ageGroupDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" fill="#82ca9d" name="Number of Attendees" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Check-in Status Distribution */}
                            {demographics.checkInStatusDistribution.length > 0 && (
                                <Grid item xs={12} md={6}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Check-in Status</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={demographics.checkInStatusDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {demographics.checkInStatusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Attendance Over Time */}
                            {demographics.attendanceOverTime.length > 0 && (
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Tickets Sold Over Time</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={demographics.attendanceOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="ticketsSold" fill="#8884d8" name="Tickets Sold" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}

                            {/* City Distribution (Bar Chart for more cities) */}
                            {demographics.cityDistribution.length > 0 && (
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{ p: 2, height: 350 }}>
                                        <Typography variant="h6" gutterBottom>Attendees by City</Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={demographics.cityDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" fill="#FFC0CB" name="Number of Attendees" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>


                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Attendee List</Typography>
                        <TableContainer>
                            <Table stickyHeader aria-label="attendees table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Ticket Type</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell>Purchase Date</TableCell>
                                        <TableCell>Check-in Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendeesData.map((attendee) => (
                                        <TableRow key={attendee.id}>
                                            <TableCell>{attendee.firstName} {attendee.lastName}</TableCell>
                                            <TableCell>{attendee.email}</TableCell>
                                            <TableCell>{attendee.phone}</TableCell>
                                            <TableCell>{attendee.ticketTypeName}</TableCell>
                                            <TableCell align="right">{attendee.quantity}</TableCell>
                                            <TableCell>{dayjs(attendee.purchaseDate).format('MMM D, YYYY h:mm A')}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={attendee.checkInStatus}
                                                    color={attendee.checkInStatus === 'Checked In' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </Box>
    );
};