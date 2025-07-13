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
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField // Added this import, as it's used in DatePicker renderInput
} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Date Pickers for filtering
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'; // For dummy UUIDs

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// This requires data from events, users, and templates for realistic foreign key lookups.

// Re-using dummy templates for lookup
const allDummyTemplates = [
    { template_id: 'temp-001', template_name: 'Event Confirmation Email', channel: 'EMAIL' },
    { template_id: 'temp-002', template_name: 'Upcoming Event Reminder SMS', channel: 'SMS' },
    { template_id: 'temp-003', template_name: 'Event Cancellation Email', channel: 'EMAIL' },
    { template_id: 'temp-004', template_name: 'Welcome New User Email', channel: 'EMAIL' },
];

// Re-using dummy events for lookup
const allDummyEvents = [
    { event_id: 'evt-001', name: 'Tech Innovators Summit 2025' },
    { event_id: 'evt-002', name: 'Annual Charity Gala' },
    { event_id: 'evt-004', name: 'Winter Wonderland Market' },
];

// Dummy Users for recipient lookup
const allDummyUsers = [
    { user_id: 'user-001', email: 'user1@example.com', name: 'Alice Attendee' },
    { user_id: 'user-002', email: 'user2@example.com', name: 'Bob Organizer' }, // Could be an organizer user
    { user_id: 'user-003', email: 'user3@example.com', name: 'Charlie Customer' },
];

// Dummy Organizers for recipient lookup
const allDummyOrganizers = [
    { organizer_id: 'organizer-1', name: 'Tkti Events Ltd.', email: 'admin@tkti.com' },
    { organizer_id: 'organizer-2', name: 'Artistic Ventures', email: 'art@example.com' },
];

// Dummy Log Data (simulates `public.communicationlogs` table)
let dummyCommunicationLogs = [
    {
        log_id: uuidv4(),
        template_id: 'temp-001',
        recipient_user_id: 'user-001',
        recipient_organizer_id: null,
        recipient_email: 'user1@example.com',
        recipient_phone: null,
        channel: 'EMAIL',
        subject_sent: 'Your Ticket Confirmation for Tech Innovators Summit 2025',
        body_sent: 'Dear Alice Attendee,\n\nThank you for purchasing tickets for Tech Innovators Summit 2025! Your order details are attached.',
        sent_datetime: new Date('2025-09-01T10:30:00Z').toISOString(),
        status: 'SENT',
        error_message: null,
        external_message_id: 'email-tx-123',
        event_id: 'evt-001',
    },
    {
        log_id: uuidv4(),
        template_id: 'temp-002',
        recipient_user_id: 'user-001',
        recipient_organizer_id: null,
        recipient_email: null,
        recipient_phone: '254711223344',
        channel: 'SMS',
        subject_sent: null,
        body_sent: 'Reminder! Your ticket for Tech Innovators Summit 2025 is on 2025-09-10 at Convention Center. See you soon!',
        sent_datetime: new Date('2025-09-08T15:00:00Z').toISOString(),
        status: 'DELIVERED',
        error_message: null,
        external_message_id: 'sms-tx-456',
        event_id: 'evt-001',
    },
    {
        log_id: uuidv4(),
        template_id: 'temp-003',
        recipient_user_id: null,
        recipient_organizer_id: 'organizer-1',
        recipient_email: 'admin@tkti.com',
        recipient_phone: null,
        channel: 'EMAIL',
        subject_sent: 'Important: Event Annual Charity Gala Cancellation',
        body_sent: 'Dear Tkti Events Ltd.,\n\nWe regret to inform you that Annual Charity Gala on 2025-10-22 has been cancelled. Refunds will be processed.',
        sent_datetime: new Date('2025-10-10T11:00:00Z').toISOString(),
        status: 'FAILED',
        error_message: 'Recipient email address invalid.',
        external_message_id: 'email-tx-789',
        event_id: 'evt-002',
    },
    {
        log_id: uuidv4(),
        template_id: 'temp-001',
        recipient_user_id: 'user-003',
        recipient_organizer_id: null,
        recipient_email: 'user3@example.com',
        recipient_phone: null,
        channel: 'EMAIL',
        subject_sent: 'Your Ticket Confirmation for Annual Charity Gala',
        body_sent: 'Dear Charlie Customer,\n\nThank you for purchasing tickets for Annual Charity Gala!',
        sent_datetime: new Date('2025-08-15T09:00:00Z').toISOString(),
        status: 'SENT',
        error_message: null,
        external_message_id: 'email-tx-101',
        event_id: 'evt-002',
    },
    {
        log_id: uuidv4(),
        template_id: 'temp-002',
        recipient_user_id: null,
        recipient_organizer_id: 'organizer-1', // Another log for the organizer
        recipient_email: null,
        recipient_phone: '254712345678',
        channel: 'SMS',
        subject_sent: null,
        body_sent: 'Admin Alert: New event created for Tkti Events Ltd. Check dashboard.',
        sent_datetime: new Date('2025-07-20T10:00:00Z').toISOString(),
        status: 'SENT',
        error_message: null,
        external_message_id: 'sms-tx-112',
        event_id: null, // No specific event
    },
];

