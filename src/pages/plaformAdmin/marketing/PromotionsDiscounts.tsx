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
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    FormHelperText,
    ToggleButtonGroup,
    ToggleButton,
    Fade, // For smooth transition of new/delete operations
} from '@mui/material';
import DiscountIcon from '@mui/icons-material/Discount';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

// Date/Time Pickers
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

// --- Dummy Data Simulation ---
// In a real application, this data would come from Firestore or your backend.

const dummyEvents = [
    {
        id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1', // Assuming current admin is this organizer
        ticketTypes: [
            { id: 'ticket-001-A', name: 'Standard Pass' },
            { id: 'ticket-001-B', name: 'VIP Pass' },
            { id: 'ticket-001-C', name: 'Student Discount' },
        ],
    },
    {
        id: 'evt-002',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        ticketTypes: [
            { id: 'ticket-002-A', name: 'General Admission' },
            { id: 'ticket-002-B', name: 'Premium Seat' },
        ],
    },
    {
        id: 'evt-003',
        name: 'Local Music Festival',
        organizerId: 'organizer-2', // Event by a different organizer
        ticketTypes: [],
    },
];

// Dummy Promotions data linked to events
let dummyPromotions = [
    {
        id: 'promo-001',
        eventId: 'evt-001',
        code: 'EARLYBIRD',
        discountType: 'Percentage', // 'Percentage' or 'Fixed Amount'
        discountValue: 15, // 15%
        appliesTo: 'Entire Event', // 'Entire Event' or 'Selected Ticket Types'
        appliedTicketTypeIds: [],
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-03-31T23:59:59Z',
        usageLimit: 100,
        usedCount: 75,
        minOrderAmount: 0,
        maxOrderAmount: 500,
        isActive: true,
    },
    {
        id: 'promo-002',
        eventId: 'evt-001',
        code: 'VIPDISCOUNT',
        discountType: 'Fixed Amount',
        discountValue: 20, // $20 off
        appliesTo: 'Selected Ticket Types',
        appliedTicketTypeIds: ['ticket-001-B'], // Applies only to VIP Pass
        startDate: '2025-02-15T00:00:00Z',
        endDate: '2025-09-01T23:59:59Z',
        usageLimit: 50,
        usedCount: 20,
        minOrderAmount: 100,
        maxOrderAmount: null, // No max limit
        isActive: true,
    },
    {
        id: 'promo-003',
        eventId: 'evt-003', // This discount belongs to another organizer's event
        code: 'MUSICFAN',
        discountType: 'Percentage',
        discountValue: 10,
        appliesTo: 'Entire Event',
        appliedTicketTypeIds: [],
        startDate: '2025-05-01T00:00:00Z',
        endDate: '2025-07-31T23:59:59Z',
        usageLimit: 200,
        usedCount: 180,
        minOrderAmount: 0,
        maxOrderAmount: null,
        isActive: false, // Already expired/inactive
    },
    {
        id: 'promo-004',
        eventId: 'evt-002',
        code: 'GALA20',
        discountType: 'Fixed Amount',
        discountValue: 20,
        appliesTo: 'Entire Event',
        appliedTicketTypeIds: [],
        startDate: '2025-08-01T00:00:00Z',
        endDate: '2025-10-20T23:59:59Z',
        usageLimit: 70,
        usedCount: 5,
        minOrderAmount: 50,
        maxOrderAmount: null,
        isActive: true,
    },
];

const CURRENT_ORGANIZER_ID = 'organizer-1'; // Simulating the logged-in admin's ID

// Simulate fetching all events for the current organizer
const fetchAllEventsForOrganizer = async (organizerId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const events = dummyEvents.filter(e => e.organizerId === organizerId);
            resolve(events);
        }, 500);
    });
};

// Simulate fetching promotions for a specific event
const fetchPromotionsForEvent = async (eventId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const promotions = dummyPromotions.filter(p => p.eventId === eventId);
            resolve(promotions);
        }, 700);
    });
};

// Simulate adding a new promotion
const addPromotion = async (newPromotion) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const promoWithId = { ...newPromotion, id: `promo-${Date.now()}` };
            dummyPromotions.push(promoWithId);
            console.log("Added new promotion:", promoWithId);
            resolve({ success: true, message: "Discount code added successfully!" });
        }, 1000);
    });
};

// Simulate deleting a promotion
const deletePromotion = async (promotionId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = dummyPromotions.length;
            dummyPromotions = dummyPromotions.filter(p => p.id !== promotionId);
            if (dummyPromotions.length < initialLength) {
                console.log("Deleted promotion:", promotionId);
                resolve({ success: true, message: "Discount code deleted successfully!" });
            } else {
                reject({ success: false, message: "Discount code not found." });
            }
        }, 500);
    });
};

export const PromotionsDiscounts = () => {
    const [availableEvents, setAvailableEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [promotions, setPromotions] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingPromotions, setLoadingPromotions] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newPromotionData, setNewPromotionData] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: 0,
        appliesTo: 'Entire Event',
        appliedTicketTypeIds: [],
        startDate: dayjs(),
        endDate: dayjs().add(1, 'month'),
        usageLimit: 0,
        minOrderAmount: 0,
        maxOrderAmount: null, // Use null for no max
    });
    const [addDialogErrors, setAddDialogErrors] = useState({});

    // Fetch all events for the dropdown
    useEffect(() => {
        const getAvailableEvents = async () => {
            try {
                setLoadingEvents(true);
                setMessage({ type: '', text: '' });
                const events = await fetchAllEventsForOrganizer(CURRENT_ORGANIZER_ID);
                setAvailableEvents(events);
                if (events.length > 0) {
                    setSelectedEventId(events[0].id); // Auto-select first event
                } else {
                    setMessage({ type: 'info', text: 'No events found to manage promotions for.' });
                }
            } catch (err) {
                console.error("Failed to fetch available events:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load events for selection.' });
            } finally {
                setLoadingEvents(false);
            }
        };
        getAvailableEvents();
    }, []);

    // Fetch promotions for the selected event
    useEffect(() => {
        const getPromotions = async () => {
            if (!selectedEventId) {
                setPromotions([]);
                return;
            }
            try {
                setLoadingPromotions(true);
                setMessage({ type: '', text: '' });
                const fetchedPromotions = await fetchPromotionsForEvent(selectedEventId);
                setPromotions(fetchedPromotions);
            } catch (err) {
                console.error("Failed to fetch promotions:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load promotions for this event.' });
            } finally {
                setLoadingPromotions(false);
            }
        };

        if (!loadingEvents && selectedEventId) {
            getPromotions();
        }
    }, [selectedEventId, loadingEvents]); // Rerun when event selected or events loaded

    const handleEventChange = (event) => {
        setSelectedEventId(event.target.value);
    };

    // --- Add Promotion Dialog Handlers ---
    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
        setNewPromotionData({
            code: '',
            discountType: 'Percentage',
            discountValue: 0,
            appliesTo: 'Entire Event',
            appliedTicketTypeIds: [],
            startDate: dayjs(),
            endDate: dayjs().add(1, 'month'),
            usageLimit: 0,
            minOrderAmount: 0,
            maxOrderAmount: null,
        });
        setAddDialogErrors({});
        setMessage({ type: '', text: '' }); // Clear any main messages
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleNewPromotionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewPromotionData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (addDialogErrors[name]) { // Clear error when user starts typing
            setAddDialogErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNewPromotionDateChange = (name, date) => {
        setNewPromotionData(prev => ({
            ...prev,
            [name]: date,
        }));
        if (addDialogErrors[name]) { // Clear error when date is selected
            setAddDialogErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAppliedTicketTypesChange = (event) => {
        const { value } = event.target;
        setNewPromotionData(prev => ({
            ...prev,
            appliedTicketTypeIds: typeof value === 'string' ? value.split(',') : value,
        }));
        if (addDialogErrors.appliedTicketTypeIds) {
            setAddDialogErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.appliedTicketTypeIds;
                return newErrors;
            });
        }
    };

    const validateNewPromotion = () => {
        const errors = {};
        if (!newPromotionData.code.trim()) errors.code = 'Discount Code is required.';
        if (newPromotionData.discountValue <= 0) errors.discountValue = 'Discount Value must be greater than 0.';
        if (!newPromotionData.startDate) errors.startDate = 'Start Date is required.';
        if (!newPromotionData.endDate) errors.endDate = 'End Date is required.';
        if (dayjs(newPromotionData.startDate).isAfter(dayjs(newPromotionData.endDate))) {
            errors.endDate = 'End Date must be after Start Date.';
        }
        if (newPromotionData.appliesTo === 'Selected Ticket Types' && newPromotionData.appliedTicketTypeIds.length === 0) {
            errors.appliedTicketTypeIds = 'At least one ticket type must be selected.';
        }
        if (newPromotionData.usageLimit < 0) errors.usageLimit = 'Usage limit cannot be negative.';
        if (newPromotionData.minOrderAmount < 0) errors.minOrderAmount = 'Min order amount cannot be negative.';
        if (newPromotionData.maxOrderAmount !== null && newPromotionData.maxOrderAmount < 0) errors.maxOrderAmount = 'Max order amount cannot be negative.';
        if (newPromotionData.minOrderAmount > (newPromotionData.maxOrderAmount || Infinity)) {
            errors.minOrderAmount = 'Min order cannot be greater than Max order.';
            errors.maxOrderAmount = 'Max order cannot be less than Min order.';
        }

        setAddDialogErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleAddPromotionSubmit = async () => {
        if (!validateNewPromotion()) {
            setMessage({ type: 'error', text: 'Please correct errors in the new discount form.' });
            return;
        }
        setLoadingPromotions(true);
        setMessage({ type: '', text: '' });
        try {
            const dataToSubmit = {
                ...newPromotionData,
                eventId: selectedEventId,
                startDate: newPromotionData.startDate.toISOString(), // Convert dayjs to ISO
                endDate: newPromotionData.endDate.toISOString(),     // Convert dayjs to ISO
                discountValue: parseFloat(newPromotionData.discountValue),
                usageLimit: parseInt(newPromotionData.usageLimit),
                minOrderAmount: parseFloat(newPromotionData.minOrderAmount),
                maxOrderAmount: newPromotionData.maxOrderAmount !== null ? parseFloat(newPromotionData.maxOrderAmount) : null,
                isActive: dayjs().isBefore(newPromotionData.endDate) && dayjs().isAfter(newPromotionData.startDate) // Determine initial active status
            };

            const response = await addPromotion(dataToSubmit);
            setMessage({ type: 'success', text: response.message });
            setAddDialogOpen(false);
            // Re-fetch promotions to update the list
            const updatedPromotions = await fetchPromotionsForEvent(selectedEventId);
            setPromotions(updatedPromotions);
        } catch (err) {
            console.error("Error adding promotion:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to add discount code.' });
        } finally {
            setLoadingPromotions(false);
        }
    };

    // --- Delete Promotion Handler ---
    const handleDeletePromotion = async (promotionId, promoCode) => {
        if (!window.confirm(`Are you sure you want to delete the discount code "${promoCode}"? This action cannot be undone.`)) {
            return;
        }
        setLoadingPromotions(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await deletePromotion(promotionId);
            setMessage({ type: 'success', text: response.message });
            // Remove from local state immediately for better UX
            setPromotions(prev => prev.filter(p => p.id !== promotionId));
        } catch (err) {
            console.error("Error deleting promotion:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to delete discount code.' });
        } finally {
            setLoadingPromotions(false);
        }
    };

    const getTicketTypeName = (ticketTypeId) => {
        const selectedEvent = availableEvents.find(event => event.id === selectedEventId);
        if (selectedEvent && selectedEvent.ticketTypes) {
            const ticketType = selectedEvent.ticketTypes.find(tt => tt.id === ticketTypeId);
            return ticketType ? ticketType.name : 'Unknown Ticket';
        }
        return 'Unknown Ticket';
    };


    if (loadingEvents) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading events for promotions...</Typography>
            </Box>
        );
    }

    if (availableEvents.length === 0) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    <DiscountIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Event Promotions
                </Typography>
                <Alert severity="info" sx={{ mt: 3 }}>
                    No events found for this organizer to manage promotions.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 , minHeight: '100vh', height: 'auto'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    <DiscountIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Event Promotions
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddDialogOpen}
                    disabled={!selectedEventId}
                >
                    Add New Discount
                </Button>
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="event-select-promo-label">Select Event</InputLabel>
                    <Select
                        labelId="event-select-promo-label"
                        value={selectedEventId}
                        onChange={handleEventChange}
                        label="Select Event"
                        startAdornment={<InputLabel htmlFor="event-select-promo-label"><EventNoteIcon sx={{ mr: 1 }} /></InputLabel>}
                    >
                        {availableEvents.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedEventId && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Managing promotions for: <strong>{availableEvents.find(e => e.id === selectedEventId)?.name}</strong>
                    </Typography>
                )}
            </Paper>

            {loadingPromotions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading promotions for selected event...</Typography>
                </Box>
            ) : promotions.length === 0 && selectedEventId ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No discount codes found for "{availableEvents.find(e => e.id === selectedEventId)?.name}". Click "Add New Discount" to create one.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {promotions.map((promo) => (
                        <Grid item xs={12} sm={6} md={4} key={promo.id}>
                            <Fade in={true} timeout={500}>
                                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" component="div">
                                                {promo.code}
                                            </Typography>
                                            <Chip
                                                label={promo.isActive ? 'Active' : 'Inactive'}
                                                color={promo.isActive ? 'success' : 'error'}
                                                size="small"
                                                icon={promo.isActive ? <CheckCircleIcon /> : <DoNotDisturbAltIcon />}
                                            />
                                        </Box>
                                        <Divider sx={{ mb: 1.5 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Discount:</strong> {promo.discountValue}
                                            {promo.discountType === 'Percentage' ? '%' : ' USD'} ({promo.discountType})
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Applies To:</strong> {promo.appliesTo}
                                            {promo.appliesTo === 'Selected Ticket Types' && promo.appliedTicketTypeIds?.length > 0 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                    {promo.appliedTicketTypeIds.map(id => (
                                                        <Chip key={id} label={getTicketTypeName(id)} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Sales Period:</strong> {dayjs(promo.startDate).format('MMM D, YY')} - {dayjs(promo.endDate).format('MMM D, YY')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Usage:</strong> {promo.usedCount} / {promo.usageLimit === 0 ? 'Unlimited' : promo.usageLimit}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Min Order:</strong> ${promo.minOrderAmount.toFixed(2)}
                                            {promo.maxOrderAmount !== null && ` | Max Order: $${promo.maxOrderAmount.toFixed(2)}`}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeletePromotion(promo.id, promo.code)}
                                            aria-label={`delete ${promo.code}`}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add New Promotion Dialog */}
            <Dialog open={addDialogOpen} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Discount Code</DialogTitle>
                <DialogContent dividers>
                    {addDialogErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{addDialogErrors.general}</Alert>}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Discount Code"
                        name="code"
                        value={newPromotionData.code}
                        onChange={handleNewPromotionChange}
                        variant="outlined"
                        required
                        error={!!addDialogErrors.code}
                        helperText={addDialogErrors.code}
                    />
                    <FormControl fullWidth margin="normal" error={!!addDialogErrors.discountType}>
                        <InputLabel>Discount Type</InputLabel>
                        <Select
                            name="discountType"
                            value={newPromotionData.discountType}
                            onChange={handleNewPromotionChange}
                            label="Discount Type"
                            required
                        >
                            <MenuItem value="Percentage">Percentage (%)</MenuItem>
                            <MenuItem value="Fixed Amount">Fixed Amount ($)</MenuItem>
                        </Select>
                        {addDialogErrors.discountType && <FormHelperText>{addDialogErrors.discountType}</FormHelperText>}
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={`Discount Value (${newPromotionData.discountType === 'Percentage' ? '%' : '$'})`}
                        name="discountValue"
                        type="number"
                        value={newPromotionData.discountValue}
                        onChange={handleNewPromotionChange}
                        variant="outlined"
                        required
                        error={!!addDialogErrors.discountValue}
                        helperText={addDialogErrors.discountValue}
                    />

                    <FormControl fullWidth margin="normal" error={!!addDialogErrors.appliesTo}>
                        <InputLabel>Applies To</InputLabel>
                        <Select
                            name="appliesTo"
                            value={newPromotionData.appliesTo}
                            onChange={handleNewPromotionChange}
                            label="Applies To"
                            required
                        >
                            <MenuItem value="Entire Event">Entire Event</MenuItem>
                            <MenuItem value="Selected Ticket Types">Selected Ticket Types</MenuItem>
                        </Select>
                        {addDialogErrors.appliesTo && <FormHelperText>{addDialogErrors.appliesTo}</FormHelperText>}
                    </FormControl>

                    {newPromotionData.appliesTo === 'Selected Ticket Types' && (
                        <FormControl fullWidth margin="normal" error={!!addDialogErrors.appliedTicketTypeIds}>
                            <InputLabel id="applied-ticket-types-label">Select Ticket Types</InputLabel>
                            <Select
                                labelId="applied-ticket-types-label"
                                multiple
                                value={newPromotionData.appliedTicketTypeIds}
                                onChange={handleAppliedTicketTypesChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={getTicketTypeName(value)} />
                                        ))}
                                    </Box>
                                )}
                                label="Select Ticket Types"
                                required={newPromotionData.appliesTo === 'Selected Ticket Types'}
                            >
                                {availableEvents.find(e => e.id === selectedEventId)?.ticketTypes?.map((ticketType) => (
                                    <MenuItem key={ticketType.id} value={ticketType.id}>
                                        {ticketType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {addDialogErrors.appliedTicketTypeIds && <FormHelperText>{addDialogErrors.appliedTicketTypeIds}</FormHelperText>}
                        </FormControl>
                    )}

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="Sales Start Date & Time"
                                value={newPromotionData.startDate}
                                onChange={(newValue) => handleNewPromotionDateChange('startDate', newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        required
                                        error={!!addDialogErrors.startDate}
                                        helperText={addDialogErrors.startDate}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="Sales End Date & Time"
                                value={newPromotionData.endDate}
                                onChange={(newValue) => handleNewPromotionDateChange('endDate', newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        required
                                        error={!!addDialogErrors.endDate}
                                        helperText={addDialogErrors.endDate}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Usage Limit (0 for unlimited)"
                        name="usageLimit"
                        type="number"
                        value={newPromotionData.usageLimit}
                        onChange={handleNewPromotionChange}
                        variant="outlined"
                        required
                        error={!!addDialogErrors.usageLimit}
                        helperText={addDialogErrors.usageLimit}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Min Order Amount ($)"
                        name="minOrderAmount"
                        type="number"
                        value={newPromotionData.minOrderAmount}
                        onChange={handleNewPromotionChange}
                        variant="outlined"
                        required
                        error={!!addDialogErrors.minOrderAmount}
                        helperText={addDialogErrors.minOrderAmount}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Max Order Amount ($) (Leave empty for no limit)"
                        name="maxOrderAmount"
                        type="number"
                        value={newPromotionData.maxOrderAmount === null ? '' : newPromotionData.maxOrderAmount}
                        onChange={(e) => {
                            const value = e.target.value === '' ? null : parseFloat(e.target.value);
                            handleNewPromotionChange({ target: { name: 'maxOrderAmount', value: value } });
                        }}
                        variant="outlined"
                        error={!!addDialogErrors.maxOrderAmount}
                        helperText={addDialogErrors.maxOrderAmount}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="error" disabled={loadingPromotions}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPromotionSubmit}
                        color="primary"
                        variant="contained"
                        startIcon={loadingPromotions ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        disabled={loadingPromotions}
                    >
                        Add Discount
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};