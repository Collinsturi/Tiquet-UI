import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// For PDF generation
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// --- Dummy Data Simulation ---
const dummyUsers = [
    { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com' },
];

const dummyEvents = [
    {
        event_id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi, Kenya',
    },
    {
        event_id: 'evt-003',
        name: 'Summer Music Fest 2024', // Past event
        startDate: '2024-07-20T12:00:00Z',
        endDate: '2024-07-21T22:00:00Z',
        location: 'City Park, Nairobi, Kenya',
    },
];

const dummyTickets = [
    {
        ticket_id: 'tkt-001-A',
        user_id: 'user-001',
        event_id: 'evt-001',
        ticketTypeName: 'Standard Pass',
        quantity: 1,
        purchaseDate: '2025-01-15T10:00:00Z',
        checkInStatus: 'Pending', // 'Pending', 'Checked In', 'Invalid'
        qrCodeData: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TicketID:tkt-001-A%0AEvent:evt-001%0AUser:user-001%0AType:Standard',
    },
    {
        ticket_id: 'tkt-001-B',
        user_id: 'user-001',
        event_id: 'evt-001',
        ticketTypeName: 'VIP Pass',
        quantity: 1,
        purchaseDate: '2025-01-15T10:05:00Z',
        checkInStatus: 'Pending',
        qrCodeData: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TicketID:tkt-001-B%0AEvent:evt-001%0AUser:user-001%0AType:VIP',
    },
    {
        ticket_id: 'tkt-002-A',
        user_id: 'user-001',
        event_id: 'evt-003', // Past event
        ticketTypeName: 'General Admission',
        quantity: 2, // Example of a ticket representing multiple entries
        purchaseDate: '2024-06-01T11:00:00Z',
        checkInStatus: 'Checked In',
        qrCodeData: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TicketID:tkt-002-A%0AEvent:evt-003%0AUser:user-001%0AType:General%0AQty:2',
    },
];

// Simulate fetching data - FIXED TO RESOLVE PROMISES
const fetchTicketDetails = async (ticketId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyTickets.find(t => t.ticket_id === ticketId));
        }, 500);
    });
};

const fetchEventDetails = async (eventId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyEvents.find(e => e.event_id === eventId));
        }, 300);
    });
};

const fetchUserDetails = async (userId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dummyUsers.find(u => u.user_id === userId));
        }, 200);
    });
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

    const [ticket, setTicket] = useState(null);
    const [event, setEvent] = useState(null);
    const [attendee, setAttendee] = useState(null); // The user who owns the ticket
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const ticketRef = useRef(null); // Ref for the ticket content to be downloaded

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true); // Ensure loading is true at the start of the fetch
                setMessage({ type: '', text: '' });

                const fetchedTicket = await fetchTicketDetails(ticketId);
                if (!fetchedTicket) {
                    setMessage({ type: 'error', text: `Ticket with ID "${ticketId}" not found.` });
                    setLoading(false); // Stop loading if ticket not found
                    return; // Exit if ticket isn't found
                }
                setTicket(fetchedTicket);

                const fetchedEvent = await fetchEventDetails(fetchedTicket.event_id);
                // Handle case where event might not be found gracefully
                if (!fetchedEvent) {
                    setMessage({ type: 'warning', text: `Event details for ticket ID "${ticketId}" could not be loaded.` });
                    setEvent(null); // Keep event as null or set a placeholder
                } else {
                    setEvent(fetchedEvent);
                }

                const fetchedAttendee = await fetchUserDetails(fetchedTicket.user_id);
                setAttendee(fetchedAttendee); // Can be null if user not found, render 'N/A' accordingly

            } catch (err) {
                console.error("Failed to load ticket details:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load ticket information.' });
            } finally {
                setLoading(false); // Always set loading to false when all fetches (or errors) are handled
            }
        };

        loadDetails();
    }, [ticketId]); // Re-run effect if ticketId changes

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

            pdf.save(`${ticket.event_id}-${ticket.ticket_id}-ticket.pdf`);
            setMessage({ type: 'success', text: 'Ticket downloaded successfully as PDF!' });

        } catch (error) {
            console.error("Error generating PDF:", error);
            setMessage({ type: 'error', text: `Failed to generate PDF: ${error.message || 'An unexpected error occurred.'}` });
        }
    };


    if (loading || ticket === null || event === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-4 text-lg">Loading ticket details...</p>
            </div>
        );
    }

    const alertClasses = message.type === 'success' ? 'alert-success' : (message.type === 'info' ? 'alert-info' : 'alert-error');

    let statusColorClass = '';
    let statusIcon = null;
    switch (ticket.checkInStatus) {
        case 'Checked In':
            statusColorClass = 'badge-success';
            statusIcon = <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />;
            break;
        case 'Pending':
            statusColorClass = 'badge-info';
            statusIcon = <HourglassEmptyIcon className="w-4 h-4 mr-1" />;
            break;
        case 'Invalid':
        default:
            statusColorClass = 'badge-error';
            statusIcon = <CancelOutlinedIcon className="w-4 h-4 mr-1" />;
            break;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <ConfirmationNumberIcon className="text-4xl" /> Ticket Details
            </h1>
            <hr className="my-6 border-base-content/10" />

            {message.text && (
                <div role="alert" className={`alert ${alertClasses} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex justify-center mb-6">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleDownloadPdf}
                    disabled={loading}
                >
                    {loading ? <span className="loading loading-spinner loading-sm mr-2"></span> : <DownloadIcon className="w-6 h-6 mr-2" />}
                    Download Ticket (PDF)
                </button>
            </div>

            {/* Ticket Content to be rendered in PDF */}
            <div ref={ticketRef} className="card bg-base-100 shadow-xl p-6 max-w-2xl mx-auto border border-primary/20">
                <div className="flex flex-col items-center mb-6">
                    <QrCode2Icon className="w-24 h-24 text-primary mb-4" />
                    <img src={ticket.qrCodeData} alt="Ticket QR Code" className="w-48 h-48 mb-4 border border-base-300 rounded-lg" />
                    <h2 className="text-2xl font-bold text-center mb-2">
                        {ticket.event_id === 'evt-001' ? 'Tech Innovators Summit 2025 Ticket' : event.name}
                    </h2>
                    <div className={`badge ${statusColorClass} text-sm p-3 gap-1`}>
                        {statusIcon}
                        Status: {ticket.checkInStatus}
                    </div>
                </div>

                <hr className="my-6 border-base-content/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content/80">
                    <div>
                        <p className="font-semibold text-lg mb-2 flex items-center gap-2"><EventIcon className="w-5 h-5" /> Event Details</p>
                        <p><strong>Name:</strong> {event.name}</p>
                        <p><strong>Dates:</strong> {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg mb-2 flex items-center gap-2"><ConfirmationNumberIcon className="w-5 h-5" /> Ticket Info</p>
                        <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
                        <p><strong>Type:</strong> {ticket.ticketTypeName}</p>
                        <p><strong>Quantity:</strong> {ticket.quantity}</p>
                        <p><strong>Purchased On:</strong> {formatDateTime(ticket.purchaseDate)}</p>
                    </div>
                </div>

                <hr className="my-6 border-base-content/10" />

                <div className="text-center text-base-content/70 text-sm">
                    <p className="font-semibold mb-2 flex items-center justify-center gap-2"><PersonIcon className="w-5 h-5" /> Attendee Details</p>
                    <p><strong>Name:</strong> {attendee?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {attendee?.email || 'N/A'}</p>
                    <p className="mt-4">Please present this QR code at the event entrance for quick check-in.</p>
                </div>
            </div>
        </div>
    );
};