// Simulate fetching communication logs (with filtering and pagination)
const fetchCommunicationLogs = async (filters, page, rowsPerPage) => {
    return new Promise(resolve => {
        setTimeout(() => {
            let filteredLogs = [...dummyCommunicationLogs]; // Create a mutable copy

            // Apply filters
            if (filters.eventId) {
                filteredLogs = filteredLogs.filter(log => log.event_id === filters.eventId);
            }
            if (filters.channel) {
                filteredLogs = filteredLogs.filter(log => log.channel === filters.channel);
            }
            if (filters.status) {
                filteredLogs = filteredLogs.filter(log => log.status === filters.status);
            }
            if (filters.startDate) {
                filteredLogs = filteredLogs.filter(log => dayjs(log.sent_datetime).isSameOrAfter(filters.startDate, 'day'));
            }
            if (filters.endDate) {
                filteredLogs = filteredLogs.filter(log => dayjs(log.sent_datetime).isSameOrBefore(filters.endDate, 'day'));
            }

            // Sort by sent_datetime (most recent first)
            filteredLogs.sort((a, b) => new Date(b.sent_datetime).getTime() - new Date(a.sent_datetime).getTime());

            // Apply pagination
            const total = filteredLogs.length;
            const start = page * rowsPerPage;
            const end = start + rowsPerPage;
            const paginatedLogs = filteredLogs.slice(start, end);

            // Enhance logs with readable names
            const enhancedLogs = paginatedLogs.map(log => {
                const template = allDummyTemplates.find(t => t.template_id === log.template_id);
                const event = allDummyEvents.find(e => e.event_id === log.event_id);
                const recipientName = log.recipient_user_id
                    ? allDummyUsers.find(u => u.user_id === log.recipient_user_id)?.name
                    : (log.recipient_organizer_id
                        ? allDummyOrganizers.find(o => o.organizer_id === log.recipient_organizer_id)?.name
                        : 'N/A');

                return {
                    ...log,
                    template_name: template ? template.template_name : 'Unknown Template',
                    event_name: event ? event.name : 'N/A',
                    recipient_name: recipientName,
                    // Determine primary recipient display
                    display_recipient: log.recipient_email || log.recipient_phone || recipientName || 'N/A',
                };
            });

            resolve({ logs: enhancedLogs, totalLogs: total });
        }, 800);
    });
};

