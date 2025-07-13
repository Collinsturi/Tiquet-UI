import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// --- Dummy Data Simulation ---
// In a real application, this data would be fetched from Firestore/backend
// and updates would be sent back to it.
const dummyProfileData = {
    organizationName: 'Tkti Events Ltd.',
    contactPersonName: 'Jane Doe',
    contactEmail: 'jane.doe@tkti.com',
    contactPhone: '+254 712 345 678',
    organizationDescription: 'Your trusted partner for seamless event ticketing and management. We empower organizers to create unforgettable experiences.',
    websiteUrl: 'https://www.tkti.com',
    organizationLogoUrl: 'https://placehold.co/100x100/A0D9D9/000000?text=Tkti+Logo', // Placeholder logo
    kraPin: 'A001234567Z',
    bankDetails: {
        bankName: 'National Bank of Kenya',
        accountName: 'Tkti Events Ltd.',
        accountNumber: '1234567890',
    },
};

// Simulate fetching profile data
const fetchProfileData = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyProfileData);
        }, 500); // Simulate network delay
    });
};

// Simulate updating profile data
const updateProfileData = async (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Simulating profile update:', data);
            // In a real app, this would be an API call to save data
            resolve({ success: true, message: "Profile updated successfully!" });
        }, 800);
    });
};

// Simulate changing password
const changeUserPassword = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, this would be an API call to change password
            // For demo: if currentPassword is 'password123', it's 'successful'
            if (currentPassword === 'password123') { // Dummy check
                console.log('Simulating password change: success');
                resolve({ success: true, message: "Password changed successfully!" });
            } else {
                console.log('Simulating password change: failed');
                reject({ success: false, message: "Incorrect current password." });
            }
        }, 1000);
    });
};

export const AdminProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [originalProfileData, setOriginalProfileData] = useState(null); // To revert on cancel
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    const [passwordChangeDialogOpen, setPasswordChangeDialogOpen] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);


    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const data = await fetchProfileData();
                setProfileData(data);
                setOriginalProfileData(data);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
                setProfileMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // When entering edit mode, ensure we have a clean copy to modify
            setOriginalProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails } });
        } else {
            // If toggling off editing without saving, reset to original data
            setProfileData(originalProfileData);
        }
        setProfileMessage({ type: '', text: '' }); // Clear messages
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bankDetails.')) {
            const bankDetailKey = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                bankDetails: {
                    ...prev.bankDetails,
                    [bankDetailKey]: value,
                },
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await updateProfileData(profileData);
            setProfileMessage({ type: 'success', text: response.message });
            setOriginalProfileData(profileData); // Update original data after successful save
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving profile:", err);
            setProfileMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData(originalProfileData);
        setIsEditing(false);
        setProfileMessage({ type: '', text: '' });
    };

    const handlePasswordChangeClick = () => {
        setPasswordChangeDialogOpen(true);
        setPasswordError('');
        setPasswordMessage('');
        setPasswordFields({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    const handlePasswordDialogClose = () => {
        setPasswordChangeDialogOpen(false);
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordFields(prev => ({ ...prev, [name]: value }));
        setPasswordError(''); // Clear error on input
        setPasswordMessage(''); // Clear message on input
    };

    const handleToggleShowPassword = (field) => {
        if (field === 'current') setShowCurrentPassword(prev => !prev);
        else if (field === 'new') setShowNewPassword(prev => !prev);
        else if (field === 'confirm') setShowConfirmNewPassword(prev => !prev);
    };

    const handleConfirmPasswordChange = async () => {
        setPasswordError('');
        setPasswordMessage('');
        const { currentPassword, newPassword, confirmNewPassword } = passwordFields;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('All password fields are required.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New password and confirm password do not match.');
            return;
        }
        if (newPassword.length < 6) { // Basic validation
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }

        setPasswordChangeLoading(true);
        try {
            const response = await changeUserPassword(currentPassword, newPassword);
            setPasswordMessage(response.message);
            setPasswordFields({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields on success
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password.');
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    if (loading || profileData === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            {profileMessage.text && (
                <Alert severity={profileMessage.type} sx={{ mb: 2 }}>
                    {profileMessage.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Organization Details</Typography>
                    {!isEditing ? (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={handleEditToggle}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{ mr: 1 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Organization Logo */}
                    <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar
                            alt="Organization Logo"
                            src={profileData.organizationLogoUrl}
                            sx={{ width: 120, height: 120, mb: 2 }}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/E0E0E0/000000?text=Logo"; }} // Fallback
                        />
                        <Typography variant="caption" color="text.secondary">Organization Logo</Typography>
                        {/* In a real app, an upload button would go here */}
                    </Grid>

                    {/* Basic Organization Info */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Organization Name"
                                    name="organizationName"
                                    value={profileData.organizationName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person Name"
                                    name="contactPersonName"
                                    value={profileData.contactPersonName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Email"
                                    name="contactEmail"
                                    type="email"
                                    value={profileData.contactEmail || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Phone"
                                    name="contactPhone"
                                    type="tel"
                                    value={profileData.contactPhone || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Website URL"
                                    name="websiteUrl"
                                    type="url"
                                    value={profileData.websiteUrl || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Organization Description"
                                    name="organizationDescription"
                                    value={profileData.organizationDescription || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* KRA PIN and Bank Details */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>Financial Details</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="KRA PIN"
                                    name="kraPin"
                                    value={profileData.kraPin || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    name="bankDetails.bankName"
                                    value={profileData.bankDetails?.bankName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Bank Account Name"
                                    name="bankDetails.accountName"
                                    value={profileData.bankDetails?.accountName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Bank Account Number"
                                    name="bankDetails.accountNumber"
                                    value={profileData.bankDetails?.accountNumber || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Change Password Section */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Security Settings</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<KeyIcon />}
                        onClick={handlePasswordChangeClick}
                    >
                        Change Password
                    </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Update your account password for enhanced security.
                </Typography>
            </Paper>

            {/* Change Password Dialog */}
            <Dialog open={passwordChangeDialogOpen} onClose={handlePasswordDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent dividers>
                    {passwordError && (
                        <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>
                    )}
                    {passwordMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>{passwordMessage}</Alert>
                    )}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Current Password"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordFields.currentPassword}
                        onChange={handlePasswordInputChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleToggleShowPassword('current')}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordFields.newPassword}
                        onChange={handlePasswordInputChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleToggleShowPassword('new')}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        value={passwordFields.confirmNewPassword}
                        onChange={handlePasswordInputChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleToggleShowPassword('confirm')}
                                        edge="end"
                                    >
                                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePasswordDialogClose} color="error" disabled={passwordChangeLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmPasswordChange}
                        color="primary"
                        variant="contained"
                        disabled={passwordChangeLoading}
                    >
                        {passwordChangeLoading ? <CircularProgress size={24} /> : 'Change Password'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};