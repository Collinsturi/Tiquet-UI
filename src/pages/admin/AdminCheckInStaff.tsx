import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';

import {
    useAvailableStaffQuery,
    useGetStaffScannedEventsQuery,
    useAssignStaffToEventMutation,
    useUnassignStaffFromEventMutation,
    useGetStaffForAssignedEventQuery, // Use the new, corrected query
} from '../../queries/checkInStaff/StaffScannedQuery.ts';
import { useGetOrganizerEventsQuery } from '../../queries/general/EventQuery.ts';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";

export const AdminCheckInStaff = ({ organizerEmail }: { organizerEmail: string }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [staffDetailsModalOpen, setStaffDetailsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [selectedStaffScans, setSelectedStaffScans] = useState<any[]>([]);
    const user = useSelector((state: RootState) => state.user.user);

    // --- Queries ---
    const { data: availableStaff = [], isLoading: isLoadingStaff } = useAvailableStaffQuery();
    const { data: organizerEvents = [], isLoading: isLoadingEvents } = useGetOrganizerEventsQuery(user.email);

    console.log(organizerEvents)
    // CORRECTED: Fetch assigned staff for the selected event using the new query
    const { data: assignedStaffForEvent = [], isLoading: isLoadingAssignedStaff } = useGetStaffForAssignedEventQuery(
        { organizerEmail: user.email, eventId: selectedEventId as number },
        { skip: !selectedEventId || !user.email } // Skip if no event or user email is selected
    );

    // Fetch scanned tickets for a staff member
    const { data: scannedEvents } = useGetStaffScannedEventsQuery(
        selectedStaff?.email ?? '', { skip: !selectedStaff?.email }
    );

    const [assignStaff] = useAssignStaffToEventMutation();
    const [unassignStaff] = useUnassignStaffFromEventMutation();

    const selectedEvent = organizerEvents.find(e => e.eventId === selectedEventId);

    const handleEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedEventId(event.target.value as number);
    };

    const handleAssignStaff = async (staffEmail: string) => {
        if (!selectedEventId) {
            console.error("No event selected to assign staff to.");
            return;
        }
        try {
            await assignStaff({ eventId: selectedEventId as number, staffEmail, organizerEmail: user.email }).unwrap();
            console.log(`Successfully assigned ${staffEmail} to event ${selectedEventId}`);
        } catch (error) {
            console.error("Failed to assign staff:", error);
        }
    };

    const handleUnassignStaff = async (staffEmail: string) => {
        if (!selectedEventId) {
            console.error("No event selected to unassign staff from.");
            return;
        }
        try {
            await unassignStaff({ eventId: selectedEventId as number, staffEmail: [staffEmail], organizerEmail: user.email }).unwrap();
            console.log(`Successfully unassigned ${staffEmail} from event ${selectedEventId}`);
        } catch (error) {
            console.error("Failed to unassign staff:", error);
        }
    };

    const handleViewStaffDetails = (staff: any) => {
        setSelectedStaff(staff);
        if (scannedEvents) {
            setSelectedStaffScans(Array.isArray(scannedEvents) ? scannedEvents : [scannedEvents]);
        }
        setStaffDetailsModalOpen(true);
    };

    const handleCloseStaffDetailsModal = () => {
        setStaffDetailsModalOpen(false);
        setSelectedStaff(null);
        setSelectedStaffScans([]);
    };

    // Filter available staff to exclude those already assigned to the selected event
    const trulyAvailableStaff = availableStaff.filter(
        (staff) => !assignedStaffForEvent.some((assigned) => assigned.email === staff.email)
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>Manage Check-in Staff</Typography>

            {/* Event Selection */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel id="select-event-label">Select Event</InputLabel>
                    <Select
                        labelId="select-event-label"
                        value={selectedEventId}
                        label="Select Event"
                        onChange={handleEventChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {organizerEvents.map((event) => (
                            <MenuItem key={event.eventId} value={event.eventId}>
                                {event.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {selectedEventId ? (
                <Grid container spacing={3}>
                    {/* Available Check-in Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Available Staff</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoadingStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">Loading available staff...</TableCell>
                                            </TableRow>
                                        ) : trulyAvailableStaff.length > 0 ? (
                                            trulyAvailableStaff.map((staff) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleAssignStaff(staff.email)}
                                                            aria-label={`Assign ${staff.firstName}`}
                                                        >
                                                            <PersonAddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewStaffDetails(staff)}
                                                            aria-label={`View details for ${staff.firstName}`}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">No available staff to assign.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Assigned Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Assigned Staff for "{selectedEvent?.title}"</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoadingAssignedStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">Loading assigned staff...</TableCell>
                                            </TableRow>
                                        ) : assignedStaffForEvent.length > 0 ? (
                                            assignedStaffForEvent.map((staff) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => handleUnassignStaff(staff.email)}
                                                            aria-label={`Unassign ${staff.firstName}`}
                                                        >
                                                            <PersonRemoveIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewStaffDetails(staff)}
                                                            aria-label={`View details for ${staff.firstName}`}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">No staff assigned to this event.</TableCell>
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
                    <Typography variant="h6" color="text.secondary">Please select an event to continue.</Typography>
                </Paper>
            )}

            {/* Staff Details Modal */}
            <Dialog open={staffDetailsModalOpen} onClose={handleCloseStaffDetailsModal} maxWidth="md" fullWidth>
                <DialogTitle>Scan Details for {selectedStaff?.firstName} {selectedStaff?.lastName}</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event ID</TableCell>
                                    <TableCell>Tickets Scanned</TableCell>
                                    <TableCell>Tickets Sold</TableCell>
                                    <TableCell>Event Title</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedStaffScans.length > 0 ? (
                                    selectedStaffScans.map((scan, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{scan.eventId}</TableCell>
                                            <TableCell>{scan.ticketScanned}</TableCell>
                                            <TableCell>{scan.ticketsSold}</TableCell>
                                            <TableCell>{scan.title}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No scan records found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStaffDetailsModal} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};