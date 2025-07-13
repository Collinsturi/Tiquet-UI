import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    Card,
    CardContent,
    CardActions,
    InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

// Date/Time Pickers
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'; // Import dayjs

// --- Dummy Data Simulation ---
const dummyEvents = [
    {
        id: 'evt-001',
        category: 'Conference',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1',
        description: 'A global summit bringing together leaders, innovators, and enthusiasts in technology to discuss future trends, AI, blockchain, and sustainable tech solutions. Featuring keynote speakers, workshops, and networking sessions.',
        startDate: '2025-09-10T09:00:00', // ISO string
        endDate: '2025-09-12T17:00:00',   // ISO string
        address: '123 Innovation Drive',
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.286389,
        longitude: 36.817223,
        posterImageUrl: 'https://placehold.co/800x450/ADD8E6/000000?text=Tech+Summit+Poster',
        thumbnailImageUrl: 'https://placehold.co/200x150/ADD8E6/000000?text=Tech+Summit+Thumb',
        ticketTypes: [
            {
                id: 'ticket-001-A',
                name: 'Standard Pass',
                price: 50.00,
                quantityAvailable: 900,
                minPerOrder: 1,
                maxPerOrder: 5,
                salesStartDate: '2025-01-01T00:00:00',
                salesEndDate: '2025-09-09T23:59:59',
                description: 'Access to all main sessions and exhibition hall.',
            },
            {
                id: 'ticket-001-B',
                name: 'VIP Pass',
                price: 150.00,
                quantityAvailable: 200,
                minPerOrder: 1,
                maxPerOrder: 2,
                salesStartDate: '2025-01-01T00:00:00',
                salesEndDate: '2025-09-09T23:59:59',
                description: 'Includes main sessions, VIP lounge access, and exclusive networking.',
            },
            {
                id: 'ticket-001-C',
                name: 'Student Discount',
                price: 25.00,
                quantityAvailable: 150,
                minPerOrder: 1,
                maxPerOrder: 1,
                salesStartDate: '2025-03-01T00:00:00',
                salesEndDate: '2025-09-05T23:59:59',
                description: 'Requires valid student ID at entry. Access to main sessions.',
            },
        ],
    },
    {
        id: 'evt-002',
        category: 'Gala',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        description: 'An elegant evening dedicated to raising funds for critical community projects. Features a gourmet dinner, live entertainment, and silent auction.',
        startDate: '2025-10-22T18:00:00',
        endDate: '2025-10-22T23:00:00',
        address: 'Grand Ballroom, City Hotel',
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2858,
        longitude: 36.8210,
        posterImageUrl: 'https://placehold.co/800x450/F08080/FFFFFF?text=Charity+Gala+Poster',
        thumbnailImageUrl: 'https://placehold.co/200x150/F08080/FFFFFF?text=Charity+Gala+Thumb',
        ticketTypes: [
            {
                id: 'ticket-002-A',
                name: 'General Admission',
                price: 100.00,
                quantityAvailable: 600,
                minPerOrder: 1,
                maxPerOrder: 10,
                salesStartDate: '2025-07-01T00:00:00',
                salesEndDate: '2025-10-21T23:59:59',
                description: 'Includes dinner and access to all entertainment.',
            },
            {
                id: 'ticket-002-B',
                name: 'Premium Seat',
                price: 250.00,
                quantityAvailable: 200,
                minPerOrder: 1,
                maxPerOrder: 4,
                salesStartDate: '2025-07-01T00:00:00',
                salesEndDate: '2025-10-21T23:59:59',
                description: 'Front-row seating, complimentary drinks, and special gift bag.',
            },
        ],
    },
];

// Simulate fetching event data
const fetchEventDetails = async (eventId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const event = dummyEvents.find(e => e.id === eventId);
            if (event) {
                resolve(JSON.parse(JSON.stringify(event))); // Deep copy to prevent direct state mutation
            } else {
                reject(new Error("Event not found."));
            }
        }, 700); // Simulate network delay
    });
};

