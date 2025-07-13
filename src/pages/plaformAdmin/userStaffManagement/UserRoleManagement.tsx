import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen'; // For permissions
import DescriptionIcon from '@mui/icons-material/Description'; // For role description

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
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                },
            },
        },
    },
});

// Sample Data for Roles & Permissions
const initialRoles = [
    {
        name: 'user',
        permissions: ['view_events', 'purchase_tickets', 'submit_reviews', 'manage_profile'],
        description: 'Standard platform user with basic event interaction capabilities.',
    },
    {
        name: 'organizer',
        permissions: [
            'create_events', 'manage_own_events', 'view_event_sales_data',
            'process_payout_requests', 'manage_event_staff', 'respond_to_reviews',
        ],
        description: 'Event organizers who can create and manage their own events.',
    },
    {
        name: 'admin',
        permissions: [
            'manage_users', 'manage_events', 'approve_organizers',
            'process_payouts', 'view_all_analytics', 'manage_roles',
            'manage_categories', 'manage_system_settings', 'view_system_logs',
        ],
        description: 'Full administrative access with control over all platform features.',
    },
    {
        name: 'checking_staff',
        permissions: ['scan_tickets', 'view_attendee_lists', 'check_in_attendees'],
        description: 'Staff responsible for checking attendees into events.',
    },
];

// All possible permissions for dynamic selection
const allPermissions = [
    'view_events', 'purchase_tickets', 'submit_reviews', 'manage_profile',
    'create_events', 'manage_own_events', 'view_event_sales_data',
    'process_payout_requests', 'manage_event_staff', 'respond_to_reviews',
    'manage_users', 'manage_events', 'approve_organizers',
    'process_payouts', 'view_all_analytics', 'manage_roles',
    'manage_categories', 'manage_system_settings', 'view_system_logs',
    'scan_tickets', 'view_attendee_lists', 'check_in_attendees',
    'send_notifications', 'generate_reports',
];

export const UserRoleManagement = () => {
    const [roles, setRoles] = useState(initialRoles);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [isNewRole, setIsNewRole] = useState(false);

    // Handlers for Role Management
    const handleOpenCreateRole = () => {
        setCurrentRole({ name: '', description: '', permissions: [] });
        setIsNewRole(true);
        setOpenRoleDialog(true);
    };

    const handleEditRole = (role) => {
        setCurrentRole({ ...role });
        setIsNewRole(false);
        setOpenRoleDialog(true);
    };

    const handleSaveRole = () => {
        if (!currentRole.name.trim()) {
            // In a real app, show an error message
            console.error("Role name cannot be empty.");
            return;
        }

        if (isNewRole) {
            if (roles.some(r => r.name === currentRole.name)) {
                console.error("Role with this name already exists.");
                return;
            }
            setRoles([...roles, currentRole]);
        } else {
            setRoles(roles.map(r => r.name === currentRole.name ? currentRole : r));
        }
        setOpenRoleDialog(false);
        setCurrentRole(null);
    };

    const handleDeleteRole = (role) => {
        setCurrentRole(role);
        setOpenDeleteConfirmDialog(true);
    };

    const confirmDeleteRole = () => {
        setRoles(roles.filter(r => r.name !== currentRole.name));
        setOpenDeleteConfirmDialog(false);
        setCurrentRole(null);
    };

    const handleTogglePermission = (permission) => {
        const updatedPermissions = currentRole.permissions.includes(permission)
            ? currentRole.permissions.filter(p => p !== permission)
            : [...currentRole.permissions, permission];
        setCurrentRole({ ...currentRole, permissions: updatedPermissions });
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    User Role Management
                </Typography>

                {/* Roles & Permissions Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <SettingsIcon className="mr-2" color="primary" /> Roles & Permissions
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box className="mb-4 text-right">
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateRole}>
                                Create New Role
                            </Button>
                        </Box>
                        <List>
                            {roles.map((role, index) => (
                                <React.Fragment key={role.name}>
                                    <ListItem alignItems="flex-start" className="py-3">
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                </Typography>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component="span" variant="body2" className="inline text-gray-600">
                                                        {role.description}
                                                    </Typography>
                                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {role.permissions.length > 0 ? (
                                                            role.permissions.map((permission, pIndex) => (
                                                                <Chip
                                                                    key={pIndex}
                                                                    label={permission.replace(/_/g, ' ')}
                                                                    size="small"
                                                                    color="info"
                                                                    variant="outlined"
                                                                />
                                                            ))
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">No permissions assigned.</Typography>
                                                        )}
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        />
                                        <IconButton aria-label="edit role" onClick={() => handleEditRole(role)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton aria-label="delete role" onClick={() => handleDeleteRole(role)} sx={{ ml: 1 }}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </ListItem>
                                    {index < roles.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                        {roles.length === 0 && (
                            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                No roles defined. Click "Create New Role" to add one.
                            </Typography>
                        )}
                    </Paper>
                </Box>

                {/* Dialog for Create/Edit Role */}
                {currentRole && (
                    <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{isNewRole ? 'Create New Role' : `Edit Role: ${currentRole.name.charAt(0).toUpperCase() + currentRole.name.slice(1)}`}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Role Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentRole.name}
                                onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                                sx={{ mb: 2 }}
                                disabled={!isNewRole} // Disable editing name for existing roles
                                helperText={!isNewRole ? "Role name cannot be changed." : "Use lowercase, spaces will be replaced by underscores."}
                            />
                            <TextField
                                margin="dense"
                                label="Role Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={currentRole.description}
                                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                                <LockOpenIcon sx={{ mr: 1 }} color="action" /> Assign Permissions
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, border: '1px solid #ccc', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                {allPermissions.map(perm => (
                                    <Chip
                                        key={perm}
                                        label={perm.replace(/_/g, ' ')}
                                        onClick={() => handleTogglePermission(perm)}
                                        color={currentRole.permissions.includes(perm) ? 'primary' : 'default'}
                                        variant={currentRole.permissions.includes(perm) ? 'contained' : 'outlined'}
                                        clickable
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                ))}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveRole} variant="contained" color="primary">Save Role</Button>
                        </DialogActions>
                    </Dialog>
                )}

                {/* Delete Confirmation Dialog */}
                {currentRole && (
                    <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
                        <DialogTitle>Confirm Delete Role</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete the role "{currentRole.name.charAt(0).toUpperCase() + currentRole.name.slice(1)}"?
                                This action cannot be undone. Users currently assigned to this role will need to be reassigned.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
                            <Button onClick={confirmDeleteRole} variant="contained" color="error">Delete Role</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default UserRoleManagement;
