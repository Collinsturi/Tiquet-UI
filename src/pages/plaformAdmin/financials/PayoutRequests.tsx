import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import PaidIcon from '@mui/icons-material/Paid'; // Icon for Payouts
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
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

// Sample Data for Payout Requests
const initialPayoutRequests = [
    {
        id: 'payout_1',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Summer Music Festival',
        amount: 50000.00,
        request_date: '2025-07-01',
        status: 'pending', // pending, processed, failed
        bank_details: {
            bank_name: 'Bank of Events',
            account_number: '1234567890',
            account_name: 'EventMasters Operating',
            swift_code: 'BOFEUS33',
        },
        transaction_reference: '',
    },
    {
        id: 'payout_2',
        organizer_id: 'org_3',
        organizer_name: 'Tech Innovations Ltd.',
        event_name: 'Annual Tech Summit',
        amount: 30000.00,
        request_date: '2025-06-25',
        status: 'pending',
        bank_details: {
            bank_name: 'Global Finance',
            account_number: '1122334455',
            account_name: 'Tech Innovations Corp',
            swift_code: 'GLOFUS33',
        },
        transaction_reference: '',
    },
    {
        id: 'payout_3',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Winter Wonderland Gala',
        amount: 10000.00,
        request_date: '2025-06-10',
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
        status: 'pending',
        bank_details: {
            bank_name: 'Community Bank',
            account_number: '9876543210',
            account_name: 'City Arts Treasury',
            swift_code: 'COMBUS33',
        },
        transaction_reference: '',
    },
];

export const PayoutRequests = () => {
    const [payoutRequests, setPayoutRequests] = useState(initialPayoutRequests);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [currentPayoutRequest, setCurrentPayoutRequest] = useState(null);
    const [transactionReference, setTransactionReference] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers for Payout Requests
    const handleOpenReview = (request) => {
        setCurrentPayoutRequest(request);
        setTransactionReference(request.transaction_reference || ''); // Load existing ref
        setOpenReviewDialog(true);
    };

    const handleProcessPayout = () => {
        if (currentPayoutRequest) {
            // In a real app, this would trigger an API call to initiate bank transfer
            console.log(`Processing payout for ${currentPayoutRequest.organizer_name} (Amount: $${currentPayoutRequest.amount}) with ref: ${transactionReference}`);
            setPayoutRequests(payoutRequests.map(req =>
                req.id === currentPayoutRequest.id
                    ? { ...req, status: 'processed', transaction_reference: transactionReference }
                    : req
            ));
            setOpenReviewDialog(false);
            setCurrentPayoutRequest(null);
            setTransactionReference('');
        }
    };

    const handleMarkAsFailed = () => {
        if (currentPayoutRequest) {
            // In a real app, this would mark the payout as failed in the backend
            console.log(`Marking payout for ${currentPayoutRequest.organizer_name} as failed`);
            setPayoutRequests(payoutRequests.map(req =>
                req.id === currentPayoutRequest.id
                    ? { ...req, status: 'failed' }
                    : req
            ));
            setOpenReviewDialog(false);
            setCurrentPayoutRequest(null);
            setTransactionReference('');
        }
    };

    // Filter payout requests based on search term and status
    const filteredPayoutRequests = payoutRequests.filter(request =>
        (request.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* Payout Requests List */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <PaidIcon className="mr-2" color="primary" /> All Payout Requests
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Requests (Organizer, Event, Status)"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
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
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPayoutRequests.length > 0 ? (
                                        filteredPayoutRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.organizer_name}</TableCell>
                                                <TableCell>{request.event_name}</TableCell>
                                                <TableCell>${request.amount.toFixed(2)}</TableCell>
                                                <TableCell>{request.request_date}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        color={
                                                            request.status === 'pending' ? 'warning' :
                                                                request.status === 'processed' ? 'success' :
                                                                    request.status === 'failed' ? 'error' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view details" onClick={() => handleOpenReview(request)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <IconButton aria-label="process payout" onClick={() => handleOpenReview(request)} sx={{ ml: 1 }}>
                                                                <CheckCircleOutlineIcon color="success" />
                                                            </IconButton>
                                                            <IconButton aria-label="mark as failed" onClick={() => { setCurrentPayoutRequest(request); handleMarkAsFailed(); }} sx={{ ml: 1 }}>
                                                                <CancelIcon color="error" />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No payout requests found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Review Payout Request Dialog */}
                {currentPayoutRequest && (
                    <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Review Payout Request: ${currentPayoutRequest.amount.toFixed(2)}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Request Details</Typography>
                            <Typography variant="body2"><strong>Organizer:</strong> {currentPayoutRequest.organizer_name}</Typography>
                            <Typography variant="body2"><strong>Event:</strong> {currentPayoutRequest.event_name}</Typography>
                            <Typography variant="body2"><strong>Requested Amount:</strong> ${currentPayoutRequest.amount.toFixed(2)}</Typography>
                            <Typography variant="body2"><strong>Request Date:</strong> {currentPayoutRequest.request_date}</Typography>
                            <Typography variant="body2"><strong>Current Status:</strong>
                                <Chip
                                    label={currentPayoutRequest.status.charAt(0).toUpperCase() + currentPayoutRequest.status.slice(1)}
                                    color={
                                        currentPayoutRequest.status === 'pending' ? 'warning' :
                                            currentPayoutRequest.status === 'processed' ? 'success' :
                                                currentPayoutRequest.status === 'failed' ? 'error' : 'default'
                                    }
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceWalletIcon sx={{ mr: 1 }} color="action" /> Bank Account Details
                            </Typography>
                            <Typography variant="body2"><strong>Bank Name:</strong> {currentPayoutRequest.bank_details.bank_name}</Typography>
                            <Typography variant="body2"><strong>Account Number:</strong> {currentPayoutRequest.bank_details.account_number}</Typography>
                            <Typography variant="body2"><strong>Account Name:</strong> {currentPayoutRequest.bank_details.account_name}</Typography>
                            <Typography variant="body2"><strong>SWIFT Code:</strong> {currentPayoutRequest.bank_details.swift_code}</Typography>

                            {currentPayoutRequest.status === 'pending' && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <TextField
                                        margin="dense"
                                        label="Transaction Reference"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={transactionReference}
                                        onChange={(e) => setTransactionReference(e.target.value)}
                                        helperText="Enter the transaction ID after initiating the bank transfer."
                                        sx={{ mb: 2 }}
                                    />
                                </>
                            )}
                            {currentPayoutRequest.status !== 'pending' && currentPayoutRequest.transaction_reference && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2"><strong>Transaction Reference:</strong> {currentPayoutRequest.transaction_reference}</Typography>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenReviewDialog(false)}>Close</Button>
                            {currentPayoutRequest.status === 'pending' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleOutlineIcon />}
                                        onClick={handleProcessPayout}
                                        disabled={!transactionReference.trim()} // Disable if no reference for processing
                                    >
                                        Process Payout
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={handleMarkAsFailed}
                                    >
                                        Mark as Failed
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default PayoutRequests;
