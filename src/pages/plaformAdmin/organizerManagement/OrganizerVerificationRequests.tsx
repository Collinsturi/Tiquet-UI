import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // Icon for verification requests
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

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

// Sample Data for Organizers (reusing structure from previous organizer page)
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
        events: [], // Simplified for this page
        payouts: [], // Simplified for this page
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
        is_verified: false, // This one needs verification
        is_active: true,
        events: [],
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
        is_verified: false, // This one needs verification
        is_active: true,
        events: [],
        payouts: [],
    },
    {
        id: 'org_4',
        organization_name: 'Green Earth Events',
        contact_email: 'green@earth.com',
        phone_number: '222-333-4444',
        website_url: 'https://www.greenearth.com',
        logo_url: 'https://placehold.co/40x40/8BC34A/ffffff?text=GE',
        description: 'Focusing on eco-friendly and sustainable events.',
        kra_pin: 'D556677889V',
        bank_account_details: {
            bank_name: 'Nature Bank',
            account_number: '5566778899',
            account_name: 'Green Earth Funds',
            swift_code: 'NATBUS33',
        },
        is_verified: false, // This one needs verification
        is_active: true,
        events: [],
        payouts: [],
    },
];

export const OrganizerVerificationRequests = () => {
    // Filter initial organizers to only show unverified ones
    const [unverifiedOrganizers, setUnverifiedOrganizers] = useState(
        initialOrganizers.filter(org => !org.is_verified)
    );
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [currentReviewOrganizer, setCurrentReviewOrganizer] = useState(null);

    // Handler to open the review dialog
    const handleOpenReview = (organizer) => {
        setCurrentReviewOrganizer(organizer);
        setOpenReviewDialog(true);
    };

    // Handler for approving an organizer
    const handleApprove = () => {
        if (currentReviewOrganizer) {
            // In a real app, you'd send an API call to update is_verified status
            console.log(`Approving organizer: ${currentReviewOrganizer.organization_name}`);
            setUnverifiedOrganizers(
                unverifiedOrganizers.filter(org => org.id !== currentReviewOrganizer.id)
            );
            setOpenReviewDialog(false);
            setCurrentReviewOrganizer(null);
        }
    };

    // Handler for rejecting an organizer
    const handleReject = () => {
        if (currentReviewOrganizer) {
            // In a real app, you might mark them as rejected or remove them
            console.log(`Rejecting organizer: ${currentReviewOrganizer.organization_name}`);
            setUnverifiedOrganizers(
                unverifiedOrganizers.filter(org => org.id !== currentReviewOrganizer.id)
            );
            setOpenReviewDialog(false);
            setCurrentReviewOrganizer(null);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    Organizer Verification Requests
                </Typography>

                {/* Verification Requests List */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <HowToRegIcon className="mr-2" color="primary" /> Pending Requests
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <List>
                            {unverifiedOrganizers.length > 0 ? (
                                unverifiedOrganizers.map((organizer, index) => (
                                    <React.Fragment key={organizer.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircleOutlineIcon />}
                                                        onClick={() => {
                                                            setCurrentReviewOrganizer(organizer); // Set for direct action
                                                            handleApprove(); // Directly approve
                                                        }}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => {
                                                            setCurrentReviewOrganizer(organizer); // Set for direct action
                                                            handleReject(); // Directly reject
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Box>
                                            }
                                            className="py-3"
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" className="font-semibold text-gray-800">
                                                        {organizer.organization_name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component="span" variant="body2" className="inline text-gray-600">
                                                            Contact: {organizer.contact_email} | KRA PIN: {organizer.kra_pin}
                                                        </Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            <Chip
                                                                label="Pending Verification"
                                                                color="warning"
                                                                size="small"
                                                                icon={<HowToRegIcon fontSize="small" />}
                                                            />
                                                        </Box>
                                                    </React.Fragment>
                                                }
                                            />
                                            <IconButton aria-label="view details" onClick={() => handleOpenReview(organizer)} sx={{ ml: 2 }}>
                                                <VisibilityIcon color="action" />
                                            </IconButton>
                                        </ListItem>
                                        {index < unverifiedOrganizers.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    No pending organizer verification requests.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Box>

                {/* Review Organizer Details Dialog */}
                {currentReviewOrganizer && (
                    <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="md" fullWidth>
                        <DialogTitle>Review Organizer: {currentReviewOrganizer.organization_name}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <img src={currentReviewOrganizer.logo_url} alt={currentReviewOrganizer.organization_name} style={{ borderRadius: '50%', marginRight: '16px', width: '60px', height: '60px' }} />
                                <Box>
                                    <Typography variant="h6">{currentReviewOrganizer.organization_name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{currentReviewOrganizer.contact_email}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>
                            <Typography variant="body2"><strong>Phone:</strong> {currentReviewOrganizer.phone_number}</Typography>
                            <Typography variant="body2"><strong>Website:</strong> <a href={currentReviewOrganizer.website_url} target="_blank" rel="noopener noreferrer">{currentReviewOrganizer.website_url}</a></Typography>
                            <Typography variant="body2"><strong>KRA PIN:</strong> {currentReviewOrganizer.kra_pin}</Typography>
                            <Typography variant="body2"><strong>Description:</strong> {currentReviewOrganizer.description}</Typography>
                            <Typography variant="body2"><strong>Status:</strong> {currentReviewOrganizer.is_active ? 'Active' : 'Suspended'}</Typography>
                            <Typography variant="body2"><strong>Verified:</strong> {currentReviewOrganizer.is_verified ? 'Yes' : 'No'}</Typography>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Bank Account Details</Typography>
                            <Typography variant="body2"><strong>Bank Name:</strong> {currentReviewOrganizer.bank_account_details.bank_name}</Typography>
                            <Typography variant="body2"><strong>Account Number:</strong> {currentReviewOrganizer.bank_account_details.account_number}</Typography>
                            <Typography variant="body2"><strong>Account Name:</strong> {currentReviewOrganizer.bank_account_details.account_name}</Typography>
                            <Typography variant="body2"><strong>SWIFT Code:</strong> {currentReviewOrganizer.bank_account_details.swift_code}</Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenReviewDialog(false)}>Close</Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleOutlineIcon />}
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleReject}
                            >
                                Reject
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default OrganizerVerificationRequests;
