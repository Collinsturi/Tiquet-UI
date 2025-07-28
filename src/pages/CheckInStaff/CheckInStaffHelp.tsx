// import { useState } from 'react';
// import {
//     Box,
//     Typography,
//     Paper,
//     Grid,
//     Alert,
//     Link,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     TextField,
//     InputAdornment,
//     Button,
//     List,
//     ListItem,
//     ListItemText,
//     CircularProgress,
//     Divider
// } from '@mui/material';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import SearchIcon from '@mui/icons-material/Search';
// import ContactSupportIcon from '@mui/icons-material/ContactSupport';
// import CameraAltIcon from '@mui/icons-material/CameraAlt';
// import InputIcon from '@mui/icons-material/Input';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import PhoneIcon from '@mui/icons-material/Phone';
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EventNoteIcon from "@mui/icons-material/EventNote";
//
// export const CheckInStaffHelp = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [submittingFeedback, setSubmittingFeedback] = useState(false);
//     const [feedbackSuccess, setFeedbackSuccess] = useState(false);
//     const [feedbackError, setFeedbackError] = useState(false);
//
//     // Define your help topics
//     const helpTopics = [
//         {
//             id: 'scanning-basics',
//             icon: <CameraAltIcon />,
//             title: 'Scanning Basics: Using Your Camera',
//             content: `
//                 <p><strong>1. Position and Lighting:</strong> Hold the device steady, about 6-12 inches away from the QR/barcode. Ensure good, even lighting; avoid shadows or glare directly on the code.</p>
//                 <p><strong>2. Focus:</strong> The scanner will automatically try to focus. If it's struggling, try moving the device slightly closer then further away, or tap on the screen if your device supports it.</p>
//                 <p><strong>3. Entire Code:</strong> Ensure the entire QR/barcode is visible within the scanning area. Do not crop out any part of the code.</p>
//                 <p><strong>4. Speed:</strong> The scanner works quickly. Once a code is recognized, you'll hear feedback and see the validation result almost instantly. You don't need to hold it for long.</p>
//             `,
//         },
//         {
//             id: 'manual-entry',
//             icon: <InputIcon />,
//             title: 'Manual Ticket Code Entry',
//             content: `
//                 <p>If the scanner cannot read a ticket (e.g., damaged code, poor print quality, or camera issues), you can manually enter the ticket code.</p>
//                 <p><strong>1. Locate the Field:</strong> Find the "Manual Ticket Entry" field below the scanner area.</p>
//                 <p><strong>2. Enter Code:</strong> Type the full ticket code accurately into the field. Codes are usually alphanumeric and case-insensitive.</p>
//                 <p><strong>3. Submit:</strong> Tap the "Send" icon or press Enter on your keyboard to submit the code for validation.</p>
//                 <p><strong>4. Validation:</strong> The system will validate the manually entered code just as it would a scanned code, providing real-time feedback.</p>
//             `,
//         },
//         {
//             id: 'validation-feedback',
//             icon: <CheckCircleOutlineIcon />,
//             title: 'Understanding Validation Feedback',
//             content: `
//                 <p>After each scan or manual entry, you'll receive immediate feedback:</p>
//                 <ul>
//                     <li><strong><span style="color: green; font-weight: bold;">Valid Ticket (Green Checkmark):</span></strong> "Entry Granted!" - The ticket is valid, unused, and for the correct event. The attendee's name and ticket type will be displayed.</li>
//                     <li><strong><span style="color: red; font-weight: bold;">Ticket Already Used (Red X):</span></strong> "Ticket Already Scanned" - This ticket has already been used. The timestamp of the previous scan and the staff member who scanned it will be shown.</li>
//                     <li><strong><span style="color: red; font-weight: bold;">Invalid Ticket (Red X):</span></strong> "Invalid Ticket Code" / "Ticket Not Found" - The code entered does not match any valid ticket in the system. Double-check for typos if manually entered.</li>
//                     <li><strong><span style="color: red; font-weight: bold;">Ticket Not for This Event (Red X):</span></strong> "This ticket is not for {Event Name}" - The ticket code is valid, but it belongs to a different event.</li>
//                     <li><strong><span style="color: red; font-weight: bold;">Ticket Type Not Active/Valid (Red X):</span></strong> "Ticket Type Inactive/Expired" - The ticket type (e.g., "Early Bird") might be expired, or the specific ticket type is no longer valid for entry.</li>
//                 </ul>
//             `,
//         },
//         {
//             id: 'override-feature',
//             icon: <VisibilityIcon />,
//             title: 'Manual Override / Emergency Check-in',
//             content: `
//                 <p>The manual override feature should be used with extreme caution and only when absolutely necessary (e.g., valid ticket holder whose ticket is unreadable due to damage, or a system discrepancy verified by a supervisor).</p>
//                 <p><strong>How to Use:</strong></p>
//                 <ol>
//                     <li>If an invalid scan occurs (e.g., "Ticket Already Used" or "Invalid Ticket"), an "Override Check-in" button will appear.</li>
//                     <li>Tap this button to open the override dialog.</li>
//                     <li>Enter or confirm the ticket code.</li>
//                     <li><strong>Select a reason</strong> for the override from the dropdown. If "Other" is selected, provide specific details in the text field.</li>
//                     <li>Tap "Confirm Override". This action will force a check-in for the ticket.</li>
//                 </ol>
//                 <p><strong>Important:</strong> All override actions are logged with a timestamp, your staff ID, and the reason provided. This creates an audit trail for accountability.</p>
//             `,
//         },
//         {
//             id: 'troubleshooting',
//             icon: <TroubleshootIcon />,
//             title: 'Troubleshooting Common Issues',
//             content: `
//                 <p><strong>1. Camera Not Showing / Black Screen:</strong></p>
//                 <ul>
//                     <li>Ensure your browser has permission to access the camera. Check the address bar for a camera icon, or your browser's site settings.</li>
//                     <li>Make sure you are accessing the page over **HTTPS** (secure connection). Camera access often fails on unsecured HTTP connections.</li>
//                     <li>Close any other applications that might be using the camera.</li>
//                     <li>Restart your browser or device.</li>
//                     <li>If on a desktop, ensure your webcam is connected and enabled.</li>
//                 </ul>
//                 <p><strong>2. Scanner Not Reading Codes:</strong></p>
//                 <ul>
//                     <li>Check lighting conditions (too dark, too bright, glare).</li>
//                     <li>Ensure the code is flat and not wrinkled or creased.</li>
//                     <li>Adjust distance and angle. Try moving closer/further.</li>
//                     <li>Clean your device's camera lens.</li>
//                     <li>Try manual entry as an alternative.</li>
//                 </ul>
//                 <p><strong>3. App Slowness / Freezing:</strong></p>
//                 <ul>
//                     <li>Check your internet connection if the app relies on online validation.</li>
//                     <li>Close other tabs or applications running on your device.</li>
//                     <li>Clear your browser's cache (if troubleshooting persists).</li>
//                     <li>Refresh the page.</li>
//                 </ul>
//             `,
//         },
//         {
//             id: 'session-counters',
//             icon: <EventNoteIcon />,
//             title: 'Session Counters Explained',
//             content: `
//                 <p>On the right side of the scanning interface, you'll see "Session Summary":</p>
//                 <ul>
//                     <li><strong>Valid Scans:</strong> This counter increases every time a ticket is successfully scanned and granted entry (including manual overrides).</li>
//                     <li><strong>Invalid Scans:</strong> This counter increases for every ticket that fails validation (e.g., already used, not found, wrong event, inactive type).</li>
//                 </ul>
//                 <p>These counters help you track your individual performance during your current check-in session for the active event.</p>
//             `,
//         },
//     ];
//
//     const filteredTopics = helpTopics.filter(topic =>
//         topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         topic.content.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     const handleSubmitFeedback = async (event) => {
//         event.preventDefault();
//         setSubmittingFeedback(true);
//         setFeedbackSuccess(false);
//         setFeedbackError(false);
//
//         // Simulate API call to send feedback
//         try {
//             await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
//             console.log("Feedback submitted:", {
//                 name: event.target.name.value,
//                 email: event.target.email.value,
//                 message: event.target.message.value
//             });
//             setFeedbackSuccess(true);
//             event.target.reset(); // Clear the form
//         } catch (err) {
//             console.error("Error submitting feedback:", err);
//             setFeedbackError(true);
//         } finally {
//             setSubmittingFeedback(false);
//         }
//     };
//
//
//     return (
//         <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
//             <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
//                 <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
//                     <HelpOutlineIcon fontSize="large" /> Check-in Staff Help
//                 </Typography>
//                 <Typography variant="body1">
//                     Find answers to common questions and troubleshoot issues with the ticket scanning system.
//                 </Typography>
//             </Paper>
//
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                     <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
//                         <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                             <SearchIcon /> Search Help Topics
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             placeholder="Search by keyword (e.g., 'camera', 'override')"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{ mb: 3 }}
//                         />
//
//                         {filteredTopics.length === 0 && (
//                             <Alert severity="info">No topics found matching "{searchTerm}". Try a different keyword.</Alert>
//                         )}
//
//                         <List>
//                             {filteredTopics.map((topic) => (
//                                 <Accordion key={topic.id} elevation={1} sx={{ mb: 1, borderRadius: '8px !important' }}>
//                                     <AccordionSummary
//                                         expandIcon={<ExpandMoreIcon />}
//                                         aria-controls={`${topic.id}-content`}
//                                         id={`${topic.id}-header`}
//                                     >
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             {topic.icon}
//                                             <Typography variant="h6">{topic.title}</Typography>
//                                         </Box>
//                                     </AccordionSummary>
//                                     <AccordionDetails>
//                                         <Typography
//                                             variant="body1"
//                                             component="div" // Use div to render HTML safely
//                                             dangerouslySetInnerHTML={{ __html: topic.content }}
//                                         />
//                                     </AccordionDetails>
//                                 </Accordion>
//                             ))}
//                         </List>
//                     </Paper>
//                 </Grid>
//
//                 <Grid item xs={12} md={4}>
//                     <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
//                         <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                             <ContactSupportIcon /> Contact Support
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                             If you can't find an answer here, please reach out to our support team.
//                         </Typography>
//
//                         <List sx={{ mb: 3 }}>
//                             <ListItem disableGutters>
//                                 <MailOutlineIcon color="action" sx={{ mr: 1 }} />
//                                 <ListItemText primary="Email Support" secondary={<Link href="mailto:support@youreventapp.com">support@youreventapp.com</Link>} />
//                             </ListItem>
//                             <ListItem disableGutters>
//                                 <PhoneIcon color="action" sx={{ mr: 1 }} />
//                                 <ListItemText primary="Phone Support" secondary={<Link href="tel:+254712345678">+254 712 345 678</Link>} />
//                             </ListItem>
//                         </List>
//
//                         <Divider sx={{ mb: 3 }} />
//
//                         <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
//                             Send Us Feedback
//                         </Typography>
//                         <form onSubmit={handleSubmitFeedback}>
//                             <TextField
//                                 fullWidth
//                                 margin="normal"
//                                 label="Your Name (Optional)"
//                                 name="name"
//                                 variant="outlined"
//                                 size="small"
//                             />
//                             <TextField
//                                 fullWidth
//                                 margin="normal"
//                                 label="Your Email (Optional)"
//                                 name="email"
//                                 type="email"
//                                 variant="outlined"
//                                 size="small"
//                             />
//                             <TextField
//                                 fullWidth
//                                 margin="normal"
//                                 label="Your Message"
//                                 name="message"
//                                 multiline
//                                 rows={4}
//                                 variant="outlined"
//                                 required
//                                 size="small"
//                             />
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 color="primary"
//                                 fullWidth
//                                 sx={{ mt: 2 }}
//                                 disabled={submittingFeedback}
//                                 startIcon={submittingFeedback ? <CircularProgress size={20} color="inherit" /> : null}
//                             >
//                                 {submittingFeedback ? 'Sending...' : 'Send Feedback'}
//                             </Button>
//                         </form>
//
//                         {feedbackSuccess && (
//                             <Alert severity="success" sx={{ mt: 2 }}>
//                                 Thank you for your feedback! We'll review it shortly.
//                             </Alert>
//                         )}
//                         {feedbackError && (
//                             <Alert severity="error" sx={{ mt: 2 }}>
//                                 Failed to send feedback. Please try again later.
//                             </Alert>
//                         )}
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };
