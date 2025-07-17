import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Howl } from 'howler';

import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InputIcon from '@mui/icons-material/Input';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScanIcon from '@mui/icons-material/QrCodeScanner';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography'; // <--- Added this import

// --- Sound Setup ---
const successSound = new Howl({ src: ['/sounds/success.mp3'] });
const errorSound = new Howl({ src: ['/sounds/error.mp3'] });

// --- Dummy Data Simulation ---
const DUMMY_STAFF_ID = 'staff-001';
const DUMMY_STAFF_NAME = 'Jane Staff';

let dummyEvents = [
    {
        event_id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi, Kenya',
    },
    {
        event_id: 'evt-002',
        name: 'Annual Charity Gala',
        startDate: '2025-07-16T18:00:00Z',
        endDate: '2025-07-20T23:00:00Z',
        location: 'Sarit Centre, Nairobi, Kenya',
    },
];

let dummyUsers = [
    { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com' },
    { user_id: 'user-002', name: 'Bob Participant', email: 'bob.p@example.com' },
];

let dummyTickets = [
    { ticket_code: 'TKT-001-ABC', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Standard Pass', status: 'valid' },
    { ticket_code: 'TKT-001-DEF', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'VIP Pass', status: 'valid' },
    { ticket_code: 'TKT-001-GHI', user_id: 'user-002', event_id: 'evt-001', ticketTypeName: 'Student Pass', status: 'valid' },
    { ticket_code: 'TKT-001-USED', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Standard Pass', status: 'scanned' },
    { ticket_code: 'TKT-002-XYZ', user_id: 'user-002', event_id: 'evt-002', ticketTypeName: 'General Admission', status: 'valid' },
    { ticket_code: 'TKT-001-INACTIVE', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Early Bird - Expired', status: 'inactive_type' },
];

let dummyCheckInRecords = [
    { ticket_code: 'TKT-001-USED', event_id: 'evt-001', timestamp: '2025-09-10T10:30:00Z', staff_id: 'staff-002', staff_name: 'Mike Smith' },
];

// --- Simulate API Calls ---
const fetchEventDetails = async (eventId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyEvents.find(e => e.event_id === eventId));
        }, 300);
    });
};

const fetchTicketAndValidate = async (ticketCode, eventId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const ticket = dummyTickets.find(t => t.ticket_code === ticketCode);
            const checkInRecord = dummyCheckInRecords.find(r => r.ticket_code === ticketCode && r.event_id === eventId);
            const attendee = ticket ? dummyUsers.find(u => u.user_id === ticket.user_id) : null;

            if (!ticket) {
                resolve({ status: 'error', type: 'invalid', message: 'Ticket Not Found', details: null });
            } else if (ticket.event_id !== eventId) {
                resolve({ status: 'error', type: 'wrong_event', message: `This ticket is not for ${dummyEvents.find(e => e.event_id === eventId)?.name || 'this event'}`, details: { eventName: dummyEvents.find(e => e.event_id === ticket.event_id)?.name } });
            } else if (checkInRecord) {
                resolve({ status: 'error', type: 'already_scanned', message: 'Ticket Already Scanned', details: { timestamp: checkInRecord.timestamp, staff: checkInRecord.staff_name || checkInRecord.staff_id } });
            } else if (ticket.status === 'inactive_type') {
                resolve({ status: 'error', type: 'inactive_type', message: 'Ticket Type Inactive/Expired', details: null });
            } else if (ticket.status === 'valid') {
                resolve({ status: 'success', type: 'valid', message: 'Entry Granted!', details: { attendeeName: attendee?.name || 'N/A', ticketTypeName: ticket.ticketTypeName, quantity: ticket.quantity || 1 } });
            } else {
                resolve({ status: 'error', type: 'unknown', message: 'Unknown ticket status.', details: null });
            }
        }, 700);
    });
};

const recordCheckIn = async (ticketCode, eventId, staffId, staffName, overrideReason = null) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const ticketIndex = dummyTickets.findIndex(t => t.ticket_code === ticketCode);
            if (ticketIndex !== -1) {
                dummyTickets[ticketIndex].status = 'scanned';
            }

            const newRecord = {
                ticket_code: ticketCode,
                event_id: eventId,
                timestamp: new Date().toISOString(),
                staff_id: staffId,
                staff_name: staffName,
                overrideReason: overrideReason,
            };
            dummyCheckInRecords.push(newRecord);
            console.log('Check-in recorded:', newRecord);
            resolve({ success: true, message: 'Check-in recorded.' });
        }, 500);
    });
};

const qrcodeRegionId = "html5qr-code-full-region";

// List of reasons for manual override
const overrideReasons = [
    'Customer insists',
    'System glitch',
    'Manual verification successful',
    'VIP access',
    'Lost ticket (verified)',
    'Other'
];

export const CheckInStaffScan = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scanResult, setScanResult] = useState('');
    const [manualTicketCode, setManualTicketCode] = useState('');
    const [validationFeedback, setValidationFeedback] = useState(null);
    const [validScanCount, setValidScanCount] = useState(0);
    const [invalidScanCount, setInvalidScanCount] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const [isProcessingScan, setIsProcessingScan] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // State for the override modal
    const [overrideModalOpen, setOverrideModalOpen] = useState(false);
    const [overrideTicketCode, setOverrideTicketCode] = useState('');
    const [overrideReason, setOverrideReason] = useState('');
    const [otherOverrideReasonText, setOtherOverrideReasonText] = useState(''); // For the 'Other' input field


    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                setLoading(true);
                const fetchedEvent = await fetchEventDetails(eventId);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                } else {
                    setEvent(null);
                    setValidationFeedback({ status: 'error', message: 'Event not found for scanning.' });
                }
            } catch (err) {
                console.error("Error fetching event details:", err);
                setValidationFeedback({ status: 'error', message: 'Failed to load event details.' });
            } finally {
                setLoading(false);
            }
        };
        loadEvent();
    }, [eventId]);

    const handleScanComplete = useCallback(async (code, isManual = false, overrideReason = null) => {
        if (!code || isProcessingScan) return;

        setIsProcessingScan(true);
        setManualTicketCode('');
        setCameraError(null);

        try {
            const result = await fetchTicketAndValidate(code, eventId);

            setValidationFeedback(result);

            if (result.status === 'success') {
                successSound.play();
                setValidScanCount(prev => prev + 1);
                await recordCheckIn(code, eventId, DUMMY_STAFF_ID, DUMMY_STAFF_NAME, overrideReason);
            } else {
                errorSound.play();
                setInvalidScanCount(prev => prev + 1);
            }
        } catch (err) {
            errorSound.play();
            console.error("Error during scan validation:", err);
            setValidationFeedback({ status: 'error', message: 'An unexpected error occurred during validation.' });
        } finally {
            setIsProcessingScan(false);
        }
    }, [eventId, isProcessingScan]);

    const onScanSuccess = useCallback((decodedText, decodedResult) => {
        if (!isProcessingScan) {
            setScanResult(decodedText);
            console.log(`Code scanned: ${decodedText}`);
            if (html5QrcodeScannerRef.current && html5QrcodeScannerRef.current.isScanning) {
                html5QrcodeScannerRef.current.pause().catch(err => console.warn("Failed to pause scanner:", err));
            }
            handleScanComplete(decodedText);
            setTimeout(() => {
                if (html5QrcodeScannerRef.current && isScanning && !html5QrcodeScannerRef.current.isScanning) {
                    html5QrcodeScannerRef.current.resume().catch(err => console.warn("Failed to resume scanner:", err));
                }
            }, 1500);
        }
    }, [handleScanComplete, isProcessingScan, isScanning]);


    const onScanError = useCallback((errorMessage) => {
        console.warn(`QR Scanner Error: ${errorMessage}`);
        if (errorMessage && !errorMessage.includes("QR code not found")) {
            setCameraError(errorMessage);
            // Optionally, stop scanning if a critical error occurs
            if (errorMessage.includes("NotAllowedError") || errorMessage.includes("NotFoundError") || errorMessage.includes("NotReadableError")) {
                setIsScanning(false);
            }
        }
    }, []);

