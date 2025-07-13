// AdminPayouts.jsx
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
   Card, // <--- ADDED THIS IMPORT
    CardContent, // <--- ADDED THIS IMPORT (Though not strictly needed based on current usage, good practice if using Card often)
    FormHelperText, // <--- ADDED THIS IMPORT (Used in FormControl for helper text)
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NorthEastIcon from '@mui/icons-material/NorthEast'; // For withdrawn
import SouthWestIcon from '@mui/icons-material/SouthWest'; // For available
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // <--- ADDED THIS IMPORT
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // <--- ADDED THIS IMPORT

// --- Dummy Data Simulation ---
// These values would typically be fetched from a central financial service or your backend.
// Simulating an organizer's financial ledger.
const dummyOrganizerFinancials = {
    organizerId: 'organizer-1',
    totalEarningsGross: 250000.00, // Total revenue generated across all events
    totalPlatformFees: 25000.00, // Example 10% platform fee
    totalRefundsProcessed: 5000.00,
    totalWithdrawn: 100000.00, // Amount previously paid out
    // Calculated: totalEarningsNet = totalEarningsGross - totalPlatformFees - totalRefundsProcessed
    // Calculated: availableBalance = totalEarningsNet - totalWithdrawn
};

// Assuming net revenue per event is already calculated and ready for payout consideration
const dummyEventsWithNetRevenue = [
    { id: 'evt-001', name: 'Tech Innovators Summit 2025', netRevenue: 70000.00, isFinalized: true },
    { id: 'evt-002', name: 'Annual Charity Gala', netRevenue: 108000.00, isFinalized: true },
    { id: 'evt-003', name: 'Local Food Festival', netRevenue: 40000.00, isFinalized: true }, // Ended event
    { id: 'evt-004', name: 'Winter Wonderland Market', netRevenue: 7000.00, isFinalized: false }, // Ongoing/not yet finalized
];

// Dummy Profile Data for bank details (matching AdminProfile structure)
const dummyProfileData = {
    bankDetails: {
        bankName: 'National Bank of Kenya',
        accountName: 'Tkti Events Ltd.',
        accountNumber: '1234567890',
    },
};

// Dummy Payout Request History
let dummyPayoutHistory = [
    { requestId: 'payout-001', amount: 50000.00, status: 'Completed', requestDate: '2025-05-01T10:00:00Z', completionDate: '2025-05-03T11:00:00Z' },
    { requestId: 'payout-002', amount: 50000.00, status: 'Completed', requestDate: '2025-06-10T14:30:00Z', completionDate: '2025-06-12T15:00:00Z' },
    { requestId: 'payout-003', amount: 20000.00, status: 'Pending', requestDate: '2025-06-25T09:00:00Z', completionDate: null },
];

const CURRENT_ORGANIZER_ID = 'organizer-1'; // Simulating the logged-in admin's ID

// Simulate fetching financial data
const fetchOrganizerFinancials = async (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Recalculate available balance based on current dummy data for demo realism
            const totalEarningsNet = dummyOrganizerFinancials.totalEarningsGross - dummyOrganizerFinancials.totalPlatformFees - dummyOrganizerFinancials.totalRefundsProcessed;
            const availableBalance = totalEarningsNet - dummyOrganizerFinancials.totalWithdrawn;

            resolve({
                ...dummyOrganizerFinancials,
                totalEarningsNet,
                availableBalance: parseFloat(availableBalance.toFixed(2)) // Ensure float and 2 decimal places
            });
        }, 600);
    });
};

const fetchOrganizerEventsForPayout = async (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, you'd filter events by organizerId and check their payout status
            resolve(dummyEventsWithNetRevenue.filter(e => e.organizerId === organizerId || true)); // For demo, assuming all dummy events are for this organizer
        }, 400);
    });
};

const fetchBankDetails = async (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(dummyProfileData.bankDetails), 300);
    });
};

const fetchPayoutHistory = async (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(dummyPayoutHistory), 500);
    });
};

// Simulate requesting a payout
const requestPayout = async (requestData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Validate against available balance (simulated)
            const currentAvailableBalance = (dummyOrganizerFinancials.totalEarningsGross - dummyOrganizerFinancials.totalPlatformFees - dummyOrganizerFinancials.totalRefundsProcessed) - dummyOrganizerFinancials.totalWithdrawn;
            if (requestData.amount > currentAvailableBalance) {
                return reject(new Error("Requested amount exceeds available balance."));
            }
            if (requestData.amount <= 0) {
                return reject(new Error("Requested amount must be positive."));
            }

            // Simulate deduction and addition to history
            dummyOrganizerFinancials.totalWithdrawn += requestData.amount;
            const newPayoutRequest = {
                requestId: `payout-${Date.now()}`,
                amount: requestData.amount,
                status: 'Pending', // New requests are always pending initially
                requestDate: new Date().toISOString(),
                completionDate: null,
                requestedForEventId: requestData.requestedForEventId || null,
            };
            dummyPayoutHistory.unshift(newPayoutRequest); // Add to the beginning

            console.log("Payout requested:", requestData);
            resolve({ success: true, message: "Payout request submitted successfully!", requestId: newPayoutRequest.requestId });
        }, 1500);
    });
};

