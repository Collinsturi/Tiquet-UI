import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Button,
    Chip,
} from '@mui/material'; // Added Box, Typography, Paper, Grid, CircularProgress, Alert, Button, Chip for MUI components
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import { QRCodeCanvas } from 'qrcode.react';
import PersonIcon from '@mui/icons-material/Person';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useSelector } from 'react-redux'; // Import useSelector
import type { RootState } from '../../redux/store'; // Import RootState type
import { useGetTicketByIdQuery } from '../../queries/eventAttendees/TicketQuery.ts'; // Import the RTK Query hook

// For PDF generation
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// Helper to generate a placeholder QR code image URL
const generateQRCodePlaceholderUrl = (data) => {
    const size = 150; // Size of the QR code image
    const color = '000000'; // Black text
    const bgColor = 'FFFFFF'; // White background
    return `https://placehold.co/${size}x${size}/${bgColor}/${color}?text=QR+Code%0A${encodeURIComponent(data.substring(0, 30))}...`;
};

// Helper function to format dates
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    };
    return date.toLocaleString(undefined, options);
};

export const TicketDetails = () => {
    const { ticketId } = useParams(); // Get ticketId from URL
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user); // Get current logged-in user from Redux

    // Use the RTK Query hook to fetch ticket details
    const { data: ticketData, isLoading, error } = useGetTicketByIdQuery(parseInt(ticketId!), {
        skip: !ticketId || isNaN(parseInt(ticketId!)), // Skip if ticketId is missing or not a number
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const ticketRef = useRef(null); // Ref for the ticket content to be downloaded

    // Effect to handle API response and set messages
    useEffect(() => {
        if (error) {
            const apiErrorMessage = (error as any)?.data?.message || `Failed to load ticket details for ID: ${ticketId}. Please try again.`;
            setMessage({ type: 'error', text: apiErrorMessage });
        } else if (ticketData && Object.keys(ticketData).length === 0) {
            // Handle case where data is empty object (e.g., API returns {} for not found)
            setMessage({ type: 'error', text: `Ticket with ID "${ticketId}" not found.` });
        } else {
            setMessage({ type: '', text: '' }); // Clear messages on successful load
        }
    }, [ticketData, error, ticketId]);

    const handleDownloadPdf = async () => {
        if (!ticketRef.current) {
            setMessage({ type: 'error', text: 'Ticket content not ready for download.' });
            return;
        }

        setMessage({ type: 'info', text: 'Generating PDF...' });
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
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

            pdf.save(`${ticketData.event.title.replace(/\s/g, '_')}-${ticketData.ticket.id}-ticket.pdf`);
            setMessage({ type: 'success', text: 'Ticket downloaded successfully as PDF!' });

        } catch (downloadError) {
            console.error("Error generating PDF:", downloadError);
            setMessage({ type: 'error', text: `Failed to generate PDF: ${downloadError.message || 'An unexpected error occurred.'}` });
        }
    };

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading ticket details...</Typography>
            </Box>
        );
    }

    // If there's an error or no ticket data is found after loading
    if (error || !ticketData || Object.keys(ticketData).length === 0) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message.text || "Could not load ticket details. Please ensure the ticket ID is valid."}
                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/attendee/tickets')}>Back to My Tickets</Button>
                </Alert>
            </Box>
        );
    }

    // Destructure data for easier access
    const { ticket, event, ticketType, venue } = ticketData;

    // Determine check-in status and styling
    const checkInStatus = ticket.isScanned ? 'Checked In' : 'Pending Check-in';
    let statusColorClass = '';
    let statusIcon = null;
    switch (checkInStatus) {
        case 'Checked In':
            statusColorClass = 'badge-success';
            statusIcon = <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />;
            break;
        case 'Pending Check-in':
            statusColorClass = 'badge-info';
            statusIcon = <HourglassEmptyIcon className="w-4 h-4 mr-1" />;
            break;
        default: // For any other unexpected status
            statusColorClass = 'badge-error';
            statusIcon = <CancelOutlinedIcon className="w-4 h-4 mr-1" />;
            break;
    }

    // Combine event date and time for display
    const eventStartDateTime = `${event.eventDate}T${event.eventTime}`;
    // Assuming event has an end date/time, or use start for simplicity if not provided
    const eventEndDateTime = event.endDate && event.endTime ? `${event.endDate}T${event.endTime}` : eventStartDateTime;


    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <ConfirmationNumberIcon className="text-4xl" /> My Ticket
            </h1>
            <hr className="my-6 border-base-content/10" />

            {message.text && (
                <div role="alert" className={`alert ${message.type === 'success' ? 'alert-success' : (message.type === 'info' ? 'alert-info' : 'alert-error')} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex justify-center mb-6">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleDownloadPdf}
                    disabled={isLoading} // Disable if still loading
                >
                    {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : <DownloadIcon className="w-6 h-6 mr-2" />}
                    Download Ticket (PDF)
                </button>
            </div>

            {/* Ticket Content to be rendered in PDF */}
            <div ref={ticketRef} className="card bg-base-100 shadow-xl p-6 max-w-2xl mx-auto border border-primary/20">
                <div className="flex flex-col items-center mb-6">
                    <QrCode2Icon className="w-24 h-24 text-primary mb-4" />
                    <div className="mb-4 border border-base-300 rounded-lg p-2 bg-white">
                        <QRCodeCanvas
                            value={ticket.uniqueCode || 'Invalid'}
                            size={200}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">
                        {event.title}
                    </h2>
                    <div className={`badge ${statusColorClass} text-sm p-3 gap-1`}>
                        {statusIcon}
                        Status: {checkInStatus}
                    </div>
                </div>

                <hr className="my-6 border-base-content/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content/80">
                    <div>
                        <p className="font-semibold text-lg mb-2 flex items-center gap-2"><EventIcon className="w-5 h-5" /> Event Details</p>
                        <p><strong>Name:</strong> {event.title}</p>
                        <p><strong>Dates:</strong> {formatDateTime(eventStartDateTime)} - {formatDateTime(eventEndDateTime)}</p>
                        <p><strong>Location:</strong> {venue.name || 'Venue Not Specified'}</p> {/* Using VenueId as location */}
                    </div>
                    <div>
                        <p className="font-semibold text-lg mb-2 flex items-center gap-2"><ConfirmationNumberIcon className="w-5 h-5" /> Ticket Info</p>
                        {/*<p><strong>Ticket ID:</strong> {ticket.id}</p>*/}
                        <p><strong>Type:</strong> {ticketType?.typeName || 'N/A'}</p>
                        <p><strong>Quantity:</strong> {ticket.quantity || 1}</p> {/* Default to 1 if quantity is not provided */}
                        <p><strong>Purchased On:</strong> {formatDateTime(ticket.purchaseDate || event.createdAt)}</p> {/* Use purchaseDate or event createdAt */}
                    </div>
                </div>

                <hr className="my-6 border-base-content/10" />

                <div className="text-center text-base-content/70 text-sm">
                    <p className="font-semibold mb-2 flex items-center justify-center gap-2"><PersonIcon className="w-5 h-5" /> Attendee Details</p>
                    {/* Assuming the logged-in user is the attendee for this ticket */}
                    <p><strong>Name:</strong> {user?.first_name} {user?.last_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                    <p className="mt-4">Please present this QR code at the event entrance for quick check-in.</p>
                </div>
            </div>
        </div>
    );
};
