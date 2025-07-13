import React, { useState } from 'react';
import {
    Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, FormControl, InputLabel, Select, MenuItem,
    Divider,
    Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'; // Icon for Audit Log
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

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

// Sample Data for Audit Log
const initialAuditLogs = [
    {
        id: 'log_1',
        actor: 'admin_john_doe',
        actor_type: 'Admin',
        action: 'Edited User Profile',
        target: 'user_alice_smith',
        target_type: 'User',
        timestamp: '2025-07-05 14:30:00',
        ip_address: '192.168.1.100',
        details: {
            field: 'email',
            old_value: 'alice.s@example.com',
            new_value: 'alice.smith@example.com',
        },
    },
    {
        id: 'log_2',
        actor: 'admin_jane_doe',
        actor_type: 'Admin',
        action: 'Approved Organizer',
        target: 'org_city_arts_collective',
        target_type: 'Organizer',
        timestamp: '2025-07-04 09:15:00',
        ip_address: '203.0.113.50',
        details: {
            organizer_id: 'org_2',
            status_change: 'is_verified: false -> true',
        },
    },
    {
        id: 'log_3',
        actor: 'system_cron',
        actor_type: 'System',
        action: 'Processed Payout',
        target: 'payout_eventmasters_inc',
        target_type: 'Payout',
        timestamp: '2025-07-03 23:00:00',
        ip_address: 'N/A',
        details: {
            payout_id: 'payout_1',
            amount: 50000.00,
            transaction_ref: 'TXN123456789',
        },
    },
    {
        id: 'log_4',
        actor: 'admin_john_doe',
        actor_type: 'Admin',
        action: 'Deactivated Category',
        target: 'cat_workshops_classes',
        target_type: 'Category',
        timestamp: '2025-07-02 10:00:00',
        ip_address: '192.168.1.100',
        details: {
            category_id: 'cat_4',
            status_change: 'is_active: true -> false',
        },
    },
    {
        id: 'log_5',
        actor: 'user_bob_johnson',
        actor_type: 'User',
        action: 'Login Attempt Failed',
        target: 'user_bob_johnson',
        target_type: 'User',
        timestamp: '2025-07-01 08:05:00',
        ip_address: '10.0.0.20',
        details: {
            reason: 'Incorrect password',
        },
    },
];

export const AuditLog = () => {
    const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [currentLog, setCurrentLog] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActorType, setFilterActorType] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Handlers
    const handleOpenDetails = (log) => {
        setCurrentLog(log);
        setOpenDetailsDialog(true);
    };

    // Get unique action types for filter dropdown
    const uniqueActionTypes = [...new Set(initialAuditLogs.map(log => log.action))];

    // Filter audit logs based on search term, actor type, action, and date range
    const filteredAuditLogs = auditLogs.filter(log => {
        const matchesSearchTerm =
            log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesActorType =
            filterActorType === 'all' || log.actor_type.toLowerCase() === filterActorType;

        const matchesAction =
            filterAction === 'all' || log.action.toLowerCase() === filterAction.toLowerCase();

        const logTimestamp = new Date(log.timestamp);
        const matchesStartDate = filterStartDate ? logTimestamp >= new Date(filterStartDate) : true;
        const matchesEndDate = filterEndDate ? logTimestamp <= new Date(filterEndDate) : true;

        return matchesSearchTerm && matchesActorType && matchesAction && matchesStartDate && matchesEndDate;
    });

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    Audit Log
                </Typography>

                {/* Audit Log List */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <HistoryToggleOffIcon className="mr-2" color="primary" /> System-Wide Actions
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                            <TextField
                                label="Search (Actor, Action, Target, IP, Details)"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
                                sx={{ flexGrow: 1, minWidth: '250px' }}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>Actor Type</InputLabel>
                                <Select
                                    value={filterActorType}
                                    label="Actor Type"
                                    onChange={(e) => setFilterActorType(e.target.value)}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="system">System</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 180 }}>
                                <InputLabel>Action</InputLabel>
                                <Select
                                    value={filterAction}
                                    label="Action"
                                    onChange={(e) => setFilterAction(e.target.value)}
                                >
                                    <MenuItem value="all">All Actions</MenuItem>
                                    {uniqueActionTypes.map(action => (
                                        <MenuItem key={action} value={action.toLowerCase()}>{action}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Date"
                                type="date"
                                variant="outlined"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: '150px' }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                variant="outlined"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: '150px' }}
                            />
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Actor</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Target</TableCell>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>IP Address</TableCell>
                                        <TableCell align="right">Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAuditLogs.length > 0 ? (
                                        filteredAuditLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <Chip
                                                        label={log.actor}
                                                        size="small"
                                                        color={log.actor_type === 'Admin' ? 'primary' : log.actor_type === 'User' ? 'secondary' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell>{log.action}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={log.target}
                                                        size="small"
                                                        color={log.target_type === 'User' ? 'secondary' : log.target_type === 'Organizer' ? 'warning' : 'info'}
                                                    />
                                                </TableCell>
                                                <TableCell>{log.timestamp}</TableCell>
                                                <TableCell>{log.ip_address}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view details" onClick={() => handleOpenDetails(log)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No audit log entries found matching your filters.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Audit Log Details Dialog */}
                {currentLog && (
                    <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Audit Log Entry Details</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Action Information</Typography>
                            <Typography variant="body2"><strong>Actor:</strong> {currentLog.actor} ({currentLog.actor_type})</Typography>
                            <Typography variant="body2"><strong>Action:</strong> {currentLog.action}</Typography>
                            <Typography variant="body2"><strong>Target:</strong> {currentLog.target} ({currentLog.target_type})</Typography>
                            <Typography variant="body2"><strong>Timestamp:</strong> {currentLog.timestamp}</Typography>
                            <Typography variant="body2"><strong>IP Address:</strong> {currentLog.ip_address}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>
                            <Paper variant="outlined" sx={{ p: 2, backgroundColor: grey[50] }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                  {JSON.stringify(currentLog.details, null, 2)}
                </pre>
                            </Paper>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default AuditLog;
