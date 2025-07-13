// AdminScheduleCommunication.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import EventIcon from '@mui/icons-material/Event';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Date and Time Pickers
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'; // For generating dummy UUIDs

// --- Dummy Data Simulation (replace with actual API calls) ---
// Re-using dummy templates and events from previous examples
const allDummyTemplates = [
    { template_id: 'temp-001', template_name: 'Event Confirmation Email', channel: 'EMAIL', subject: 'Your Ticket Confirmation for {eventName}', body: 'Dear {attendeeName},\n\nThank you for purchasing tickets for {eventName}! Your order details are attached. \n\nEvent Date: {eventDate}\nLocation: {eventLocation}\n\nWe look forward to seeing you there!\n\nBest regards,\n{organizerName}' },
    { template_id: 'temp-002', template_name: 'Upcoming Event Reminder SMS', channel: 'SMS', subject: null, body: 'Reminder! Your ticket for {eventName} is on {eventDate} at {eventLocation}. See you soon!' },
    { template_id: 'temp-003', template_name: 'Event Cancellation Email', channel: 'EMAIL', subject: 'Important: Event {eventName} Cancellation', body: 'Dear {attendeeName},\n\nWe regret to inform you that {eventName} on {eventDate} has been cancelled. Refunds will be processed within 5-7 business days. We apologize for any inconvenience.\n\nSincerely,\n{organizerName}' },
    { template_id: 'temp-004', template_name: 'Welcome New User Email', channel: 'EMAIL', subject: 'Welcome to our platform!', body: 'Dear {userName},\n\nWelcome aboard! We are excited to have you.' },
    { template_id: 'temp-005', template_name: 'Organizer Account Activation SMS', channel: 'SMS', subject: null, body: 'Welcome {organizerName}! Your account is active. Login to start creating events.'},
    // Adding a template that uses {RecipientName} for explicit testing based on the error
    { template_id: 'temp-006', template_name: 'General Notification Email', channel: 'EMAIL', subject: 'General Update from Us', body: 'Dear {RecipientName},\n\nThis is a general notification from our platform. Hope you are well.\n\nBest regards,\nAdmin Team'},
];

const allDummyEvents = [
    { event_id: 'evt-001', name: 'Tech Innovators Summit 2025', date: '2025-09-10T09:00:00Z', location: 'KICC, Nairobi', organizer_id: 'org-001' },
    { event_id: 'evt-002', name: 'Annual Charity Gala', date: '2025-10-22T19:00:00Z', location: 'Sarit Centre, Nairobi', organizer_id: 'org-002' },
    { event_id: 'evt-003', name: 'Startup Pitch Day', date: '2025-11-05T14:00:00Z', location: 'Strathmore University', organizer_id: 'org-001' },
    { event_id: 'evt-004', name: 'Winter Wonderland Market', date: '2025-12-15T10:00:00Z', location: 'Village Market', organizer_id: 'org-003' },
];

const allDummyOrganizers = [
    { organizer_id: 'org-001', name: 'Tech Events Ltd', email: 'info@techevents.com' },
    { organizer_id: 'org-002', name: 'Charity Connect', email: 'contact@charityconnect.org' },
    { organizer_id: 'org-003', name: 'Market Place Group', email: 'sales@marketplace.com' },
];

const allDummyUsers = [
    { user_id: 'user-001', email: 'alice@example.com', name: 'Alice Attendee', phone: '254712345001' },
    { user_id: 'user-002', email: 'bob@example.com', name: 'Bob Organizer (User)', phone: '254712345002' }, // Example of a user who is also an organizer account
    { user_id: 'user-003', email: 'charlie@example.com', name: 'Charlie Customer', phone: '254712345003' },
    { user_id: 'user-004', email: 'diana@example.com', name: 'Diana Volunteer', phone: '254712345004' },
];

// In a real app, you'd fetch event attendees/registered users
const fetchEventAttendees = async (eventId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const attendees = [];
            if (eventId === 'evt-001') {
                attendees.push(allDummyUsers[0]); // Alice
                attendees.push(allDummyUsers[2]); // Charlie
            } else if (eventId === 'evt-002') {
                attendees.push(allDummyUsers[1]); // Bob
            } else if (eventId === 'evt-003') {
                attendees.push(allDummyUsers[0]); // Alice again
            }
            resolve(attendees);
        }, 300);
    });
};

// Simulate scheduling API call
const scheduleCommunication = async (scheduleData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Scheduling:", scheduleData);
            // In a real app, this would save to a 'scheduled_communications' table
            // and a cron job/queue would pick it up later.
            if (Math.random() > 0.1) { // 90% success rate
                resolve({ success: true, message: "Communication scheduled successfully!", scheduleId: uuidv4() });
            } else {
                reject(new Error("Failed to schedule communication due to a simulated network error."));
            }
        }, 1000);
    });
};

