import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Chip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// In a real application, this data would come from Firestore or your backend.

// Dummy Events (with an organizerId and a checkInStaff array)
const dummyEvents = [
    {
        id: 'event-1',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1', // Assuming this admin's ID
        date: '2025-09-10',
        location: 'Convention Center',
        assignedCheckInStaffIds: ['staff-1', 'staff-3'], // IDs of assigned staff
    },
    {
        id: 'event-2',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        date: '2025-10-22',
        location: 'Grand Ballroom',
        assignedCheckInStaffIds: ['staff-2'],
    },
    {
        id: 'event-3',
        name: 'Local Food Festival',
        organizerId: 'organizer-2', // Event by another organizer
        date: '2025-08-01',
        location: 'City Park',
        assignedCheckInStaffIds: [],
    },
    {
        id: 'event-4',
        name: 'Winter Wonderland Market',
        organizerId: 'organizer-1',
        date: '2025-12-05',
        location: 'Winter Fairgrounds',
        assignedCheckInStaffIds: [],
    },
];

// Dummy Users (including check-in staff and the current organizer)
const dummyUsers = [
    { id: 'organizer-1', name: 'Admin Organizer', email: 'admin@example.com', role: 'event_organizer' },
    { id: 'staff-1', name: 'Alice Johnson', email: 'alice@checkin.com', role: 'check_in_staff' },
    { id: 'staff-2', name: 'Bob Williams', email: 'bob@checkin.com', role: 'check_in_staff' },
    { id: 'staff-3', name: 'Charlie Brown', email: 'charlie@checkin.com', role: 'check_in_staff' },
    { id: 'staff-4', name: 'Diana Prince', email: 'diana@checkin.com', role: 'check_in_staff' },
    { id: 'staff-5', name: 'Eve Adams', email: 'eve@checkin.com', role: 'check_in_staff' },
    { id: 'attendee-1', name: 'Frank Green', email: 'frank@attendee.com', role: 'attendee' },
];

