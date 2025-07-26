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
    Card,
    CardContent,
    FormHelperText,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NorthEastIcon from '@mui/icons-material/NorthEast'; // For withdrawn
import SouthWestIcon from '@mui/icons-material/SouthWest'; // For available
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useTheme, alpha } from '@mui/material/styles'; // Import alpha for card backgrounds

// --- RTK Query Imports ---
import {
    useGetOrganizerEarningsSummaryQuery,
    useGetRevenuePerEventQuery,
    // Assuming you will add a mutation for payout requests:
    // useRequestPayoutMutation,
    // Assuming you have a query for organizer profile/bank details:
    // useGetOrganizerProfileQuery,
} from '../../queries/admin/adminQuery.ts'; // Adjust path as necessary

// Redux imports for user email and ID
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store'; // Adjust path as necessary

// Dummy Profile Data for bank details (This would ideally come from an RTK Query for organizer profile)
const dummyProfileData = {
    bankDetails: {
        bankName: 'National Bank of Kenya',
        accountName: 'Tkti Events Ltd.',
        accountNumber: '1234567890',
    },
};

// --- Mock Payout Request (Replace with RTK Query Mutation later) ---
// For demonstration, this will simulate the actual request.
// In a real app, you'd define this as a builder.mutation in adminQuery.ts
const mockRequestPayout = async (requestData: { amount: number; bankDetails: any; requestedForEventId: string | null; }) => {
    return new new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Mock Payout request submitted:", requestData);
            // Simulate success
            resolve({ success: true, message: "Payout request submitted successfully!", requestId: `payout-${Date.now()}` });
        }, 1500);
    });
};


