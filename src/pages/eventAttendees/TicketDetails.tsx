import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import { QRCodeCanvas } from 'qrcode.react';
import PersonIcon from '@mui/icons-material/Person';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useGetTicketByIdQuery } from '../../queries/eventAttendees/TicketQuery.ts';

// For PDF generation
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// --- Type Definitions ---

// Define the structure of the Ticket object within the API response
// interface Ticket {
//     id: number; // Changed to number based on error
//     orderItemId: number;
//     userId: number;
//     eventId: number;
//     ticketTypeId: number;
//     uniqueCode: string;
//     isScanned: boolean;
//     scannedAt: string | null;
//     scannedByUser: number | null;
//     purchaseDate?: string; // Assuming this might be optional or comes from the API
// }

// Define the structure of the Event object within the API response
// interface EventDetails {
//     id: number; // Changed to number based on error
//     title: string;
//     Description: string; // Added based on error
//     VenueId: number; // Added based on error
//     Category: string; // Added based on error
//     eventDate: string;
//     eventTime: string;
//     endDate?: string; // Optional end date
//     endTime?: string; // Optional end time
//     createdAt: string; // Added based on error
//     updatedAt: string; // Added based on error
// }

// Define the structure of the TicketType object within the API response
// interface TicketType {
//     typeName: string;
//     id: number; // Assuming id is a number based on previous fixes
// }

// Define the structure of the Venue object within the API response
// interface Venue {
//     id: number; // Assuming id is a number
//     name: string;
//     addresses: string; // Corrected from 'address' to 'addresses' based on error
//     capacity: number; // Added based on error
//     createdAt: string; // Added based on error
//     updateAt: string; // Added based on error
// }

// Define the overall structure of the data returned by useGetTicketByIdQuery
// interface TicketDataResponse {
//     ticket: Ticket;
//     event: EventDetails;
//     ticketType: TicketType;
//     venue: Venue;
// }

// Helper function to format dates
const formatDateTime = (dateString: string): string => { // Explicitly type dateString
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    };
    return date.toLocaleString(undefined, options);
};

