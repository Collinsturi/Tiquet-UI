import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // Icon for assignment

// Define a custom Material-UI theme for consistent styling
const theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
        secondary: {
            main: green[500],
        },
        error: {
            main: red[500],
        },
        warning: {
            main: orange[500],
        },
        info: {
            main: purple[500],
        },
        text: {
            secondary: grey[600],
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#6b7280',
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                },
            },
        },
    },
});

// Sample Data for Events and Check-in Staff
const initialEvents = [
    { id: 'event_1', name: 'Summer Music Festival', date: '2025-08-10', assignedStaffIds: ['staff_1'] },
    { id: 'event_2', name: 'Annual Tech Summit', date: '2025-09-01', assignedStaffIds: ['staff_2', 'staff_3'] },
    { id: 'event_3', name: 'Local Art Exhibition', date: '2025-10-20', assignedStaffIds: [] },
    { id: 'event_4', name: 'Community Fun Run', date: '2025-07-25', assignedStaffIds: ['staff_1'] },
    { id: 'event_5', name: 'Winter Gala Dinner', date: '2025-12-15', assignedStaffIds: [] },
];

const initialCheckingStaff = [
    { id: 'staff_1', name: 'Bob Johnson', email: 'bob.j@example.com' },
    { id: 'staff_2', name: 'Eve Davis', email: 'eve.d@example.com' },
    { id: 'staff_3', name: 'Frank White', email: 'frank.w@example.com' },
    { id: 'staff_4', name: 'Grace Lee', email: 'grace.l@example.com' },
];

export const CheckInStaffAssignment = () => {
    const [events, setEvents] = useState(initialEvents);
    const [checkingStaff, setCheckingStaff] = useState(initialCheckingStaff);
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handler to open the assignment dialog for a specific event
    const handleOpenAssignment = (event) => {
        setSelectedEvent({ ...event }); // Create a copy to edit in dialog
        setOpenAssignmentDialog(true);
    };

    // Handler to save assignments
    const handleSaveAssignment = () => {
        setEvents(events.map(event =>
            event.id === selectedEvent.id ? selectedEvent : event
        ));
        setOpenAssignmentDialog(false);
        setSelectedEvent(null);
    };

    // Helper function to get staff name by ID
    const getStaffName = (staffId) => {
        const staff = checkingStaff.find(s => s.id === staffId);
        return staff ? staff.name : 'Unknown Staff';
    };

    // Filter events based on search term
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.assignedStaffIds.some(id => getStaffName(id).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">

                {/* Events List Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <EventAvailableIcon className="mr-2" color="primary" /> Manage Event Staff
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Events or Assigned Staff"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
                            />
                        </Box>
                        <List>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <React.Fragment key={event.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AssignmentIndIcon />}
                                                    onClick={() => handleOpenAssignment(event)}
                                                >
                                                    Assign Staff
                                                </Button>
                                            }
                                            className="py-3"
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" className="font-semibold text-gray-800">
                                                        {event.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component="span" variant="body2" className="inline text-gray-600">
                                                            Date: {event.date}
                                                        </Typography>
                                                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {event.assignedStaffIds.length > 0 ? (
                                                                event.assignedStaffIds.map((staffId, sIndex) => (
                                                                    <Chip
                                                                        key={sIndex}
                                                                        label={getStaffName(staffId)}
                                                                        size="small"
                                                                        color="secondary"
                                                                        variant="outlined"
                                                                        icon={<PersonPinIcon fontSize="small" />}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">No staff assigned.</Typography>
                                                            )}
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {index < filteredEvents.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    No events found matching your search.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Box>

                {/* Assignment Dialog */}
                {selectedEvent && (
                    <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Assign Staff to: {selectedEvent.name}</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Event Date: {selectedEvent.date}
                            </Typography>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="assign-staff-label">Select Check-in Staff</InputLabel>
                                <Select
                                    labelId="assign-staff-label"
                                    multiple
                                    value={selectedEvent.assignedStaffIds || []}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, assignedStaffIds: e.target.value })}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={getStaffName(value)} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {checkingStaff.map((staff) => (
                                        <MenuItem key={staff.id} value={staff.id}>
                                            {staff.name} ({staff.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                                Currently Assigned Staff:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, border: '1px solid #ccc', borderRadius: '8px', minHeight: '50px' }}>
                                {selectedEvent.assignedStaffIds && selectedEvent.assignedStaffIds.length > 0 ? (
                                    selectedEvent.assignedStaffIds.map(staffId => (
                                        <Chip
                                            key={staffId}
                                            label={getStaffName(staffId)}
                                            onDelete={() => setSelectedEvent({
                                                ...selectedEvent,
                                                assignedStaffIds: selectedEvent.assignedStaffIds.filter(id => id !== staffId)
                                            })}
                                            color="secondary"
                                            variant="contained"
                                            icon={<PersonPinIcon fontSize="small" />}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No staff assigned to this event.</Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAssignmentDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveAssignment} variant="contained" color="primary">Save Assignment</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default CheckInStaffAssignment;
