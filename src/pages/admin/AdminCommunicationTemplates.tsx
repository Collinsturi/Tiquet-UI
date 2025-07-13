// AdminCommunicationTemplates.jsx
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormHelperText,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { v4 as uuidv4 } from 'uuid'; // For generating dummy UUIDs

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// This data simulates your `public.communicationtemplates` table.
let dummyCommunicationTemplates = [
    {
        template_id: 'temp-001',
        template_name: 'Event Confirmation Email',
        channel: 'EMAIL',
        subject: 'Your Ticket Confirmation for {eventName}',
        body: 'Dear {attendeeName},\n\nThank you for purchasing tickets for {eventName}! Your order details are attached. \n\nEvent Date: {eventDate}\nLocation: {eventLocation}\n\nWe look forward to seeing you there!\n\nBest regards,\n{organizerName}',
        created_at: new Date('2025-01-01T10:00:00Z').toISOString(),
        updated_at: new Date('2025-01-01T10:00:00Z').toISOString(),
    },
    {
        template_id: 'temp-002',
        template_name: 'Upcoming Event Reminder SMS',
        channel: 'SMS',
        subject: null, // SMS typically doesn't have a subject
        body: 'Reminder! Your ticket for {eventName} is on {eventDate} at {eventLocation}. See you soon!',
        created_at: new Date('2025-01-15T14:30:00Z').toISOString(),
        updated_at: new Date('2025-01-15T14:30:00Z').toISOString(),
    },
    {
        template_id: 'temp-003',
        template_name: 'Event Cancellation Email',
        channel: 'EMAIL',
        subject: 'Important: Event {eventName} Cancellation',
        body: 'Dear {attendeeName},\n\nWe regret to inform you that {eventName} on {eventDate} has been cancelled. Refunds will be processed within 5-7 business days. We apologize for any inconvenience.\n\nSincerely,\n{organizerName}',
        created_at: new Date('2025-02-01T09:00:00Z').toISOString(),
        updated_at: new Date('2025-02-01T09:00:00Z').toISOString(),
    },
];

// Simulate API calls
const fetchTemplates = async () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(dummyCommunicationTemplates))), 500);
    });
};

const saveTemplate = async (template) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (template.template_id) {
                // Update existing
                const index = dummyCommunicationTemplates.findIndex(t => t.template_id === template.template_id);
                if (index !== -1) {
                    // Check for unique name on update
                    const nameExists = dummyCommunicationTemplates.some(t => t.template_name === template.template_name && t.template_id !== template.template_id);
                    if (nameExists) {
                        return reject(new Error("Template name already exists. Please choose a different name."));
                    }
                    dummyCommunicationTemplates[index] = { ...template, updated_at: new Date().toISOString() };
                    resolve({ success: true, message: "Template updated successfully!" });
                } else {
                    reject(new Error("Template not found."));
                }
            } else {
                // Add new
                // Check for unique name on creation
                const nameExists = dummyCommunicationTemplates.some(t => t.template_name === template.template_name);
                if (nameExists) {
                    return reject(new Error("Template name already exists. Please choose a different name."));
                }
                const newTemplate = { ...template, template_id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
                dummyCommunicationTemplates.push(newTemplate);
                resolve({ success: true, message: "Template added successfully!" });
            }
        }, 800);
    });
};

const deleteTemplate = async (templateId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = dummyCommunicationTemplates.length;
            dummyCommunicationTemplates = dummyCommunicationTemplates.filter(t => t.template_id !== templateId);
            if (dummyCommunicationTemplates.length < initialLength) {
                resolve({ success: true, message: "Template deleted successfully!" });
            } else {
                reject(new Error("Template not found."));
            }
        }, 500);
    });
};