export const CommunicationLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [filters, setFilters] = useState({
        eventId: '',
        channel: '',
        status: '',
        startDate: null, // dayjs object
        endDate: null,   // dayjs object
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalLogs, setTotalLogs] = useState(0);

    const [logDetailsDialogOpen, setLogDetailsDialogOpen] = useState(false);
    const [selectedLogDetails, setSelectedLogDetails] = useState(null);

    // Fetch logs based on filters and pagination
    useEffect(() => {
        const getLogs = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                const { logs: fetchedLogs, totalLogs: total } = await fetchCommunicationLogs(filters, page, rowsPerPage);
                setLogs(fetchedLogs);
                setTotalLogs(total);
            } catch (err) {
                console.error("Failed to fetch communication logs:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load communication logs.' });
            } finally {
                setLoading(false);
            }
        };
        getLogs();
    }, [filters, page, rowsPerPage]); // Re-fetch when filters or pagination changes

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset to first page on filter change
    };

    const handleDateFilterChange = (name, date) => {
        setFilters(prev => ({ ...prev, [name]: date }));
        setPage(0); // Reset to first page on filter change
    };

    const handleClearFilters = () => {
        setFilters({
            eventId: '',
            channel: '',
            status: '',
            startDate: null,
            endDate: null,
        });
        setPage(0); // Reset to first page
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewLogDetails = (log) => {
        setSelectedLogDetails(log);
        setLogDetailsDialogOpen(true);
    };

    const handleLogDetailsDialogClose = () => {
        setLogDetailsDialogOpen(false);
        setSelectedLogDetails(null);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: "100vh", height: 'auto'}}>
            <Typography variant="h4" gutterBottom>
                <ManageSearchIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Communication Logs
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
                        <Typography variant="h6">Filter Logs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Event</InputLabel>
                                    <Select
                                        name="eventId"
                                        value={filters.eventId}
                                        onChange={handleFilterChange}
                                        label="Event"
                                    >
                                        <MenuItem value=""><em>All Events</em></MenuItem>
                                        {allDummyEvents.map(event => (
                                            <MenuItem key={event.event_id} value={event.event_id}>{event.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Channel</InputLabel>
                                    <Select
                                        name="channel"
                                        value={filters.channel}
                                        onChange={handleFilterChange}
                                        label="Channel"
                                    >
                                        <MenuItem value=""><em>All Channels</em></MenuItem>
                                        <MenuItem value="EMAIL">Email</MenuItem>
                                        <MenuItem value="SMS">SMS</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        label="Status"
                                    >
                                        <MenuItem value=""><em>All Statuses</em></MenuItem>
                                        <MenuItem value="SENT">Sent</MenuItem>
                                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                                        <MenuItem value="FAILED">Failed</MenuItem>
                                        <MenuItem value="PENDING">Pending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <DatePicker
                                    label="Start Date"
                                    value={filters.startDate}
                                    onChange={(newValue) => handleDateFilterChange('startDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <DatePicker
                                    label="End Date"
                                    value={filters.endDate}
                                    onChange={(newValue) => handleDateFilterChange('endDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClearFilters}
                                    fullWidth
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading logs...</Typography>
                </Box>
            ) : totalLogs === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No communication logs found matching your criteria.
                </Alert>
            ) : (
                <Paper elevation={3} sx={{ p: 0 }}>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sent At</TableCell>
                                    <TableCell>Template</TableCell>
                                    <TableCell>Recipient</TableCell>
                                    <TableCell>Channel</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell align="right">Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.log_id}>
                                        <TableCell>{new Date(log.sent_datetime).toLocaleString()}</TableCell>
                                        <TableCell>{log.template_name}</TableCell>
                                        <TableCell>{log.display_recipient}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={log.channel === 'EMAIL' ? <EmailIcon /> : <SmsIcon />}
                                                label={log.channel}
                                                color={log.channel === 'EMAIL' ? 'primary' : 'secondary'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {log.subject_sent || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.status}
                                                color={
                                                    log.status === 'DELIVERED' ? 'success' :
                                                        log.status === 'FAILED' ? 'error' :
                                                            'info' // For SENT, PENDING
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{log.event_name}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="info"
                                                size="small"
                                                onClick={() => handleViewLogDetails(log)}
                                                aria-label={`view details for log ${log.log_id}`}
                                            >
                                                <InfoOutlinedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalLogs}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            {/* Log Details Dialog */}
            <Dialog open={logDetailsDialogOpen} onClose={handleLogDetailsDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Communication Log Details</DialogTitle>
                <DialogContent dividers>
                    {selectedLogDetails && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Sent At:</strong> {new Date(selectedLogDetails.sent_datetime).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Channel:</strong> {selectedLogDetails.channel}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Status:</strong> {selectedLogDetails.status}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Template:</strong> {selectedLogDetails.template_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1"><strong>Recipient:</strong> {selectedLogDetails.display_recipient}</Typography>
                            </Grid>
                            {selectedLogDetails.event_id && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1"><strong>Event:</strong> {selectedLogDetails.event_name}</Typography>
                                </Grid>
                            )}
                            {selectedLogDetails.external_message_id && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1"><strong>External Message ID:</strong> {selectedLogDetails.external_message_id}</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" gutterBottom><strong>Subject Sent:</strong></Typography>
                                <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.default' }}>
                                    <Typography variant="body2">{selectedLogDetails.subject_sent || '-'}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom><strong>Body Sent:</strong></Typography>
                                <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.default', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                    <Typography variant="body2">{selectedLogDetails.body_sent}</Typography>
                                </Paper>
                            </Grid>
                            {selectedLogDetails.error_message && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom><strong>Error Message:</strong></Typography>
                                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'error.main', color: 'error.contrastText' }}>
                                        <Typography variant="body2">{selectedLogDetails.error_message}</Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogDetailsDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};