import { useState } from 'react';
import {
    Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress,
    Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';

import {
    useAvailableStaffQuery,
    useGetStaffScannedEventsQuery,
    useAssignStaffToEventMutation,
    useUnassignStaffFromEventMutation,
    useGetStaffForAssignedEventQuery,
} from '../../queries/checkInStaff/StaffScannedQuery.ts';
import { useGetOrganizerEventsQuery } from '../../queries/general/EventQuery.ts';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";

export const AdminCheckInStaff = () => {
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [staffDetailsModalOpen, setStaffDetailsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [selectedStaffScans, setSelectedStaffScans] = useState<any[]>([]);
    const user = useSelector((state: RootState) => state.user.user);
    const organizerEmail = user?.email; // Safely get the email

    // --- Queries ---
    const { data: availableStaff = [], isLoading: isLoadingAvailableStaff, isError: isErrorAvailableStaff, error: errorAvailableStaff } = useAvailableStaffQuery();
    const { data: organizerEvents = [], isLoading: isLoadingEvents, isError: isErrorEvents, error: errorEvents } = useGetOrganizerEventsQuery(organizerEmail!, {
        skip: !organizerEmail,
    });

    const { data: assignedStaffForEvent = [], isLoading: isLoadingAssignedStaff, isError: isErrorAssignedStaff, error: errorAssignedStaff } = useGetStaffForAssignedEventQuery(
        { organizerEmail: organizerEmail!, eventId: selectedEventId as number },
        { skip: !selectedEventId || !organizerEmail }
    );

    const { data: scannedEvents, isLoading: isLoadingScannedEvents, isError: isErrorScannedEvents, error: errorScannedEvents } = useGetStaffScannedEventsQuery(
        selectedStaff?.email ?? '', { skip: !selectedStaff?.email }
    );

    const [assignStaff] = useAssignStaffToEventMutation();
    const [unassignStaff] = useUnassignStaffFromEventMutation();

    const selectedEvent = organizerEvents.find(e => e.eventId === selectedEventId);

    const handleEventChange = (event: any) => {
        setSelectedEventId(event.target.value as number);
    };

    const handleAssignStaff = async (staffEmail: string) => {
        if (!selectedEventId) {
            console.error("No event selected to assign staff to.");
            return;
        }
        try {
            await assignStaff({ eventId: selectedEventId as number, staffEmail, organizerEmail: organizerEmail! }).unwrap();
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
            await unassignStaff({ eventId: selectedEventId as number, staffEmail, organizerEmail: organizerEmail! }).unwrap();
            console.log(`Successfully unassigned ${staffEmail} from event ${selectedEventId}`);
        } catch (error) {
            console.error("Failed to unassign staff:", error);
        }
    };

    const handleViewStaffDetails = (staff: any) => {
        setSelectedStaff(staff);
        if (scannedEvents) {
            setSelectedStaffScans(Array.isArray(scannedEvents) ? scannedEvents : [scannedEvents]);
        } else {
            setSelectedStaffScans([]);
        }
        setStaffDetailsModalOpen(true);
    };

    const handleCloseStaffDetailsModal = () => {
        setStaffDetailsModalOpen(false);
        setSelectedStaff(null);
        setSelectedStaffScans([]);
    };

    const trulyAvailableStaff = availableStaff.filter(
        (staff) => !assignedStaffForEvent.some((assigned) => assigned.email === staff.email)
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)', minHeight: '100vh', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>Manage Check-in Staff</Typography>

            {/* Event Selection */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <FormControl fullWidth>
                    <InputLabel id="select-event-label" sx={{ color: 'var(--color-my-base-content)' }}>Select Event</InputLabel>
                    <Select
                        labelId="select-event-label"
                        value={selectedEventId}
                        label="Select Event"
                        onChange={handleEventChange}
                        sx={{
                            color: 'var(--color-my-base-content)',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-my-base-300)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-my-primary)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-my-primary)', // Use primary for hover
                            },
                            '.MuiSvgIcon-root': {
                                color: 'var(--color-my-base-content)',
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: 'var(--color-my-base-100)',
                                    color: 'var(--color-my-base-content)',
                                },
                            },
                        }}
                    >
                        <MenuItem value="" sx={{ color: 'var(--color-my-base-content)' }}><em>None</em></MenuItem>
                        {isLoadingEvents ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'var(--color-my-primary)' }} /> Loading events...
                            </MenuItem>
                        ) : isErrorEvents ? (
                            <MenuItem disabled sx={{ color: 'var(--color-my-error)' }}>Error loading events.</MenuItem>
                        ) : (
                            organizerEvents.map((event) => (
                                <MenuItem key={event.eventId} value={event.eventId} sx={{ color: 'var(--color-my-base-content)' }}>
                                    {event.title}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                    {isErrorEvents && <Alert severity="error" sx={{ mt: 1, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{(errorEvents as any)?.data?.message || 'Failed to load events.'}</Alert>}
                </FormControl>
            </Paper>

            {selectedEventId ? (
                <Grid container spacing={3}>
                    {/* Available Check-in Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, backgroundColor: 'var(--color-my-base-100)' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Available Staff</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'var(--color-my-base-200)' }}> {/* Lighter background for header */}
                                            <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Name</TableCell>
                                            <TableCell align="right" sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoadingAvailableStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-base-content)' }}>
                                                    <CircularProgress size={20} sx={{ mr: 1, color: 'var(--color-my-primary)' }} /> Loading available staff...
                                                </TableCell>
                                            </TableRow>
                                        ) : isErrorAvailableStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-error)' }}>
                                                    <Alert severity="error" sx={{ width: '100%', backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{(errorAvailableStaff as any)?.data?.message || 'Failed to load available staff.'}</Alert>
                                                </TableCell>
                                            </TableRow>
                                        ) : trulyAvailableStaff.length > 0 ? (
                                            trulyAvailableStaff.map((staff) => (
                                                <TableRow key={staff.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                                                    <TableCell align="right" sx={{ borderColor: 'var(--color-my-base-300)' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAssignStaff(staff.email)}
                                                            aria-label={`Assign ${staff.firstName}`}
                                                            sx={{ color: 'var(--color-my-primary)' }}
                                                        >
                                                            <PersonAddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewStaffDetails(staff)}
                                                            aria-label={`View details for ${staff.firstName}`}
                                                            sx={{ color: 'var(--color-my-info)' }}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-base-content)' }}>No available staff to assign.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Assigned Staff */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, backgroundColor: 'var(--color-my-base-100)' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Assigned Staff for "{selectedEvent?.title}"</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'var(--color-my-base-200)' }}> {/* Lighter background for header */}
                                            <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Name</TableCell>
                                            <TableCell align="right" sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoadingAssignedStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-base-content)' }}>
                                                    <CircularProgress size={20} sx={{ mr: 1, color: 'var(--color-my-primary)' }} /> Loading assigned staff...
                                                </TableCell>
                                            </TableRow>
                                        ) : isErrorAssignedStaff ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-error)' }}>
                                                    <Alert severity="error" sx={{ width: '100%', backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{(errorAssignedStaff as any)?.data?.message || 'Failed to load assigned staff.'}</Alert>
                                                </TableCell>
                                            </TableRow>
                                        ) : assignedStaffForEvent.length > 0 ? (
                                            assignedStaffForEvent.map((staff) => (
                                                <TableRow key={staff.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                                                    <TableCell align="right" sx={{ borderColor: 'var(--color-my-base-300)' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleUnassignStaff(staff.email)}
                                                            aria-label={`Unassign ${staff.firstName}`}
                                                            sx={{ color: 'var(--color-my-secondary)' }}
                                                        >
                                                            <PersonRemoveIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewStaffDetails(staff)}
                                                            aria-label={`View details for ${staff.firstName}`}
                                                            sx={{ color: 'var(--color-my-info)' }}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: 'var(--color-my-base-content)' }}>No staff assigned to this event.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: 'var(--color-my-base-100)' }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-my-base-content)' }}>Please select an event to continue.</Typography>
                </Paper>
            )}

            {/* Staff Details Modal */}
            <Dialog open={staffDetailsModalOpen} onClose={handleCloseStaffDetailsModal} maxWidth="md" fullWidth
                    PaperProps={{
                        sx: {
                            backgroundColor: 'var(--color-my-base-100)',
                            color: 'var(--color-my-base-content)',
                        }
                    }}
            >
                <DialogTitle sx={{ color: 'var(--color-my-primary)' }}>Scan Details for {selectedStaff?.firstName} {selectedStaff?.lastName}</DialogTitle>
                <DialogContent>
                    {isLoadingScannedEvents ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'var(--color-my-primary)' }} />
                            <Typography sx={{ color: 'var(--color-my-base-content)' }}>Loading scan records...</Typography>
                        </Box>
                    ) : isErrorScannedEvents ? (
                        <Alert severity="error" sx={{ mt: 2, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>{(errorScannedEvents as any)?.data?.message || 'Failed to load scan records.'}</Alert>
                    ) : (
                        <TableContainer component={Paper} sx={{ backgroundColor: 'var(--color-my-base-100)', border: `1px solid var(--color-my-base-300)` }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'var(--color-my-base-200)' }}> {/* Lighter background for header */}
                                        <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Event ID</TableCell>
                                        <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Tickets Scanned</TableCell>
                                        <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Tickets Sold</TableCell>
                                        <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Event Title</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedStaffScans.length > 0 ? (
                                        selectedStaffScans.map((scan, i) => (
                                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{scan.eventId}</TableCell>
                                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{scan.ticketScanned}</TableCell>
                                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{scan.ticketsSold}</TableCell>
                                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{scan.title}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ color: 'var(--color-my-base-content)' }}>No scan records found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'var(--color-my-base-100)' }}>
                    <Button onClick={handleCloseStaffDetailsModal} sx={{ color: 'var(--color-my-primary)' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};