export const AdminCommunicationTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null); // null for add, object for edit
    const [formErrors, setFormErrors] = useState({});

    // Fetch templates on component mount
    useEffect(() => {
        const getTemplates = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                const fetchedTemplates = await fetchTemplates();
                setTemplates(fetchedTemplates);
            } catch (err) {
                console.error("Failed to fetch templates:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load communication templates.' });
            } finally {
                setLoading(false);
            }
        };
        getTemplates();
    }, []);

    // --- Dialog Handlers ---
    const handleAddTemplateClick = () => {
        setCurrentTemplate({
            template_name: '',
            channel: 'EMAIL', // Default to Email
            subject: '',
            body: '',
        });
        setFormErrors({});
        setAddEditDialogOpen(true);
        setMessage({ type: '', text: '' }); // Clear main page message
    };

    const handleEditTemplateClick = (template) => {
        setCurrentTemplate({ ...template }); // Create a copy for editing
        setFormErrors({});
        setAddEditDialogOpen(true);
        setMessage({ type: '', text: '' }); // Clear main page message
    };

    const handleAddEditDialogClose = () => {
        setAddEditDialogOpen(false);
        setCurrentTemplate(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentTemplate(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!currentTemplate.template_name.trim()) errors.template_name = 'Template Name is required.';
        if (!currentTemplate.channel) errors.channel = 'Channel is required.';
        if (currentTemplate.channel === 'EMAIL' && !currentTemplate.subject?.trim()) errors.subject = 'Subject is required for Email templates.';
        if (!currentTemplate.body.trim()) errors.body = 'Body is required.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveTemplate = async () => {
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please correct errors in the form.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' }); // Clear any previous messages
        try {
            const dataToSave = { ...currentTemplate };
            // Ensure subject is null if channel is SMS
            if (dataToSave.channel === 'SMS') {
                dataToSave.subject = null;
            }

            const response = await saveTemplate(dataToSave);
            setMessage({ type: 'success', text: response.message });
            setAddEditDialogOpen(false);
            // Re-fetch templates to update the list with new/updated data
            const updatedTemplates = await fetchTemplates();
            setTemplates(updatedTemplates);
        } catch (err) {
            console.error("Error saving template:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save template.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId, templateName) => {
        if (!window.confirm(`Are you sure you want to delete the template "${templateName}"? This action cannot be undone.`)) {
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await deleteTemplate(templateId);
            setMessage({ type: 'success', text: response.message });
            // Remove from local state immediately for better UX
            setTemplates(prev => prev.filter(t => t.template_id !== templateId));
        } catch (err) {
            console.error("Error deleting template:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to delete template.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: "100vh", height: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Communication Templates
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddTemplateClick}
                    disabled={loading}
                >
                    Add New Template
                </Button>
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading templates...</Typography>
                </Box>
            ) : templates.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No communication templates found. Click "Add New Template" to create one.
                </Alert>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Template Name</TableCell>
                                <TableCell>Channel</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {templates.map((template) => (
                                <TableRow key={template.template_id}>
                                    <TableCell>{template.template_name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={template.channel === 'EMAIL' ? <EmailIcon /> : <SmsIcon />}
                                            label={template.channel}
                                            color={template.channel === 'EMAIL' ? 'primary' : 'secondary'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {template.subject || '-'}
                                    </TableCell>
                                    <TableCell>{new Date(template.created_at).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(template.updated_at).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="info"
                                            size="small"
                                            onClick={() => handleEditTemplateClick(template)}
                                            aria-label={`edit ${template.template_name}`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteTemplate(template.template_id, template.template_name)}
                                            aria-label={`delete ${template.template_name}`}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add/Edit Template Dialog */}
            <Dialog open={addEditDialogOpen} onClose={handleAddEditDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>{currentTemplate?.template_id ? 'Edit Communication Template' : 'Add New Communication Template'}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Template Name"
                        name="template_name"
                        value={currentTemplate?.template_name || ''}
                        onChange={handleFormChange}
                        variant="outlined"
                        required
                        error={!!formErrors.template_name}
                        helperText={formErrors.template_name}
                    />
                    <FormControl fullWidth margin="normal" required error={!!formErrors.channel}>
                        <InputLabel>Channel</InputLabel>
                        <Select
                            name="channel"
                            value={currentTemplate?.channel || ''}
                            onChange={handleFormChange}
                            label="Channel"
                        >
                            <MenuItem value="EMAIL">Email</MenuItem>
                            <MenuItem value="SMS">SMS</MenuItem>
                        </Select>
                        {formErrors.channel && <FormHelperText>{formErrors.channel}</FormHelperText>}
                    </FormControl>

                    {currentTemplate?.channel === 'EMAIL' && (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Subject"
                            name="subject"
                            value={currentTemplate?.subject || ''}
                            onChange={handleFormChange}
                            variant="outlined"
                            required
                            error={!!formErrors.subject}
                            helperText={formErrors.subject}
                        />
                    )}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Body (use {placeholderName} for dynamic content)"
                        name="body"
                        value={currentTemplate?.body || ''}
                        onChange={handleFormChange}
                        variant="outlined"
                        multiline
                        rows={8}
                        required
                        error={!!formErrors.body}
                        helperText={formErrors.body}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Available placeholders: {'{attendeeName}, {eventName}, {eventDate}, {eventLocation}, {organizerName}, {ticketType}'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddEditDialogClose} color="error" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveTemplate}
                        color="primary"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                    >
                        {currentTemplate?.template_id ? 'Save Changes' : 'Add Template'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};