export const AdminPayouts = () => {
    const theme = useTheme();

    // Get current organizer ID and Email from Redux store
    const user = useSelector((state: RootState) => state.user.user);
    const organizerId = user?.user_id; // Assuming user.id is available and is a number
    const organizerEmail = user.email; // Assuming user.email is available and is a string

    // --- RTK Query Hooks ---
    const {
        data: organizerEarningsSummary,
        isLoading: isLoadingEarningsSummary,
        isError: isErrorEarningsSummary,
        error: errorEarningsSummary,
        refetch: refetchEarningsSummary
    } = useGetOrganizerEarningsSummaryQuery(organizerId, { skip: !organizerId }); // Skip if organizerId is not available

    const {
        data: revenuePerEvent,
        isLoading: isLoadingRevenuePerEvent,
        isError: isErrorRevenuePerEvent,
        error: errorRevenuePerEvent,
        refetch: refetchRevenuePerEvent
    } = useGetRevenuePerEventQuery(organizerEmail, { skip: !organizerEmail }); // Skip if organizerEmail is not available

    // Placeholder for bank details. In a real app, this would likely come from:
    // const { data: organizerProfileData, isLoading: isLoadingProfile } = useGetOrganizerProfileQuery(organizerId);
    // const bankDetails = organizerProfileData?.bankDetails || null;
    const [bankDetails, setBankDetails] = useState(dummyProfileData.bankDetails); // Using dummy for now

    // --- State for Payout Request Form ---
    const [payoutAmount, setPayoutAmount] = useState('');
    const [selectedEventForPayout, setSelectedEventForPayout] = useState(''); // Event ID for specific payout request
    const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
    const [payoutRequestLoading, setPayoutRequestLoading] = useState(false); // For the payout dialog submission
    const [message, setMessage] = useState({ type: '', text: '' }); // General alert messages

    // Convert revenuePerEvent data for display in the table
    // Assuming 'isFinalized' status might come from event details or be derived.
    // For this example, I'll add a mock `isFinalized` based on a simple rule.
    const eventsForPayoutDisplay = revenuePerEvent?.map(event => ({
        id: event.eventName, // Using eventName as ID for simplicity if backend doesn't provide unique ID here
        name: event.eventName,
        netRevenue: event.revenue,
        // Mocking `isFinalized` status. In a real app, this would come from backend.
        isFinalized: event.revenue > 0, // Simple rule: if there's revenue, assume it's finalized for payout purposes
    })) || [];


    // --- Payout Request Handlers ---
    const handlePayoutAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and a single decimal point
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setPayoutAmount(value);
        }
    };

    const handleEventForPayoutChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const eventId = e.target.value as string;
        setSelectedEventForPayout(eventId);
        if (eventId) {
            const event = eventsForPayoutDisplay.find(evt => evt.id === eventId);
            if (event) {
                setPayoutAmount(event.netRevenue.toFixed(2)); // Pre-fill with event's net revenue
            }
        } else {
            setPayoutAmount(''); // Clear if "None" selected
        }
    };

    const handleRequestPayoutClick = () => {
        setMessage({ type: '', text: '' }); // Clear any previous messages
        // In a real app, you'd fetch/verify bank details from organizer profile query
        if (!bankDetails || !bankDetails.accountNumber) {
            setMessage({ type: 'error', text: 'Please update your bank account details in your profile before requesting a payout.' });
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
        if (organizerEarningsSummary && amount > organizerEarningsSummary.availableBalance) {
            setMessage({ type: 'error', text: `Requested amount ($${amount.toFixed(2)}) exceeds available balance ($${organizerEarningsSummary.availableBalance.toFixed(2)}).` });
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
            // Replace mockRequestPayout with your actual RTK Query mutation here
            // const [requestPayoutTrigger, { isLoading: isRequestingPayout }] = useRequestPayoutMutation();
            // await requestPayoutTrigger(requestPayload).unwrap();
            await mockRequestPayout(requestPayload); // Using mock for now

            setMessage({ type: 'success', text: "Payout request submitted successfully!" });
            setPayoutDialogOpen(false);

            // Refetch data to update the UI with new balances and history
            refetchEarningsSummary();
            refetchRevenuePerEvent(); // If payout affects individual event revenues immediately

            setPayoutAmount(''); // Clear after successful request
            setSelectedEventForPayout('');
        } catch (err: any) { // Type 'any' for error for now
            console.error("Payout request failed:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to submit payout request.' });
        } finally {
            setPayoutRequestLoading(false);
        }
    };


    // Combined loading state for initial render
    const overallLoading = isLoadingEarningsSummary || isLoadingRevenuePerEvent;
    // Combined error state
    const overallError = isErrorEarningsSummary || isErrorRevenuePerEvent;
    const overallErrorMessage = (errorEarningsSummary as any)?.message || (errorRevenuePerEvent as any)?.message || 'Failed to load payout information.';


    if (overallLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: 'var(--color-my-base-200)' }}>
                <CircularProgress sx={{ color: 'var(--color-my-primary)' }} />
                <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading payout information...</Typography>
            </Box>
        );
    }

    if (overallError) {
        return (
            <Box sx={{ p: 3, backgroundColor: 'var(--color-my-base-200)' }}>
                <Alert severity="error" sx={{ backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>
                    Error: {overallErrorMessage}
                </Alert>
            </Box>
        );
    }

    // Ensure data exists before trying to render
    if (!organizerEarningsSummary) {
        return (
            <Box sx={{ p: 3, backgroundColor: 'var(--color-my-base-200)' }}>
                <Alert severity="info" sx={{ backgroundColor: 'var(--color-my-info)', color: 'var(--color-my-info-content)' }}>
                    No organizer earnings summary available.
                </Alert>
            </Box>
        );
    }


    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)', minHeight: '100vh', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>
                <AccountBalanceWalletIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> My Payouts
            </Typography>

            {message.text && (
                <Alert severity={message.type as "success" | "info" | "warning" | "error"} sx={{ mb: 2,
                    backgroundColor: `var(--color-my-${message.type})`,
                    color: `var(--color-my-${message.type}-content)`
                }}>
                    {message.text}
                </Alert>
            )}

            {/* Overall Financial Summary */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Overall Financial Summary</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                            <MonetizationOnIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Total Earnings</Typography>
                                <Typography variant="h4" color="success">${organizerEarningsSummary.totalEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: alpha(theme.palette.warning.main, 0.1) }}>
                            <NorthEastIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Total Withdrawn</Typography>
                                <Typography variant="h4" color="warning">${organizerEarningsSummary.totalWithdrawn?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                            <SouthWestIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h6" color="text.secondary">Current Available Balance</Typography>
                                <Typography variant="h4" color="primary">${organizerEarningsSummary.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Request Payout Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Request Payout</Typography>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="select-event-payout-label" sx={{ color: 'var(--color-my-base-content)' }}>Select Event (Optional)</InputLabel>
                            <Select
                                labelId="select-event-payout-label"
                                id="select-event-payout"
                                value={selectedEventForPayout}
                                label="Select Event (Optional)"
                                onChange={handleEventForPayoutChange}
                                sx={{
                                    color: 'var(--color-my-base-content)',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-base-300)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: 'var(--color-my-base-content)',
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'var(--color-my-base-100)',
                                            color: 'var(--color-my-base-content)',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="" sx={{ color: 'var(--color-my-base-content)' }}>
                                    <em>None (Overall Balance)</em>
                                </MenuItem>
                                {eventsForPayoutDisplay.filter(e => e.isFinalized).map((event) => (
                                    <MenuItem key={event.id} value={event.id} sx={{ color: 'var(--color-my-base-content)' }}>
                                        {event.name} (${event.netRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText sx={{ color: 'var(--color-my-base-content)' }}>Select an event to pre-fill its net revenue for payout.</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Payout Amount"
                            variant="outlined"
                            value={payoutAmount}
                            onChange={handlePayoutAmountChange}
                            type="text" // Use text to allow partial input like "123."
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ color: 'var(--color-my-base-content)' }}>$</InputAdornment>,
                                sx: {
                                    color: 'var(--color-my-base-content)',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-base-300)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-my-primary)',
                                    },
                                }
                            }}
                            InputLabelProps={{
                                sx: { color: 'var(--color-my-base-content)' }
                            }}
                            helperText={`Available: $${organizerEarningsSummary.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            FormHelperTextProps={{
                                sx: { color: 'var(--color-my-base-content)' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleRequestPayoutClick}
                            disabled={payoutRequestLoading || !organizerEarningsSummary || organizerEarningsSummary.availableBalance <= 0}
                            startIcon={<AttachMoneyIcon />}
                            sx={{
                                backgroundColor: 'var(--color-my-primary)',
                                color: 'var(--color-my-primary-content)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-my-primary-focus)',
                                }
                            }}
                        >
                            Request Payout
                        </Button>
                    </Grid>
                </Grid>
                {!bankDetails?.accountNumber && (
                    <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'var(--color-my-warning)', color: 'var(--color-my-warning-content)' }}>
                        Your bank details are not fully set up. Please update them in your profile to enable payouts.
                    </Alert>
                )}
            </Paper>

            {/* Event Contributions */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Event Revenue Contributions</Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--color-my-base-200)' }}>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Event Name</TableCell>
                                <TableCell align="right" sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Net Revenue Contribution</TableCell>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Payout Ready</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventsForPayoutDisplay.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ color: 'var(--color-my-base-content)' }}>No events found or revenue pending.</TableCell>
                                </TableRow>
                            ) : (
                                eventsForPayoutDisplay.map((event) => (
                                    <TableRow key={event.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>{event.name}</TableCell>
                                        <TableCell align="right" sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>${event.netRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell sx={{ borderColor: 'var(--color-my-base-300)' }}>
                                            <Alert
                                                severity={event.isFinalized ? 'success' : 'info'}
                                                iconMapping={{
                                                    success: <CheckCircleIcon fontSize="inherit" />,
                                                    info: <HourglassEmptyIcon fontSize="inherit" />,
                                                }}
                                                sx={{
                                                    p: 0.5, py: 0, '& .MuiAlert-message': { mt: 0, mb: 0 }, minWidth: '80px',
                                                    backgroundColor: `var(--color-my-${event.isFinalized ? 'success' : 'info'})`,
                                                    color: `var(--color-my-${event.isFinalized ? 'success' : 'info'}-content)`
                                                }}
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

            {/* Payout History - Placeholder for now as you didn't provide its RTK Query */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-my-base-content)' }}>Payout History</Typography>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--color-my-base-200)' }}>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Request ID</TableCell>
                                <TableCell align="right" sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Status</TableCell>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Request Date</TableCell>
                                <TableCell sx={{ color: 'var(--color-my-base-content)', borderColor: 'var(--color-my-base-300)' }}>Completion Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* This data would come from an RTK Query for payout history, e.g., useGetPayoutHistoryQuery(organizerId) */}
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: 'var(--color-my-base-content)' }}>Payout history data would be loaded here via RTK Query.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>


            {/* Payout Confirmation Dialog */}
            <Dialog
                open={payoutDialogOpen}
                onClose={handlePayoutDialogClose}
                aria-labelledby="payout-dialog-title"
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--color-my-base-100)',
                        color: 'var(--color-my-base-content)',
                    }
                }}
            >
                <DialogTitle id="payout-dialog-title" sx={{ color: 'var(--color-my-primary)' }}>Confirm Payout Request</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2, color: 'var(--color-my-base-content)' }}>
                        You are requesting a payout of <Typography component="span" variant="h6" sx={{ color: 'var(--color-my-primary)' }}>${parseFloat(payoutAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>
                        This amount will be transferred to your registered bank account:
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, border: '1px dashed var(--color-my-base-300)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>Bank Name: <strong sx={{ color: 'var(--color-my-base-content)' }}>{bankDetails?.bankName || 'N/A'}</strong></Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>Account Name: <strong sx={{ color: 'var(--color-my-base-content)' }}>{bankDetails?.accountName || 'N/A'}</strong></Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-my-base-content)' }}>Account Number: <strong sx={{ color: 'var(--color-my-base-content)' }}>{bankDetails?.accountNumber || 'N/A'}</strong></Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2, color: 'var(--color-my-error)' }}>
                        Please ensure all details are correct. This action cannot be undone.
                    </Typography>
                    {payoutRequestLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress size={20} sx={{ color: 'var(--color-my-primary)' }} />
                            <Typography sx={{ ml: 1, color: 'var(--color-my-base-content)' }}>Processing request...</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'var(--color-my-base-100)' }}>
                    <Button onClick={handlePayoutDialogClose} disabled={payoutRequestLoading} sx={{ color: 'var(--color-my-base-content)' }}>Cancel</Button>
                    <Button
                        onClick={handleConfirmPayout}
                        variant="contained"
                        disabled={payoutRequestLoading}
                        sx={{
                            backgroundColor: 'var(--color-my-primary)',
                            color: 'var(--color-my-primary-content)',
                            '&:hover': {
                                backgroundColor: 'var(--color-my-primary-focus)',
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
