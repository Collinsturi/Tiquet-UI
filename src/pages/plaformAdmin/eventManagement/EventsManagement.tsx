import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem,
    Switch, FormControlLabel, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

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

// Sample Data for Events
const initialEvents = [
    {
        id: 'event_1',
        event_name: 'Summer Music Festival 2025',
        description: 'An annual music festival featuring various genres and artists.',
        datetimes: '2025-08-10 10:00 AM - 2025-08-12 10:00 PM',
        address: 'Festival Grounds, City Park',
        images: ['https://placehold.co/100x70/FF5722/ffffff?text=Event1', 'https://placehold.co/100x70/FF9800/ffffff?text=Stage'],
        status: 'published', // published, cancelled, postponed, completed
        is_featured: true,
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        ticket_types: [
            { id: 'tt_1', name: 'General Admission', price: 50.00, quantity: 1000, sold: 750, sales_start: '2025-03-01', sales_end: '2025-08-09' },
            { id: 'tt_2', name: 'VIP Pass', price: 150.00, quantity: 100, sold: 80, sales_start: '2025-03-01', sales_end: '2025-08-09' },
        ],
        assigned_staff_ids: ['staff_1', 'staff_2'],
    },
    {
        id: 'event_2',
        event_name: 'Annual Tech Summit 2025',
        description: 'A summit for tech enthusiasts and professionals, covering latest innovations.',
        datetimes: '2025-09-01 09:00 AM - 2025-09-03 05:00 PM',
        address: 'Convention Center, Downtown',
        images: ['https://placehold.co/100x70/9C27B0/ffffff?text=TechSummit'],
        status: 'postponed',
        is_featured: false,
        organizer_id: 'org_3',
        organizer_name: 'Tech Innovations Ltd.',
        ticket_types: [
            { id: 'tt_3', name: 'Standard Ticket', price: 200.00, quantity: 500, sold: 300, sales_start: '2025-04-01', sales_end: '2025-08-31' },
        ],
        assigned_staff_ids: ['staff_3'],
    },
    {
        id: 'event_3',
        event_name: 'Local Art Exhibition',
        description: 'Showcasing works from local artists across various mediums.',
        datetimes: '2025-10-20 02:00 PM - 2025-10-22 08:00 PM',
        address: 'Community Art Gallery',
        images: ['https://placehold.co/100x70/FFEB3B/000000?text=ArtEx'],
        status: 'published',
        is_featured: true,
        organizer_id: 'org_2',
        organizer_name: 'City Arts Collective',
        ticket_types: [
            { id: 'tt_4', name: 'Entry Ticket', price: 10.00, quantity: 200, sold: 150, sales_start: '2025-07-01', sales_end: '2025-10-19' },
        ],
        assigned_staff_ids: [],
    },
    {
        id: 'event_4',
        event_name: 'Charity Run 5K',
        description: 'Run for a cause! Support local charities.',
        datetimes: '2025-07-25 08:00 AM',
        address: 'Central Park',
        images: ['https://placehold.co/100x70/4CAF50/ffffff?text=Run'],
        status: 'completed',
        is_featured: false,
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        ticket_types: [
            { id: 'tt_5', name: 'Runner Registration', price: 25.00, quantity: 300, sold: 300, sales_start: '2025-01-01', sales_end: '2025-07-24' },
        ],
        assigned_staff_ids: ['staff_1'],
    },
];

// Sample Data for Check-in Staff (reused from previous page)
const checkingStaff = [
    { id: 'staff_1', name: 'Bob Johnson', email: 'bob.j@example.com' },
    { id: 'staff_2', name: 'Eve Davis', email: 'eve.d@example.com' },
    { id: 'staff_3', name: 'Frank White', email: 'frank.w@example.com' },
    { id: 'staff_4', name: 'Grace Lee', email: 'grace.l@example.com' },
];


