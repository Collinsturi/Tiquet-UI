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
    Alert,
    CircularProgress,
    useTheme // Import useTheme hook for spacing, etc.
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Import RTK Query hook and type
import { useGetUserDetailsQuery, type ApplicationUser } from '../../queries/general/AuthQuery.ts';
import { useSelector } from 'react-redux';
import type {RootState} from '../../redux/store.ts'; // Assuming your RootState is defined here


export const AdminProfile = () => {
    const theme = useTheme(); // Access the theme object for spacing, etc.

    // Get user from Redux store to access the ID for the query
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id; // Get the user ID from your Redux state

    // Use the RTK Query hook to fetch user details
    const {
        data: profileData,
        isLoading,
        isFetching, // isFetching can be used to indicate background refetches
        isError,
        error,
        refetch // Allows manual refetching
    } = useGetUserDetailsQuery(userId!, {
        skip: !userId, // Skip the query if userId is not available
    });

    // We'll manage a local state for editing, initialized from query data
    const [editableProfileData, setEditableProfileData] = useState<ApplicationUser | null>(null);
    const [originalProfileData, setOriginalProfileData] = useState<ApplicationUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

    // Use a mutation hook if you have one for updating user details
    // For now, we'll simulate the update since it wasn't provided in AuthQuery.ts
    // If you add an update mutation, you would use it like this:
    // const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    // Effect to initialize editable data when profileData is loaded
    useEffect(() => {
        if (profileData) {
            setEditableProfileData({ ...profileData });
            setOriginalProfileData({ ...profileData });
        }
    }, [profileData]);

    // Effect to handle errors from the query
    useEffect(() => {
        if (isError) {
            console.error("Failed to fetch profile data:", error);
            setProfileMessage({ type: 'error', text: (error as any)?.data?.message || 'Failed to load profile data.' });
        }
    }, [isError, error]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing && editableProfileData) {
            // When entering edit mode, save a copy of current data as original
            setOriginalProfileData({ ...editableProfileData });
        } else if (originalProfileData) {
            // If exiting edit mode without saving, revert to original data
            setEditableProfileData({ ...originalProfileData });
        }
        setProfileMessage({ type: '', text: '' }); // Clear messages
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableProfileData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = async () => {
        if (!editableProfileData) return;

        // In a real application, you would call your RTK Query mutation here
        // Example if you had an `updateUserDetails` mutation:
        // try {
        //     const response = await updateUserProfile(editableProfileData).unwrap();
        //     setProfileMessage({ type: 'success', text: response.message || "Profile updated successfully!" });
        //     setOriginalProfileData(editableProfileData); // Update original after successful save
        //     setIsEditing(false);
        //     refetch(); // Refetch to ensure local state is in sync with server
        // } catch (err) {
        //     console.error("Error saving profile:", err);
        //     setProfileMessage({ type: 'error', text: (err as any)?.data?.message || 'Failed to save profile changes.' });
        // }

        // --- Simulating save for demonstration since mutation is not yet defined ---
        setProfileMessage({ type: '', text: '' }); // Clear message before simulating
        // Simulate loading state
        // setIsUpdating(true); // If you had an actual isUpdating state from mutation
        console.log("Simulating profile save:", editableProfileData);
        return new Promise(resolve => {
            setTimeout(() => {
                setProfileMessage({ type: 'success', text: "Profile updated successfully (simulated)!" });
                setOriginalProfileData(editableProfileData); // Update original after simulated save
                setIsEditing(false);
                refetch(); // Simulate refetching data after update
                // setIsUpdating(false); // If you had an actual isUpdating state from mutation
                resolve(true);
            }, 800);
        });
        // --- End Simulation ---
    };

    const handleCancel = () => {
        if (originalProfileData) {
            setEditableProfileData(originalProfileData);
        }
        setIsEditing(false);
        setProfileMessage({ type: '', text: '' });
    };

    // Show loading spinner if fetching initial data or refetching
    if (isLoading || isFetching || !editableProfileData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: 'var(--color-my-base-200)' }}>
                <CircularProgress sx={{ color: 'var(--color-my-primary)' }} />
                <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading profile...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'var(--color-my-base-200)', color: 'var(--color-my-base-content)', minHeight: '100vh', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-my-primary)' }}>
                My Profile
            </Typography>

            {profileMessage.text && (
                <Alert severity={profileMessage.type} sx={{ mb: 2,
                    backgroundColor: `var(--color-my-${profileMessage.type})`,
                    color: `var(--color-my-${profileMessage.type}-content)`
                }}>
                    {profileMessage.text}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'var(--color-my-base-100)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'var(--color-my-base-content)' }}>My Details</Typography>
                    {!isEditing ? (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={handleEditToggle}
                            sx={{ color: 'var(--color-my-primary)', borderColor: 'var(--color-my-primary)' }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{ mr: 1, backgroundColor: 'var(--color-my-primary)', color: 'var(--color-my-primary-content)', '&:hover': { backgroundColor: 'var(--color-my-primary-focus)' } }}
                                // disabled={isUpdating} // Use this if you have an actual mutation
                            >
                                {/* {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'} */}
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                sx={{ color: 'var(--color-my-error)', borderColor: 'var(--color-my-error)' }}
                                // disabled={isUpdating} // Use this if you have an actual mutation
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
                <Divider sx={{ mb: 3, borderColor: 'var(--color-my-base-300)' }} />

                <Grid container spacing={3}>
                    {/* Profile Picture */}
                    <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar
                            alt={`${editableProfileData.firstName} ${editableProfileData.lastName}`}
                            src={editableProfileData.profilePicture || "https://via.placeholder.com/150"} // Placeholder if no picture
                            sx={{ width: 120, height: 120, mb: 2, border: `2px solid var(--color-my-primary)` }}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://via.placeholder.com/150"; }} // Fallback on error
                        />
                        <Typography variant="caption" sx={{ color: 'var(--color-my-base-content)' }}>Profile Picture</Typography>
                        {/* Add file upload functionality here if needed for profile picture */}
                    </Grid>

                    {/* User Details */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={editableProfileData.firstName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
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
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)', // Maintain border color when disabled
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)', // Keep text readable when disabled
                                                opacity: 0.7, // Reduce opacity for disabled fields
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={editableProfileData.lastName || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
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
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={editableProfileData.email || ''}
                                    onChange={handleChange}
                                    disabled // Email is usually not editable via profile UI
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
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
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="contactPhone"
                                    type="tel"
                                    value={editableProfileData.contactPhone || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
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
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={editableProfileData.address || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
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
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    name="role"
                                    value={editableProfileData.role || ''}
                                    disabled // Role is typically not editable by the user
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
                                        sx: {
                                            color: 'var(--color-my-base-content)',
                                            '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Verified"
                                    name="isVerified"
                                    value={editableProfileData.isVerified ? 'Yes' : 'No'}
                                    disabled // Display only, not editable
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
                                        sx: {
                                            color: 'var(--color-my-base-content)',
                                            '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Member Since"
                                    name="createdAt"
                                    value={editableProfileData.createdAt ? new Date(editableProfileData.createdAt).toLocaleDateString() : ''}
                                    disabled // Display only
                                    variant="outlined"
                                    InputLabelProps={{ sx: { color: 'var(--color-my-base-content)' } }}
                                    InputProps={{
                                        sx: {
                                            color: 'var(--color-my-base-content)',
                                            '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--color-my-base-300)',
                                            },
                                            '&.Mui-disabled': {
                                                color: 'var(--color-my-base-content)',
                                                opacity: 0.7,
                                            },
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};
