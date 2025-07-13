import React, { useState } from 'react';
import {
    Typography, Box, Paper, TextField, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch,
    List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem,
    Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import PaymentIcon from '@mui/icons-material/Payment'; // Icon for Payment Gateway
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // For API keys
import WebhookIcon from '@mui/icons-material/Webhook'; // For webhook URLs
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For fees
import CreditCardIcon from '@mui/icons-material/CreditCard'; // For payment methods

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

// Sample Data for Payment Gateway Settings
const initialGatewaySettings = [
    {
        id: 'mpesa',
        name: 'M-Pesa Pay Bill',
        is_enabled: true,
        api_key: 'sk_mpesa_xxxxxxxxxxxxxxxxxxxx',
        secret_key: 'sh_mpesa_yyyyyyyyyyyyyyyyyyyy', // Sensitive data, usually not displayed/edited directly
        webhook_url: 'https://api.yourplatform.com/webhooks/mpesa',
        transaction_fee_percentage: 1.5, // 1.5%
        default_method: true,
        supported_methods: ['M-Pesa Pay Bill', 'M-Pesa Till Number'],
    },
    {
        id: 'stripe',
        name: 'Stripe',
        is_enabled: true,
        api_key: 'pk_test_zzzzzzzzzzzzzzzzzzzzzz',
        secret_key: 'sk_test_aaaaaaaaaaaaaaaaaaaa', // Sensitive data
        webhook_url: 'https://api.yourplatform.com/webhooks/stripe',
        transaction_fee_percentage: 2.9, // 2.9% + 30c
        default_method: false,
        supported_methods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
    },
    {
        id: 'paypal',
        name: 'PayPal',
        is_enabled: false, // Disabled
        api_key: 'sb_paypal_bbbbbbbbbbbbbbbbbbbb',
        secret_key: 'sh_paypal_cccccccccccccccccc', // Sensitive data
        webhook_url: 'https://api.yourplatform.com/webhooks/paypal',
        transaction_fee_percentage: 3.49, // 3.49% + fixed fee
        default_method: false,
        supported_methods: ['PayPal Balance', 'Credit Card'],
    },
];

export const PaymentGatewaySettings = () => {
    const [gatewaySettings, setGatewaySettings] = useState(initialGatewaySettings);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentGateway, setCurrentGateway] = useState(null);

    // Handlers
    const handleEditGateway = (gateway) => {
        // Clone the gateway to avoid direct state mutation before saving
        setCurrentGateway({ ...gateway });
        setOpenEditDialog(true);
    };

    const handleSaveGateway = () => {
        if (currentGateway) {
            setGatewaySettings(gatewaySettings.map(g =>
                g.id === currentGateway.id ? currentGateway : g
            ));
            setOpenEditDialog(false);
            setCurrentGateway(null);
            // In a real app, send data to backend
            console.log('Saving gateway settings:', currentGateway);
        }
    };

    const handleToggleEnabled = (gatewayId) => {
        setGatewaySettings(gatewaySettings.map(g =>
            g.id === gatewayId ? { ...g, is_enabled: !g.is_enabled } : g
        ));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    Payment Gateway Settings
                </Typography>

                <Paper className="p-6 bg-white rounded-xl shadow-lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" className="text-gray-700 flex items-center">
                            <PaymentIcon className="mr-2" color="primary" /> Manage Integrations
                        </Typography>
                        {/* Add New Gateway Button could go here if needed */}
                        {/* <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Add New Gateway
            </Button> */}
                    </Box>

                    <List>
                        {gatewaySettings.map((gateway, index) => (
                            <React.Fragment key={gateway.id}>
                                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {gateway.name}
                                                </Typography>
                                                <Box>
                                                    <Chip
                                                        label={gateway.is_enabled ? 'Enabled' : 'Disabled'}
                                                        color={gateway.is_enabled ? 'success' : 'error'}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    {gateway.default_method && (
                                                        <Chip
                                                            label="Default"
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
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <WebhookIcon fontSize="small" sx={{ mr: 1 }} /> Webhook URL: {gateway.webhook_url || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> Transaction Fee: {gateway.transaction_fee_percentage}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <CreditCardIcon fontSize="small" sx={{ mr: 1 }} /> Supported Methods: {gateway.supported_methods.join(', ') || 'N/A'}
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
                                {index < gatewaySettings.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Edit Payment Gateway Dialog */}
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
                            <TextField
                                margin="dense"
                                label="Secret Key (Not displayed for security)"
                                type="password" // Use password type for sensitive input
                                fullWidth
                                variant="outlined"
                                value="********" // Never display actual secret key
                                // In a real app, you'd handle this securely, e.g., separate input for new secret
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Webhook URL"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={currentGateway.webhook_url}
                                onChange={(e) => setCurrentGateway({ ...currentGateway, webhook_url: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Transaction Fee Percentage (%)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={currentGateway.transaction_fee_percentage}
                                onChange={(e) => setCurrentGateway({ ...currentGateway, transaction_fee_percentage: parseFloat(e.target.value) || 0 })}
                                inputProps={{ step: "0.1", min: "0" }}
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                <InputLabel>Supported Payment Methods</InputLabel>
                                <Select
                                    multiple
                                    value={currentGateway.supported_methods}
                                    onChange={(e) => setCurrentGateway({ ...currentGateway, supported_methods: e.target.value })}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {/* Example of all possible methods. In a real app, this would be dynamic. */}
                                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                                    <MenuItem value="M-Pesa Pay Bill">M-Pesa Pay Bill</MenuItem>
                                    <MenuItem value="M-Pesa Till Number">M-Pesa Till Number</MenuItem>
                                    <MenuItem value="PayPal Balance">PayPal Balance</MenuItem>
                                    <MenuItem value="Apple Pay">Apple Pay</MenuItem>
                                    <MenuItem value="Google Pay">Google Pay</MenuItem>
                                </Select>
                            </FormControl>
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
                                        checked={currentGateway.default_method}
                                        onChange={(e) => setCurrentGateway({ ...currentGateway, default_method: e.target.checked })}
                                        color="secondary"
                                    />
                                }
                                label="Set as Default Payment Method"
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

export default PaymentGatewaySettings;
