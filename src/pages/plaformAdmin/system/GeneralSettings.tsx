import React, { useState } from 'react';
import {
    Typography, Box, Paper, TextField, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch,
    List, ListItem, ListItemText, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

// Sample Data for General Settings
const initialSettings = {
    site_name: 'EventTicketingPro',
    site_logo_url: 'https://placehold.co/100x40/007BFF/ffffff?text=Logo',
    default_currency: 'USD',
    time_zone: 'Africa/Nairobi', // EAT - East Africa Time
    terms_of_service_content: `
    Welcome to EventTicketingPro. By using our services, you agree to the following terms:
    1. All ticket sales are final unless otherwise stated.
    2. Event organizers are responsible for event content and execution.
    3. We reserve the right to modify these terms at any time.
    For more details, please visit our full terms page.
  `.trim(),
    privacy_policy_content: `
    Your privacy is important to us. This policy explains how we collect, use, and protect your personal data.
    1. We collect data necessary for ticket purchases and event management.
    2. Your data is not shared with third parties without your consent, except as required by law.
    3. We use industry-standard security measures to protect your information.
    For more details, please visit our full privacy policy page.
  `.trim(),
    public_contact_email: 'support@eventticketingpro.com',
    public_contact_phone: '+254 712 345 678', // Kenyan phone number example
    public_address: '123 Event Plaza, Nairobi, Kenya',
};

export const GeneralSettings = () => {
    const [settings, setSettings] = useState(initialSettings);
    const [editMode, setEditMode] = useState(false);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [previewContent, setPreviewContent] = useState({ title: '', content: '' });

    // Handlers
    const handleSaveSettings = () => {
        // In a real application, you would send this data to your backend API
        console.log('Saving settings:', settings);
        setEditMode(false);
        // Add success feedback here
    };

    const handleCancelEdit = () => {
        // Revert to initial settings or last saved settings
        setSettings(initialSettings); // For demo, revert to initial. In real app, load from a "saved" state.
        setEditMode(false);
    };

    const handlePreview = (title, content) => {
        setPreviewContent({ title, content });
        setOpenPreviewDialog(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
                    General Settings
                </Typography>

                <Paper className="p-6 bg-white rounded-xl shadow-lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" className="text-gray-700 flex items-center">
                            <SettingsIcon className="mr-2" color="primary" /> Core Platform Configurations
                        </Typography>
                        {!editMode ? (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={() => setEditMode(true)}
                            >
                                Edit Settings
                            </Button>
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
                                    onClick={handleSaveSettings}
                                >
                                    Save Settings
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <List>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Site Name</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={settings.site_name}
                                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.site_name}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Site Logo URL</Typography>}
                                secondary={
                                    editMode ? (
                                        <>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={settings.site_logo_url}
                                                onChange={(e) => setSettings({ ...settings, site_logo_url: e.target.value })}
                                                sx={{ mt: 1, mb: 1 }}
                                            />
                                            {settings.site_logo_url && (
                                                <Box sx={{ mt: 1 }}>
                                                    <img src={settings.site_logo_url} alt="Site Logo Preview" style={{ maxWidth: '150px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} onError={(e) => e.target.src='https://placehold.co/100x40/cccccc/000000?text=Error'} />
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Preview</Typography>
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {settings.site_logo_url && (
                                                <img src={settings.site_logo_url} alt="Site Logo" style={{ maxWidth: '100px', height: 'auto', marginRight: '8px' }} onError={(e) => e.target.src='https://placehold.co/100x40/cccccc/000000?text=Error'} />
                                            )}
                                            <Typography variant="body1">{settings.site_logo_url || 'N/A'}</Typography>
                                        </Box>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Default Currency</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={settings.default_currency}
                                            onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.default_currency}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Time Zone</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={settings.time_zone}
                                            onChange={(e) => setSettings({ ...settings, time_zone: e.target.value })}
                                            sx={{ mt: 1 }}
                                            helperText="e.g., Africa/Nairobi, America/New_York"
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.time_zone}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Terms of Service Content</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            variant="outlined"
                                            value={settings.terms_of_service_content}
                                            onChange={(e) => setSettings({ ...settings, terms_of_service_content: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handlePreview('Terms of Service', settings.terms_of_service_content)}
                                            sx={{ mt: 1 }}
                                        >
                                            View Content
                                        </Button>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Privacy Policy Content</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            variant="outlined"
                                            value={settings.privacy_policy_content}
                                            onChange={(e) => setSettings({ ...settings, privacy_policy_content: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handlePreview('Privacy Policy', settings.privacy_policy_content)}
                                            sx={{ mt: 1 }}
                                        >
                                            View Content
                                        </Button>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Public Contact Email</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={settings.public_contact_email}
                                            onChange={(e) => setSettings({ ...settings, public_contact_email: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.public_contact_email}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Public Contact Phone</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={settings.public_contact_phone}
                                            onChange={(e) => setSettings({ ...settings, public_contact_phone: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.public_contact_phone}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                        <Divider component="li" />

                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Public Address</Typography>}
                                secondary={
                                    editMode ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                            value={settings.public_address}
                                            onChange={(e) => setSettings({ ...settings, public_address: e.target.value })}
                                            sx={{ mt: 1 }}
                                        />
                                    ) : (
                                        <Typography variant="body1">{settings.public_address}</Typography>
                                    )
                                }
                            />
                        </ListItem>
                    </List>
                </Paper>

                {/* Preview Content Dialog */}
                <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>{previewContent.title}</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {previewContent.content}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default GeneralSettings;