export const EventsManagement = () => {
    const [events, setEvents] = useState(initialEvents);
    const [openEditEventDialog, setOpenEditEventDialog] = useState(false);
    const [openViewEventDialog, setOpenViewEventDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [openManageTicketsDialog, setOpenManageTicketsDialog] = useState(false);
    const [openManageStaffDialog, setOpenManageStaffDialog] = useState(false);

    const [currentEvent, setCurrentEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to get staff name by ID
    const getStaffName = (staffId) => {
        const staff = checkingStaff.find(s => s.id === staffId);
        return staff ? staff.name : 'Unknown Staff';
    };

    // Handlers for Event Management
    const handleEditEvent = (event) => {
        setCurrentEvent({ ...event });
        setOpenEditEventDialog(true);
    };

    const handleSaveEvent = () => {
        setEvents(events.map(e => e.id === currentEvent.id ? currentEvent : e));
        setOpenEditEventDialog(false);
        setCurrentEvent(null);
    };

    const handleDeleteEvent = (event) => {
        setCurrentEvent(event);
        setOpenDeleteConfirmDialog(true);
    };

    const confirmDeleteEvent = () => {
        setEvents(events.filter(e => e.id !== currentEvent.id));
        setOpenDeleteConfirmDialog(false);
        setCurrentEvent(null);
    };

    const handleViewEvent = (event) => {
        setCurrentEvent(event);
        setOpenViewEventDialog(true);
    };

    const handleToggleFeatured = (event) => {
        setEvents(events.map(e => e.id === event.id ? { ...e, is_featured: !e.is_featured } : e));
    };

    const handleManageTickets = (event) => {
        setCurrentEvent({ ...event });
        setOpenManageTicketsDialog(true);
    };

    const handleSaveTicketTypes = () => {
        setEvents(events.map(e => e.id === currentEvent.id ? currentEvent : e));
        setOpenManageTicketsDialog(false);
        setCurrentEvent(null);
    };

    const handleManageStaff = (event) => {
        setCurrentEvent({ ...event });
        setOpenManageStaffDialog(true);
    };

    const handleSaveStaffAssignment = () => {
        setEvents(events.map(e => e.id === currentEvent.id ? currentEvent : e));
        setOpenManageStaffDialog(false);
        setCurrentEvent(null);
    };

    const handleToggleStaffAssignment = (staffId) => {
        const updatedStaff = currentEvent.assigned_staff_ids.includes(staffId)
            ? currentEvent.assigned_staff_ids.filter(id => id !== staffId)
            : [...currentEvent.assigned_staff_ids, staffId];
        setCurrentEvent({ ...currentEvent, assigned_staff_ids: updatedStaff });
    };


    // Filter events based on search term
    const filteredEvents = events.filter(event =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* All Events Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <EventIcon className="mr-2" color="primary" /> All Events
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Events by Name, Organizer, or Status"
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
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ ml: 2, minWidth: '150px' }}>
                                Add New Event
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event Name</TableCell>
                                        <TableCell>Organizer</TableCell>
                                        <TableCell>Date & Time</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Featured</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={event.images[0]} alt={event.event_name} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px', marginRight: '8px' }} />
                                                        {event.event_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{event.organizer_name}</TableCell>
                                                <TableCell>{event.datetimes}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                        color={
                                                            event.status === 'published' ? 'primary' :
                                                                event.status === 'cancelled' ? 'error' :
                                                                    event.status === 'postponed' ? 'warning' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={event.is_featured}
                                                        onChange={() => handleToggleFeatured(event)}
                                                        color="secondary"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view" onClick={() => handleViewEvent(event)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                    <IconButton aria-label="edit" onClick={() => handleEditEvent(event)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton aria-label="manage tickets" onClick={() => handleManageTickets(event)}>
                                                        <ConfirmationNumberIcon color="info" />
                                                    </IconButton>
                                                    <IconButton aria-label="manage staff" onClick={() => handleManageStaff(event)}>
                                                        <PeopleIcon color="secondary" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDeleteEvent(event)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No events found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Dialogs for Event Management */}
                {currentEvent && (
                    <>
                        {/* Edit Event Dialog */}
                        <Dialog open={openEditEventDialog} onClose={() => setOpenEditEventDialog(false)} maxWidth="md" fullWidth>
                            <DialogTitle>Edit Event: {currentEvent.event_name}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Event Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentEvent.event_name}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, event_name: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={currentEvent.description}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Date & Times"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentEvent.datetimes}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, datetimes: e.target.value })}
                                    helperText="e.g., 2025-08-10 10:00 AM - 2025-08-12 10:00 PM"
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Address"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentEvent.address}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, address: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Image URLs (comma separated)"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentEvent.images.join(', ')}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, images: e.target.value.split(',').map(url => url.trim()) })}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={currentEvent.status}
                                        label="Status"
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                                    >
                                        <MenuItem value="published">Published</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                        <MenuItem value="postponed">Postponed</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentEvent.is_featured}
                                            onChange={(e) => setCurrentEvent({ ...currentEvent, is_featured: e.target.checked })}
                                            color="primary"
                                        />
                                    }
                                    label="Feature Event on Homepage"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenEditEventDialog(false)}>Cancel</Button>
                                <Button onClick={handleSaveEvent} variant="contained" color="primary">Save</Button>
                            </DialogActions>
                        </Dialog>

                        {/* View Event Dialog */}
                        <Dialog open={openViewEventDialog} onClose={() => setOpenViewEventDialog(false)} maxWidth="md" fullWidth>
                            <DialogTitle>Event Details: {currentEvent.event_name}</DialogTitle>
                            {/*<DialogContent>*/}
                            {/*    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>*/}
                            {/*        <img src={currentEvent.images[0]} alt={currentEvent.event_name} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />*/}
                            {/*        <Box>*/}
                            {/*            <Typography variant="h6">{currentEvent.event_name}</Typography>*/}
                            {/*            <Typography variant="body2" color="text.secondary">Organizer: {currentEvent.organizer_name}</Typography>*/}
                            {/*        </Box>*/}
                            {/*    </Box>*/}
                            {/*    <Divider sx={{ my: 2 }} />*/}
                            {/*    <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>*/}
                            {/*    <Typography variant="body2"><strong>Description:</strong> {currentEvent.description}</Typography>*/}
                            {/*    <Typography variant="body2"><strong>Date & Time:</strong> {currentEvent.datetimes}</Typography>*/}
                            {/*    <Typography variant="body2"><strong>Address:</strong> {currentEvent.address}</Typography>*/}
                            {/*    <Typography variant="body2"><strong>Status:</strong> {currentEvent.status.charAt(0).toUpperCase() + currentEvent.status.slice(1)}</Typography>*/}
                            {/*    <Typography variant="body2"><strong>Featured:</strong> {currentEvent.is_featured ? 'Yes' : 'No'}</Typography>*/}

                            {/*    <Divider sx={{ my: 2 }} />*/}
                            {/*    <Typography variant="subtitle1" sx={{ mb: 1 }}>Ticket Types ({currentEvent.ticket_types.length})</Typography>*/}
                            {/*    {currentEvent.ticket_types.length > 0 ? (*/}
                            {/*        <List dense>*/}
                            {/*            {currentEvent.ticket_types.map(ticket => (*/}
                            {/*                <ListItem key={ticket.id}>*/}
                            {/*                    <ListItemText*/}
                            {/*                        primary={`${ticket.name} - $${ticket.price.toFixed(2)}`}*/}
                            {/*                        secondary={`Quantity: ${ticket.quantity} | Sold: ${ticket.sold} | Sales: ${ticket.sales_start} to ${ticket.sales_end}`}*/}
                            {/*                    />*/}
                            {/*                </ListItem>*/}
                            {/*            ))}*/}
                            {/*        </List>*/}
                            {/*    ) : (*/}
                            {/*        <Typography variant="body2" color="text.secondary">No ticket types defined.</Typography>*/}
                            {/*    )}*/}

                            {/*    <Divider sx={{ my: 2 }} />*/}
                            {/*    <Typography variant="subtitle1" sx={{ mb: 1 }}>Assigned Check-in Staff ({currentEvent.assigned_staff_ids.length})</Typography>*/}
                            {/*    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, border: '1px solid #ccc', borderRadius: '8px', minHeight: '50px' }}>*/}
                            {/*        {currentEvent.assigned_staff_ids.length > 0 ? (*/}
                            {/*            currentEvent.assigned_staff_ids.map(staffId => (*/}
                            {/*                <Chip*/}
                            {/*                    key={staffId}*/}
                            {/*                    label={getStaffName(staffId)}*/}
                            {/*                    size="small"*/}
                            {/*                    color="secondary"*/}
                            {/*                    variant="outlined"*/}
                            {/*                    icon={<PeopleIcon fontSize="small" />}*/}
                            {/*                />*/}
                            {/*            ))*/}
                            {/*        ) : (*/}
                            {/*            <Typography variant="body2" color="text.secondary">No staff assigned to this event.</Typography>*/}
                            {/*            </Typography>*/}
                            {/*            )}*/}
                            {/*    </Box>*/}
                            {/*</DialogContent>*/}
                            <DialogActions>
                                <Button onClick={() => setOpenViewEventDialog(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
                            <DialogTitle>Confirm Delete Event</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to delete event "{currentEvent.event_name}"?
                                    This action cannot be undone and will delete associated Ticket Types, Order Items, Tickets, and Reviews.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
                                <Button onClick={confirmDeleteEvent} variant="contained" color="error">Delete Event</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Manage Ticket Types Dialog */}
                        <Dialog open={openManageTicketsDialog} onClose={() => setOpenManageTicketsDialog(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Manage Ticket Types for: {currentEvent.event_name}</DialogTitle>
                            <DialogContent>
                                {currentEvent.ticket_types.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        No ticket types currently defined for this event.
                                    </Typography>
                                )}
                                {currentEvent.ticket_types.map((ticketType, index) => (
                                    <Paper key={ticketType.id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: '0.5rem' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Ticket Type #{index + 1}</Typography>
                                        <TextField
                                            margin="dense"
                                            label="Ticket Name"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.name}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].name = e.target.value;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Price"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.price}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].price = parseFloat(e.target.value) || 0;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Quantity Available"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.quantity}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].quantity = parseInt(e.target.value) || 0;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Sold Quantity"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.sold}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].sold = parseInt(e.target.value) || 0;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Sales Start Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.sales_start}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].sales_start = e.target.value;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            margin="dense"
                                            label="Sales End Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            value={ticketType.sales_end}
                                            onChange={(e) => {
                                                const updatedTickets = [...currentEvent.ticket_types];
                                                updatedTickets[index].sales_end = e.target.value;
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 1 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                const updatedTickets = currentEvent.ticket_types.filter((_, i) => i !== index);
                                                setCurrentEvent({ ...currentEvent, ticket_types: updatedTickets });
                                            }}
                                            sx={{ mt: 1 }}
                                        >
                                            Remove Ticket Type
                                        </Button>
                                    </Paper>
                                ))}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        setCurrentEvent({
                                            ...currentEvent,
                                            ticket_types: [...currentEvent.ticket_types, { id: `new_tt_${Date.now()}`, name: '', price: 0, quantity: 0, sold: 0, sales_start: '', sales_end: '' }]
                                        });
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    Add New Ticket Type
                                </Button>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenManageTicketsDialog(false)}>Cancel</Button>
                                <Button onClick={handleSaveTicketTypes} variant="contained" color="primary">Save Ticket Types</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Manage Staff Dialog */}
                        <Dialog open={openManageStaffDialog} onClose={() => setOpenManageStaffDialog(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Manage Check-in Staff for: {currentEvent.event_name}</DialogTitle>
                            <DialogContent>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="assign-staff-label">Select Check-in Staff</InputLabel>
                                    <Select
                                        labelId="assign-staff-label"
                                        multiple
                                        value={currentEvent.assigned_staff_ids || []}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, assigned_staff_ids: e.target.value })}
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
                                    {currentEvent.assigned_staff_ids && currentEvent.assigned_staff_ids.length > 0 ? (
                                        currentEvent.assigned_staff_ids.map(staffId => (
                                            <Chip
                                                key={staffId}
                                                label={getStaffName(staffId)}
                                                onDelete={() => handleToggleStaffAssignment(staffId)}
                                                color="secondary"
                                                variant="contained"
                                                icon={<PeopleIcon fontSize="small" />}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No staff assigned to this event.</Typography>
                                    )}
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenManageStaffDialog(false)}>Cancel</Button>
                                <Button onClick={handleSaveStaffAssignment} variant="contained" color="primary">Save Assignment</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default EventsManagement;
