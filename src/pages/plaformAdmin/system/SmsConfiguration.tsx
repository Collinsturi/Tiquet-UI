import React, { useState } from 'react';
import {
    Typography, Box, Paper, TextField, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch,
    List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem,
    Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message'; // Icon for SMS/Email Gateway
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // For API keys
import SendIcon from '@mui/icons-material/Send'; // For sender IDs

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

// Sample Data for SMS/Email Gateway Settings
const initialCommunicationGateways = [
    {
        id: 'twilio_sms',
        name: 'Twilio SMS Gateway',
        type: 'SMS',
        is_enabled: true,
        api_key: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        auth_token: 'your_auth_token_here', // Sensitive data
        sender_id: 'EventPro',
        default_sender: true,
    },
    {
        id: 'sendgrid_email',
        name: 'SendGrid Email Gateway',
        type: 'Email',
        is_enabled: true,
        api_key: 'SG.yyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
        auth_token: '', // Not always applicable for email APIs
        sender_id: 'noreply@eventpro.com', // Default sender email
        default_sender: true,
    },
    {
        id: 'nexmo_sms',
        name: 'Vonage (Nexmo) SMS',
        type: 'SMS',
        is_enabled: false,
        api_key: 'zzzzzzzz',
        auth_token: 'aaaaaaaaaaaaaaaa', // Sensitive data
        sender_id: 'EventApp',
        default_sender: false,
    },
];

export const SmsConfiguration = () => {
    const [communicationGateways, setCommunicationGateways] = useState(initialCommunicationGateways);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentGateway, setCurrentGateway] = useState(null);

    // Handlers
    const handleEditGateway = (gateway) => {
        setCurrentGateway({ ...gateway }); // Clone for editing
        setOpenEditDialog(true);
    };

    const handleSaveGateway = () => {
        if (currentGateway) {
            setCommunicationGateways(communicationGateways.map(g =>
                g.id === currentGateway.id ? currentGateway : g
            ));
            setOpenEditDialog(false);
            setCurrentGateway(null);
            // In a real app, send data to backend
            console.log('Saving communication gateway settings:', currentGateway);
        }
    };

    const handleToggleEnabled = (gatewayId) => {
        setCommunicationGateways(communicationGateways.map(g =>
            g.id === gatewayId ? { ...g, is_enabled: !g.is_enabled } : g
        ));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    SMS/Email Gateway Settings
                </Typography>

                <Paper className="p-6 bg-white rounded-xl shadow-lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" className="text-gray-700 flex items-center">
                            <MessageIcon className="mr-2" color="primary" /> Configure Communication Providers
                        </Typography>
                        {/* Add New Gateway Button could go here if needed */}
                        {/* <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Add New Gateway
            </Button> */}
                    </Box>

                    <List>
                        {communicationGateways.map((gateway, index) => (
                            <React.Fragment key={gateway.id}>
                                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {gateway.name} ({gateway.type})
                                                </Typography>
                                                <Box>
                                                    <Chip
                                                        label={gateway.is_enabled ? 'Enabled' : 'Disabled'}
                                                        color={gateway.is_enabled ? 'success' : 'error'}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    {gateway.default_sender && (
                                                        <Chip
                                                            label="Default Sender"
                                                            color="info"
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ width: '100%', mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <VpnKeyIcon fontSize="small" sx={{ mr: 1 }} /> API Key: {gateway.api_key ? '********' : 'Not Set'}
                                                </Typography>
                                                {gateway.auth_token && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                        <VpnKeyIcon fontSize="small" sx={{ mr: 1 }} /> Auth Token: ********
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <SendIcon fontSize="small" sx={{ mr: 1 }} /> Sender ID: {gateway.sender_id || 'N/A'}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Box sx={{ ml: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={gateway.is_enabled}
                                                    onChange={() => handleToggleEnabled(gateway.id)}
                                                    color="primary"
                                                />
                                            }
                                            label={gateway.is_enabled ? 'Disable' : 'Enable'}
                                            labelPlacement="top"
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<SaveIcon />}
                                            onClick={() => handleEditGateway(gateway)}
                                            sx={{ ml: 1 }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                </ListItem>
                                {index < communicationGateways.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Edit Communication Gateway Dialog */}
                {currentGateway && (
                    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Edit Gateway: {currentGateway.name}</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                label="API Key"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentGateway.api_key}
                                onChange={(e) => setCurrentGateway({ ...currentGateway, api_key: e.target.value })}
                                sx={{ mb: 2 }}
                                helperText="Use caution when editing API keys."
                            />
                            {currentGateway.auth_token !== undefined && ( // Only show if auth_token exists in sample data
                                <TextField
                                    margin="dense"
                                    label="Auth Token (Sensitive)"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value="********" // Never display actual auth token
                                    // In a real app, you'd handle this securely, e.g., separate input for new secret
                                    disabled
                                    sx={{ mb: 2 }}
                                />
                            )}
                            <TextField
                                margin="dense"
                                label="Sender ID / Default Sender Email"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentGateway.sender_id}
                                onChange={(e) => setCurrentGateway({ ...currentGateway, sender_id: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentGateway.is_enabled}
                                        onChange={(e) => setCurrentGateway({ ...currentGateway, is_enabled: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Enable Gateway"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentGateway.default_sender}
                                        onChange={(e) => setCurrentGateway({ ...currentGateway, default_sender: e.target.checked })}
                                        color="secondary"
                                    />
                                }
                                label="Set as Default Sender"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveGateway} variant="contained" color="primary" startIcon={<SaveIcon />}>
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default SmsConfiguration;
