import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icon for Venues
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info'; // For contact info

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

// Sample Data for Venues
const initialVenues = [
    {
        id: 'venue_1',
        venue_name: 'City Convention Center',
        address: '123 Exhibition Rd, Metropolis',
        capacity: 5000,
        contact_info: 'info@conventioncenter.com | +1-234-567-8900',
        is_active: true,
    },
    {
        id: 'venue_2',
        venue_name: 'Grand Music Hall',
        address: '456 Harmony Lane, Musicville',
        capacity: 2000,
        contact_info: 'bookings@musichall.com | +1-987-654-3210',
        is_active: true,
    },
    {
        id: 'venue_3',
        venue_name: 'Community Art Gallery',
        address: '789 Creative Blvd, Artstown',
        capacity: 200,
        contact_info: 'gallery@artstown.org | +1-555-111-2222',
        is_active: true,
    },
    {
        id: 'venue_4',
        venue_name: 'Old Town Stadium',
        address: '101 Sports Ave, Athletica',
        capacity: 15000,
        contact_info: 'stadium@athletica.com | +1-333-444-5555',
        is_active: false, // Deactivated venue
    },
];

export const VenueManagement = () => {
    const [venues, setVenues] = useState(initialVenues);
    const [openVenueDialog, setOpenVenueDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

    const [currentVenue, setCurrentVenue] = useState(null);
    const [isNewVenue, setIsNewVenue] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers for Venue Management
    const handleOpenCreateVenue = () => {
        setCurrentVenue({ id: `venue_${Date.now()}`, venue_name: '', address: '', capacity: 0, contact_info: '', is_active: true });
        setIsNewVenue(true);
        setOpenVenueDialog(true);
    };

    const handleEditVenue = (venue) => {
        setCurrentVenue({ ...venue });
        setIsNewVenue(false);
        setOpenVenueDialog(true);
    };

    const handleSaveVenue = () => {
        if (!currentVenue.venue_name.trim() || !currentVenue.address.trim()) {
            console.error("Venue name and address cannot be empty.");
            // In a real app, show a user-friendly error message
            return;
        }

        if (isNewVenue) {
            setVenues([...venues, currentVenue]);
        } else {
            setVenues(venues.map(v => v.id === currentVenue.id ? currentVenue : v));
        }
        setOpenVenueDialog(false);
        setCurrentVenue(null);
    };

    const handleDeleteVenue = (venue) => {
        setCurrentVenue(venue);
        setOpenDeleteConfirmDialog(true);
    };

    const confirmDeleteVenue = () => {
        setVenues(venues.filter(v => v.id !== currentVenue.id));
        setOpenDeleteConfirmDialog(false);
        setCurrentVenue(null);
    };

    // Filter venues based on search term
    const filteredVenues = venues.filter(venue =>
        venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* All Venues Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <LocationOnIcon className="mr-2" color="primary" /> All Venues
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Venues by Name, Address, or Contact"
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
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ ml: 2, minWidth: '150px' }} onClick={handleOpenCreateVenue}>
                                Add New Venue
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Venue Name</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Capacity</TableCell>
                                        <TableCell>Contact Info</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredVenues.length > 0 ? (
                                        filteredVenues.map((venue) => (
                                            <TableRow key={venue.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: grey[600] }} />
                                                        {venue.venue_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{venue.address}</TableCell>
                                                <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <InfoIcon fontSize="small" sx={{ mr: 0.5, color: grey[500] }} />
                                                        {venue.contact_info}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={venue.is_active ? 'Active' : 'Inactive'}
                                                        color={venue.is_active ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="edit" onClick={() => handleEditVenue(venue)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDeleteVenue(venue)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No venues found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Dialog for Create/Edit Venue */}
                {currentVenue && (
                    <Dialog open={openVenueDialog} onClose={() => setOpenVenueDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{isNewVenue ? 'Add New Venue' : `Edit Venue: ${currentVenue.venue_name}`}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Venue Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentVenue.venue_name}
                                onChange={(e) => setCurrentVenue({ ...currentVenue, venue_name: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={currentVenue.address}
                                onChange={(e) => setCurrentVenue({ ...currentVenue, address: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Capacity"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={currentVenue.capacity}
                                onChange={(e) => setCurrentVenue({ ...currentVenue, capacity: parseInt(e.target.value) || 0 })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Contact Info (Email or Phone)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentVenue.contact_info}
                                onChange={(e) => setCurrentVenue({ ...currentVenue, contact_info: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentVenue.is_active}
                                        onChange={(e) => setCurrentVenue({ ...currentVenue, is_active: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Is Active"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenVenueDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveVenue} variant="contained" color="primary">Save Venue</Button>
                        </DialogActions>
                    </Dialog>
                )}

                {/* Delete Confirmation Dialog */}
                {currentVenue && (
                    <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
                        <DialogTitle>Confirm Delete Venue</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete the venue "{currentVenue.venue_name}"?
                                This action cannot be undone. Events associated with this venue might be affected.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
                            <Button onClick={confirmDeleteVenue} variant="contained" color="error">Delete Venue</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default VenueManagement;
