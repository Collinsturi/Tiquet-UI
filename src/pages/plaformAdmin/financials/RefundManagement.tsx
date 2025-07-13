import React, { useState } from 'react';
import {
    Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, FormControl, InputLabel, Select, MenuItem,
    List, ListItem, ListItemText, Divider,
    Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import RefundIcon from '@mui/icons-material/AssignmentReturn'; // Icon for Refund Management
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

// Sample Data for Orders (some completed, some refunded)
const initialOrders = [
    {
        id: 'order_001',
        user_id: 'user_1',
        user_name: 'Alice Smith',
        event_id: 'event_1',
        event_name: 'Summer Music Festival',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        total_amount: 150.00,
        order_date: '2025-07-01',
        status: 'completed', // completed, refunded, pending
        transaction_id: 'PAYGATEXYZ123',
        organizer_share_percentage: 0.90,
        tickets: [
            { id: 'tkt_001', type: 'General Admission', quantity: 2, price: 50.00, status: 'valid' },
            { id: 'tkt_002', type: 'VIP Pass', quantity: 1, price: 50.00, status: 'valid' }
        ]
    },
    {
        id: 'order_002',
        user_id: 'user_4',
        user_name: 'Diana Prince',
        event_id: 'event_3',
        organizer_id: 'org_2',
        organizer_name: 'City Arts Collective',
        event_name: 'Local Art Exhibition',
        total_amount: 20.00,
        order_date: '2025-07-03',
        status: 'completed',
        transaction_id: 'PAYGATEABC456',
        organizer_share_percentage: 0.95,
        tickets: [
            { id: 'tkt_003', type: 'Entry Ticket', quantity: 2, price: 10.00, status: 'valid' }
        ]
    },
    {
        id: 'order_003',
        user_id: 'user_1',
        user_name: 'Alice Smith',
        event_id: 'event_2',
        organizer_id: 'org_3',
        organizer_name: 'Tech Innovations Ltd.',
        event_name: 'Annual Tech Summit',
        total_amount: 200.00,
        order_date: '2025-06-28',
        status: 'refunded', // Already refunded
        transaction_id: 'PAYGATEDEF789',
        organizer_share_percentage: 0.90,
        tickets: [
            { id: 'tkt_004', type: 'Standard Ticket', quantity: 1, price: 200.00, status: 'refunded' }
        ],
        refund_details: {
            refund_amount: 200.00,
            refund_date: '2025-07-01',
            refund_reason: 'Event cancelled by organizer'
        }
    },
    {
        id: 'order_004',
        user_id: 'user_2',
        user_name: 'Bob Johnson',
        event_id: 'event_1',
        organizer_id: 'org_1',
        organizer_name: 'EventMasters Inc.',
        event_name: 'Summer Music Festival',
        total_amount: 50.00,
        order_date: '2025-07-05',
        status: 'completed',
        transaction_id: 'PAYGATEGHI012',
        organizer_share_percentage: 0.90,
        tickets: [
            { id: 'tkt_005', type: 'General Admission', quantity: 1, price: 50.00, status: 'valid' }
        ]
    },
];

export const RefundManagement = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [openRefundDialog, setOpenRefundDialog] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [refundAmount, setRefundAmount] = useState(0);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, completed, refunded, pending
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Handlers
    const handleOpenRefund = (order) => {
        setCurrentOrder(order);
        setRefundAmount(order.total_amount); // Default to full refund
        setRefundReason('');
        setOpenRefundDialog(true);
    };

    const handleProcessRefund = () => {
        if (currentOrder && refundAmount > 0 && refundReason.trim()) {
            // Simulate API call to process refund
            console.log(`Processing refund for Order ID: ${currentOrder.id}`);
            console.log(`Amount: $${refundAmount.toFixed(2)}, Reason: ${refundReason}`);

            setOrders(orders.map(order =>
                order.id === currentOrder.id
                    ? {
                        ...order,
                        status: 'refunded',
                        tickets: order.tickets.map(ticket => ({ ...ticket, status: 'refunded' })),
                        refund_details: {
                            refund_amount: refundAmount,
                            refund_date: new Date().toISOString().slice(0, 10), // Current date
                            refund_reason: refundReason,
                        }
                    }
                    : order
            ));
            setOpenRefundDialog(false);
            setCurrentOrder(null);
            setRefundReason('');
            setRefundAmount(0);
        } else {
            // Provide user feedback if inputs are invalid
            console.error("Refund amount must be greater than 0 and reason cannot be empty.");
        }
    };

    // Filter orders based on search term, status, and date range
    const filteredOrders = orders.filter(order => {
        const matchesSearchTerm =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.organizer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' || order.status === filterStatus;

        const orderDate = new Date(order.order_date);
        const matchesStartDate = filterStartDate ? orderDate >= new Date(filterStartDate) : true;
        const matchesEndDate = filterEndDate ? orderDate <= new Date(filterEndDate) : true;

        return matchesSearchTerm && matchesStatus && matchesStartDate && matchesEndDate;
    });

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    Refund Management
                </Typography>

                {/* Orders Eligible for Refund / Refunded Orders */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <RefundIcon className="mr-2" color="primary" /> Orders Overview
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                            <TextField
                                label="Search (Order ID, User, Event, Org, Txn Ref)"
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
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    label="Status"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="completed">Completed (Refundable)</MenuItem>
                                    <MenuItem value="refunded">Refunded</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
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
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Organizer</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Order Date</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.user_name}</TableCell>
                                                <TableCell>{order.event_name}</TableCell>
                                                <TableCell>{order.organizer_name}</TableCell>
                                                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        color={
                                                            order.status === 'completed' ? 'success' :
                                                                order.status === 'refunded' ? 'error' :
                                                                    order.status === 'pending' ? 'warning' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{order.order_date}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view details" onClick={() => setCurrentOrder(order)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                    {order.status === 'completed' && (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<RefundIcon />}
                                                            onClick={() => handleOpenRefund(order)}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Refund
                                                        </Button>
                                                    )}
                                                    {order.status === 'refunded' && order.refund_details && (
                                                        <Button
                                                            variant="text"
                                                            color="info"
                                                            size="small"
                                                            onClick={() => handleOpenRefund(order)} // Re-use dialog to show refund details
                                                            sx={{ ml: 1 }}
                                                        >
                                                            View Refund
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No orders found matching your filters.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Refund Dialog */}
                {currentOrder && (
                    <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{currentOrder.status === 'refunded' ? 'Refund Details' : 'Process Refund'}: Order {currentOrder.id}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Order Information</Typography>
                            <Typography variant="body2"><strong>User:</strong> {currentOrder.user_name}</Typography>
                            <Typography variant="body2"><strong>Event:</strong> {currentOrder.event_name}</Typography>
                            <Typography variant="body2"><strong>Organizer:</strong> {currentOrder.organizer_name}</Typography>
                            <Typography variant="body2"><strong>Order Date:</strong> {currentOrder.order_date}</Typography>
                            <Typography variant="body2"><strong>Total Amount:</strong> ${currentOrder.total_amount.toFixed(2)}</Typography>
                            <Typography variant="body2"><strong>Current Status:</strong>
                                <Chip
                                    label={currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                    color={
                                        currentOrder.status === 'completed' ? 'success' :
                                            currentOrder.status === 'refunded' ? 'error' :
                                                currentOrder.status === 'pending' ? 'warning' : 'default'
                                    }
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Tickets in Order</Typography>
                            {currentOrder.tickets.length > 0 ? (
                                <List dense>
                                    {currentOrder.tickets.map((ticket, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={`${ticket.type} (x${ticket.quantity})`} secondary={`Price: $${ticket.price.toFixed(2)} each | Status: ${ticket.status}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No ticket details available for this order.</Typography>
                            )}

                            {currentOrder.status === 'completed' && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Refund Details</Typography>
                                    <TextField
                                        margin="dense"
                                        label="Refund Amount"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                                        inputProps={{ min: 0, max: currentOrder.total_amount }}
                                        helperText={`Max refund amount: $${currentOrder.total_amount.toFixed(2)}`}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Refund Reason"
                                        type="text"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        helperText="Please provide a reason for the refund."
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="body2" color="warning.main">
                                        * Processing this refund will update order/ticket status and affect organizer payout calculations.
                                    </Typography>
                                </>
                            )}

                            {currentOrder.status === 'refunded' && currentOrder.refund_details && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Processed Refund Information</Typography>
                                    <Typography variant="body2"><strong>Refunded Amount:</strong> ${currentOrder.refund_details.refund_amount.toFixed(2)}</Typography>
                                    <Typography variant="body2"><strong>Refund Date:</strong> {currentOrder.refund_details.refund_date}</Typography>
                                    <Typography variant="body2"><strong>Refund Reason:</strong> {currentOrder.refund_details.refund_reason}</Typography>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenRefundDialog(false)}>Close</Button>
                            {currentOrder.status === 'completed' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckCircleOutlineIcon />}
                                    onClick={handleProcessRefund}
                                    disabled={refundAmount <= 0 || refundAmount > currentOrder.total_amount || !refundReason.trim()}
                                >
                                    Process Refund
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default RefundManagement;
