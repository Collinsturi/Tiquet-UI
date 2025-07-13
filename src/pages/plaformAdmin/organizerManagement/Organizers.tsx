import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

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

// Sample Data for Organizers
const initialOrganizers = [
    {
        id: 'org_1',
        organization_name: 'EventMasters Inc.',
        contact_email: 'contact@eventmasters.com',
        phone_number: '111-222-3333',
        website_url: 'https://www.eventmasters.com',
        logo_url: 'https://placehold.co/40x40/4CAF50/ffffff?text=EM',
        description: 'Leading event management company specializing in large-scale festivals.',
        kra_pin: 'A123456789Z',
        bank_account_details: {
            bank_name: 'Bank of Events',
            account_number: '1234567890',
            account_name: 'EventMasters Operating',
            swift_code: 'BOFEUS33',
        },
        is_verified: true,
        is_active: true,
        events: [
            { id: 'e_1', name: 'Summer Music Festival', date: '2025-08-10', status: 'Active' },
            { id: 'e_2', name: 'New Year\'s Eve Gala', date: '2025-12-31', status: 'Upcoming' },
        ],
        payouts: [
            { id: 'p_1', amount: '$50,000', date: '2025-06-20', status: 'Completed' },
            { id: 'p_2', amount: '$15,000', date: '2025-05-10', status: 'Completed' },
        ],
    },
    {
        id: 'org_2',
        organization_name: 'City Arts Collective',
        contact_email: 'info@cityarts.org',
        phone_number: '444-555-6666',
        website_url: 'https://www.cityarts.org',
        logo_url: 'https://placehold.co/40x40/FFC107/ffffff?text=CA',
        description: 'Promoting local artists and cultural events in the city.',
        kra_pin: 'B987654321Y',
        bank_account_details: {
            bank_name: 'Community Bank',
            account_number: '9876543210',
            account_name: 'City Arts Treasury',
            swift_code: 'COMBUS33',
        },
        is_verified: false,
        is_active: true,
        events: [
            { id: 'e_3', name: 'Local Art Exhibition', date: '2025-10-20', status: 'Upcoming' },
        ],
        payouts: [],
    },
    {
        id: 'org_3',
        organization_name: 'Tech Innovations Ltd.',
        contact_email: 'support@techinnovations.com',
        phone_number: '777-888-9999',
        website_url: 'https://www.techinnovations.com',
        logo_url: 'https://placehold.co/40x40/2196F3/ffffff?text=TI',
        description: 'Organizing conferences and workshops for the tech community.',
        kra_pin: 'C112233445X',
        bank_account_details: {
            bank_name: 'Global Finance',
            account_number: '1122334455',
            account_name: 'Tech Innovations Corp',
            swift_code: 'GLOFUS33',
        },
        is_verified: true,
        is_active: false, // Suspended/Deactivated
        events: [
            { id: 'e_4', name: 'Annual Tech Summit', date: '2025-09-01', status: 'Active' },
        ],
        payouts: [
            { id: 'p_3', amount: '$30,000', date: '2025-07-01', status: 'Pending' },
        ],
    },
];