// Simulate updating event data
const updateEventDetails = async (eventId, updatedData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Simulating update for event ${eventId}:`, updatedData);
            // In a real app, you'd update your backend here.
            // For demo, just resolve successfully.
            resolve({ success: true, message: "Event details updated successfully!" });
        }, 1000);
    });
};

export const AdminEventDetails = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [originalEventData, setOriginalEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const getEventDetails = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                const data = await fetchEventDetails(eventId);
                setEventData(data);
                setOriginalEventData(data); // Store a copy for 'cancel'
            } catch (err) {
                console.error("Failed to fetch event details:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load event details.' });
            } finally {
                setLoading(false);
            }
        };
        getEventDetails();
    }, [eventId]);

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
        if (isEditing) { // If was editing and now toggling off (e.g. without saving)
            setEventData(originalEventData); // Revert to original
        } else {
            // Deep copy original data before editing
            setOriginalEventData(JSON.parse(JSON.stringify(eventData)));
        }
        setMessage({ type: '', text: '' }); // Clear messages
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name, date) => {
        setEventData(prev => ({
            ...prev,
            [name]: dayjs(date).toISOString(), // Store as ISO string
        }));
    };

    const handleTicketTypeChange = (id, field, value) => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.map(ticket =>
                ticket.id === id ? { ...ticket, [field]: value } : ticket
            ),
        }));
    };

    const handleAddTicketType = () => {
        const newTicketId = `ticket-${eventId}-${Date.now()}`; // Unique ID
        setEventData(prev => ({
            ...prev,
            ticketTypes: [
                ...prev.ticketTypes,
                {
                    id: newTicketId,
                    name: `New Ticket Type ${prev.ticketTypes.length + 1}`,
                    price: 0.00,
                    quantityAvailable: 0,
                    minPerOrder: 1,
                    maxPerOrder: 10,
                    salesStartDate: dayjs().toISOString(),
                    salesEndDate: dayjs().add(1, 'month').toISOString(),
                    description: '',
                },
            ],
        }));
    };

    const handleDeleteTicketType = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this ticket type? This action cannot be undone.")) {
            setEventData(prev => ({
                ...prev,
                ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== idToDelete),
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await updateEventDetails(eventId, eventData);
            setMessage({ type: 'success', text: response.message });
            setOriginalEventData(JSON.parse(JSON.stringify(eventData))); // Update original copy
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving event:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save event details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEventData(originalEventData);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    if (loading || !eventData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading event details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Event Details: {eventData.name}
                </Typography>
                {!isEditing ? (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                    >
                        Edit Event
                    </Button>
                ) : (
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            sx={{ mr: 1 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>General Event Information</Typography>
                <Grid container spacing={3}>
                    {/* Image Previews */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Poster Image</Typography>
                            {eventData.posterImageUrl ? (
                                <img
                                    src={eventData.posterImageUrl}
                                    alt="Event Poster"
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain', border: '1px solid #ddd' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250?text=No+Poster"; }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: 200, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary' }}>
                                    <ImageNotSupportedIcon sx={{ fontSize: 50 }} />
                                    <Typography>No Poster Image</Typography>
                                </Box>
                            )}
                            {isEditing && (
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Poster Image URL"
                                    name="posterImageUrl"
                                    value={eventData.posterImageUrl || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Thumbnail Image</Typography>
                            {eventData.thumbnailImageUrl ? (
                                <img
                                    src={eventData.thumbnailImageUrl}
                                    alt="Event Thumbnail"
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ddd' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150?text=No+Thumbnail"; }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: 150, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary' }}>
                                    <ImageNotSupportedIcon sx={{ fontSize: 40 }} />
                                    <Typography>No Thumbnail</Typography>
                                </Box>
                            )}
                            {isEditing && (
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Thumbnail Image URL"
                                    name="thumbnailImageUrl"
                                    value={eventData.thumbnailImageUrl || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Basic Event Details */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Category"
                            name="category"
                            value={eventData.category || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Event Name"
                            name="name"
                            value={eventData.name || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={eventData.description || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Date and Time Pickers */}
                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="Start Date & Time"
                            value={eventData.startDate ? dayjs(eventData.startDate) : null}
                            onChange={(newValue) => handleDateChange('startDate', newValue)}
                            disabled={!isEditing}
                            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="End Date & Time"
                            value={eventData.endDate ? dayjs(eventData.endDate) : null}
                            onChange={(newValue) => handleDateChange('endDate', newValue)}
                            disabled={!isEditing}
                            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                        />
                    </Grid>

                    {/* Location Details */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={eventData.address || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={eventData.city || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={eventData.country || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            name="latitude"
                            type="number"
                            value={eventData.latitude || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={eventData.longitude || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Ticket Types Section */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>Ticket Types</Typography>
                    {isEditing && (
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddTicketType}
                        >
                            Add New Ticket Type
                        </Button>
                    )}
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {eventData.ticketTypes.length > 0 ? (
                        eventData.ticketTypes.map((ticket) => (
                            <Grid item xs={12} sm={6} lg={4} key={ticket.id}>
                                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {ticket.name || 'Untitled Ticket'}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Ticket Type Name"
                                            value={ticket.name || ''}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'name', e.target.value)}
                                            disabled={!isEditing}
                                            variant="outlined"
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Price"
                                            type="number"
                                            value={ticket.price || 0}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'price', parseFloat(e.target.value))}
                                            disabled={!isEditing}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Quantity Available"
                                            type="number"
                                            value={ticket.quantityAvailable || 0}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'quantityAvailable', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            variant="outlined"
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Min Per Order"
                                            type="number"
                                            value={ticket.minPerOrder || 0}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'minPerOrder', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            variant="outlined"
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Max Per Order"
                                            type="number"
                                            value={ticket.maxPerOrder || 0}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'maxPerOrder', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            variant="outlined"
                                        />
                                        <DateTimePicker
                                            label="Sales Start Date & Time"
                                            value={ticket.salesStartDate ? dayjs(ticket.salesStartDate) : null}
                                            onChange={(newValue) => handleTicketTypeChange(ticket.id, 'salesStartDate', dayjs(newValue).toISOString())}
                                            disabled={!isEditing}
                                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" variant="outlined" />}
                                        />
                                        <DateTimePicker
                                            label="Sales End Date & Time"
                                            value={ticket.salesEndDate ? dayjs(ticket.salesEndDate) : null}
                                            onChange={(newValue) => handleTicketTypeChange(ticket.id, 'salesEndDate', dayjs(newValue).toISOString())}
                                            disabled={!isEditing}
                                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" variant="outlined" />}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Description"
                                            value={ticket.description || ''}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'description', e.target.value)}
                                            disabled={!isEditing}
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                        />
                                    </CardContent>
                                    {isEditing && (
                                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteTicketType(ticket.id)}
                                            >
                                                Delete
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">No ticket types defined for this event. Add some to get started!</Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
};