export const AdminPayouts = () => {
    const [financials, setFinancials] = useState(null);
    const [eventsForPayout, setEventsForPayout] = useState([]);
    const [bankDetails, setBankDetails] = useState(null);
    const [payoutHistory, setPayoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [payoutAmount, setPayoutAmount] = useState('');
    const [selectedEventForPayout, setSelectedEventForPayout] = useState(''); // Event ID for specific payout request
    const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
    const [payoutRequestLoading, setPayoutRequestLoading] = useState(false);

    // Fetch all necessary data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                const [fin, events, bank, history] = await Promise.all([
                    fetchOrganizerFinancials(CURRENT_ORGANIZER_ID),
                    fetchOrganizerEventsForPayout(CURRENT_ORGANIZER_ID),
                    fetchBankDetails(CURRENT_ORGANIZER_ID),
                    fetchPayoutHistory(CURRENT_ORGANIZER_ID),
                ]);
                setFinancials(fin);
                setEventsForPayout(events);
                setBankDetails(bank);
                setPayoutHistory(history);
            } catch (err) {
                console.error("Failed to load payout data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load payout information.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePayoutAmountChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and a single decimal point
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setPayoutAmount(value);
        }
    };

    const handleEventForPayoutChange = (e) => {
        const eventId = e.target.value;
        setSelectedEventForPayout(eventId);
        if (eventId) {
            const event = eventsForPayout.find(evt => evt.id === eventId);
            if (event) {
                setPayoutAmount(event.netRevenue.toFixed(2)); // Pre-fill with event's net revenue
            }
        } else {
            setPayoutAmount(''); // Clear if "None" selected
        }
    };

    const handleRequestPayoutClick = () => {
        setMessage({ type: '', text: '' }); // Clear any previous messages
        if (!bankDetails || !bankDetails.accountNumber) {
            setMessage({ type: 'error', text: 'Please update your bank account details in the Admin Profile section before requesting a payout.' });
            return;
        }
        setPayoutDialogOpen(true);
    };

    const handlePayoutDialogClose = () => {
        setPayoutDialogOpen(false);
        setPayoutAmount('');
        setSelectedEventForPayout('');
    };

    const handleConfirmPayout = async () => {
        const amount = parseFloat(payoutAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid positive amount for payout.' });
            return;
        }
        if (financials && amount > financials.availableBalance) {
            setMessage({ type: 'error', text: `Requested amount ($${amount.toFixed(2)}) exceeds available balance ($${financials.availableBalance.toFixed(2)}).` });
            return;
        }

        setPayoutRequestLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const requestPayload = {
                amount: amount,
                bankDetails: bankDetails, // Send full bank details for payout processing
                requestedForEventId: selectedEventForPayout || null, // Optional: for tracking origin
            };
            const response = await requestPayout(requestPayload);
            setMessage({ type: 'success', text: response.message });
            setPayoutDialogOpen(false);
            // Re-fetch financials and history to reflect changes
            const [updatedFin, updatedHistory] = await Promise.all([
                fetchOrganizerFinancials(CURRENT_ORGANIZER_ID),
                fetchPayoutHistory(CURRENT_ORGANIZER_ID),
            ]);
            setFinancials(updatedFin);
            setPayoutHistory(updatedHistory);
            setPayoutAmount(''); // Clear after successful request
            setSelectedEventForPayout('');
        } catch (err) {
            console.error("Payout request failed:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to submit payout request.' });
        } finally {
            setPayoutRequestLoading(false);
        }
    };


    if (loading || financials === null || bankDetails === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading payout information...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <AccountBalanceWalletIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> My Payouts
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            {/* Overall Financial Summary */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Overall Financial Summary</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <MonetizationOnIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Total Earnings (Gross)</Typography>
                                <Typography variant="h4" color="success">${financials.totalEarningsGross?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <NorthEastIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Total Withdrawn</Typography>
                                <Typography variant="h4" color="warning">${financials.totalWithdrawn?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <SouthWestIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Current Available Balance</Typography>
                                <Typography variant="h4" color="primary">${financials.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Event Contributions */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Event Revenue Contributions</Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Name</TableCell>
                                <TableCell align="right">Net Revenue Contribution</TableCell>
                                <TableCell>Payout Ready</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventsForPayout.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No events found or revenue pending.</TableCell>
                                </TableRow>
                            ) : (
                                eventsForPayout.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.name}</TableCell>
                                        <TableCell align="right">${event.netRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            <Alert
                                                severity={event.isFinalized ? 'success' : 'info'}
                                                iconMapping={{
                                                    success: <CheckCircleIcon fontSize="inherit" />,
                                                    info: <HourglassEmptyIcon fontSize="inherit" />,
                                                }}
                                                sx={{ p: 0.5, py: 0, '& .MuiAlert-message': { mt: 0, mb: 0 } }}
                                            >
                                                {event.isFinalized ? 'Ready' : 'Processing'}
                                            </Alert>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Request Payout Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Request Payout</Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Request Payout For (Optional)</InputLabel>
                            <Select
                                value={selectedEventForPayout}
                                label="Request Payout For (Optional)"
                                onChange={handleEventForPayoutChange}
                                disabled={payoutRequestLoading || !eventsForPayout.some(e => e.isFinalized)} // Disable if no finalized events
                            >
                                <MenuItem value="">
                                    <em>Overall Available Balance</em>
                                </MenuItem>
                                {eventsForPayout.filter(e => e.isFinalized).map((event) => (
                                    <MenuItem key={event.id} value={event.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EventIcon sx={{ mr: 1 }} />
                                            {event.name} (Net: ${event.netRevenue.toLocaleString()})
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {(!eventsForPayout.some(e => e.isFinalized) && (
                                <FormHelperText>No finalized events available for specific payout requests.</FormHelperText>
                            ))}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Amount to Withdraw"
                            type="text" // Use text to allow partial decimals during typing
                            value={payoutAmount}
                            onChange={handlePayoutAmountChange}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                inputMode: 'decimal', // Helps with mobile keyboards
                            }}
                            helperText={`Max: $${financials.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            disabled={payoutRequestLoading || financials?.availableBalance <= 0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Payout Details</Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Payouts will be sent to the bank account details configured in your Profile. Please ensure they are correct.
                        </Alert>
                        {bankDetails ? (
                            <Box>
                                <Typography variant="body1"><strong>Bank Name:</strong> {bankDetails.bankName}</Typography>
                                <Typography variant="body1"><strong>Account Name:</strong> {bankDetails.accountName}</Typography>
                                <Typography variant="body1"><strong>Account Number:</strong> {bankDetails.accountNumber}</Typography>
                            </Box>
                        ) : (
                            <Alert severity="warning">Bank details not found. Please set them up in your Admin Profile.</Alert>
                        )}
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRequestPayoutClick}
                            disabled={payoutRequestLoading || parseFloat(payoutAmount || '0') <= 0 || parseFloat(payoutAmount || '0') > financials?.availableBalance || !bankDetails?.accountNumber}
                            startIcon={payoutRequestLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {payoutRequestLoading ? 'Submitting...' : 'Request Payout'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Payout History */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Payout History</Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Request ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Requested For Event</TableCell>
                                <TableCell>Request Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Completion Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payoutHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No payout history found.</TableCell>
                                </TableRow>
                            ) : (
                                payoutHistory.map((request) => (
                                    <TableRow key={request.requestId}>
                                        <TableCell>{request.requestId}</TableCell>
                                        <TableCell>${request.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            {request.requestedForEventId ? (
                                                eventsForPayout.find(e => e.id === request.requestedForEventId)?.name || request.requestedForEventId
                                            ) : 'Overall'}
                                        </TableCell>
                                        <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Alert
                                                severity={request.status === 'Completed' ? 'success' : request.status === 'Pending' ? 'info' : 'error'}
                                                sx={{ p: 0.5, py: 0, '& .MuiAlert-message': { mt: 0, mb: 0 } }}
                                            >
                                                {request.status}
                                            </Alert>
                                        </TableCell>
                                        <TableCell>{request.completionDate ? new Date(request.completionDate).toLocaleString() : '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Payout Confirmation Dialog */}
            <Dialog open={payoutDialogOpen} onClose={handlePayoutDialogClose}>
                <DialogTitle>Confirm Payout Request</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        You are about to request a payout of <strong>${parseFloat(payoutAmount || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                    </Typography>
                    {selectedEventForPayout && (
                        <Typography gutterBottom>
                            This amount is being requested for the event: <strong>{eventsForPayout.find(evt => evt.id === selectedEventForPayout)?.name}</strong>.
                        </Typography>
                    )}
                    <Typography gutterBottom>
                        Funds will be sent to the following bank account:
                    </Typography>
                    {bankDetails && (
                        <Box sx={{ ml: 2, mb: 2 }}>
                            <Typography variant="body2"><strong>Bank Name:</strong> {bankDetails.bankName}</Typography>
                            <Typography variant="body2"><strong>Account Name:</strong> {bankDetails.accountName}</Typography>
                            <Typography variant="body2"><strong>Account Number:</strong> {bankDetails.accountNumber}</Typography>
                        </Box>
                    )}
                    <Typography color="error">
                        Please double-check these details as payouts cannot be reversed once processed.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePayoutDialogClose} color="error" disabled={payoutRequestLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmPayout}
                        color="primary"
                        variant="contained"
                        disabled={payoutRequestLoading}
                    >
                        {payoutRequestLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payout'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};