export const MassCommunication = () => {
    const [events, setEvents] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [selectedEventId, setSelectedEventId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [sendDateTime, setSendDateTime] = useState(dayjs().add(1, 'hour')); // Default to 1 hour from now
    const [recipientType, setRecipientType] = useState('attendees'); // 'attendees' or 'organizers' or 'users'
    const [customRecipientEmails, setCustomRecipientEmails] = useState(''); // For ad-hoc emails
    const [customRecipientPhones, setCustomRecipientPhones] = useState(''); // For ad-hoc phones
    const [customRecipientsEnabled, setCustomRecipientsEnabled] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    // Fetch initial data (events, templates)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                setEvents(allDummyEvents); // Replace with actual fetch
                setTemplates(allDummyTemplates); // Replace with actual fetch
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load initial data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedTemplate = templates.find(t => t.template_id === selectedTemplateId);
    const selectedEvent = events.find(e => e.event_id === selectedEventId);

    // Function to preview the filled body
    const previewBody = (templateBody, eventData, recipientData) => {
        if (!templateBody) return '';
        let filledBody = templateBody;

        if (eventData) {
            const eventOrganizer = allDummyOrganizers.find(org => org.organizer_id === eventData.organizer_id);
            filledBody = filledBody
                .replace(/{eventName}/g, eventData.name || 'N/A')
                .replace(/{eventDate}/g, eventData.date ? dayjs(eventData.date).format('MMMM DD, YYYY h:mm A') : 'N/A') // Corrected format
                .replace(/{eventLocation}/g, eventData.location || 'N/A')
                .replace(/{organizerName}/g, eventOrganizer ? eventOrganizer.name : 'N/A');
        }

        if (recipientData) {
            filledBody = filledBody
                .replace(/{attendeeName}/g, recipientData.name || 'N/A')
                .replace(/{userName}/g, recipientData.name || 'N/A')
                .replace(/{RecipientName}/g, recipientData.name || 'N/A'); // THIS IS THE CRUCIAL LINE FOR THE FIX
            // Add more specific recipient placeholders if needed, e.g., {ticketType}
        }

        return filledBody;
    };

    // Function to preview the filled subject (for email templates)
    const previewSubject = (templateSubject, eventData) => {
        if (!templateSubject) return '';
        let filledSubject = templateSubject;

        if (eventData) {
            filledSubject = filledSubject.replace(/{eventName}/g, eventData.name || 'N/A');
        }
        return filledSubject;
    };


    const validateForm = () => {
        const errors = {};
        if (!selectedTemplateId) errors.selectedTemplateId = 'Please select a communication template.';
        if (!sendDateTime || sendDateTime.isBefore(dayjs())) errors.sendDateTime = 'Schedule time must be in the future.';

        // Validation based on recipient type selected
        if (recipientType === 'attendees' && !selectedEventId) {
            errors.selectedEventId = 'Please select an event to target attendees.';
        }

        // Custom recipients validation
        if (customRecipientsEnabled) {
            if (selectedTemplate?.channel === 'EMAIL') {
                const emails = customRecipientEmails.split(',').map(email => email.trim()).filter(Boolean);
                if (emails.length === 0) {
                    errors.customRecipientEmails = 'At least one email address is required for custom email recipients.';
                } else {
                    // Basic email format validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emails.some(email => !emailRegex.test(email))) {
                        errors.customRecipientEmails = 'One or more custom email addresses are invalid.';
                    }
                }
            } else if (selectedTemplate?.channel === 'SMS') {
                const phones = customRecipientPhones.split(',').map(phone => phone.trim()).filter(Boolean);
                if (phones.length === 0) {
                    errors.customRecipientPhones = 'At least one phone number is required for custom SMS recipients.';
                } else {
                    // Basic phone number validation (e.g., allow digits and '+')
                    const phoneRegex = /^\+?[0-9\s-()]{7,20}$/; // Example regex, adjust as needed for E.164
                    if (phones.some(phone => !phoneRegex.test(phone))) {
                        errors.customRecipientPhones = 'One or more custom phone numbers are invalid (use E.164 format if possible, e.g., +2547...).';
                    }
                }
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleScheduleSend = async () => {
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please correct errors in the form.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Determine the actual recipients to be sent to the backend
            let actualRecipients = { emails: [], phones: [] };
            let targetAudienceIdentifier = recipientType; // e.g., 'attendees', 'organizers', 'users'

            if (customRecipientsEnabled) {
                if (selectedTemplate.channel === 'EMAIL') {
                    actualRecipients.emails = customRecipientEmails.split(',').map(email => email.trim()).filter(Boolean);
                } else if (selectedTemplate.channel === 'SMS') {
                    actualRecipients.phones = customRecipientPhones.split(',').map(phone => phone.trim()).filter(Boolean);
                }
                targetAudienceIdentifier = 'custom'; // Override target type if custom recipients are used
            }
            // For 'attendees', 'organizers', 'users', the backend would fetch the actual list
            // based on `recipientType` and `eventId`. We only send the identifier.


            const schedulePayload = {
                eventId: recipientType === 'attendees' ? selectedEventId : null, // Only send eventId if targeting attendees
                templateId: selectedTemplateId,
                sendDateTime: sendDateTime.toISOString(),
                recipientTarget: targetAudienceIdentifier, // e.g., 'attendees', 'organizers', 'users', 'custom'
                customRecipients: customRecipientsEnabled ? actualRecipients : null,

                // These are for logging/backend reference, actual content generation per recipient is backend's job
                subjectPreview: previewSubject(selectedTemplate?.subject, selectedEvent),
                bodyPreview: previewBody(selectedTemplate?.body, selectedEvent, { name: '{{RECIPIENT_NAME}}' }), // Use a generic token for backend reference
                channel: selectedTemplate.channel,
            };

            const response = await scheduleCommunication(schedulePayload);
            setMessage({ type: 'success', text: response.message });
            // Reset form
            setSelectedEventId('');
            setSelectedTemplateId('');
            setSendDateTime(dayjs().add(1, 'hour'));
            setRecipientType('attendees');
            setCustomRecipientEmails('');
            setCustomRecipientPhones('');
            setCustomRecipientsEnabled(false);
            setFormErrors({});

        } catch (err) {
            console.error("Error scheduling communication:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to schedule communication.' });
        } finally {
            setLoading(false);
        }
    };

    // Determine available placeholders based on selected template
    const getAvailablePlaceholders = (template) => {
        if (!template) return [];
        const placeholders = new Set();
        const regex = /{([a-zA-Z0-9_]+)}/g; // Matches {any_placeholder_name}
        let match;

        if (template.body) {
            while ((match = regex.exec(template.body)) !== null) {
                placeholders.add(match[1]);
            }
        }
        if (template.subject) {
            while ((match = regex.exec(template.subject)) !== null) {
                placeholders.add(match[1]);
            }
        }
        return Array.from(placeholders);
    };

    const availablePlaceholders = getAvailablePlaceholders(selectedTemplate);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <ScheduleSendIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Schedule Communication
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Select Campaign Details
                        </Typography>
                        <FormControl fullWidth margin="normal" error={!!formErrors.selectedTemplateId}>
                            <InputLabel>Communication Template</InputLabel>
                            <Select
                                value={selectedTemplateId}
                                label="Communication Template"
                                onChange={(e) => {
                                    setSelectedTemplateId(e.target.value);
                                    if (formErrors.selectedTemplateId) setFormErrors(prev => ({ ...prev, selectedTemplateId: '' }));
                                }}
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    <em>Select a Template</em>
                                </MenuItem>
                                {templates.map((template) => (
                                    <MenuItem key={template.template_id} value={template.template_id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {template.channel === 'EMAIL' ? <EmailIcon sx={{ mr: 1 }} /> : <SmsIcon sx={{ mr: 1 }} />}
                                            {template.template_name} ({template.channel})
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.selectedTemplateId && <FormHelperText>{formErrors.selectedTemplateId}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="normal" error={!!formErrors.sendDateTime}>
                            <DateTimePicker
                                label="Scheduled Send Date & Time"
                                value={sendDateTime}
                                onChange={(newValue) => {
                                    setSendDateTime(newValue);
                                    if (formErrors.sendDateTime) setFormErrors(prev => ({ ...prev, sendDateTime: '' }));
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                disabled={loading}
                            />
                            {formErrors.sendDateTime && <FormHelperText>{formErrors.sendDateTime}</FormHelperText>}
                        </FormControl>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Select Recipients
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Recipient Type</InputLabel>
                            <Select
                                value={recipientType}
                                label="Recipient Type"
                                onChange={(e) => {
                                    setRecipientType(e.target.value);
                                    // Clear event selection if recipient type changes to non-attendee
                                    if (e.target.value !== 'attendees') {
                                        setSelectedEventId('');
                                    }
                                    if (formErrors.selectedEventId) setFormErrors(prev => ({ ...prev, selectedEventId: '' }));
                                }}
                                disabled={loading || customRecipientsEnabled}
                            >
                                <MenuItem value="attendees">Event Attendees</MenuItem>
                                <MenuItem value="organizers">Event Organizers</MenuItem>
                                <MenuItem value="users">All Registered Users</MenuItem>
                            </Select>
                        </FormControl>

                        {recipientType === 'attendees' && (
                            <FormControl fullWidth margin="normal" error={!!formErrors.selectedEventId}>
                                <InputLabel>Select Event (for Attendees)</InputLabel>
                                <Select
                                    value={selectedEventId}
                                    label="Select Event (for Attendees)"
                                    onChange={(e) => {
                                        setSelectedEventId(e.target.value);
                                        if (formErrors.selectedEventId) setFormErrors(prev => ({ ...prev, selectedEventId: '' }));
                                    }}
                                    disabled={loading || customRecipientsEnabled}
                                >
                                    <MenuItem value="">
                                        <em>Select an Event</em>
                                    </MenuItem>
                                    {events.map((event) => (
                                        <MenuItem key={event.event_id} value={event.event_id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <EventIcon sx={{ mr: 1 }} />
                                                {event.name} ({dayjs(event.date).format('MMM DD, YYYY')})
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.selectedEventId && <FormHelperText>{formErrors.selectedEventId}</FormHelperText>}
                            </FormControl>
                        )}
                        {(recipientType === 'organizers' || recipientType === 'users') && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                This will target all {recipientType} in the system. No specific event selection needed.
                            </Typography>
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={customRecipientsEnabled}
                                    onChange={(e) => setCustomRecipientsEnabled(e.target.checked)}
                                    icon={<CheckBoxOutlineBlankIcon />}
                                    checkedIcon={<CheckBoxIcon />}
                                />
                            }
                            label="Send to Custom Recipients (override above)"
                            sx={{ mt: 2 }}
                            disabled={loading}
                        />

                        {customRecipientsEnabled && selectedTemplate && (
                            <Box mt={2}>
                                {selectedTemplate.channel === 'EMAIL' ? (
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Custom Recipient Emails (comma-separated)"
                                        value={customRecipientEmails}
                                        onChange={(e) => {
                                            setCustomRecipientEmails(e.target.value);
                                            if (formErrors.customRecipientEmails) setFormErrors(prev => ({ ...prev, customRecipientEmails: '' }));
                                        }}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        helperText="e.g., user1@example.com, user2@example.com"
                                        required
                                        error={!!formErrors.customRecipientEmails}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Custom Recipient Phone Numbers (comma-separated, E.164 format)"
                                        value={customRecipientPhones}
                                        onChange={(e) => {
                                            setCustomRecipientPhones(e.target.value);
                                            if (formErrors.customRecipientPhones) setFormErrors(prev => ({ ...prev, customRecipientPhones: '' }));
                                        }}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        helperText="e.g., +254712345678, +254798765432"
                                        required
                                        error={!!formErrors.customRecipientPhones}
                                    />
                                )}
                            </Box>
                        )}

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Template Preview
                        </Typography>
                        <Card variant="outlined" sx={{ minHeight: 400 }}>
                            <CardContent>
                                {selectedTemplate ? (
                                    <>
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                                            Template: <strong>{selectedTemplate.template_name}</strong> ({selectedTemplate.channel})
                                        </Typography>
                                        {selectedEvent && (
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                Event Context: <strong>{selectedEvent.name}</strong>
                                            </Typography>
                                        )}

                                        <Divider sx={{ my: 2 }} />

                                        {selectedTemplate.channel === 'EMAIL' && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" gutterBottom>Subject:</Typography>
                                                <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.default' }}>
                                                    <Typography variant="body1">
                                                        {previewSubject(selectedTemplate.subject, selectedEvent)}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        )}

                                        <Typography variant="h6" gutterBottom>Body:</Typography>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                            <Typography variant="body1">
                                                {/* Changed the dummy recipient data to a generic string for preview */}
                                                {previewBody(selectedTemplate.body, selectedEvent, { name: 'Recipient Name' })}
                                            </Typography>
                                        </Paper>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            *Placeholders like <code>{'{attendeeName}'}</code>, <code>{'{RecipientName}'}</code> etc. will be filled with actual data at send time.*
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle2" gutterBottom>
                                            Available Placeholders in Template:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {availablePlaceholders.length > 0 ? (
                                                availablePlaceholders.map(p => (
                                                    <Chip key={p} label={`{${p}}`} size="small" color="info" />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No dynamic placeholders detected.
                                                </Typography>
                                            )}
                                        </Box>

                                    </>
                                ) : (
                                    <Typography color="text.secondary">
                                        Select a template and an event (if applicable) to see a preview.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScheduleSendIcon />}
                        onClick={handleScheduleSend}
                        disabled={loading}
                    >
                        Schedule Communication
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};