// Dummy Scan Records
const dummyScanRecords = [
    { id: 'scan-1', eventId: 'event-1', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T10:05:00Z', ticketId: 'ticket-A1', status: 'valid' },
    { id: 'scan-2', eventId: 'event-1', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T10:06:00Z', ticketId: 'ticket-A2', status: 'valid' },
    { id: 'scan-3', eventId: 'event-1', scannedByStaffId: 'staff-3', timestamp: '2025-09-10T10:07:00Z', ticketId: 'ticket-A3', status: 'valid' },
    { id: 'scan-4', eventId: 'event-1', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T10:08:00Z', ticketId: 'ticket-A4', status: 'duplicate' },
    { id: 'scan-5', eventId: 'event-2', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T09:30:00Z', ticketId: 'ticket-B1', status: 'valid' },
    { id: 'scan-6', eventId: 'event-2', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T09:31:00Z', ticketId: 'ticket-B2', status: 'valid' },
    { id: 'scan-7', eventId: 'event-2', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T09:32:00Z', ticketId: 'ticket-B3', status: 'valid' },
    { id: 'scan-8', eventId: 'event-1', scannedByStaffId: 'staff-3', timestamp: '2025-09-10T10:09:00Z', ticketId: 'ticket-A5', status: 'valid' },
];

// --- Helper Functions (Simulating Database Interactions) ---

// Get events for the current organizer
const getOrganizerEvents = (organizerId) => {
    return dummyEvents.filter(event => event.organizerId === organizerId);
};

// Get all check-in staff users
const getAllCheckInStaff = () => {
    return dummyUsers.filter(user => user.role === 'check_in_staff');
};

// Get scan records for a specific event and optionally a specific staff member
const getScanRecords = (eventId, staffId = null) => {
    let records = dummyScanRecords.filter(record => record.eventId === eventId);
    if (staffId) {
        records = records.filter(record => record.scannedByStaffId === staffId);
    }
    return records;
};

// Simulate updating an event's assigned staff
const updateEventAssignedStaff = (eventId, newStaffIds) => {
    const eventIndex = dummyEvents.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
        dummyEvents[eventIndex].assignedCheckInStaffIds = newStaffIds;
        // In a real app, you'd send this update to Firestore
        console.log(`Event ${eventId} staff updated:`, dummyEvents[eventIndex].assignedCheckInStaffIds);
    }
};

// --- React Component ---

export const AdminCheckInStaff = () => {
    // This would be the actual organizer's ID from your auth context
    const currentOrganizerId = 'organizer-1';

    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [allCheckInStaff, setAllCheckInStaff] = useState([]);
    const [assignedStaff, setAssignedStaff] = useState([]);
    const [availableStaff, setAvailableStaff] = useState([]);
    const [staffDetailsModalOpen, setStaffDetailsModalOpen] = useState(false);
    const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
    const [selectedStaffScans, setSelectedStaffScans] = useState([]);

    // Fetch initial data on component mount
    useEffect(() => {
        setEvents(getOrganizerEvents(currentOrganizerId));
        setAllCheckInStaff(getAllCheckInStaff());
    }, []);

    // Effect to update assigned/available staff whenever selectedEventId or allCheckInStaff changes
    useEffect(() => {
        if (selectedEventId) {
            const event = events.find(e => e.id === selectedEventId);
            if (event) {
                const currentAssignedIds = event.assignedCheckInStaffIds || [];
                const newAssignedStaff = allCheckInStaff.filter(staff => currentAssignedIds.includes(staff.id));
                const newAvailableStaff = allCheckInStaff.filter(staff => !currentAssignedIds.includes(staff.id));

                // Calculate scan statistics for assigned staff
                const assignedStaffWithStats = newAssignedStaff.map(staff => {
                    const scans = getScanRecords(selectedEventId, staff.id);
                    const validScans = scans.filter(s => s.status === 'valid').length;
                    const invalidScans = scans.filter(s => s.status !== 'valid').length;
                    return { ...staff, totalScans: scans.length, validScans, invalidScans };
                });

                setAssignedStaff(assignedStaffWithStats);
                setAvailableStaff(newAvailableStaff);
            }
        } else {
            setAssignedStaff([]);
            setAvailableStaff(allCheckInStaff); // All staff are 'available' if no event is selected
        }
    }, [selectedEventId, events, allCheckInStaff]);

    const handleEventChange = (event) => {
        setSelectedEventId(event.target.value);
    };

    const handleAssignStaff = (staffId) => {
        const eventToUpdate = events.find(e => e.id === selectedEventId);
        if (eventToUpdate) {
            const newAssignedIds = [...(eventToUpdate.assignedCheckInStaffIds || []), staffId];
            updateEventAssignedStaff(selectedEventId, newAssignedIds);
            // Manually update the state to reflect the change for demonstration
            setEvents(prevEvents => prevEvents.map(e =>
                e.id === selectedEventId ? { ...e, assignedCheckInStaffIds: newAssignedIds } : e
            ));
        }
    };

    const handleUnassignStaff = (staffId) => {
        const eventToUpdate = events.find(e => e.id === selectedEventId);
        if (eventToUpdate) {
            const newAssignedIds = (eventToUpdate.assignedCheckInStaffIds || []).filter(id => id !== staffId);
            updateEventAssignedStaff(selectedEventId, newAssignedIds);
            // Manually update the state to reflect the change for demonstration
            setEvents(prevEvents => prevEvents.map(e =>
                e.id === selectedEventId ? { ...e, assignedCheckInStaffIds: newAssignedIds } : e
            ));
        }
    };

    const handleViewStaffDetails = (staff) => {
        setSelectedStaffForDetails(staff);
        const scans = getScanRecords(selectedEventId, staff.id);
        setSelectedStaffScans(scans);
        setStaffDetailsModalOpen(true);
    };

    const handleCloseStaffDetailsModal = () => {
        setStaffDetailsModalOpen(false);
        setSelectedStaffForDetails(null);
        setSelectedStaffScans([]);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, height: '100vh' }}>
            <Typography variant="h4" gutterBottom>
                Manage Check-in Staff
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel id="select-event-label">Select Event</InputLabel>
                    <Select
                        labelId="select-event-label"
                        id="select-event"
                        value={selectedEventId}
                        label="Select Event"
                        onChange={handleEventChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {events.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.name} ({event.date})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {selectedEventId ? (
                <Grid container spacing={3}>
                    {/* Assigned Check-in Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Assigned Staff for{' '}
                                <Chip label={events.find(e => e.id === selectedEventId)?.name || ''} color="primary" size="small" />
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="center">Total Scans</TableCell>
                                            <TableCell align="center">Valid Scans</TableCell>
                                            <TableCell align="center">Invalid Scans</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {assignedStaff.length > 0 ? (
                                            assignedStaff.map((staff) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>{staff.name}</TableCell>
                                                    <TableCell align="center">{staff.totalScans}</TableCell>
                                                    <TableCell align="center">{staff.validScans}</TableCell>
                                                    <TableCell align="center">{staff.invalidScans}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="info"
                                                            size="small"
                                                            onClick={() => handleViewStaffDetails(staff)}
                                                            aria-label={`view details for ${staff.name}`}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleUnassignStaff(staff.id)}
                                                            aria-label={`unassign ${staff.name}`}
                                                        >
                                                            <PersonRemoveIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    No staff assigned to this event.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Available Check-in Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Available Check-in Staff
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableStaff.length > 0 ? (
                                            availableStaff.map((staff) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>{staff.name}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleAssignStaff(staff.id)}
                                                            aria-label={`assign ${staff.name}`}
                                                        >
                                                            <PersonAddIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">
                                                    All available staff are assigned to this event.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Please select an event to manage check-in staff.
                    </Typography>
                </Paper>
            )}

            {/* Staff Details Modal */}
            <Dialog open={staffDetailsModalOpen} onClose={handleCloseStaffDetailsModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    Scan Details for {selectedStaffForDetails?.name} (Event:{' '}
                    {events.find(e => e.id === selectedEventId)?.name})
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticket ID</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedStaffScans.length > 0 ? (
                                    selectedStaffScans.map((scan) => (
                                        <TableRow key={scan.id}>
                                            <TableCell>{scan.ticketId}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={scan.status}
                                                    color={scan.status === 'valid' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(scan.timestamp).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No scans recorded by this staff member for this event.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStaffDetailsModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};