// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Box,
//     Typography,
//     Paper,
//     Grid,
//     CircularProgress,
//     Alert,
//     Button,
//     Card,
//     CardContent,
//     Divider,
//     Chip
// } from '@mui/material';
// import EventIcon from '@mui/icons-material/Event';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import BarcodeScannerIcon from '@mui/icons-material/QrCodeScanner';
// import { useSelector } from "react-redux";
// import type { RootState } from "../../redux/store.ts";
// import { useGetStaffAssignedEventsQuery, useGetStaffScannedEventsQuery } from "../../queries/checkInStaff/StaffScannedQuery.ts";
//
// // --- Type Definitions ---
//
// // Type for individual assigned event data from RTK Query
// interface AssignedEvent {
//     eventId: string;
//     title: string;
//     startDate: string;
//     endDate: string;
//     location: string;
//     ticketsSold: number; // Total tickets sold for the event
//     ticketsRemaining: number; // Remaining tickets for the event
// }
//
// // Type for individual scanned event data from RTK Query
// // interface ScannedEvent {
// //     eventId: string;
// //     ticketScanned: number; // Total tickets scanned for this event by ALL staff
// //     // If 'scannedByThisStaff' is needed, the API would need to provide it.
// //     // Assuming it's not directly available from this query for now.
// // }
//
// // Type for the combined and processed event summary displayed in the dashboard
// interface ProcessedEventSummary {
//     eventId: string;
//     name: string;
//     totalExpectedAttendees: number;
//     totalScannedForEvent: number;
//     ticketsRemaining: number;
//     // scannedByThisStaff: number; // Removed as it's not provided by current API structure
//     date: string; // Event's start date
//     status: 'Upcoming' | 'Active' | 'Completed'; // Strict literal types for status
// }
//
// // Type for event status helper function return
// interface EventStatus {
//     label: 'Upcoming' | 'Active' | 'Completed';
//     color: 'info' | 'success' | 'default';
//     icon: JSX.Element;
// }
//
// // --- Helper Functions ---
// const formatDateRange = (startDate: string, endDate?: string): string => {
//     const start = new Date(startDate);
//     if (isNaN(start.getTime())) return 'Invalid Date';
//
//     const optionsDate: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
//     const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
//
//     const formattedStartDate = start.toLocaleDateString(undefined, optionsDate);
//     const formattedStartTime = start.toLocaleTimeString(undefined, optionsTime);
//
//     // If no endDate is provided, assume it's a single-day event or just show start
//     if (!endDate) {
//         return `${formattedStartDate} ${formattedStartTime}`;
//     }
//
//     const end = new Date(endDate);
//     if (isNaN(end.getTime())) {
//         return `${formattedStartDate} ${formattedStartTime}`; // Fallback if endDate is invalid
//     }
//
//     const formattedEndDate = end.toLocaleDateString(undefined, optionsDate);
//     const formattedEndTime = end.toLocaleTimeString(undefined, optionsTime);
//
//     if (start.toDateString() === end.toDateString()) {
//         return `${formattedStartDate} from ${formattedStartTime} to ${formattedEndTime}`;
//     }
//     return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`;
// };
//
// const getEventStatus = (event: AssignedEvent): EventStatus => {
//     const now = new Date();
//     const start = new Date(event.startDate);
//     const end = new Date(event.endDate);
//
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return { label: 'Upcoming', color: 'info', icon: <HourglassEmptyIcon fontSize="small" /> }; // Default for invalid dates
//     }
//
//     if (now < start) {
//         return { label: 'Upcoming', color: 'info', icon: <HourglassEmptyIcon fontSize="small" /> };
//     } else if (now >= start && now <= end) {
//         return { label: 'Active', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> };
//     } else {
//         return { label: 'Completed', color: 'default', icon: <EventIcon fontSize="small" /> };
//     }
// };
//
// export const CheckInStaffDashboard = () => {
//     const navigate = useNavigate();
//
//     // Get user email from Redux root state
//     const userEmail = useSelector((state: RootState) => state.user.user?.email);
//
//     // Fetch assigned events using RTK Query
//     const {
//         data: assignedEventsData,
//         isLoading: isLoadingAssignedEvents,
//         isError: isErrorAssignedEvents,
//         error: errorAssignedEvents
//     } = useGetStaffAssignedEventsQuery(userEmail || '', { // Provide empty string as fallback for query
//         skip: !userEmail, // Skip the query if userEmail is not available
//     });
//
//     // Fetch scanned events using RTK Query
//     const {
//         data: scannedEventsData,
//         isLoading: isLoadingScannedEvents,
//         isError: isErrorScannedEvents,
//         error: errorScannedEvents
//     } = useGetStaffScannedEventsQuery(userEmail || '', { // Provide empty string as fallback for query
//         skip: !userEmail, // Skip the query if userEmail is not available
//     });
//
//     // State for managing selected event and its summary
//     const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
//     const [currentEventSummary, setCurrentEventSummary] = useState<ProcessedEventSummary | null>(null);
//
//     // Combine loading and error states
//     const isLoading = isLoadingAssignedEvents || isLoadingScannedEvents;
//     // Combine errors from both queries
//     const error = isErrorAssignedEvents ? errorAssignedEvents : isErrorScannedEvents ? errorScannedEvents : null;
//
//     // Effect to set initial selected event and update assigned events list
//     useEffect(() => {
//         if (assignedEventsData && assignedEventsData.length > 0) {
//             const now = new Date();
//             const activeOrUpcomingEvent = assignedEventsData.find(event => {
//                 const endDate = new Date(event.endDate);
//                 return now < endDate; // Event is not yet over
//             });
//
//             if (activeOrUpcomingEvent) {
//                 setSelectedEventId(activeOrUpcomingEvent.eventId);
//             } else {
//                 setSelectedEventId(assignedEventsData[0].eventId); // Fallback to first event
//             }
//         } else if (assignedEventsData && assignedEventsData.length === 0) {
//             setSelectedEventId(null); // No events assigned
//         }
//     }, [assignedEventsData]); // Re-run when assignedEventsData changes
//
//     // Effect to load current event summary based on selected event and fetched data
//     useEffect(() => {
//         if (selectedEventId && assignedEventsData && scannedEventsData) {
//             const selectedEvent = assignedEventsData.find(event => event.eventId === selectedEventId);
//             const scannedDataForSelectedEvent = scannedEventsData.find(scanned => scanned.eventId === selectedEventId);
//
//             if (selectedEvent) {
//                 setCurrentEventSummary({
//                     eventId: selectedEvent.eventId, // Ensure eventId is included
//                     name: selectedEvent.title,
//                     totalExpectedAttendees: selectedEvent.ticketsSold,
//                     totalScannedForEvent: scannedDataForSelectedEvent?.ticketScanned || 0,
//                     ticketsRemaining: selectedEvent.ticketsRemaining,
//                     date: selectedEvent.startDate,
//                     status: getEventStatus(selectedEvent).label, // Use the label from getEventStatus
//                 });
//             } else {
//                 setCurrentEventSummary(null);
//             }
//         } else {
//             setCurrentEventSummary(null); // Clear summary if no event is selected or data not ready
//         }
//     }, [selectedEventId, assignedEventsData, scannedEventsData]); // Re-run when dependencies change
//
//     const handleStartScanning = (eventId: string) => { // Type eventId
//         navigate(`/staff/checkin/${eventId}`);
//     };
//
//     const handleEventSelection = (eventId: string) => { // Type eventId
//         setSelectedEventId(eventId);
//     };
//
//     const sortedAssignedEvents = assignedEventsData ? [...assignedEventsData].sort((a, b) => {
//         const statusA = getEventStatus(a).label;
//         const statusB = getEventStatus(b).label;
//
//         // Prioritize Active > Upcoming > Completed
//         const order = { 'Active': 1, 'Upcoming': 2, 'Completed': 3 };
//         // Use non-null assertion or default value if order[statusA] could be undefined
//         if (order[statusA] !== order[statusB]) {
//             return (order[statusA] || 0) - (order[statusB] || 0);
//         }
//         // For same status, sort by date
//         return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
//     }) : [];
//
//     if (isLoading && !assignedEventsData) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//                 <CircularProgress />
//                 <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
//             </Box>
//         );
//     }
//
//     return (
//         <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
//             <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
//                 <EventIcon fontSize="large" /> Staff Dashboard
//             </Typography>
//             <Divider sx={{ mb: 3 }} />
//
//             {error && (
//                 <Alert severity="error" sx={{ mb: 3 }}>
//                     Failed to load data: {(error as any)?.message || 'Unknown error'}
//                 </Alert>
//             )}
//
//             <Grid container spacing={3}>
//                 {/* Left Column: Assigned Events Overview */}
//                 <Grid item xs={12} md={5}>
//                     <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
//                         <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <EventIcon /> Assigned Events
//                         </Typography>
//                         <Divider sx={{ mb: 2 }} />
//                         {sortedAssignedEvents.length === 0 ? (
//                             <Alert severity="info">No events assigned to you yet.</Alert>
//                         ) : (
//                             <Box>
//                                 {sortedAssignedEvents.map(event => {
//                                     const status = getEventStatus(event);
//                                     const isSelected = selectedEventId === event.eventId;
//                                     return (
//                                         <Card
//                                             key={event.eventId}
//                                             variant="outlined"
//                                             sx={{
//                                                 mb: 2,
//                                                 borderColor: isSelected ? 'primary.main' : 'divider',
//                                                 borderWidth: isSelected ? 2 : 1,
//                                                 cursor: 'pointer',
//                                                 '&:hover': {
//                                                     boxShadow: 3,
//                                                 }
//                                             }}
//                                             onClick={() => handleEventSelection(event.eventId)}
//                                         >
//                                             <CardContent>
//                                                 <Typography variant="h6" component="div">{event.title}</Typography>
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {event.location}
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                                                     <ConfirmationNumberIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {formatDateRange(event.startDate, event.endDate)}
//                                                 </Typography>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                                     <Chip label={status.label} color={status.color} size="small" icon={status.icon} />
//                                                     {status.label === 'Active' && (
//                                                         <Button
//                                                             variant="contained"
//                                                             size="small"
//                                                             startIcon={<BarcodeScannerIcon />}
//                                                             onClick={(e) => { e.stopPropagation(); handleStartScanning(event.eventId); }}
//                                                         >
//                                                             Start Scanning
//                                                         </Button>
//                                                     )}
//                                                     {status.label === 'Upcoming' && (
//                                                         <Button
//                                                             variant="outlined"
//                                                             size="small"
//                                                             startIcon={<BarcodeScannerIcon />}
//                                                             disabled // Disable scanning for upcoming events
//                                                         >
//                                                             Scan (Starts {formatDateRange(event.startDate).split(' ')[0]})
//                                                         </Button>
//                                                     )}
//                                                     {status.label === 'Completed' && (
//                                                         <Button
//                                                             variant="text"
//                                                             size="small"
//                                                             disabled
//                                                         >
//                                                             Event Completed
//                                                         </Button>
//                                                     )}
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     );
//                                 })}
//                             </Box>
//                         )}
//                     </Paper>
//                 </Grid>
//
//                 {/* Right Column: Current Event Summary */}
//                 <Grid item xs={12} md={7}>
//                     <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
//                         <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <ConfirmationNumberIcon /> Current Event Summary
//                         </Typography>
//                         <Divider sx={{ mb: 2 }} />
//                         {isLoading && selectedEventId && !currentEventSummary ? (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
//                                 <CircularProgress />
//                                 <Typography sx={{ ml: 2 }}>Loading summary...</Typography>
//                             </Box>
//                         ) : selectedEventId && currentEventSummary ? (
//                             <>
//                                 <Typography variant="h6" component="div" sx={{ mb: 1 }}>
//                                     {currentEventSummary.name}
//                                 </Typography>
//                                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                                     <Grid item xs={12} sm={6}>
//                                         <Card variant="outlined">
//                                             <CardContent>
//                                                 <Typography variant="subtitle1" color="text.secondary">Total Expected Attendees:</Typography>
//                                                 <Typography variant="h5" color="primary.main">
//                                                     {currentEventSummary.totalExpectedAttendees}
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <Card variant="outlined">
//                                             <CardContent>
//                                                 <Typography variant="subtitle1" color="text.secondary">Total Tickets Scanned:</Typography>
//                                                 <Typography variant="h5" color="success.main">
//                                                     {currentEventSummary.totalScannedForEvent}
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <Card variant="outlined">
//                                             <CardContent>
//                                                 <Typography variant="subtitle1" color="text.secondary">Tickets Remaining:</Typography>
//                                                 <Typography variant="h5" color="warning.main">
//                                                     {currentEventSummary.ticketsRemaining}
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                 </Grid>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     startIcon={<BarcodeScannerIcon />}
//                                     fullWidth
//                                     sx={{ mt: 'auto' }}
//                                     onClick={() => handleStartScanning(selectedEventId)}
//                                     disabled={getEventStatus(assignedEventsData?.find(e => e.eventId === selectedEventId) as AssignedEvent).label !== 'Active'}
//                                 >
//                                     Continue Scanning for {currentEventSummary.name}
//                                 </Button>
//                             </>
//                         ) : (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexDirection: 'column' }}>
//                                 <HourglassEmptyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
//                                 <Typography variant="h6" color="text.secondary" align="center">
//                                     Select an event from the left to view its summary.
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" align="center">
//                                     Or, if no events are assigned, contact your administrator.
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };