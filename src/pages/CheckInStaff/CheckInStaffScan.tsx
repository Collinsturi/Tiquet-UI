// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { Html5Qrcode} from 'html5-qrcode'; // Import Html5QrcodeSupportedMethod
// import { Howl } from 'howler';
//
// import {
//     Box,
//     Typography,
//     Button,
//     Paper,
//     Grid,
//     CircularProgress,
//     Alert,
//     TextField,
//     InputAdornment,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     MenuItem,
//     Divider,
// } from '@mui/material';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import InputIcon from '@mui/icons-material/Input';
// import SendIcon from '@mui/icons-material/Send';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ScanIcon from '@mui/icons-material/QrCodeScanner';
// import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
//
// // --- Type Definitions ---
//
// // Define the structure of an Event
// interface Event {
//     event_id: string;
//     name: string;
//     startDate: string;
//     endDate: string;
//     location: string;
// }
//
// // Define the structure of a User
// interface User {
//     user_id: string;
//     name: string;
//     email: string;
// }
//
// // Define the structure of a Ticket
// interface Ticket {
//     ticket_code: string;
//     user_id: string;
//     event_id: string;
//     ticketTypeName: string;
//     status: 'valid' | 'scanned' | 'inactive_type'; // Explicit statuses
//     quantity?: number; // Quantity might be optional in dummy data
// }
//
// // Define the structure of a Check-in Record
// interface CheckInRecord {
//     ticket_code: string;
//     event_id: string;
//     timestamp: string;
//     staff_id: string;
//     staff_name: string;
//     overrideReason?: string | null; // Optional override reason
// }
//
// // Define the structure for validation feedback details
// interface SuccessDetails {
//     attendeeName: string;
//     ticketTypeName: string;
//     quantity: number;
// }
//
// interface AlreadyScannedDetails {
//     timestamp: string;
//     staff: string;
// }
//
// interface WrongEventDetails {
//     eventName: string;
// }
//
// // Discriminated union for ValidationFeedback
// type ValidationFeedback =
//     | { status: 'success'; type: 'valid'; message: string; details: SuccessDetails }
//     | { status: 'error'; type: 'invalid'; message: string; details: null }
//     | { status: 'error'; type: 'wrong_event'; message: string; details: WrongEventDetails }
//     | { status: 'error'; type: 'already_scanned'; message: string; details: AlreadyScannedDetails }
//     | { status: 'error'; type: 'inactive_type'; message: string; details: null }
//     | { status: 'error'; type: 'unknown'; message: string; details: null }
//     | { status: 'error'; message: string; details?: any; type?: string }; // Generic error for unexpected cases
//
// // --- Sound Setup ---
// const successSound = new Howl({ src: ['/sounds/success.mp3'] });
// const errorSound = new Howl({ src: ['/sounds/error.mp3'] });
//
// // --- Dummy Data Simulation ---
// const DUMMY_STAFF_ID = 'staff-001';
// const DUMMY_STAFF_NAME = 'Jane Staff';
//
// let dummyEvents: Event[] = [
//     {
//         event_id: 'evt-001',
//         name: 'Tech Innovators Summit 2025',
//         startDate: '2025-09-10T09:00:00Z',
//         endDate: '2025-09-12T17:00:00Z',
//         location: 'KICC, Nairobi, Kenya',
//     },
//     {
//         event_id: 'evt-002',
//         name: 'Annual Charity Gala',
//         startDate: '2025-07-16T18:00:00Z',
//         endDate: '2025-07-20T23:00:00Z',
//         location: 'Sarit Centre, Nairobi, Kenya',
//     },
// ];
//
// let dummyUsers: User[] = [
//     { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com' },
//     { user_id: 'user-002', name: 'Bob Participant', email: 'bob.p@example.com' },
// ];
//
// let dummyTickets: Ticket[] = [
//     { ticket_code: 'TKT-001-ABC', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Standard Pass', status: 'valid' },
//     { ticket_code: 'TKT-001-DEF', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'VIP Pass', status: 'valid' },
//     { ticket_code: 'TKT-001-GHI', user_id: 'user-002', event_id: 'evt-001', ticketTypeName: 'Student Pass', status: 'valid' },
//     { ticket_code: 'TKT-001-USED', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Standard Pass', status: 'scanned' },
//     { ticket_code: 'TKT-002-XYZ', user_id: 'user-002', event_id: 'evt-002', ticketTypeName: 'General Admission', status: 'valid' },
//     { ticket_code: 'TKT-001-INACTIVE', user_id: 'user-001', event_id: 'evt-001', ticketTypeName: 'Early Bird - Expired', status: 'inactive_type' },
// ];
//
// let dummyCheckInRecords: CheckInRecord[] = [
//     { ticket_code: 'TKT-001-USED', event_id: 'evt-001', timestamp: '2025-09-10T10:30:00Z', staff_id: 'staff-002', staff_name: 'Mike Smith' },
// ];
//
// // --- Simulate API Calls ---
// const fetchEventDetails = async (eventId: string): Promise<Event | undefined> => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(dummyEvents.find(e => e.event_id === eventId));
//         }, 300);
//     });
// };
//
// const fetchTicketAndValidate = async (ticketCode: string, eventId: string): Promise<ValidationFeedback> => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const ticket = dummyTickets.find(t => t.ticket_code === ticketCode);
//             const checkInRecord = dummyCheckInRecords.find(r => r.ticket_code === ticketCode && r.event_id === eventId);
//             const attendee = ticket ? dummyUsers.find(u => u.user_id === ticket.user_id) : null;
//
//             if (!ticket) {
//                 resolve({ status: 'error', type: 'invalid', message: 'Ticket Not Found', details: null });
//             } else if (ticket.event_id !== eventId) {
//                 resolve({ status: 'error', type: 'wrong_event', message: `This ticket is not for ${dummyEvents.find(e => e.event_id === eventId)?.name || 'this event'}`, details: { eventName: dummyEvents.find(e => e.event_id === ticket.event_id)?.name || 'another event' } });
//             } else if (checkInRecord) {
//                 resolve({ status: 'error', type: 'already_scanned', message: 'Ticket Already Scanned', details: { timestamp: checkInRecord.timestamp, staff: checkInRecord.staff_name || checkInRecord.staff_id } });
//             } else if (ticket.status === 'inactive_type') {
//                 resolve({ status: 'error', type: 'inactive_type', message: 'Ticket Type Inactive/Expired', details: null });
//             } else if (ticket.status === 'valid') {
//                 resolve({ status: 'success', type: 'valid', message: 'Entry Granted!', details: { attendeeName: attendee?.name || 'N/A', ticketTypeName: ticket.ticketTypeName, quantity: ticket.quantity || 1 } });
//             } else {
//                 resolve({ status: 'error', type: 'unknown', message: 'Unknown ticket status.', details: null });
//             }
//         }, 700);
//     });
// };
//
// const recordCheckIn = async (ticketCode: string, eventId: string, staffId: string, staffName: string, overrideReason: string | null = null): Promise<{ success: boolean; message: string }> => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const ticketIndex = dummyTickets.findIndex(t => t.ticket_code === ticketCode);
//             if (ticketIndex !== -1) {
//                 dummyTickets[ticketIndex].status = 'scanned';
//             }
//
//             const newRecord: CheckInRecord = {
//                 ticket_code: ticketCode,
//                 event_id: eventId,
//                 timestamp: new Date().toISOString(),
//                 staff_id: staffId,
//                 staff_name: staffName,
//                 overrideReason: overrideReason,
//             };
//             dummyCheckInRecords.push(newRecord);
//             console.log('Check-in recorded:', newRecord);
//             resolve({ success: true, message: 'Check-in recorded.' });
//         }, 500);
//     });
// };
//
// const qrcodeRegionId = "html5qr-code-full-region";
//
// // List of reasons for manual override
// const overrideReasons: string[] = [
//     'Customer insists',
//     'System glitch',
//     'Manual verification successful',
//     'VIP access',
//     'Lost ticket (verified)',
//     'Other'
// ];
//
// export const CheckInStaffScan = () => {
//     const { eventId } = useParams<{ eventId: string }>(); // Type useParams
//     const [event, setEvent] = useState<Event | null>(null); // Type event state
//     const [loading, setLoading] = useState<boolean>(true);
//     const [scanResult, setScanResult] = useState<string>('');
//     const [manualTicketCode, setManualTicketCode] = useState<string>('');
//     const [validationFeedback, setValidationFeedback] = useState<ValidationFeedback | null>(null); // Type validationFeedback
//     const [validScanCount, setValidScanCount] = useState<number>(0);
//     const [invalidScanCount, setInvalidScanCount] = useState<number>(0);
//     const [isScanning, setIsScanning] = useState<boolean>(true);
//     const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);
//     const [cameraError, setCameraError] = useState<string | null>(null);
//
//     // State for the override modal
//     const [overrideModalOpen, setOverrideModalOpen] = useState<boolean>(false);
//     const [overrideTicketCode, setOverrideTicketCode] = useState<string>('');
//     const [overrideReason, setOverrideReason] = useState<string>('');
//     const [otherOverrideReasonText, setOtherOverrideReasonText] = useState<string>('');
//
//     // Type useRef to hold Html5Qrcode instance
//     const html5QrcodeScannerRef = useRef<Html5Qrcode | null>(null);
//
//     useEffect(() => {
//         const loadEvent = async () => {
//             try {
//                 setLoading(true);
//                 // Ensure eventId is not undefined before fetching
//                 if (eventId) {
//                     const fetchedEvent = await fetchEventDetails(eventId);
//                     if (fetchedEvent) {
//                         setEvent(fetchedEvent);
//                     } else {
//                         setEvent(null);
//                         setValidationFeedback({ status: 'error', message: 'Event not found for scanning.', details: null });
//                     }
//                 } else {
//                     setEvent(null);
//                     setValidationFeedback({ status: 'error', message: 'Event ID is missing.', details: null });
//                 }
//             } catch (err: any) { // Catch error as any or a more specific type if known
//                 console.error("Error fetching event details:", err);
//                 setValidationFeedback({ status: 'error', message: err.message || 'Failed to load event details.', details: null });
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadEvent();
//     }, [eventId]); // Dependency array for useEffect
//
//     const handleScanComplete = useCallback(async (code: string, overrideReason: string | null = null) => {
//         if (!code || isProcessingScan) return;
//
//         setIsProcessingScan(true);
//         setManualTicketCode('');
//         setCameraError(null);
//
//         try {
//             // Ensure eventId is available
//             if (!eventId) {
//                 setValidationFeedback({ status: 'error', message: 'Event ID is missing for validation.', details: null });
//                 errorSound.play();
//                 setInvalidScanCount(prev => prev + 1);
//                 return;
//             }
//
//             const result = await fetchTicketAndValidate(code, eventId);
//
//             setValidationFeedback(result);
//
//             if (result.status === 'success') {
//                 successSound.play();
//                 setValidScanCount(prev => prev + 1);
//                 await recordCheckIn(code, eventId, DUMMY_STAFF_ID, DUMMY_STAFF_NAME, overrideReason);
//             } else {
//                 errorSound.play();
//                 setInvalidScanCount(prev => prev + 1);
//             }
//         } catch (err: any) {
//             errorSound.play();
//             console.error("Error during scan validation:", err);
//             setValidationFeedback({ status: 'error', message: err.message || 'An unexpected error occurred during validation.', details: null });
//         } finally {
//             setIsProcessingScan(false);
//         }
//     }, [eventId, isProcessingScan]); // Dependencies for useCallback
//
//     const onScanSuccess = useCallback((decodedText: string) => { // Type decodedText and decodedResult
//         if (!isProcessingScan) {
//             setScanResult(decodedText);
//             console.log(`Code scanned: ${decodedText}`);
//             if (html5QrcodeScannerRef.current && html5QrcodeScannerRef.current.isScanning) {
//                 html5QrcodeScannerRef.current.pause().catch((err: any) => console.warn("Failed to pause scanner:", err));
//             }
//             handleScanComplete(decodedText);
//             setTimeout(() => {
//                 // Check if scanner is still active and not currently scanning before resuming
//                 if (html5QrcodeScannerRef.current && isScanning && !html5QrcodeScannerRef.current.isScanning()) {
//                     html5QrcodeScannerRef.current.resume().catch((err: any) => console.warn("Failed to resume scanner:", err));
//                 }
//             }, 1500);
//         }
//     }, [handleScanComplete, isProcessingScan, isScanning]);
//
//
//     const onScanError = useCallback((errorMessage: string) => { // Type errorMessage
//         console.warn(`QR Scanner Error: ${errorMessage}`);
//         if (errorMessage && !errorMessage.includes("QR code not found")) {
//             setCameraError(errorMessage);
//             // Optionally, stop scanning if a critical error occurs
//             if (errorMessage.includes("NotAllowedError") || errorMessage.includes("NotFoundError") || errorMessage.includes("NotReadableError")) {
//                 setIsScanning(false);
//             }
//         }
//     }, []);
//
// // Scanner setup with Html5Qrcode (not the Scanner version)
//     useEffect(() => {
//         const qrCodeRegionId = "html5qr-code-full-region";
//         let html5Qr: Html5Qrcode | null = null; // Declare html5Qr here
//
//         if (isScanning && document.getElementById(qrCodeRegionId)) {
//             html5Qr = new Html5Qrcode(qrCodeRegionId);
//
//             html5Qr
//                 .start(
//                     { facingMode: "environment" }, // Or { deviceId: { exact: cameraId } }
//                     {
//                         fps: 10,
//                         qrbox: { width: 250, height: 250 },
//                     },
//                     onScanSuccess,
//                     onScanError
//                 )
//                 .then(() => {
//                     html5QrcodeScannerRef.current = html5Qr; // Assign to ref
//                 })
//                 .catch((err: any) => { // Type err
//                     console.error("Failed to start scanner:", err);
//                     setCameraError(err.message || "Camera initialization failed.");
//                     setIsScanning(false); // Stop scanning if it fails to start
//                 });
//         }
//
//         return () => {
//             // Stop and clear the scanner on unmount or when isScanning changes to false
//             if (html5QrcodeScannerRef.current) {
//                 // Check if scanner is currently scanning before attempting to stop
//                 if (html5QrcodeScannerRef.current.isScanning()) {
//                     html5QrcodeScannerRef.current
//                         .stop()
//                         .then(() => {
//                             html5QrcodeScannerRef.current?.clear();
//                             html5QrcodeScannerRef.current = null; // Clear ref
//                         })
//                         .catch((err: any) => console.error("Scanner cleanup error:", err));
//                 } else {
//                     // If not scanning but ref exists, just clear it
//                     html5QrcodeScannerRef.current?.clear();
//                     html5QrcodeScannerRef.current = null; // Clear ref
//                 }
//             }
//         };
//     }, [isScanning, onScanSuccess, onScanError]); // Dependencies for useEffect
//
//     // Additional cleanup for when the component unmounts entirely
//     useEffect(() => {
//         return () => {
//             // Ensure the scanner is stopped and cleared if the component unmounts
//             if (html5QrcodeScannerRef.current) {
//                 if (html5QrcodeScannerRef.current.isScanning()) {
//                     html5QrcodeScannerRef.current.stop().then(() => {
//                         html5QrcodeScannerRef.current?.clear();
//                         html5QrcodeScannerRef.current = null;
//                     }).catch((error: any) => {
//                         console.error("Failed to clear html5QrcodeScanner on unmount.", error);
//                     });
//                 } else {
//                     html5QrcodeScannerRef.current.clear().catch((error: any) => {
//                         console.error("Failed to clear html5QrcodeScanner on unmount (not scanning).", error);
//                     });
//                 }
//             }
//         };
//     }, []);
//
//
//     const handleManualSubmit = (e: React.FormEvent) => { // Type event
//         e.preventDefault();
//         if (manualTicketCode.trim()) {
//             handleScanComplete(manualTicketCode.trim());
//         }
//     };
//
//     const handleOpenOverrideModal = (ticketCodeToOverride: string = '') => { // Type parameter
//         setOverrideTicketCode(ticketCodeToOverride);
//         setOverrideReason('');
//         setOtherOverrideReasonText('');
//         setOverrideModalOpen(true);
//     };
//
//     const handleCloseOverrideModal = () => {
//         setOverrideModalOpen(false);
//         setOverrideTicketCode('');
//         setOverrideReason('');
//         setOtherOverrideReasonText('');
//     };
//
//     const handleOverrideConfirm = async () => {
//         const finalOverrideReason = overrideReason === 'Other' ? otherOverrideReasonText.trim() : overrideReason.trim();
//
//         if (!overrideTicketCode.trim() || !finalOverrideReason) {
//             setValidationFeedback({ status: 'error', message: 'Override ticket code and reason are required.', details: null });
//             return;
//         }
//         setIsProcessingScan(true);
//         setOverrideModalOpen(false);
//
//         try {
//             // Ensure eventId is available
//             if (!eventId) {
//                 setValidationFeedback({ status: 'error', message: 'Event ID is missing for manual override.', details: null });
//                 errorSound.play();
//                 setInvalidScanCount(prev => prev + 1);
//                 return;
//             }
//
//             await recordCheckIn(overrideTicketCode.trim(), eventId, DUMMY_STAFF_ID, DUMMY_STAFF_NAME, finalOverrideReason);
//             setValidationFeedback({ status: 'success', type: 'valid', message: `Ticket ${overrideTicketCode} manually checked in. Reason: ${finalOverrideReason}`, details: { attendeeName: 'Manual Override', ticketTypeName: 'Manual Override', quantity: 1 } }); // Provide dummy details for success type
//             successSound.play();
//             setValidScanCount(prev => prev + 1);
//         } catch (err: any) {
//             errorSound.play();
//             console.error("Error during manual override:", err);
//             setValidationFeedback({ status: 'error', message: `Manual check-in failed for ${overrideTicketCode}. ${err.message || ''}`, details: null });
//             setInvalidScanCount(prev => prev + 1);
//         } finally {
//             setIsProcessingScan(false);
//             setOverrideTicketCode('');
//             setOverrideReason('');
//             setOtherOverrideReasonText('');
//         }
//     };
//
//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//                 <CircularProgress />
//                 <Typography sx={{ ml: 2 }}>Loading scanner for event...</Typography>
//             </Box>
//         );
//     }
//
//     if (!event) {
//         return (
//             <Box sx={{ p: 3, textAlign: 'center' }}>
//                 <Alert severity="error" sx={{ mb: 3 }}>
//                     Event details could not be loaded or event not found for ID: {eventId}.
//                 </Alert>
//                 <Button variant="contained" onClick={() => window.history.back()}>Go Back to Dashboard</Button>
//             </Box>
//         );
//     }
//
//     // Safely access properties of validationFeedback
//     const feedbackColor = validationFeedback?.status === 'success' ? 'success.main' : 'error.main';
//     const feedbackIcon = validationFeedback?.status === 'success' ? <CheckCircleOutlineIcon sx={{ fontSize: 40 }} /> : <CancelOutlinedIcon sx={{ fontSize: 40 }} />;
//
//     return (
//         <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#e0e0e0' }}>
//             <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
//                 <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <ScanIcon fontSize="large" /> Scan Tickets for {event.name}
//                 </Typography>
//                 <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <LocationOnIcon /> {event.location}
//                 </Typography>
//                 <Typography variant="subtitle1">
//                     Event Dates: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
//                 </Typography>
//             </Paper>
//
//             <Grid container spacing={3}>
//                 {/* Left Column: Scanner and Manual Entry */}
//                 <Grid item xs={12} md={7}>
//                     <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
//                         <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <ScanIcon /> Live Scanner
//                         </Typography>
//                         <Divider sx={{ my: 2 }} />
//
//                         <Box sx={{ flexGrow: 1, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
//                             {isScanning ? (
//                                 // This is where the html5-qrcode scanner will be rendered
//                                 <div id={qrcodeRegionId} style={{ width: '100%', maxWidth: '400px' }}></div>
//                             ) : cameraError ? (
//                                 <Box sx={{ p: 4, textAlign: 'center' }}>
//                                     <NoPhotographyIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
//                                     <Typography variant="h6" color="error.main">Camera Error!</Typography>
//                                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{cameraError}</Typography>
//                                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 'bold' }}>
//                                         Please ensure:
//                                         <ul>
//                                             <li>You are on **HTTPS**.</li>
//                                             <li>You have granted camera permission in your browser's address bar.</li>
//                                             <li>No other application is using the camera.</li>
//                                         </ul>
//                                         Then try clicking "Start Camera" again.
//                                     </Typography>
//                                 </Box>
//                             ) : (
//                                 <Box sx={{ p: 4, textAlign: 'center' }}>
//                                     <ScanIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
//                                     <Typography variant="h6" color="text.secondary">Scanner is Off</Typography>
//                                     <Typography variant="body2" color="text.secondary">Click "Start Camera" to begin scanning.</Typography>
//                                 </Box>
//                             )}
//                         </Box>
//
//                         <Button
//                             variant="outlined"
//                             onClick={() => {
//                                 setIsScanning(prev => !prev);
//                                 setCameraError(null);
//                             }}
//                             startIcon={isScanning ? <CancelOutlinedIcon /> : <ScanIcon />}
//                             sx={{ mb: 3 }}
//                         >
//                             {isScanning ? 'Stop Camera' : 'Start Camera'}
//                         </Button>
//
//                         <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
//                             <InputIcon /> Manual Ticket Entry
//                         </Typography>
//                         <Divider sx={{ my: 2 }} />
//                         <form onSubmit={handleManualSubmit}>
//                             <TextField
//                                 label="Enter Ticket Code"
//                                 variant="outlined"
//                                 fullWidth
//                                 value={manualTicketCode}
//                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualTicketCode(e.target.value.toUpperCase())} // Type event
//                                 disabled={isProcessingScan}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton type="submit" disabled={isProcessingScan}>
//                                                 <SendIcon />
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </form>
//                     </Paper>
//                 </Grid>
//
//                 {/* Right Column: Validation Feedback & Counters */}
//                 <Grid item xs={12} md={5}>
//                     <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
//                         <Typography variant="h5" gutterBottom>Validation Feedback</Typography>
//                         <Divider sx={{ my: 2, width: '100%' }} />
//
//                         {isProcessingScan ? (
//                             <Box sx={{ textAlign: 'center', py: 4 }}>
//                                 <CircularProgress size={60} sx={{ mb: 2 }} />
//                                 <Typography variant="h6" color="text.secondary">Processing Scan...</Typography>
//                             </Box>
//                         ) : validationFeedback ? (
//                             <Box sx={{ textAlign: 'center', py: 2, color: feedbackColor }}>
//                                 {feedbackIcon}
//                                 <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
//                                     {validationFeedback.message}
//                                 </Typography>
//                                 {validationFeedback.status === 'success' && validationFeedback.details && (
//                                     <>
//                                         <Typography variant="body1" color="text.primary">
//                                             Attendee: {validationFeedback.details.attendeeName}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Ticket Type: {validationFeedback.details.ticketTypeName}
//                                             {validationFeedback.details.quantity > 1 && ` (x${validationFeedback.details.quantity})`}
//                                         </Typography>
//                                     </>
//                                 )}
//                                 {validationFeedback.status === 'error' && validationFeedback.type === 'already_scanned' && validationFeedback.details && (
//                                     <>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Scanned on: {new Date(validationFeedback.details.timestamp).toLocaleString()}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             By Staff: {validationFeedback.details.staff}
//                                         </Typography>
//                                         <Button
//                                             variant="outlined"
//                                             color="warning"
//                                             startIcon={<VisibilityIcon />}
//                                             sx={{ mt: 2 }}
//                                             onClick={() => handleOpenOverrideModal(scanResult || manualTicketCode)}
//                                         >
//                                             Override Check-in
//                                         </Button>
//                                     </>
//                                 )}
//                                 {validationFeedback.status === 'error' && validationFeedback.type === 'wrong_event' && validationFeedback.details && (
//                                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                                         This ticket is for the {validationFeedback.details.eventName}.
//                                     </Typography>
//                                 )}
//                                 {validationFeedback.status === 'error' && validationFeedback.type !== 'already_scanned' && (
//                                     <Button
//                                         variant="outlined"
//                                         color="warning"
//                                         startIcon={<VisibilityIcon />}
//                                         sx={{ mt: 2 }}
//                                         onClick={() => handleOpenOverrideModal(scanResult || manualTicketCode)}
//                                     >
//                                         Manual Override
//                                     </Button>
//                                 )}
//                             </Box>
//                         ) : (
//                             <Box sx={{ textAlign: 'center', py: 4 }}>
//                                 <ScanIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
//                                 <Typography variant="h6" color="text.secondary">Waiting for Scan...</Typography>
//                             </Box>
//                         )}
//
//                         <Divider sx={{ my: 3, width: '100%' }} />
//
//                         <Typography variant="h5" gutterBottom>Session Summary</Typography>
//                         <Grid container spacing={2} sx={{ width: '100%' }}>
//                             <Grid item xs={6}>
//                                 <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
//                                     <Typography variant="subtitle1">Valid Scans</Typography>
//                                     <Typography variant="h4">{validScanCount}</Typography>
//                                 </Paper>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
//                                     <Typography variant="subtitle1">Invalid Scans</Typography>
//                                     <Typography variant="h4">{invalidScanCount}</Typography>
//                                 </Paper>
//                             </Grid>
//                         </Grid>
//                     </Paper>
//                 </Grid>
//             </Grid>
//
//             {/* Override/Manual Check Dialog */}
//             <Dialog open={overrideModalOpen} onClose={handleCloseOverrideModal}>
//                 <DialogTitle>Manual Ticket Override</DialogTitle>
//                 <DialogContent dividers>
//                     <Typography gutterBottom>
//                         Proceed with caution. This action will manually check in the ticket
//                         regardless of its current status. An audit trail will be recorded.
//                     </Typography>
//                     <TextField
//                         label="Ticket Code to Override"
//                         variant="outlined"
//                         fullWidth
//                         margin="normal"
//                         value={overrideTicketCode}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOverrideTicketCode(e.target.value.toUpperCase())}
//                         disabled={isProcessingScan}
//                     />
//                     <TextField
//                         select
//                         label="Reason for Override"
//                         variant="outlined"
//                         fullWidth
//                         margin="normal"
//                         value={overrideReason}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOverrideReason(e.target.value)}
//                         disabled={isProcessingScan}
//                     >
//                         {overrideReasons.map((reason) => (
//                             <MenuItem key={reason} value={reason}>
//                                 {reason}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                     {overrideReason === 'Other' && (
//                         <TextField
//                             label="Specify Other Reason"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={otherOverrideReasonText}
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtherOverrideReasonText(e.target.value)}
//                             disabled={isProcessingScan}
//                         />
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseOverrideModal} disabled={isProcessingScan}>Cancel</Button>
//                     <Button
//                         onClick={handleOverrideConfirm}
//                         color="warning"
//                         variant="contained"
//                         disabled={isProcessingScan || !overrideTicketCode.trim() || !overrideReason.trim() || (overrideReason === 'Other' && !otherOverrideReasonText.trim())}
//                     >
//                         {isProcessingScan ? <CircularProgress size={24} /> : <VisibilityIcon sx={{ mr: 1 }} />}
//                         Confirm Override
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };