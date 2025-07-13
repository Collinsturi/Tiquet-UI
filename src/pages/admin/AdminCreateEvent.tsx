import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

// Date/Time Pickers
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'; // Import dayjs

// --- Dummy Data Simulation ---
// In a real application, this would be an actual API call to your backend
// to create a new event.
const createNewEvent = async (eventData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate unique ID generation for the new event
            const newEventId = `evt-${Date.now()}`;
            console.log("Simulating new event creation:", { id: newEventId, ...eventData });
            resolve({ success: true, message: "Event created successfully!", eventId: newEventId });
        }, 1500); // Simulate network delay
    });
};

export const AdminCreateEvent = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        category: '',
        name: '',
        description: '',
        startDate: null, // dayjs object or ISO string
        endDate: null,   // dayjs object or ISO string
        address: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
        posterImageUrl: '',
        thumbnailImageUrl: '',
        ticketTypes: [ // Start with one default ticket type
            {
                id: `ticket-${Date.now()}-1`, // Temporary unique ID
                name: 'Standard Ticket',
                price: 0.00,
                quantityAvailable: 0,
                minPerOrder: 1,
                maxPerOrder: 10,
                salesStartDate: dayjs().toISOString(), // Default to current time
                salesEndDate: dayjs().add(1, 'month').toISOString(), // Default to 1 month from now
                description: '',
            },
        ],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    // Simple validation
    const validateForm = () => {
        const newErrors = {};
        if (!eventData.name) newErrors.name = 'Event Name is required.';
        if (!eventData.category) newErrors.category = 'Category is required.';
        if (!eventData.description) newErrors.description = 'Description is required.';
        if (!eventData.startDate) newErrors.startDate = 'Start Date & Time is required.';
        if (!eventData.endDate) newErrors.endDate = 'End Date & Time is required.';
        if (eventData.startDate && eventData.endDate && dayjs(eventData.startDate).isAfter(dayjs(eventData.endDate))) {
            newErrors.endDate = 'End Date must be after Start Date.';
        }
        if (!eventData.address) newErrors.address = 'Address is required.';
        if (!eventData.city) newErrors.city = 'City is required.';
        if (!eventData.country) newErrors.country = 'Country is required.';

        eventData.ticketTypes.forEach((ticket, index) => {
            if (!ticket.name) newErrors[`ticketTypes.${index}.name`] = 'Ticket Name is required.';
            if (ticket.price <= 0) newErrors[`ticketTypes.${index}.price`] = 'Price must be greater than 0.';
            if (ticket.quantityAvailable < 0) newErrors[`ticketTypes.${index}.quantityAvailable`] = 'Quantity cannot be negative.';
            if (ticket.minPerOrder <= 0) newErrors[`ticketTypes.${index}.minPerOrder`] = 'Min per order must be greater than 0.';
            if (ticket.maxPerOrder <= 0) newErrors[`ticketTypes.${index}.maxPerOrder`] = 'Max per order must be greater than 0.';
            if (ticket.minPerOrder > ticket.maxPerOrder) newErrors[`ticketTypes.${index}.maxPerOrder`] = 'Max per order must be >= Min per order.';
            if (!ticket.salesStartDate) newErrors[`ticketTypes.${index}.salesStartDate`] = 'Sales Start Date is required.';
            if (!ticket.salesEndDate) newErrors[`ticketTypes.${index}.salesEndDate`] = 'Sales End Date is required.';
            if (ticket.salesStartDate && ticket.salesEndDate && dayjs(ticket.salesStartDate).isAfter(dayjs(ticket.salesEndDate))) {
                newErrors[`ticketTypes.${index}.salesEndDate`] = 'Sales End Date must be after Sales Start Date.';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) { // Clear error when user starts typing
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (name, date) => {
        setEventData(prev => ({
            ...prev,
            [name]: date ? dayjs(date).toISOString() : null, // Store as ISO string or null
        }));
        if (errors[name]) { // Clear error when date is selected
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTicketTypeChange = (id, field, value) => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.map(ticket =>
                ticket.id === id ? { ...ticket, [field]: value } : ticket
            ),
        }));
        const errorKey = `ticketTypes.${prev.ticketTypes.findIndex(t => t.id === id)}.${field}`;
        if (errors[errorKey]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const handleAddTicketType = () => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: [
                ...prev.ticketTypes,
                {
                    id: `ticket-${Date.now()}-${prev.ticketTypes.length + 1}`, // Unique ID
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
        if (eventData.ticketTypes.length === 1) {
            setMessage({ type: 'error', text: 'You must have at least one ticket type for the event.' });
            return;
        }
        if (window.confirm("Are you sure you want to delete this ticket type?")) {
            setEventData(prev => ({
                ...prev,
                ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== idToDelete),
            }));
            setMessage({ type: 'success', text: 'Ticket type deleted.' });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please correct the errors in the form.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' }); // Clear previous messages
        try {
            // Prepare data for submission (remove temporary IDs, convert numbers)
            const dataToSubmit = {
                ...eventData,
                startDate: eventData.startDate, // Already ISO string
                endDate: eventData.endDate,     // Already ISO string
                latitude: parseFloat(eventData.latitude) || null,
                longitude: parseFloat(eventData.longitude) || null,
                ticketTypes: eventData.ticketTypes.map(({ id, ...rest }) => ({ // Remove temporary 'id'
                    ...rest,
                    price: parseFloat(rest.price),
                    quantityAvailable: parseInt(rest.quantityAvailable),
                    minPerOrder: parseInt(rest.minPerOrder),
                    maxPerOrder: parseInt(rest.maxPerOrder),
                })),
                organizerId: 'organizer-1', // Assign to current organizer (dummy)
            };

            const response = await createNewEvent(dataToSubmit);
            setMessage({ type: 'success', text: response.message });
            // Optionally redirect to the newly created event's details page or event list
            setTimeout(() => {
                if (response.eventId) {
                    navigate(`/admin/my-events/${response.eventId}`);
                } else {
                    navigate('/admin/my-events'); // Go to event list if no specific ID returned
                }
            }, 2000); // Give time for message to be read
        } catch (err) {
            console.error("Error creating event:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to create event.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Create New Event
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>General Event Information</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Category"
                            name="category"
                            value={eventData.category}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.category}
                            helperText={errors.category}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Event Name"
                            name="name"
                            value={eventData.name}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={eventData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            variant="outlined"
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="Start Date & Time"
                            value={eventData.startDate ? dayjs(eventData.startDate) : null}
                            onChange={(newValue) => handleDateChange('startDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors.startDate}
                                    helperText={errors.startDate}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="End Date & Time"
                            value={eventData.endDate ? dayjs(eventData.endDate) : null}
                            onChange={(newValue) => handleDateChange('endDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    error={!!errors.endDate}
                                    helperText={errors.endDate}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={eventData.address}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={eventData.city}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.city}
                            helperText={errors.city}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={eventData.country}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.country}
                            helperText={errors.country}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Latitude (Optional)"
                            name="latitude"
                            type="number"
                            value={eventData.latitude}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Longitude (Optional)"
                            name="longitude"
                            type="number"
                            value={eventData.longitude}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Poster Image URL (Optional)"
                            name="posterImageUrl"
                            value={eventData.posterImageUrl}
                            onChange={handleChange}
                            variant="outlined"
                            helperText="Paste a URL for your event's main poster image."
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Thumbnail Image URL (Optional)"
                            name="thumbnailImageUrl"
                            value={eventData.thumbnailImageUrl}
                            onChange={handleChange}
                            variant="outlined"
                            helperText="Paste a URL for a smaller thumbnail image."
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>Ticket Types</Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddTicketType}
                    >
                        Add New Ticket Type
                    </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {eventData.ticketTypes.length > 0 ? (
                        eventData.ticketTypes.map((ticket, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={ticket.id}>
                                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            Ticket Type #{index + 1}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Ticket Type Name"
                                            value={ticket.name}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'name', e.target.value)}
                                            variant="outlined"
                                            error={!!errors[`ticketTypes.${index}.name`]}
                                            helperText={errors[`ticketTypes.${index}.name`]}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Price"
                                            type="number"
                                            value={ticket.price}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'price', e.target.value)}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            error={!!errors[`ticketTypes.${index}.price`]}
                                            helperText={errors[`ticketTypes.${index}.price`]}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Quantity Available"
                                            type="number"
                                            value={ticket.quantityAvailable}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'quantityAvailable', e.target.value)}
                                            variant="outlined"
                                            error={!!errors[`ticketTypes.${index}.quantityAvailable`]}
                                            helperText={errors[`ticketTypes.${index}.quantityAvailable`]}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Min Per Order"
                                            type="number"
                                            value={ticket.minPerOrder}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'minPerOrder', e.target.value)}
                                            variant="outlined"
                                            error={!!errors[`ticketTypes.${index}.minPerOrder`]}
                                            helperText={errors[`ticketTypes.${index}.minPerOrder`]}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Max Per Order"
                                            type="number"
                                            value={ticket.maxPerOrder}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'maxPerOrder', e.target.value)}
                                            variant="outlined"
                                            error={!!errors[`ticketTypes.${index}.maxPerOrder`]}
                                            helperText={errors[`ticketTypes.${index}.maxPerOrder`]}
                                        />
                                        <DateTimePicker
                                            label="Sales Start Date & Time"
                                            value={ticket.salesStartDate ? dayjs(ticket.salesStartDate) : null}
                                            onChange={(newValue) => handleTicketTypeChange(ticket.id, 'salesStartDate', dayjs(newValue).toISOString())}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    error={!!errors[`ticketTypes.${index}.salesStartDate`]}
                                                    helperText={errors[`ticketTypes.${index}.salesStartDate`]}
                                                />
                                            )}
                                        />
                                        <DateTimePicker
                                            label="Sales End Date & Time"
                                            value={ticket.salesEndDate ? dayjs(ticket.salesEndDate) : null}
                                            onChange={(newValue) => handleTicketTypeChange(ticket.id, 'salesEndDate', dayjs(newValue).toISOString())}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    error={!!errors[`ticketTypes.${index}.salesEndDate`]}
                                                    helperText={errors[`ticketTypes.${index}.salesEndDate`]}
                                                />
                                            )}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Description (Optional)"
                                            value={ticket.description}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'description', e.target.value)}
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                        />
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteTicketType(ticket.id)}
                                            disabled={eventData.ticketTypes.length === 1} // Disable if only one ticket type left
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">No ticket types added yet. Click "Add New Ticket Type" to get started!</Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Event'}
                </Button>
            </Box>
        </Box>
    );
};