export const Organizers = () => {
    const [organizers, setOrganizers] = useState(initialOrganizers);
    const [openEditOrganizerDialog, setOpenEditOrganizerDialog] = useState(false);
    const [openViewOrganizerDialog, setOpenViewOrganizerDialog] = useState(false);
    const [openToggleActiveConfirmDialog, setOpenToggleActiveConfirmDialog] = useState(false);
    const [openPayoutDetailsDialog, setOpenPayoutDetailsDialog] = useState(false);

    const [currentOrganizer, setCurrentOrganizer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers for Organizer Management
    const handleEditOrganizer = (organizer) => {
        setCurrentOrganizer({ ...organizer });
        setOpenEditOrganizerDialog(true);
    };

    const handleSaveOrganizer = () => {
        setOrganizers(organizers.map(o => o.id === currentOrganizer.id ? currentOrganizer : o));
        setOpenEditOrganizerDialog(false);
        setCurrentOrganizer(null);
    };

    const handleViewOrganizer = (organizer) => {
        setCurrentOrganizer(organizer);
        setOpenViewOrganizerDialog(true);
    };

    const handleToggleActiveStatus = (organizer) => {
        setCurrentOrganizer(organizer);
        setOpenToggleActiveConfirmDialog(true);
    };

    const confirmToggleActiveStatus = () => {
        setOrganizers(organizers.map(o =>
            o.id === currentOrganizer.id ? { ...o, is_active: !o.is_active } : o
        ));
        setOpenToggleActiveConfirmDialog(false);
        setCurrentOrganizer(null);
    };

    const handleManagePayouts = (organizer) => {
        setCurrentOrganizer({ ...organizer });
        setOpenPayoutDetailsDialog(true);
    };

    const handleSavePayoutDetails = () => {
        setOrganizers(organizers.map(o => o.id === currentOrganizer.id ? currentOrganizer : o));
        setOpenPayoutDetailsDialog(false);
        setCurrentOrganizer(null);
    };

    // Filter organizers based on search term
    const filteredOrganizers = organizers.filter(organizer =>
        organizer.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">

                {/* All Organizers Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <BusinessIcon className="mr-2" color="primary" /> All Organizers
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Organizers by Name or Email"
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
                                Add New Organizer
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Organization Name</TableCell>
                                        <TableCell>Contact Email</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Verified</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrganizers.length > 0 ? (
                                        filteredOrganizers.map((organizer) => (
                                            <TableRow key={organizer.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={organizer.logo_url} alt={organizer.organization_name} style={{ borderRadius: '50%', marginRight: '8px' }} />
                                                        {organizer.organization_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{organizer.contact_email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={organizer.is_active ? 'Active' : 'Suspended'}
                                                        color={organizer.is_active ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={organizer.is_verified ? 'Verified' : 'Pending'}
                                                        color={organizer.is_verified ? 'primary' : 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="view" onClick={() => handleViewOrganizer(organizer)}>
                                                        <VisibilityIcon color="action" />
                                                    </IconButton>
                                                    <IconButton aria-label="edit" onClick={() => handleEditOrganizer(organizer)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton aria-label="toggle active status" onClick={() => handleToggleActiveStatus(organizer)}>
                                                        {organizer.is_active ? <BlockIcon color="error" /> : <CheckCircleOutlineIcon color="success" />}
                                                    </IconButton>
                                                    <IconButton aria-label="manage payouts" onClick={() => handleManagePayouts(organizer)}>
                                                        <AccountBalanceIcon color="info" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No organizers found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Dialogs for Organizer Management */}
                {currentOrganizer && (
                    <>
                        {/* Edit Organizer Dialog */}
                        <Dialog open={openEditOrganizerDialog} onClose={() => setOpenEditOrganizerDialog(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Edit Organizer: {currentOrganizer.organization_name}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Organization Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.organization_name}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, organization_name: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Contact Email"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.contact_email}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, contact_email: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Phone Number"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.phone_number}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, phone_number: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Website URL"
                                    type="url"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.website_url}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, website_url: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Logo URL"
                                    type="url"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.logo_url}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, logo_url: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={currentOrganizer.description}
                                    onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, description: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={currentOrganizer.is_verified}
                                            onChange={(e) => setCurrentOrganizer({ ...currentOrganizer, is_verified: e.target.checked })}
                                            color="primary"
                                        />
                                    }
                                    label="Is Verified"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenEditOrganizerDialog(false)}>Cancel</Button>
                                <Button onClick={handleSaveOrganizer} variant="contained" color="primary">Save</Button>
                            </DialogActions>
                        </Dialog>

                        {/* View Organizer Dialog */}
                        <Dialog open={openViewOrganizerDialog} onClose={() => setOpenViewOrganizerDialog(false)} maxWidth="md" fullWidth>
                            <DialogTitle>Organizer Profile: {currentOrganizer.organization_name}</DialogTitle>
                            <DialogContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <img src={currentOrganizer.logo_url} alt={currentOrganizer.organization_name} style={{ borderRadius: '50%', marginRight: '16px', width: '60px', height: '60px' }} />
                                    <Box>
                                        <Typography variant="h6">{currentOrganizer.organization_name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{currentOrganizer.contact_email}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>
                                <Typography variant="body2"><strong>Phone:</strong> {currentOrganizer.phone_number}</Typography>
                                <Typography variant="body2"><strong>Website:</strong> <a href={currentOrganizer.website_url} target="_blank" rel="noopener noreferrer">{currentOrganizer.website_url}</a></Typography>
                                <Typography variant="body2"><strong>KRA PIN:</strong> {currentOrganizer.kra_pin}</Typography>
                                <Typography variant="body2"><strong>Description:</strong> {currentOrganizer.description}</Typography>
                                <Typography variant="body2"><strong>Status:</strong> {currentOrganizer.is_active ? 'Active' : 'Suspended'}</Typography>
                                <Typography variant="body2"><strong>Verified:</strong> {currentOrganizer.is_verified ? 'Yes' : 'No'}</Typography>

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Events ({currentOrganizer.events.length})</Typography>
                                {currentOrganizer.events.length > 0 ? (
                                    <List dense>
                                        {currentOrganizer.events.map(event => (
                                            <ListItem key={event.id}>
                                                <ListItemText primary={`Event: ${event.name}`} secondary={`Date: ${event.date} | Status: ${event.status}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No events created by this organizer.</Typography>
                                )}

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Payouts ({currentOrganizer.payouts.length})</Typography>
                                {currentOrganizer.payouts.length > 0 ? (
                                    <List dense>
                                        {currentOrganizer.payouts.map(payout => (
                                            <ListItem key={payout.id}>
                                                <ListItemText primary={`Amount: ${payout.amount}`} secondary={`Date: ${payout.date} | Status: ${payout.status}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No payout history for this organizer.</Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenViewOrganizerDialog(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Toggle Active Status Confirmation Dialog */}
                        <Dialog open={openToggleActiveConfirmDialog} onClose={() => setOpenToggleActiveConfirmDialog(false)}>
                            <DialogTitle>{currentOrganizer.is_active ? 'Suspend Organizer' : 'Activate Organizer'}</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to {currentOrganizer.is_active ? 'suspend' : 'activate'} "{currentOrganizer.organization_name}"?
                                    This will {currentOrganizer.is_active ? 'disable their ability to create/manage events.' : 'restore their ability to create/manage events.'}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenToggleActiveConfirmDialog(false)}>Cancel</Button>
                                <Button onClick={confirmToggleActiveStatus} variant="contained" color={currentOrganizer.is_active ? 'error' : 'success'}>
                                    {currentOrganizer.is_active ? 'Suspend' : 'Activate'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Manage Payout Details Dialog */}
                        <Dialog open={openPayoutDetailsDialog} onClose={() => setOpenPayoutDetailsDialog(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>Manage Payout Details for: {currentOrganizer.organization_name}</DialogTitle>
                            <DialogContent>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>KRA PIN: {currentOrganizer.kra_pin}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Bank Account Details</Typography>
                                <TextField
                                    margin="dense"
                                    label="Bank Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.bank_account_details.bank_name}
                                    onChange={(e) => setCurrentOrganizer({
                                        ...currentOrganizer,
                                        bank_account_details: { ...currentOrganizer.bank_account_details, bank_name: e.target.value }
                                    })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Account Number"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.bank_account_details.account_number}
                                    onChange={(e) => setCurrentOrganizer({
                                        ...currentOrganizer,
                                        bank_account_details: { ...currentOrganizer.bank_account_details, account_number: e.target.value }
                                    })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Account Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.bank_account_details.account_name}
                                    onChange={(e) => setCurrentOrganizer({
                                        ...currentOrganizer,
                                        bank_account_details: { ...currentOrganizer.bank_account_details, account_name: e.target.value }
                                    })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="dense"
                                    label="SWIFT Code"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={currentOrganizer.bank_account_details.swift_code}
                                    onChange={(e) => setCurrentOrganizer({
                                        ...currentOrganizer,
                                        bank_account_details: { ...currentOrganizer.bank_account_details, swift_code: e.target.value }
                                    })}
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                    * Editing bank details requires high security and verification.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenPayoutDetailsDialog(false)}>Cancel</Button>
                                <Button onClick={handleSavePayoutDetails} variant="contained" color="primary">Save Payout Details</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default Organizers;
