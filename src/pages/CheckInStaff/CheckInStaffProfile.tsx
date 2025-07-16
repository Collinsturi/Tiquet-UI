import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from "@mui/icons-material/Phone";
import {useSelector} from "react-redux";
import {useGetUserDetailsQuery} from "../../queries/general/AuthQuery.ts"

// --- Dummy Data Simulation ---
const DUMMY_STAFF_ID = 'staff-001'; // Simulate the current logged-in staff
const DUMMY_STAFF_EMAIL = 'jane.staff@example.com';

let dummyStaffProfile = {
    id: DUMMY_STAFF_ID,
    name: 'Jane Staff',
    email: DUMMY_STAFF_EMAIL,
    role: 'Check-in Agent',
    lastLogin: '2025-06-28T14:30:00Z',
    contactNumber: '+254712345678',
};

// Past check-in records (simulated total scans for event, and scans by this staff)
let dummyPastEventStats = [
    {
        event_id: 'evt-001',
        eventName: 'Tech Innovators Summit 2025',
        totalExpected: 1500,
        totalScannedByAllStaff: 1200, // Total tickets scanned for this event by all staff
        scannedByThisStaff: 250,      // Tickets scanned by Jane Staff for evt-001
        date: '2025-09-10T09:00:00Z',
        status: 'Completed'
    },
    {
        event_id: 'evt-003',
        eventName: 'Summer Music Fest 2024',
        totalExpected: 2500,
        totalScannedByAllStaff: 2450,
        scannedByThisStaff: 480,      // Tickets scanned by Jane Staff for evt-003
        date: '2024-07-20T12:00:00Z',
        status: 'Completed'
    },
    {
        event_id: 'evt-004',
        eventName: 'Future Tech Expo 2026',
        totalExpected: 800,
        totalScannedByAllStaff: 0, // Event is upcoming, no scans yet
        scannedByThisStaff: 0,
        date: '2026-03-01T09:00:00Z',
        status: 'Upcoming'
    }
];

// --- Simulate API Calls ---
const fetchStaffProfile = async (staffId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, this would fetch from a database using staffId
            resolve({ ...dummyStaffProfile });
        }, 500);
    });
};

const fetchStaffEventStats = async (staffId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, filter stats by staffId
            const relevantStats = dummyPastEventStats.filter(stat => stat.scannedByThisStaff > 0 || stat.status === 'Upcoming'); // Show only relevant events
            resolve(relevantStats);
        }, 700);
    });
};

const updateStaffProfile = async (staffId, updatedProfile) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate updating the dummy data
            dummyStaffProfile = { ...dummyStaffProfile, ...updatedProfile };
            console.log(`Profile updated for ${staffId}:`, dummyStaffProfile);
            resolve({ success: true, newProfile: dummyStaffProfile });
        }, 600);
    });
};

