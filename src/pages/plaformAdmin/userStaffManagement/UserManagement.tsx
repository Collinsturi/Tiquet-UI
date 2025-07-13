import React, { useState } from 'react';
import {
    Card, CardContent, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem,
    Switch, FormControlLabel, Chip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
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
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
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
    },
});

// Sample Data for Users
const initialUsers = [
    {
        id: 'user_1',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice.s@example.com',
        phone_number: '123-456-7890',
        profile_picture_url: 'https://placehold.co/40x40/aabbcc/ffffff?text=AS',
        is_active: true,
        role: 'user',
        communication_preferences: { // Kept for viewing in user profile, but not editable directly on this page
            newsletter: true,
            event_updates: true,
            promotions: false,
        },
        orders: [{ id: 'order_001', total: '$50', date: '2025-06-15' }],
        tickets: [{ id: 'ticket_001', event: 'Music Fest', date: '2025-08-01' }],
        reviews: [{ id: 'review_001', rating: 5, comment: 'Great event!' }],
    },
    {
        id: 'user_2',
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.j@example.com',
        phone_number: '098-765-4321',
        profile_picture_url: 'https://placehold.co/40x40/ccbbaa/ffffff?text=BJ',
        is_active: true,
        role: 'checking_staff',
        communication_preferences: {
            newsletter: false,
            event_updates: true,
            promotions: false,
        },
        orders: [],
        tickets: [],
        reviews: [],
    },
    {
        id: 'user_3',
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie.b@example.com',
        phone_number: '555-123-4567',
        profile_picture_url: 'https://placehold.co/40x40/aaccbb/ffffff?text=CB',
        is_active: false,
        role: 'admin',
        communication_preferences: {
            newsletter: true,
            event_updates: true,
            promotions: true,
        },
        orders: [],
        tickets: [],
        reviews: [],
    },
    {
        id: 'user_4',
        first_name: 'Diana',
        last_name: 'Prince',
        email: 'diana.p@example.com',
        phone_number: '111-222-3333',
        profile_picture_url: 'https://placehold.co/40x40/bbccaa/ffffff?text=DP',
        is_active: true,
        role: 'user',
        communication_preferences: {
            newsletter: true,
            event_updates: false,
            promotions: true,
        },
        orders: [{ id: 'order_002', total: '$120', date: '2025-07-01' }],
        tickets: [{ id: 'ticket_002', event: 'Art Exhibition', date: '2025-09-10' }],
        reviews: [],
    },
];

