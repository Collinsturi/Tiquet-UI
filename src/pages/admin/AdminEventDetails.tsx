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

// --- RTK Query Imports ---
import {
    useGetEventByIdQuery,
    type EventDetailResponseData,
    type TicketType,
} from '../../queries/general/EventQuery'; // Adjust path as necessary


export const AdminEventDetails = () => {
    const { eventId: eventIdParam } = useParams<{ eventId: string }>();
    const eventId = eventIdParam ? parseInt(eventIdParam, 10) : undefined;

    // RTK Query hook to fetch event details
    const {
        data: fetchedEvent, // This will now be of type EventDetailResponseData | null
        isLoading: isEventLoading,
        isFetching: isEventFetching,
        isError: isEventError,
        error: eventError,
        refetch
    } = useGetEventByIdQuery(eventId as number, {
        skip: typeof eventId === 'undefined' || isNaN(eventId),
    });

    // Local state for editing purposes, initialized with fetched data
    const [editableEventData, setEditableEventData] = useState<EventDetailResponseData | null>(null);
    const [originalEditableEventData, setOriginalEditableEventData] = useState<EventDetailResponseData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Effect to update local state when fetched data changes
    useEffect(() => {
        if (fetchedEvent) {
            setEditableEventData(JSON.parse(JSON.stringify(fetchedEvent)));
            setOriginalEditableEventData(JSON.parse(JSON.stringify(fetchedEvent)));
        } else if (!isEventLoading && !isEventFetching && isEventError) {
            setMessage({ type: 'error', text: (eventError as any)?.data?.message || 'Failed to load event details.' });
        }
    }, [fetchedEvent, isEventLoading, isEventFetching, isEventError, eventError]);


    // Determine if the event date and time are in the past
    const isEventPast = editableEventData && editableEventData.eventDate && editableEventData.eventTime
        ? dayjs(`${editableEventData.eventDate}T${editableEventData.eventTime}`).isBefore(dayjs())
        : false;

    const handleEditToggle = () => {
        // Prevent editing if the event is in the past
        if (isEventPast) {
            setMessage({ type: 'info', text: 'This event has already occurred and cannot be edited.' });
            return;
        }
        setIsEditing(prev => !prev);
        if (isEditing) {
            setEditableEventData(originalEditableEventData);
        } else {
            setOriginalEditableEventData(JSON.parse(JSON.stringify(editableEventData)));
        }
        setMessage({ type: '', text: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableEventData(prev => {
            if (!prev) return null;

            // Handle properties based on EventDetailResponseData structure
            // Direct properties of EventDetailResponseData
            if (['title', 'description', 'category', 'eventDate', 'eventTime', 'posterImageUrl', 'thumbnailImageUrl', 'latitude', 'longitude', 'venueName', 'venueAddress', 'venueCapacity', 'totalTicketsSold', 'totalTicketsAvailable'].includes(name)) {
                return {
                    ...prev,
                    [name]: value
                };
            }
            // Nested venue properties
            else if (['name', 'address', 'capacity'].includes(name) && prev.venue) {
                return {
                    ...prev,
                    venue: { ...prev.venue, [name]: value }
                };
            }
            return prev;
        });
    };

    const handleDateChange = (field: 'eventDate' | 'eventTime', date: dayjs.Dayjs | null) => {
        setEditableEventData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [field]: date ? (field === 'eventDate' ? date.format('YYYY-MM-DD') : date.format('HH:mm:ss')) : '',
            };
        });
    };

    const handleTicketTypeChange = (id: number, field: keyof TicketType, value: any) => {
        setEditableEventData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                ticketTypes: prev.ticketTypes.map(ticket =>
                    // Make sure 'id' exists on 'ticket' for the comparison
                    ticket.id === id ? { ...ticket, [field]: value } : ticket
                ),
            };
        });
    };

    const handleAddTicketType = () => {
        if (!editableEventData) return;
        const newTicketId = -(editableEventData.ticketTypes.length + 1); // Negative temporary ID
        setEditableEventData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                ticketTypes: [
                    ...prev.ticketTypes,
                    {
                        id: newTicketId,
                        eventId: prev.id, // Use prev.id (event ID from EventDetailResponseData)
                        typeName: `New Ticket Type ${prev.ticketTypes.length + 1}`,
                        price: 0.00,
                        quantityAvailable: 0,
                        quantitySold: 0,
                        description: '',
                    } as TicketType,
                ],
            };
        });
    };

    const handleDeleteTicketType = (idToDelete: number) => {
        if (window.confirm("Are you sure you want to delete this ticket type? This action cannot be undone.")) {
            setEditableEventData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== idToDelete),
                };
            });
        }
    };

    const handleSave = async () => {
        setMessage({ type: '', text: '' });
        console.log("Attempting to save:", editableEventData);

        // --- IMPORTANT: Placeholder for your actual update mutation ---
        // You would typically call a mutation here, e.g.:
        // const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
        // try {
        //     await updateEvent({ eventId: editableEventData.id, updateData: editableEventData }).unwrap();
        //     setMessage({ type: 'success', text: "Event details updated successfully!" });
        //     setIsEditing(false);
        //     refetch();
        // } catch (err) {
        //     console.error("Error saving event:", err);
        //     setMessage({ type: 'error', text: (err as any)?.data?.message || 'Failed to save event details.' });
        // }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            setMessage({ type: 'success', text: "Event details updated successfully!" });
            setIsEditing(false);
            refetch(); // Refetch the data to ensure UI is in sync with backend
        } catch (err) {
            console.error("Error saving event:", err);
            setMessage({ type: 'error', text: (err as any)?.data?.message || 'Failed to save event details.' });
        }
    };


    const handleCancel = () => {
        setEditableEventData(originalEditableEventData);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const isLoading = isEventLoading || isEventFetching;

    if (isLoading || !editableEventData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading event details...</Typography>
            </Box>
        );
    }

    if (isEventError && !editableEventData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {message.text || 'Error loading event details. Please check the event ID or try again.'}
                </Alert>
            </Box>
        );
    }

    const event = editableEventData;
    const venue = editableEventData.venue;
    const ticketTypes = editableEventData.ticketTypes;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Event Details: {event.title}
                </Typography>
                {/* Hide Edit/Save/Cancel buttons if event is in the past */}
                {!isEventPast && (
                    !isEditing ? (
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
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )
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
                            {event.posterImageUrl ? (
                                <img
                                    src={event.posterImageUrl}
                                    alt="Event Poster"
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain', border: '1px solid #ddd' }}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x250?text=No+Poster"; }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: 200, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary' }}>
                                    <ImageNotSupportedIcon sx={{ fontSize: 50 }} />
                                    <Typography>No Poster Image</Typography>
                                </Box>
                            )}
                            {isEditing && !isEventPast && ( // Disable if not editing OR if event is past
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Poster Image URL"
                                    name="posterImageUrl"
                                    value={event.posterImageUrl || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Thumbnail Image</Typography>
                            {event.thumbnailImageUrl ? (
                                <img
                                    src={event.thumbnailImageUrl}
                                    alt="Event Thumbnail"
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ddd' }}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/200x150?text=No+Thumbnail"; }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: 150, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary' }}>
                                    <ImageNotSupportedIcon sx={{ fontSize: 40 }} />
                                    <Typography>No Thumbnail</Typography>
                                </Box>
                            )}
                            {isEditing && !isEventPast && ( // Disable if not editing OR if event is past
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Thumbnail Image URL"
                                    name="thumbnailImageUrl"
                                    value={event.thumbnailImageUrl || ''}
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
                            value={event.category || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Event Name"
                            name="title"
                            value={event.title || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={event.description || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Date and Time Pickers */}
                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="Event Date & Time"
                            value={event.eventDate && event.eventTime ? dayjs(`${event.eventDate}T${event.eventTime}`) : null}
                            onChange={(newValue) => {
                                if (newValue) {
                                    handleDateChange('eventDate', newValue);
                                    handleDateChange('eventTime', newValue);
                                }
                            }}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Placeholder for End Date & Time - needs proper backend field */}
                        <DateTimePicker
                            label="End Date & Time (Backend Needs End Date Field)"
                            value={null}
                            disabled={true}
                            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" helperText="Backend 'Event' type lacks 'endDate' field" />}
                        />
                    </Grid>


                    {/* Location Details - These should come from `venue` object */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Venue Name"
                            name="venueName"
                            value={event.venueName || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Venue Address"
                            name="venueAddress"
                            value={event.venueAddress || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            multiline
                            rows={2}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Venue Capacity"
                            name="venueCapacity"
                            type="number"
                            value={event.venueCapacity || ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            name="latitude"
                            type="number"
                            value={event.latitude ?? ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={event.longitude ?? ''}
                            onChange={handleChange}
                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Ticket Types Section */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>Ticket Types</Typography>
                    {isEditing && !isEventPast && ( // Hide if not editing OR if event is past
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
                    {ticketTypes.length > 0 ? (
                        ticketTypes.map((ticket) => (
                            <Grid item xs={12} sm={6} lg={4} key={ticket.id}>
                                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {ticket.typeName || 'Untitled Ticket'}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Ticket Type Name"
                                            value={ticket.typeName || ''}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'typeName', e.target.value)}
                                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                                            variant="outlined"
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Price"
                                            type="number"
                                            value={ticket.price || 0}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'price', parseFloat(e.target.value))}
                                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
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
                                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                                            variant="outlined"
                                        />
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Description"
                                            value={ticket.description || ''}
                                            onChange={(e) => handleTicketTypeChange(ticket.id, 'description', e.target.value)}
                                            disabled={!isEditing || isEventPast} // Disable if not editing OR if event is past
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                        />
                                    </CardContent>
                                    {isEditing && !isEventPast && ( // Hide if not editing OR if event is past
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
