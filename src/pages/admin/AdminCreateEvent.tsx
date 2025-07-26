import React, { useState, useEffect, useRef } from 'react';
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
    IconButton, // Import IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Import upload icon
import ImageIcon from '@mui/icons-material/Image'; // Icon for image preview

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

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = 'dd9wneqwy'; // Replace with your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'Tiquet'; // Replace with your unsigned upload preset name

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
        address: '',
        city: '',
        country: '',
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

    // State for image upload loading
    const [isUploadingPoster, setIsUploadingPoster] = useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

    // Refs for file inputs to programmatically click them
    const posterInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Effect to handle success/error messages from RTK Query
    useEffect(() => {
        if (isSuccess) {
            setMessage({ type: 'success', text: 'Event created successfully!' });
            setTimeout(() => {
                navigate('/organizer/my-events');
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
            if (!eventData.address) newErrors.address = 'Address is required for a new venue.';
            if (!eventData.city) newErrors.city = 'City is required for a new venue.';
            if (!eventData.country) newErrors.country = 'Country is required for a new venue.';
        } else if (eventData.venueOption === 'existing') {
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
        let processedValue: any = value;
        if (name === 'latitude' || name === 'longitude') {
            processedValue = value === '' ? null : parseFloat(value);
        }

        setEventData(prev => ({
            ...prev,
            [name]: processedValue,
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
            [name]: date ? dayjs(date).toISOString() : '',
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
                const updatedErrors = { ...prevErrors };
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
                    id: `ticket-${Date.now()}-${prev.ticketTypes.length + 1}`,
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

    // --- Cloudinary Upload Logic ---
    const uploadImageToCloudinary = async (file: File, type: 'poster' | 'thumbnail') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Your unsigned upload preset

        const uploadStateSetter = type === 'poster' ? setIsUploadingPoster : setIsUploadingThumbnail;
        const imageUrlSetter = type === 'poster' ? 'posterImageUrl' : 'thumbnailImageUrl';

        uploadStateSetter(true);
        setMessage({ type: '', text: '' }); // Clear any previous messages

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `Cloudinary upload failed for ${type} image.`);
            }

            const data = await response.json();
            setEventData(prev => ({
                ...prev,
                [imageUrlSetter]: data.secure_url, // Cloudinary returns secure_url
            }));
            setMessage({ type: 'success', text: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully!` });
        } catch (error: any) {
            console.error(`Error uploading ${type} image to Cloudinary:`, error);
            setMessage({ type: 'error', text: `Failed to upload ${type} image: ${error.message}` });
        } finally {
            uploadStateSetter(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'thumbnail') => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5 MB limit
                setMessage({ type: 'error', text: 'File size exceeds 5MB. Please choose a smaller image.' });
                return;
            }
            uploadImageToCloudinary(file, type);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please correct the errors in the form.' });
            return;
        }

        setMessage({ type: '', text: '' }); // Clear previous messages

        if (isUploadingPoster || isUploadingThumbnail) {
            setMessage({ type: 'error', text: 'Please wait for image uploads to complete.' });
            return;
        }

        try {
            const organizerEmail = user?.email;

            if (!organizerEmail) {
                setMessage({ type: 'error', text: 'Organizer email not found. Please log in.' });
                return;
            }

            const dataToSubmit: any = {
                category: eventData.category,
                name: eventData.name,
                description: eventData.description,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                organizerEmail: organizerEmail,
                ticketTypes: eventData.ticketTypes.map(ticket => ({
                    typeName: ticket.typeName,
                    price: parseFloat(ticket.price.toString()),
                    quantityAvailable: parseInt(ticket.quantityAvailable.toString()),
                    description: ticket.description,
                })),
            };

            if (eventData.latitude !== null && eventData.latitude !== undefined) {
                dataToSubmit.latitude = eventData.latitude;
            }
            if (eventData.longitude !== null && eventData.longitude !== undefined) {
                dataToSubmit.longitude = eventData.longitude;
            }
            if (eventData.posterImageUrl && eventData.posterImageUrl.trim() !== '') {
                dataToSubmit.posterImageUrl = eventData.posterImageUrl;
            }
            if (eventData.thumbnailImageUrl && eventData.thumbnailImageUrl.trim() !== '') {
                dataToSubmit.thumbnailImageUrl = eventData.thumbnailImageUrl;
            }

            if (eventData.venueOption === 'existing') {
                dataToSubmit.venueId = eventData.selectedVenueId as number;
            } else if (eventData.venueOption === 'new') {
                dataToSubmit.address = eventData.address as string;
                dataToSubmit.city = eventData.city as string;
                dataToSubmit.country = eventData.country as string;
            }

            await createEvent({ CreateEventRequest: dataToSubmit, organizerEmail: organizerEmail }).unwrap();
        } catch (err) {
            console.error("Error in handleSubmit:", err);
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

                    {/* Poster Image Upload */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                disabled={isUploadingPoster}
                            >
                                Upload Poster Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    ref={posterInputRef}
                                    onChange={(e) => handleFileChange(e, 'poster')}
                                />
                            </Button>
                            {isUploadingPoster && <CircularProgress size={24} />}
                        </Box>
                        {eventData.posterImageUrl ? (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ImageIcon color="action" />
                                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {eventData.posterImageUrl.split('/').pop()} {/* Display file name from URL */}
                                </Typography>
                                <IconButton size="small" onClick={() => setEventData(prev => ({ ...prev, posterImageUrl: '' }))}>
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">No poster image selected.</Typography>
                        )}
                    </Grid>

                    {/* Thumbnail Image Upload */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                disabled={isUploadingThumbnail}
                            >
                                Upload Thumbnail Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    ref={thumbnailInputRef}
                                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                                />
                            </Button>
                            {isUploadingThumbnail && <CircularProgress size={24} />}
                        </Box>
                        {eventData.thumbnailImageUrl ? (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ImageIcon color="action" />
                                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {eventData.thumbnailImageUrl.split('/').pop()} {/* Display file name from URL */}
                                </Typography>
                                <IconButton size="small" onClick={() => setEventData(prev => ({ ...prev, thumbnailImageUrl: '' }))}>
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">No thumbnail image selected.</Typography>
                        )}
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Latitude (Optional)"
                            name="latitude"
                            type="number"
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
                                selectedVenueId: selectedOption === 'existing' ? prev.selectedVenueId : '',
                                address: selectedOption === 'new' ? (prev.address || '') : '', // Reset to empty string
                                city: selectedOption === 'new' ? (prev.city || '') : '',
                                country: selectedOption === 'new' ? (prev.country || '') : '',
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
                    disabled={isCreatingEvent || isUploadingPoster || isUploadingThumbnail}
                >
                    {isCreatingEvent ? <CircularProgress size={24} color="inherit" /> : 'Create Event'}
                </Button>
            </Box>
        </Box>
    );
};