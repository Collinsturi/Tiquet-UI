import React, { useState, useEffect } from 'react';
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
    Card,
    CardContent,
    CardActions,
    InputAdornment,
    FormControlLabel,
    RadioGroup,
    Radio,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

// Date/Time Pickers
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

// Import RTK Query hooks and types
import {
    useGetAllVenuesQuery,
    useCreateEventMutation,
    type Venue,
    type CreateEventRequest,
    type NewTicketTypeInput,
} from '../../queries/general/EventQuery.ts';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";

export const AdminCreateEvent = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    // RTK Query hooks
    const { data: venues, isLoading: isLoadingVenues, isError: isErrorVenues } = useGetAllVenuesQuery();
    const [createEvent, { isLoading: isCreatingEvent, isSuccess, isError, error }] = useCreateEventMutation();

    // State for event form data
    const [eventData, setEventData] = useState<Omit<CreateEventRequest, 'ticketTypes' | 'organizerEmail'> & {
        ticketTypes: Array<NewTicketTypeInput & { id: string }>; // Add a local 'id' for React keys
        venueOption: 'existing' | 'new';
        selectedVenueId?: number | ''; // Store as number or empty string for UI dropdown
    }>({
        category: '',
        name: '',
        description: '',
        startDate: dayjs().toISOString(),
        endDate: dayjs().add(1, 'hour').toISOString(),
        // Initialize address, city, country to null/undefined
        // This makes it clear they are not present by default for *new* venue creation.
        // They will be populated if venueOption is 'new'.
        address: null, // Changed from '' to null
        city: null,    // Changed from '' to null
        country: null, // Changed from '' to null
        latitude: null,
        longitude: null,
        posterImageUrl: '',
        thumbnailImageUrl: '',
        venueOption: 'new', // Default to creating a new venue
        selectedVenueId: '', // Default to empty string for the dropdown
        ticketTypes: [
            {
                id: `ticket-${Date.now()}-1`, // Unique ID for local list rendering
                typeName: 'Standard Ticket',
                price: 0.00,
                quantityAvailable: 0,
                description: '',
            },
        ],
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Effect to handle success/error messages from RTK Query
    useEffect(() => {
        if (isSuccess) {
            setMessage({ type: 'success', text: 'Event created successfully!' });
            // Optionally redirect after a delay
            setTimeout(() => {
                // If createEvent response includes eventId, navigate there
                navigate('/admin/my-events'); // Or /admin/my-events/${response.eventId} if available
            }, 2000);
        } else if (isError) {
            console.error("Error creating event:", error);
            setMessage({ type: 'error', text: (error as any)?.data?.message || 'Failed to create event.' });
        }
    }, [isSuccess, isError, error, navigate]);

    // Simple validation
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!eventData.name) newErrors.name = 'Event Name is required.';
        if (!eventData.category) newErrors.category = 'Category is required.';
        if (!eventData.description) newErrors.description = 'Description is required.';
        if (!eventData.startDate) newErrors.startDate = 'Start Date & Time is required.';
        if (!eventData.endDate) newErrors.endDate = 'End Date & Time is required.';
        if (eventData.startDate && eventData.endDate && dayjs(eventData.startDate).isAfter(dayjs(eventData.endDate))) {
            newErrors.endDate = 'End Date must be after Start Date.';
        }

        if (eventData.venueOption === 'new') {
            // Check for non-null/non-empty string
            if (!eventData.address) newErrors.address = 'Address is required for a new venue.';
            if (!eventData.city) newErrors.city = 'City is required for a new venue.';
            if (!eventData.country) newErrors.country = 'Country is required for a new venue.';
        } else if (eventData.venueOption === 'existing') {
            // Ensure selectedVenueId is a number and not empty string
            if (typeof eventData.selectedVenueId !== 'number' || !eventData.selectedVenueId) {
                newErrors.selectedVenueId = 'Please select an existing venue.';
            }
        }

        eventData.ticketTypes.forEach((ticket, index) => {
            if (!ticket.typeName) newErrors[`ticketTypes.${index}.typeName`] = 'Ticket Name is required.';
            if (ticket.price <= 0) newErrors[`ticketTypes.${index}.price`] = 'Price must be greater than 0.';
            if (ticket.quantityAvailable < 0) newErrors[`ticketTypes.${index}.quantityAvailable`] = 'Quantity cannot be negative.';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Convert empty string for address/city/country back to null if they are meant to be optional
        const newValue = (name === 'address' || name === 'city' || name === 'country') && value === '' ? null : value;

        setEventData(prev => ({
            ...prev,
            [name]: newValue,
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (name: 'startDate' | 'endDate', date: dayjs.Dayjs | null) => {
        setEventData(prev => ({
            ...prev,
            [name]: date ? dayjs(date).toISOString() : '', // Store as ISO string or empty string
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTicketTypeChange = (id: string, field: keyof NewTicketTypeInput, value: string | number) => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.map(ticket =>
                ticket.id === id ? { ...ticket, [field]: value } : ticket
            ),
        }));
        const index = eventData.ticketTypes.findIndex(t => t.id === id);
        const errorKey = `ticketTypes.${index}.${field}`;
        if (errors[errorKey]) {
            setErrors(prevErrors => {
                const updatedErrors = { ...prevErrors }; // Corrected: use prevErrors here
                delete updatedErrors[errorKey];
                return updatedErrors;
            });
        }
    };

    const handleAddTicketType = () => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: [
                ...prev.ticketTypes,
                {
                    id: `ticket-${Date.now()}-${prev.ticketTypes.length + 1}`, // Generate unique ID
                    typeName: `New Ticket Type ${prev.ticketTypes.length + 1}`,
                    price: 0.00,
                    quantityAvailable: 0,
                    description: '',
                },
            ],
        }));
    };

    const handleDeleteTicketType = (idToDelete: string) => {
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

        setMessage({ type: '', text: '' }); // Clear previous messages

        try {
            const organizerEmail = user?.email;

            console.log(organizerEmail)

            if (!organizerEmail) {
                setMessage({ type: 'error', text: 'Organizer email not found. Please log in.' });
                return;
            }

            console.log("here")

            // Start with a base object that mirrors CreateEventRequest
            // Initialize optional fields to undefined to ensure they are omitted unless explicitly set
            const dataToSubmit: CreateEventRequest = {
                category: eventData.category,
                name: eventData.name,
                description: eventData.description,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                // These are conditional and will be added later
                venueId: undefined,
                address: undefined,
                city: undefined,
                country: undefined,
                // Latitude/Longitude can be null in the request, or undefined if you prefer to omit entirely
                latitude: eventData.latitude,
                longitude: eventData.longitude,
                posterImageUrl: eventData.posterImageUrl || undefined, // Send undefined if empty string
                thumbnailImageUrl: eventData.thumbnailImageUrl || undefined, // Send undefined if empty string
                organizerEmail: organizerEmail,
                ticketTypes: eventData.ticketTypes.map(ticket => ({
                    typeName: ticket.typeName,
                    price: parseFloat(ticket.price.toString()),
                    quantityAvailable: parseInt(ticket.quantityAvailable.toString()),
                    description: ticket.description,
                })),
            };
            console.log("there")

            console.log("Event Data Venue Option:", eventData.venueOption);
            if (eventData.venueOption === 'existing') {
                // We've ensured selectedVenueId is a number during validation
                dataToSubmit.venueId = eventData.selectedVenueId as number;
                // Explicitly ensure new venue fields are undefined/not present
                dataToSubmit.address = undefined;
                dataToSubmit.city = undefined;
                dataToSubmit.country = undefined;
                console.log("gone")

            } else if (eventData.venueOption === 'new') {
                // Ensure these are non-null strings from validation
                dataToSubmit.address = eventData.address as string;
                dataToSubmit.city = eventData.city as string;
                dataToSubmit.country = eventData.country as string;
                // Explicitly ensure venueId is undefined/not present
                dataToSubmit.venueId = undefined;
                console.log("also gone")

            }

            console.log("Submitting Event Data:", dataToSubmit); // Crucial for debugging

            await createEvent({ CreateEventRequest: dataToSubmit, organizerEmail: organizerEmail }).unwrap();
        } catch (err) {
            // Error handling is now managed by the useEffect hook watching `isError` and `error`
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
                            value={dayjs(eventData.startDate)}
                            onChange={(newValue) => handleDateChange('startDate', newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    error: !!errors.startDate,
                                    helperText: errors.startDate,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="End Date & Time"
                            value={dayjs(eventData.endDate)}
                            onChange={(newValue) => handleDateChange('endDate', newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    error: !!errors.endDate,
                                    helperText: errors.endDate,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Latitude (Optional)"
                            name="latitude"
                            type="number"
                            // If latitude/longitude can truly be null in the request, keep this.
                            // If they should be omitted if not provided, change to (eventData.latitude ?? '')
                            value={eventData.latitude === null ? '' : eventData.latitude}
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
                            value={eventData.longitude === null ? '' : eventData.longitude}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Venue Information</Typography>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <RadioGroup
                        row
                        name="venueOption"
                        value={eventData.venueOption}
                        onChange={(e) => {
                            const selectedOption = e.target.value as 'existing' | 'new';
                            setEventData(prev => ({
                                ...prev,
                                venueOption: selectedOption,
                                // Reset venue-related fields when switching option
                                selectedVenueId: selectedOption === 'existing' ? prev.selectedVenueId : '', // Keep current if existing, clear if new
                                address: selectedOption === 'new' ? (prev.address || '') : null, // Keep existing if new, clear if existing
                                city: selectedOption === 'new' ? (prev.city || '') : null,
                                country: selectedOption === 'new' ? (prev.country || '') : null,
                            }));
                        }}
                    >
                        <FormControlLabel value="existing" control={<Radio />} label="Select Existing Venue" />
                        <FormControlLabel value="new" control={<Radio />} label="Create New Venue" />
                    </RadioGroup>
                </FormControl>

                {eventData.venueOption === 'existing' && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" error={!!errors.selectedVenueId}>
                                <InputLabel id="venue-select-label">Select Venue</InputLabel>
                                <Select
                                    labelId="venue-select-label"
                                    id="selectedVenueId"
                                    name="selectedVenueId"
                                    value={eventData.selectedVenueId}
                                    onChange={(e) => {
                                        // Crucial: Convert value to number if not empty string
                                        const value = e.target.value;
                                        setEventData(prev => ({
                                            ...prev,
                                            selectedVenueId: value === '' ? '' : Number(value)
                                        }));
                                    }}
                                    label="Select Venue"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {isLoadingVenues ? (
                                        <MenuItem disabled>Loading venues...</MenuItem>
                                    ) : isErrorVenues ? (
                                        <MenuItem disabled>Error loading venues.</MenuItem>
                                    ) : (
                                        venues?.map((venue: Venue) => (
                                            <MenuItem key={venue.id} value={venue.id}>
                                                {venue.name} (Capacity: {venue.capacity})
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {errors.selectedVenueId && <Typography color="error" variant="caption">{errors.selectedVenueId}</Typography>}
                            </FormControl>
                        </Grid>
                    </Grid>
                )}

                {eventData.venueOption === 'new' && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                // Ensure display value is '' if null for TextField
                                value={eventData.address ?? ''}
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
                                value={eventData.city ?? ''}
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
                                value={eventData.country ?? ''}
                                onChange={handleChange}
                                variant="outlined"
                                error={!!errors.country}
                                helperText={errors.country}
                            />
                        </Grid>
                    </Grid>
                )}
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
                                            value={ticket.typeName}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'typeName', e.target.value)}
                                            variant="outlined"
                                            error={!!errors[`ticketTypes.${index}.typeName`]}
                                            helperText={errors[`ticketTypes.${index}.typeName`]}
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
                                            disabled={eventData.ticketTypes.length === 1}
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
                    disabled={isCreatingEvent}
                >
                    {isCreatingEvent ? <CircularProgress size={24} color="inherit" /> : 'Create Event'}
                </Button>
            </Box>
        </Box>
    );
};