// Scanner setup with Html5Qrcode (not the Scanner version)
    useEffect(() => {
        const qrCodeRegionId = "html5qr-code-full-region";

        if (isScanning && document.getElementById(qrCodeRegionId)) {
            const html5Qr = new Html5Qrcode(qrCodeRegionId);

            html5Qr
                .start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    onScanSuccess,
                    onScanError
                )
                .then(() => {
                    html5QrcodeScannerRef.current = html5Qr;
                })
                .catch((err) => {
                    console.error("Failed to start scanner:", err);
                    setCameraError(err.message || "Camera initialization failed.");
                });
        }

        return () => {
            // Stop and clear the scanner on unmount
            if (html5QrcodeScannerRef.current) {
                html5QrcodeScannerRef.current
                    .stop()
                    .then(() => html5QrcodeScannerRef.current?.clear())
                    .catch((err) => console.error("Scanner cleanup error:", err));
            }
        };
    }, [isScanning, onScanSuccess, onScanError]);


    // Additional cleanup for when the component unmounts entirely
    useEffect(() => {
        return () => {
            if (html5QrcodeScannerRef.current && html5QrcodeScannerRef.current.isScanning) {
                html5QrcodeScannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner on unmount.", error);
                });
            }
        };
    }, []);


    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualTicketCode.trim()) {
            handleScanComplete(manualTicketCode.trim());
        }
    };

    const handleOpenOverrideModal = (ticketCodeToOverride = '') => {
        setOverrideTicketCode(ticketCodeToOverride);
        setOverrideReason('');
        setOtherOverrideReasonText(''); // Clear other reason text
        setOverrideModalOpen(true);
    };

    const handleCloseOverrideModal = () => {
        setOverrideModalOpen(false);
        setOverrideTicketCode('');
        setOverrideReason('');
        setOtherOverrideReasonText(''); // Clear other reason text on close
    };

    const handleOverrideConfirm = async () => {
        // Determine the final reason to record
        const finalOverrideReason = overrideReason === 'Other' ? otherOverrideReasonText.trim() : overrideReason.trim();

        if (!overrideTicketCode.trim() || !finalOverrideReason) {
            setValidationFeedback({ status: 'error', message: 'Override ticket code and reason are required.' });
            return;
        }
        setIsProcessingScan(true);
        setOverrideModalOpen(false);

        try {
            await recordCheckIn(overrideTicketCode.trim(), eventId, DUMMY_STAFF_ID, DUMMY_STAFF_NAME, finalOverrideReason);
            setValidationFeedback({ status: 'success', message: `Ticket ${overrideTicketCode} manually checked in. Reason: ${finalOverrideReason}` });
            successSound.play();
            setValidScanCount(prev => prev + 1);
        } catch (err) {
            errorSound.play();
            console.error("Error during manual override:", err);
            setValidationFeedback({ status: 'error', message: `Manual check-in failed for ${overrideTicketCode}. ${err.message || ''}` });
            setInvalidScanCount(prev => prev + 1);
        } finally {
            setIsProcessingScan(false);
            setOverrideTicketCode('');
            setOverrideReason('');
            setOtherOverrideReasonText(''); // Reset this as well
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading scanner for event...</Typography>
            </Box>
        );
    }

    if (!event) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Event details could not be loaded or event not found for ID: {eventId}.
                </Alert>
                <Button variant="contained" onClick={() => window.history.back()}>Go Back to Dashboard</Button>
            </Box>
        );
    }

    const feedbackColor = validationFeedback?.status === 'success' ? 'success.main' : 'error.main';
    const feedbackIcon = validationFeedback?.status === 'success' ? <CheckCircleOutlineIcon sx={{ fontSize: 40 }} /> : <CancelOutlinedIcon sx={{ fontSize: 40 }} />;

    return (
        <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#e0e0e0' }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScanIcon fontSize="large" /> Scan Tickets for {event.name}
                </Typography>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon /> {event.location}
                </Typography>
                <Typography variant="subtitle1">
                    Event Dates: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column: Scanner and Manual Entry */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScanIcon /> Live Scanner
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ flexGrow: 1, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                            {isScanning ? (
                                // This is where the html5-qrcode scanner will be rendered
                                <div id={qrcodeRegionId} style={{ width: '100%', maxWidth: '400px' }}></div>
                            ) : cameraError ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <NoPhotographyIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                                    <Typography variant="h6" color="error.main">Camera Error!</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{cameraError}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 'bold' }}>
                                        Please ensure:
                                        <ul>
                                            <li>You are on **HTTPS**.</li>
                                            <li>You have granted camera permission in your browser's address bar.</li>
                                            <li>No other application is using the camera.</li>
                                        </ul>
                                        Then try clicking "Start Camera" again.
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <ScanIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Scanner is Off</Typography>
                                    <Typography variant="body2" color="text.secondary">Click "Start Camera" to begin scanning.</Typography>
                                </Box>
                            )}
                        </Box>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setIsScanning(prev => !prev);
                                setCameraError(null);
                            }}
                            startIcon={isScanning ? <CancelOutlinedIcon /> : <ScanIcon />}
                            sx={{ mb: 3 }}
                        >
                            {isScanning ? 'Stop Camera' : 'Start Camera'}
                        </Button>

                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                            <InputIcon /> Manual Ticket Entry
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <form onSubmit={handleManualSubmit}>
                            <TextField
                                label="Enter Ticket Code"
                                variant="outlined"
                                fullWidth
                                value={manualTicketCode}
                                onChange={(e) => setManualTicketCode(e.target.value.toUpperCase())}
                                disabled={isProcessingScan}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit" disabled={isProcessingScan}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </form>
                    </Paper>
                </Grid>

                {/* Right Column: Validation Feedback & Counters */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Typography variant="h5" gutterBottom>Validation Feedback</Typography>
                        <Divider sx={{ my: 2, width: '100%' }} />

                        {isProcessingScan ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress size={60} sx={{ mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">Processing Scan...</Typography>
                            </Box>
                        ) : validationFeedback ? (
                            <Box sx={{ textAlign: 'center', py: 2, color: feedbackColor }}>
                                {feedbackIcon}
                                <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                                    {validationFeedback.message}
                                </Typography>
                                {validationFeedback.status === 'success' && validationFeedback.details && (
                                    <>
                                        <Typography variant="body1" color="text.primary">
                                            Attendee: {validationFeedback.details.attendeeName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ticket Type: {validationFeedback.details.ticketTypeName}
                                            {validationFeedback.details.quantity > 1 && ` (x${validationFeedback.details.quantity})`}
                                        </Typography>
                                    </>
                                )}
                                {validationFeedback.status === 'error' && validationFeedback.type === 'already_scanned' && validationFeedback.details && (
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            Scanned on: {new Date(validationFeedback.details.timestamp).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            By Staff: {validationFeedback.details.staff}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            startIcon={<VisibilityIcon />}
                                            sx={{ mt: 2 }}
                                            onClick={() => handleOpenOverrideModal(scanResult || manualTicketCode)}
                                        >
                                            Override Check-in
                                        </Button>
                                    </>
                                )}
                                {validationFeedback.status === 'error' && validationFeedback.type === 'wrong_event' && validationFeedback.details && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        This ticket is for the {validationFeedback.details.eventName}.
                                    </Typography>
                                )}
                                {validationFeedback.status === 'error' && validationFeedback.type !== 'already_scanned' && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<VisibilityIcon />}
                                        sx={{ mt: 2 }}
                                        onClick={() => handleOpenOverrideModal(scanResult || manualTicketCode)}
                                    >
                                        Manual Override
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <ScanIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">Waiting for Scan...</Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 3, width: '100%' }} />

                        <Typography variant="h5" gutterBottom>Session Summary</Typography>
                        <Grid container spacing={2} sx={{ width: '100%' }}>
                            <Grid item xs={6}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                                    <Typography variant="subtitle1">Valid Scans</Typography>
                                    <Typography variant="h4">{validScanCount}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
                                    <Typography variant="subtitle1">Invalid Scans</Typography>
                                    <Typography variant="h4">{invalidScanCount}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Override/Manual Check Dialog */}
            <Dialog open={overrideModalOpen} onClose={handleCloseOverrideModal}>
                <DialogTitle>Manual Ticket Override</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Proceed with caution. This action will manually check in the ticket
                        regardless of its current status. An audit trail will be recorded.
                    </Typography>
                    <TextField
                        label="Ticket Code to Override"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={overrideTicketCode}
                        onChange={(e) => setOverrideTicketCode(e.target.value.toUpperCase())}
                        disabled={isProcessingScan}
                    />
                    <TextField
                        select
                        label="Reason for Override"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        disabled={isProcessingScan}
                    >
                        {overrideReasons.map((reason) => (
                            <MenuItem key={reason} value={reason}>
                                {reason}
                            </MenuItem>
                        ))}
                    </TextField>
                    {overrideReason === 'Other' && (
                        <TextField
                            label="Specify Other Reason"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={otherOverrideReasonText} // Correctly uses the new state for 'other'
                            onChange={(e) => setOtherOverrideReasonText(e.target.value)}
                            disabled={isProcessingScan}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseOverrideModal} disabled={isProcessingScan}>Cancel</Button>
                    <Button
                        onClick={handleOverrideConfirm}
                        color="warning"
                        variant="contained"
                        disabled={isProcessingScan || !overrideTicketCode.trim() || !overrideReason.trim() || (overrideReason === 'Other' && !otherOverrideReasonText.trim())}
                    >
                        {isProcessingScan ? <CircularProgress size={24} /> : <VisibilityIcon sx={{ mr: 1 }} />}
                        Confirm Override
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};