export const TicketDetails = () => {
    // Type useParams to expect a ticketId string
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    // Type useSelector to get the user object from RootState
    const user = useSelector((state: RootState) => state.user.user);

    // Use the RTK Query hook, explicitly typing the data it returns
    const { data: ticketData, isLoading, error } = useGetTicketByIdQuery(parseInt(ticketId!), {
        // Ensure ticketId is a valid number before making the query
        skip: !ticketId || isNaN(parseInt(ticketId)),
    });

    const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });
    // Type useRef to hold an HTMLDivElement
    const ticketRef = useRef<HTMLDivElement>(null);

    // Effect to handle API response and set messages
    useEffect(() => {
        if (error) {
            // Type assertion for the error object from RTK Query
            const apiErrorMessage = (error as any)?.data?.message || `Failed to load ticket details for ID: ${ticketId}. Please try again.`;
            setMessage({ type: 'error', text: apiErrorMessage });
        } else if (ticketData && Object.keys(ticketData).length === 0) {
            setMessage({ type: 'error', text: `Ticket with ID "${ticketId}" not found.` });
        } else {
            setMessage({ type: '', text: '' }); // Clear messages on successful load
        }
    }, [ticketData, error, ticketId]); // Add ticketId to dependencies

    const handleDownloadPdf = async () => {
        if (!ticketRef.current) {
            setMessage({ type: 'error', text: 'Ticket content not ready for download.' });
            return;
        }

        // Ensure ticketData is available before proceeding
        if (!ticketData) {
            setMessage({ type: 'error', text: 'Ticket data not loaded yet. Please wait.' });
            return;
        }

        setMessage({ type: 'info', text: 'Generating PDF...' });
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Safely access event title and ticket ID
            const eventTitle = ticketData.event?.title?.replace(/\s/g, '_') || 'ticket';
            const ticketIdForFilename = ticketData.ticket?.id || 'unknown';
            pdf.save(`${eventTitle}-${ticketIdForFilename}-ticket.pdf`);
            setMessage({ type: 'success', text: 'Ticket downloaded successfully as PDF!' });

        } catch (downloadError: any) { // Type downloadError
            console.error("Error generating PDF:", downloadError);
            setMessage({ type: 'error', text: `Failed to generate PDF: ${downloadError.message || 'An unexpected error occurred.'}` });
        }
    };

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-my-base-200)' }}>
                <CircularProgress sx={{ color: 'var(--color-my-primary)' }} />
                <Typography sx={{ ml: 2, color: 'var(--color-my-base-content)' }}>Loading ticket details...</Typography>
            </Box>
        );
    }

    // If there's an error or no ticket data is found after loading
    if (error || !ticketData || Object.keys(ticketData).length === 0) {
        return (
            <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', backgroundColor: 'var(--color-my-base-200)' }}>
                <Alert severity="error" sx={{ mb: 2, backgroundColor: 'var(--color-my-error)', color: 'var(--color-my-error-content)' }}>
                    {message.text || "Could not load ticket details. Please ensure the ticket ID is valid."}
                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: 'var(--color-my-primary)', color: 'var(--color-my-primary-content)', '&:hover': { backgroundColor: 'var(--color-my-primary-focus)' } }} onClick={() => navigate('/attendee/tickets')}>Back to My Tickets</Button>
                </Alert>
            </Box>
        );
    }

    // Destructure data for easier access, now with type safety
    const { ticket, event, ticketType, venue } = ticketData;

    // Determine check-in status and styling
    const checkInStatus = ticket.isScanned ? 'Checked In' : 'Pending Check-in';
    let statusColorClass = '';
    let statusIcon: React.ReactElement | null = null;
    switch (checkInStatus) {
        case 'Checked In':
            statusColorClass = 'bg-[var(--color-my-success)] text-[var(--color-my-success-content)]';
            statusIcon = <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />;
            break;
        case 'Pending Check-in':
            statusColorClass = 'bg-[var(--color-my-info)] text-[var(--color-my-info-content)]';
            statusIcon = <HourglassEmptyIcon className="w-4 h-4 mr-1" />;
            break;
        default: // For any other unexpected status
            statusColorClass = 'bg-[var(--color-my-error)] text-[var(--color-my-error-content)]';
            statusIcon = <CancelOutlinedIcon className="w-4 h-4 mr-1" />;
            break;
    }

    // Combine event date and time for display
    const eventStartDateTime = `${event.eventDate}T${event.eventTime}`;

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[var(--color-my-primary)]">
                <ConfirmationNumberIcon className="text-4xl text-[var(--color-my-primary)]" /> My Ticket
            </h1>
            <hr className="my-6 border-[var(--color-my-base-300)]" />

            {message.text && (
                <div role="alert" className={`alert ${message.type === 'success' ? 'bg-[var(--color-my-success)] text-[var(--color-my-success-content)]' : (message.type === 'info' ? 'bg-[var(--color-my-info)] text-[var(--color-my-info-content)]' : 'bg-[var(--color-my-error)] text-[var(--color-my-error-content)]')} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex justify-center mb-6">
                <button
                    className="btn btn-lg bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                    onClick={handleDownloadPdf}
                    disabled={isLoading} // Disable if still loading
                >
                    {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : <DownloadIcon className="w-6 h-6 mr-2" />}
                    Download Ticket (PDF)
                </button>
            </div>

            {/* Ticket Content to be rendered in PDF */}
            <div ref={ticketRef} className="relative bg-[var(--color-my-base-100)] shadow-2xl rounded-lg overflow-hidden max-w-2xl mx-auto border-2 border-[var(--color-my-primary)]">
                {/* Top decorative border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-my-primary)]"></div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <Typography variant="h4" component="h2" className="font-extrabold text-[var(--color-my-primary)]">
                                {event.title}
                            </Typography>
                            <Typography variant="subtitle1" className="text-[var(--color-my-base-content)]/80">
                                {ticketType?.typeName || 'General Admission'} Ticket
                            </Typography>
                        </div>
                        <div className={`badge ${statusColorClass} text-sm p-3 gap-1`}>
                            {statusIcon}
                            Status: {checkInStatus}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--color-my-base-content)]">
                        <div>
                            <Typography variant="h6" className="font-semibold mb-2 flex items-center gap-2 text-[var(--color-my-secondary)]">
                                <EventIcon className="w-5 h-5" /> Event Details
                            </Typography>
                            <Typography variant="body1"><strong>Date:</strong> {formatDateTime(eventStartDateTime)}</Typography>
                            <Typography variant="body1"><strong>Time:</strong> {new Date(eventStartDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {venue.name || 'Venue Not Specified'}</Typography>
                            <Typography variant="body1"><strong>Address:</strong> {venue.addresses || 'N/A'}</Typography> {/* Corrected to venue.addresses */}
                        </div>
                        <div>
                            <Typography variant="h6" className="font-semibold mb-2 flex items-center gap-2 text-[var(--color-my-secondary)]">
                                <PersonIcon className="w-5 h-5" /> Attendee Details
                            </Typography>
                            <Typography variant="body1"><strong>Name:</strong> {user?.first_name} {user?.last_name || 'N/A'}</Typography>
                            {/*<Typography variant="body1"><strong>Email:</strong> {user?.email || 'N/A'}</Typography>*/}
                            {/*<Typography variant="body1"><strong>Ticket ID:</strong> {ticket.id}</Typography>*/}
                        </div>
                    </div>
                </div>

                {/* Perforation line */}
                <div className="relative my-4">
                    <div className="border-t-2 border-dashed border-[var(--color-my-base-300)] w-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--color-my-base-200)] -ml-2 border-2 border-[var(--color-my-primary)]"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--color-my-base-200)] -mr-2 border-2 border-[var(--color-my-primary)]"></div>
                </div>

                {/* Ticket Stub Section (QR Code) */}
                <div className="p-6 pt-2 flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="text-center">
                        <Typography variant="h6" className="font-semibold mb-2 flex items-center justify-center gap-2 text-[var(--color-my-secondary)]">
                            <QrCode2Icon className="w-6 h-6" /> Scan for Entry
                        </Typography>
                        <div className="bg-white p-2 rounded-lg shadow-md border border-[var(--color-my-base-300)]">
                            <QRCodeCanvas
                                value={ticket.uniqueCode || 'Invalid'}
                                size={150}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                        <Typography variant="caption" className="text-[var(--color-my-base-content)]/70 mt-2 block">
                            Unique Code: {ticket.uniqueCode}
                        </Typography>
                    </div>
                    <div className="text-center md:text-left">
                        <Typography variant="body2" className="text-[var(--color-my-base-content)]/80 max-w-xs">
                            Please present this QR code at the event entrance for quick check-in.
                            Enjoy the event!
                        </Typography>
                        <Typography variant="body2" className="text-[var(--color-my-base-content)]/70 mt-2">
                            Purchased On: {formatDateTime(ticket.purchaseDate || event.createdAt)}
                        </Typography>
                    </div>
                </div>

                {/* Bottom decorative border */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[var(--color-my-primary)]"></div>
            </div>
        </div>
    );
};
