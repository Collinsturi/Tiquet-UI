import React, { useState } from 'react';
import {
    Typography, Box, Paper, TextField, Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    List, ListItem, ListItemText, Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon for Profile
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // For password change
import SaveIcon from '@mui/icons-material/Save';

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
    },
});

// Sample Admin Profile Data
const initialAdminProfile = {
    id: 'admin_john_doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@admin.com',
    phone_number: '+254712345678',
    profile_picture_url: 'https://placehold.co/80x80/007BFF/ffffff?text=JD',
    role: 'Super Admin',
    last_login: '2025-07-05 14:45:00',
};

export const PlatformAdminProfile = () => {
    const [profile, setProfile] = useState(initialAdminProfile);
    const [editMode, setEditMode] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Handlers for Profile Editing
    const handleSaveProfile = () => {
        // In a real application, send updated profile data to the backend
        console.log('Saving profile:', profile);
        setEditMode(false);
        // Add success feedback here
    };

    const handleCancelEdit = () => {
        // Revert to initial profile data (or last saved)
        setProfile(initialAdminProfile);
        setEditMode(false);
    };

    // Handlers for Password Change
    const handleOpenPasswordDialog = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordError('');
        setOpenPasswordDialog(true);
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) { // Basic validation
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        if (currentPassword === newPassword) {
            setPasswordError('New password cannot be the same as the current password.');
            return;
        }

        // In a real application, send currentPassword and newPassword to backend for verification and update
        console.log('Changing password for:', profile.email);
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);

        // Simulate success
        setOpenPasswordDialog(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordError('');
        alert('Password changed successfully!'); // Use a custom message box in a real app
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    Admin Profile
                </Typography>

                <Paper className="p-6 bg-white rounded-xl shadow-lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" className="text-gray-700 flex items-center">
                            <AccountCircleIcon className="mr-2" color="primary" /> My Profile
                        </Typography>
                        {!editMode ? (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditMode(true)}
                                    sx={{ mr: 2 }}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    startIcon={<VpnKeyIcon />}
                                    onClick={handleOpenPasswordDialog}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancelEdit}
                                    sx={{ mr: 2 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveProfile}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <img src={profile.profile_picture_url} alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover', marginRight: '24px' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{profile.first_name} {profile.last_name}</Typography>
                            <Typography variant="body1" color="text.secondary">{profile.role}</Typography>
                        </Box>
                    </Box>

                    <List>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Email</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            sx={{ mt: 1 }}
                                            type="email"
                                        />
                                    ) : (
                                        <Typography variant="body1">{profile.email}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Phone Number</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={profile.phone_number}
                                            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                            sx={{ mt: 1 }}
                                            type="tel"
                                        />
                                    ) : (
                                        <Typography variant="body1">{profile.phone_number}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Profile Picture URL</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={profile.profile_picture_url}
                                            onChange={(e) => setProfile({ ...profile, profile_picture_url: e.target.value })}
                                            sx={{ mt: 1 }}
                                            type="url"
                                            helperText="Enter a valid image URL for your profile picture."
                                        />
                                    ) : (
                                        <Typography variant="body1">{profile.profile_picture_url}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Last Login</Typography>}
                                secondary={<Typography variant="body1">{profile.last_login}</Typography>}
                            />
                        </ListItem>
                    </List>
                </Paper>

                {/* Change Password Dialog */}
                <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        {passwordError && (
                            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                                {passwordError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleChangePassword}
                            variant="contained"
                            color="primary"
                            disabled={!currentPassword || !newPassword || !confirmNewPassword}
                        >
                            Change Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default PlatformAdminProfile;
