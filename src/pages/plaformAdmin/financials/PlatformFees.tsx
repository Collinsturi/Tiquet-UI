import React, { useState } from 'react';
import {
    Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, FormControl, InputLabel, Select, MenuItem,
    List,
    ListItem,
    ListItemText,
    Button,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Icon for Transactions
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Icon for Orders/Transactions
import Divider from '@mui/material/Divider';

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

// Sample Data for Orders/Transactions
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
        transaction_id: 'PAYGATEXYZ123', // Payment gateway transaction ID
        organizer_share_percentage: 0.90, // 90% goes to organizer
        tickets: [
            { type: 'General Admission', quantity: 2, price: 50.00 },
            { type: 'VIP Pass', quantity: 1, price: 50.00 } // Adjusted VIP price for example
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
        organizer_share_percentage: 0.95, // 95% goes to organizer
        tickets: [
            { type: 'Entry Ticket', quantity: 2, price: 10.00 }
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
        status: 'refunded',
        transaction_id: 'PAYGATEDEF789',
        organizer_share_percentage: 0.90,
        tickets: [
            { type: 'Standard Ticket', quantity: 1, price: 200.00 }
        ]
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
        status: 'pending', // Simulating a pending payment
        transaction_id: 'PAYGATEGHI012',
        organizer_share_percentage: 0.90,
        tickets: [
            { type: 'General Admission', quantity: 1, price: 50.00 }
        ]
    },
];

export const PlatformFees = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Handlers
    const handleOpenDetails = (order) => {
        setCurrentOrder(order);
        setOpenOrderDetailsDialog(true);
    };

    // Calculate commissions
    const calculateCommission = (order) => {
        const organizerShare = order.total_amount * order.organizer_share_percentage;
        const platformCommission = order.total_amount - organizerShare;
        return { organizerShare, platformCommission };
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

    // Calculate overall totals for display
    const totalRevenue = filteredOrders.reduce((sum, order) => order.status === 'completed' ? sum + order.total_amount : sum, 0);
    const totalCommission = filteredOrders.reduce((sum, order) => {
        if (order.status === 'completed') {
            const { platformCommission } = calculateCommission(order);
            return sum + platformCommission;
        }
        return sum;
    }, 0);

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* Overview Cards for Totals */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Overview
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg flex justify-around items-center">
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Total Revenue (Filtered)</Typography>
                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Total Platform Commission (Filtered)</Typography>
                            <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>${totalCommission.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Box>

                {/* All Transactions List */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <ReceiptLongIcon className="mr-2" color="primary" /> All Transactions
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
                                    <MenuItem value="completed">Completed</MenuItem>
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
                                        <TableCell>Total Amount</TableCell>
                                        <TableCell>Commission</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Order Date</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => {
                                            const { platformCommission } = calculateCommission(order);
                                            return (
                                                <TableRow key={order.id}>
                                                    <TableCell>{order.id}</TableCell>
                                                    <TableCell>{order.user_name}</TableCell>
                                                    <TableCell>{order.event_name}</TableCell>
                                                    <TableCell>{order.organizer_name}</TableCell>
                                                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                                    <TableCell>${platformCommission.toFixed(2)}</TableCell>
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
                                                        <IconButton aria-label="view details" onClick={() => handleOpenDetails(order)}>
                                                            <VisibilityIcon color="action" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No transactions found matching your filters.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Order Details Dialog */}
                {currentOrder && (
                    <Dialog open={openOrderDetailsDialog} onClose={() => setOpenOrderDetailsDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Order Details: {currentOrder.id}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Order Information</Typography>
                            <Typography variant="body2"><strong>User:</strong> {currentOrder.user_name}</Typography>
                            <Typography variant="body2"><strong>Event:</strong> {currentOrder.event_name}</Typography>
                            <Typography variant="body2"><strong>Organizer:</strong> {currentOrder.organizer_name}</Typography>
                            <Typography variant="body2"><strong>Order Date:</strong> {currentOrder.order_date}</Typography>
                            <Typography variant="body2"><strong>Status:</strong>
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
                            <Typography variant="body2"><strong>Total Amount:</strong> ${currentOrder.total_amount.toFixed(2)}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Commission Breakdown</Typography>
                            <Typography variant="body2"><strong>Organizer Share (%):</strong> {(currentOrder.organizer_share_percentage * 100).toFixed(0)}%</Typography>
                            <Typography variant="body2"><strong>Organizer Share:</strong> ${calculateCommission(currentOrder).organizerShare.toFixed(2)}</Typography>
                            <Typography variant="body2"><strong>Platform Commission:</strong> ${calculateCommission(currentOrder).platformCommission.toFixed(2)}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Payment Gateway Reconciliation</Typography>
                            <Typography variant="body2"><strong>Transaction ID:</strong> {currentOrder.transaction_id || 'N/A'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentOrder.transaction_id ? "This ID can be used to reconcile with your payment gateway logs." : "No transaction ID recorded."}
                            </Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Tickets in Order</Typography>
                            {currentOrder.tickets.length > 0 ? (
                                <List dense>
                                    {currentOrder.tickets.map((ticket, index) => (
                                        <ListItem key={index}>
                                            <sListItemText primary={`${ticket.type} (x${ticket.quantity})`} secondary={`Price: $${ticket.price.toFixed(2)} each`} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No ticket details available for this order.</Typography>
                            )}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenOrderDetailsDialog(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default PlatformFees;
