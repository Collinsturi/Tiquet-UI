import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import HistoryIcon from '@mui/icons-material/History'; // Icon for Payout History
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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

// Sample Data for Payout History (including processed and failed ones)
const allPayouts = [
    {
        id: 'payout_1',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Summer Music Festival',
        amount: 50000.00,
        request_date: '2025-07-01',
        processed_date: '2025-07-02',
        status: 'processed', // pending, processed, failed
        bank_details: {
            bank_name: 'Bank of Events',
            account_number: '1234567890',
            account_name: 'EventMasters Operating',
            swift_code: 'BOFEUS33',
        },
        transaction_reference: 'TXN123456789',
    },
    {
        id: 'payout_2',
        organizer_id: 'org_3',
        organizer_name: 'Tech Innovations Ltd.',
        event_name: 'Annual Tech Summit',
        amount: 30000.00,
        request_date: '2025-06-25',
        processed_date: '2025-06-26',
        status: 'processed',
        bank_details: {
            bank_name: 'Global Finance',
            account_number: '1122334455',
            account_name: 'Tech Innovations Corp',
            swift_code: 'GLOFUS33',
        },
        transaction_reference: 'TXN987654321',
    },
    {
        id: 'payout_3',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Winter Wonderland Gala',
        amount: 10000.00,
        request_date: '2025-06-10',
        processed_date: '2025-06-11',
        status: 'processed',
        bank_details: {
            bank_name: 'Bank of Events',
            account_number: '1234567890',
            account_name: 'EventMasters Operating',
            swift_code: 'BOFEUS33',
        },
        transaction_reference: 'TXN789012345',
    },
    {
        id: 'payout_4',
        organizer_id: 'org_2',
        organizer_name: 'City Arts Collective',
        event_name: 'Local Art Exhibition',
        amount: 500.00,
        request_date: '2025-07-03',
        processed_date: '', // No processed date if pending/failed
        status: 'failed',
        bank_details: {
            bank_name: 'Community Bank',
            account_number: '9876543210',
            account_name: 'City Arts Treasury',
            swift_code: 'COMBUS33',
        },
        transaction_reference: '',
    },
    {
        id: 'payout_5',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Spring Concert Series',
        amount: 25000.00,
        request_date: '2025-05-15',
        processed_date: '2025-05-16',
        status: 'processed',
        bank_details: {
            bank_name: 'Bank of Events',
            account_number: '1234567890',
            account_name: 'EventMasters Operating',
            swift_code: 'BOFEUS33',
        },
        transaction_reference: 'TXN112233445',
    },
];

export const PayoutHistory = () => {
    const [payouts, setPayouts] = useState(allPayouts);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [currentPayout, setCurrentPayout] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Handlers
    const handleOpenDetails = (payout) => {
        setCurrentPayout(payout);
        setOpenDetailsDialog(true);
    };

    // Filter payouts based on search term, status, and date range
    const filteredPayouts = payouts.filter(payout => {
        const matchesSearchTerm =
            payout.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payout.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payout.transaction_reference.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' || payout.status === filterStatus;

        const requestDate = new Date(payout.request_date);
        const matchesStartDate = filterStartDate ? requestDate >= new Date(filterStartDate) : true;
        const matchesEndDate = filterEndDate ? requestDate <= new Date(filterEndDate) : true;

        return matchesSearchTerm && matchesStatus && matchesStartDate && matchesEndDate;
    });

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* Payout History List */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <HistoryIcon className="mr-2" color="primary" /> All Past Payouts
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                            <TextField
                                label="Search (Org, Event, Ref)"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
                                sx={{ flexGrow: 1, minWidth: '200px' }}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    label="Status"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="processed">Processed</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
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
                                        <TableCell>Organizer</TableCell>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Request Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Transaction Ref</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPayouts.length > 0 ? (
                                        filteredPayouts.map((payout) => (
                                            <TableRow key={payout.id}>
                                                <TableCell>{payout.organizer_name}</TableCell>
                                                <TableCell>{payout.event_name}</TableCell>
                                                <TableCell>${payout.amount.toFixed(2)}</TableCell>
                                                <TableCell>{payout.request_date}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                                        color={
                                                            payout.status === 'pending' ? 'warning' :
                                                                payout.status === 'processed' ? 'success' :
                                                                    payout.status === 'failed' ? 'error' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{payout.transaction_reference || 'N/A'}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view details" onClick={() => handleOpenDetails(payout)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No payout records found matching your filters.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Payout Details Dialog */}
                {currentPayout && (
                    <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Payout Details: ${currentPayout.amount.toFixed(2)}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Payout Information</Typography>
                            <Typography variant="body2"><strong>Organizer:</strong> {currentPayout.organizer_name}</Typography>
                            <Typography variant="body2"><strong>Event:</strong> {currentPayout.event_name}</Typography>
                            <Typography variant="body2"><strong>Amount:</strong> ${currentPayout.amount.toFixed(2)}</Typography>
                            <Typography variant="body2"><strong>Request Date:</strong> {currentPayout.request_date}</Typography>
                            {currentPayout.processed_date && (
                                <Typography variant="body2"><strong>Processed Date:</strong> {currentPayout.processed_date}</Typography>
                            )}
                            <Typography variant="body2"><strong>Status:</strong>
                                <Chip
                                    label={currentPayout.status.charAt(0).toUpperCase() + currentPayout.status.slice(1)}
                                    color={
                                        currentPayout.status === 'pending' ? 'warning' :
                                            currentPayout.status === 'processed' ? 'success' :
                                                currentPayout.status === 'failed' ? 'error' : 'default'
                                    }
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                            <Typography variant="body2"><strong>Transaction Reference:</strong> {currentPayout.transaction_reference || 'N/A'}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceWalletIcon sx={{ mr: 1 }} color="action" /> Bank Account Details
                            </Typography>
                            <Typography variant="body2"><strong>Bank Name:</strong> {currentPayout.bank_details.bank_name}</Typography>
                            <Typography variant="body2"><strong>Account Number:</strong> {currentPayout.bank_details.account_number}</Typography>
                            <Typography variant="body2"><strong>Account Name:</strong> {currentPayout.bank_details.account_name}</Typography>
                            <Typography variant="body2"><strong>SWIFT Code:</strong> {currentPayout.bank_details.swift_code}</Typography>
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

export default PayoutHistory;