export const CheckInStaffProfile = () => {
    // Get user ID from Redux root state
    // Assuming RootState and user slice are correctly configured in Redux
    const userId = useSelector((state) => state.user.user?.user_id); // Get user_id from the user object

    const [error, setError] = useState(null);
    const [eventStats, setEventStats] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedContact, setEditedContact] = useState('');

    // Fetch user details using RTK Query
    const {
        data: staffProfile,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
        error: profileError
    } = useGetUserDetailsQuery(userId, {
        skip: !userId, // Skip the query if userId is not available
    });

    // Effect to load event stats (still using dummy data for now)
    useEffect(() => {
        const loadEventStats = async () => {
            try {
                // Only fetch if userId is available, though DUMMY_STAFF_ID is used for now
                if (userId) {
                    const stats = await fetchStaffEventStats(userId); // Use userId if your dummy function can handle it, otherwise DUMMY_STAFF_ID
                    setEventStats(stats);
                }
            } catch (err) {
                console.error("Error loading staff event stats:", err);
                setError("Failed to load event statistics. Please try again.");
            }
        };

        loadEventStats();
    }, [userId]); // Re-run when userId changes

    // Update editedName and editedContact when staffProfile data changes
    useEffect(() => {
        if (staffProfile) {
            setEditedName(`${staffProfile.firstName || ''} ${staffProfile.lastName || ''}`.trim());
            setEditedContact(staffProfile.contactPhone || '');
        }
    }, [staffProfile]);

    const handleOpenEditModal = () => {
        if (staffProfile) {
            setEditedName(`${staffProfile.firstName || ''} ${staffProfile.lastName || ''}`.trim());
            setEditedContact(staffProfile.contactPhone || '');
        }
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleSaveProfile = async () => {
        if (!editedName.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        try {
            // This part still uses the dummy updateStaffProfile as no RTK Query mutation
            // for updating user details was provided in AuthQuery.
            // In a real app, you would use a mutation here (e.g., useUpdateUserMutation).
            const [firstName, ...lastNameParts] = editedName.trim().split(' ');
            const lastName = lastNameParts.join(' ');

            const result = await updateStaffProfile(userId, {
                firstName: firstName,
                lastName: lastName,
                contactPhone: editedContact.trim(),
            });

            if (result.success) {
                // If a real mutation was used, RTK Query would automatically re-fetch
                // or update the cache. For this dummy, we might need a manual refetch
                // or local state update if the data isn't immediately consistent.
                // For now, we rely on the `staffProfile` from `useGetUserDetailsQuery`
                // to update if the backend actually changes.
                handleCloseEditModal();
                setError(null); // Clear any previous errors
            } else {
                setError("Failed to save profile. Please try again.");
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            setError("An error occurred while saving your profile.");
        }
    };

    if (isLoadingProfile) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Loading staff profile...</Typography>
            </Box>
        );
    }

    if (isErrorProfile) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Alert severity="error" sx={{mb: 3}}>
                    Failed to load staff profile: {profileError?.message || 'Unknown error'}
                </Alert>
                <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
            </Box>
        );
    }

    if (!staffProfile) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Alert severity="info">
                    Staff profile not found. Please ensure you are logged in correctly or that your user ID is
                    available.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#f0f2f5'}}>
            <Paper elevation={3} sx={{p: 4, mb: 3, borderRadius: 2, bgcolor: 'background.paper'}}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar sx={{width: 100, height: 100, bgcolor: 'primary.main'}}>
                            <AccountCircleIcon sx={{fontSize: 60}}/>
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" component="h1" gutterBottom
                                    sx={{fontWeight: 'bold', color: 'primary.dark'}}>
                            {`${staffProfile.firstName} ${staffProfile.lastName}`}
                        </Typography>
                        <Chip
                            label={staffProfile.role}
                            color="secondary"
                            icon={<WorkIcon/>}
                            sx={{mb: 1}}
                        />
                        <Typography variant="body1" color="text.secondary"
                                    sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <MailOutlineIcon fontSize="small"/> {staffProfile.email}
                        </Typography>
                        <Typography variant="body1" color="text.secondary"
                                    sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <PhoneIcon fontSize="small"/> {staffProfile.contactPhone || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{mt: 1}}>
                            Staff ID: {staffProfile.id} | Created
                            At: {new Date(staffProfile.createdAt).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon/>}
                            onClick={handleOpenEditModal}
                            sx={{bgcolor: 'info.main', '&:hover': {bgcolor: 'info.dark'}}}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{p: 4, borderRadius: 2, bgcolor: 'background.paper'}}>
                <Typography variant="h5" component="h2" gutterBottom
                            sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.primary'}}>
                    <EventNoteIcon/> Past Event Check-in Performance
                </Typography>
                <Divider sx={{mb: 3}}/>

                {eventStats.length === 0 ? (
                    <Alert severity="info">No past event check-in data available yet.</Alert>
                ) : (
                    <List>
                        {eventStats.map((stat) => (
                            <ListItem
                                key={stat.event_id}
                                disableGutters
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    '&:hover': {bgcolor: 'action.hover'}
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="div" sx={{mb: 0.5}}>
                                            {stat.eventName}
                                            <Chip
                                                label={stat.status}
                                                color={stat.status === 'Completed' ? 'success' : 'info'}
                                                size="small"
                                                sx={{ml: 1, verticalAlign: 'middle'}}
                                            />
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Date: {new Date(stat.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2"
                                                        sx={{display: 'flex', alignItems: 'center', gap: 0.5, mt: 1}}>
                                                <GroupIcon fontSize="small" color="action"/> Total
                                                Expected: <strong>{stat.totalExpected}</strong>
                                            </Typography>
                                            <Typography variant="body2"
                                                        sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                <CheckCircleOutlineIcon fontSize="small" color="success"/> Scanned by
                                                All: <strong>{stat.totalScannedByAllStaff}</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                mt: 0.5,
                                                fontWeight: 'bold'
                                            }}>
                                                <AccountCircleIcon fontSize="small" color="primary"/> Scanned by
                                                You: <span
                                                style={{color: stat.scannedByThisStaff > 0 ? 'green' : 'text.secondary'}}>{stat.scannedByThisStaff}</span>
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Edit Profile Dialog */}
            <Dialog open={editModalOpen} onClose={handleCloseEditModal} aria-labelledby="edit-profile-dialog-title">
                <DialogTitle id="edit-profile-dialog-title">Edit Profile</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        sx={{mb: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="contactNumber"
                        label="Contact Number"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={editedContact}
                        onChange={(e) => setEditedContact(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="secondary">Cancel</Button>
                    <Button
                        onClick={handleSaveProfile}
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        disabled={isLoadingProfile || !editedName.trim()} // Disable if loading or name is empty
                    >
                        {isLoadingProfile ? <CircularProgress size={24}/> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};