export const UserManagement = () => {
    const [users, setUsers] = useState(initialUsers);
    const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
    const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers for User Management
    const handleEditUser = (user) => {
        setCurrentUser({ ...user });
        setOpenEditUserDialog(true);
    };

    const handleSaveUser = () => {
        setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
        setOpenEditUserDialog(false);
        setCurrentUser(null);
    };

    const handleDeleteUser = (user) => {
        setCurrentUser(user);
        setOpenDeleteConfirmDialog(true);
    };

    const confirmDeleteUser = () => {
        setUsers(users.filter(u => u.id !== currentUser.id));
        setOpenDeleteConfirmDialog(false);
        setCurrentUser(null);
    };

    const handleViewUser = (user) => {
        setCurrentUser(user);
        setOpenViewUserDialog(true);
    };

    const handleResetPassword = (user) => {
        setCurrentUser(user);
        setOpenResetPasswordDialog(true);
    };

    const confirmResetPassword = () => {
        // In a real application, this would trigger an API call to reset the password
        console.log(`Password reset requested for ${currentUser.email}`);
        setOpenResetPasswordDialog(false);
        setCurrentUser(null);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* All Users Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <PersonAddIcon className="mr-2" color="primary" /> All Users
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Users"
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
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ ml: 2, minWidth: '150px' }}>
                                Add New User
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={user.profile_picture_url} alt={user.first_name} style={{ borderRadius: '50%', marginRight: '8px' }} />
                                                        {user.first_name} {user.last_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.role}
                                                        color={
                                                            user.role === 'admin' ? 'primary' :
                                                                user.role === 'checking_staff' ? 'secondary' : 'default'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.is_active ? 'Active' : 'Inactive'}
                                                        color={user.is_active ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view" onClick={() => handleViewUser(user)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                    <IconButton aria-label="edit" onClick={() => handleEditUser(user)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton aria-label="reset password" onClick={() => handleResetPassword(user)}>
                                                        <VpnKeyIcon color="warning" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDeleteUser(user)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No users found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Dialogs for User Management */}
                {currentUser && (
                    <>
                        {/* Edit User Dialog */}
                        <Dialog open={openEditUserDialog} onClose={() => setOpenEditUserDialog(false)}>
                            <DialogTitle>Edit User: {currentUser.first_name} {currentUser.last_name}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentUser.first_name}
                                    onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentUser.last_name}
                                    onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Phone Number"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentUser.phone_number}
                                    onChange={(e) => setCurrentUser({ ...currentUser, phone_number: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        value={currentUser.role}
                                        label="Role"
                                        onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="checking_staff">Checking Staff</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentUser.is_active}
                                            onChange={(e) => setCurrentUser({ ...currentUser, is_active: e.target.checked })}
                                            color="primary"
                                        />
                                    }
                                    label="Account Active"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenEditUserDialog(false)}>Cancel</Button>
                                <Button onClick={handleSaveUser} variant="contained" color="primary">Save</Button>
                            </DialogActions>
                        </Dialog>

                        {/* View User Dialog */}
                        <Dialog open={openViewUserDialog} onClose={() => setOpenViewUserDialog(false)} maxWidth="md" fullWidth>
                            <DialogTitle>User Profile: {currentUser.first_name} {currentUser.last_name}</DialogTitle>
                            <DialogContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <img src={currentUser.profile_picture_url} alt={currentUser.first_name} style={{ borderRadius: '50%', marginRight: '16px', width: '60px', height: '60px' }} />
                                    <Box>
                                        <Typography variant="h6">{currentUser.first_name} {currentUser.last_name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>
                                <Typography variant="body2"><strong>Phone:</strong> {currentUser.phone_number}</Typography>
                                <Typography variant="body2"><strong>Role:</strong> {currentUser.role}</Typography>
                                <Typography variant="body2"><strong>Status:</strong> {currentUser.is_active ? 'Active' : 'Inactive'}</Typography>

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Communication Preferences</Typography>
                                <Typography variant="body2"><strong>Newsletter:</strong> {currentUser.communication_preferences.newsletter ? 'Subscribed' : 'Unsubscribed'}</Typography>
                                <Typography variant="body2"><strong>Event Updates:</strong> {currentUser.communication_preferences.event_updates ? 'Subscribed' : 'Unsubscribed'}</Typography>
                                <Typography variant="body2"><strong>Promotions:</strong> {currentUser.communication_preferences.promotions ? 'Subscribed' : 'Unsubscribed'}</Typography>

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Orders ({currentUser.orders.length})</Typography>
                                {currentUser.orders.length > 0 ? (
                                    <List dense>
                                        {currentUser.orders.map(order => (
                                            <ListItem key={order.id}>
                                                <ListItemText primary={`Order ID: ${order.id} - Total: ${order.total}`} secondary={`Date: ${order.date}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No orders found.</Typography>
                                )}

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Tickets ({currentUser.tickets.length})</Typography>
                                {currentUser.tickets.length > 0 ? (
                                    <List dense>
                                        {currentUser.tickets.map(ticket => (
                                            <ListItem key={ticket.id}>
                                                <ListItemText primary={`Ticket ID: ${ticket.id} - Event: ${ticket.event}`} secondary={`Date: ${ticket.date}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No tickets found.</Typography>
                                )}

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Reviews ({currentUser.reviews.length})</Typography>
                                {currentUser.reviews.length > 0 ? (
                                    <List dense>
                                        {currentUser.reviews.map(review => (
                                            <ListItem key={review.id}>
                                                <ListItemText primary={`Rating: ${review.rating}/5`} secondary={`Comment: "${review.comment}"`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No reviews found.</Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenViewUserDialog(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
                            <DialogTitle>Confirm Delete User</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to delete user "{currentUser.first_name} {currentUser.last_name}"?
                                    This action cannot be undone and will delete associated communication preferences.
                                    Orders, tickets, and reviews will be restricted from deletion.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
                                <Button onClick={confirmDeleteUser} variant="contained" color="error">Delete</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Reset Password Dialog */}
                        <Dialog open={openResetPasswordDialog} onClose={() => setOpenResetPasswordDialog(false)}>
                            <DialogTitle>Reset Password for {currentUser.email}</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to send a password reset link to {currentUser.email}?
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenResetPasswordDialog(false)}>Cancel</Button>
                                <Button onClick={confirmResetPassword} variant="contained" color="warning">Send Reset Link</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default UserManagement;
