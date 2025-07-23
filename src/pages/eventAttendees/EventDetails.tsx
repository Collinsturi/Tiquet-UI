import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Card,
    Button,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // For speaker icon
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For pricing
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // For buy tickets
import ShareIcon from '@mui/icons-material/Share'; // For share button
import AddAlertIcon from '@mui/icons-material/AddAlert'; // For add to calendar
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
// Import APIEventResponseItem as the actual data type returned by getEventById
import { useGetEventByIdQuery, type APIEventResponseItem } from '../../queries/general/EventQuery.ts'; // ADJUST PATH if different

// For PDF generation
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// Helper function to format dates
const formatDateTime = (dateString: string) => { // Added type for dateString
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const options: Intl.DateTimeFormatOptions = { // Added type for options
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    };
    return date.toLocaleString(undefined, options);
};

const formatTimeOnly = (dateString: string) => { // Added type for dateString
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Time';
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }; // Added type for options
    return date.toLocaleTimeString(undefined, options);
};

export const EventDetails = () => {
    const { eventId } = useParams(); // Get eventId from URL
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user); // Get logged-in user

    // Use RTK Query hook to fetch event details
    // The data received here will be APIEventResponseItem (or null if not found)
    const { data: eventData, isLoading, error } = useGetEventByIdQuery(parseInt(eventId!), {
        skip: !eventId || isNaN(parseInt(eventId!)), // Skip if eventId is missing or invalid
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [ticketQuantities, setTicketQuantities] = useState<{ [key: number]: number }>({}); // Added type for state
    const [buyTicketLoading, setBuyTicketLoading] = useState(false); // This is for the modal's proceed button

    const buyTicketsModalRef = useRef<HTMLDialogElement>(null); // Ref for the buy tickets modal, added type
    const ticketRef = useRef<HTMLDivElement>(null); // Ref for PDF download content, added type


    // Effect to handle API response and initialize ticket quantities
    useEffect(() => {
        if (isLoading) {
            setMessage({ type: '', text: '' }); // Clear messages while loading
            return;
        }

        if (error) {
            const apiErrorMessage = (error as any)?.data?.message || `Failed to load event details for ID: ${eventId}. Please try again.`;
            setMessage({ type: 'error', text: apiErrorMessage });
            setTicketQuantities({}); // Clear quantities on error
            return;
        }

        // eventData is now directly APIEventResponseItem
        if (eventData) {
            // Initialize ticket quantities to 0 for all available ticket types
            const initialQuantities: { [key: number]: number } = {};
            eventData.ticketTypes.forEach(type => { // Directly access eventData.ticketTypes
                initialQuantities[type.id] = 0;
            });
            setTicketQuantities(initialQuantities);
            setMessage({ type: '', text: '' }); // Clear messages on successful load
        } else if (!eventData && !isLoading && !error) {
            // This case handles when data is explicitly null/undefined and not loading/erroring
            setMessage({ type: 'error', text: `Event with ID "${eventId}" not found.` });
            setTicketQuantities({});
        }
    }, [eventData, isLoading, error, eventId]);


    const handleQuantityChange = (ticketTypeId: number, change: number) => { // Added types
        setTicketQuantities(prev => {
            const currentQuantity = prev[ticketTypeId];
            const newQuantity = Math.max(0, currentQuantity + change); // Ensure non-negative
            // Max quantity: prevent buying more than available
            // Directly access eventData.ticketTypes
            const ticketType = eventData?.ticketTypes.find(t => t.id === ticketTypeId);
            const finalQuantity = ticketType ? Math.min(newQuantity, ticketType.quantityAvailable) : newQuantity;
            return { ...prev, [ticketTypeId]: finalQuantity };
        });
    };

    const calculateTotalPrice = () => {
        if (!eventData) return 0;
        let total = 0;
        eventData.ticketTypes.forEach(type => { // Directly access eventData.ticketTypes
            total += type.price * (ticketQuantities[type.id] || 0);
        });
        return total;
    };

    const handleProceedToCheckout = () => {
        if (!eventData) { // Ensure eventData is available
            setMessage({ type: 'error', text: 'Event data is not available for checkout.' });
            return;
        }

        const totalTicketsSelected = Object.values(ticketQuantities).reduce((sum: number, qty: number) => sum + qty, 0); // Added types
        const totalPrice = calculateTotalPrice();

        if (totalTicketsSelected === 0) {
            setMessage({ type: 'error', text: 'Please select at least one ticket.' });
            return;
        }

        setMessage({ type: '', text: '' }); // Clear previous messages
        setBuyTicketLoading(true); // Indicate loading for checkout process

        // Construct order details to pass to the checkout page
        const orderDetails = {
            eventId: eventData.id, // Directly access eventData.id
            eventName: eventData.title, // Directly access eventData.title
            eventDate: `${formatDateTime(`${eventData.eventDate}T${eventData.eventTime}`)}`, // Directly access eventData.eventDate/Time
            eventLocation: eventData.venue?.address || eventData.venueAddress || 'Venue Not Specified', // Use venue.address or venueAddress
            totalAmount: totalPrice,
            tickets: Object.keys(ticketQuantities)
                .filter(id => ticketQuantities[parseInt(id)] > 0) // Parse id to number
                .map(id => {
                    const parsedId = parseInt(id);
                    const ticketType = eventData.ticketTypes.find(t => t.id === parsedId);
                    return {
                        ticketTypeId: parsedId,
                        ticketTypeName: ticketType?.typeName,
                        quantity: ticketQuantities[parsedId],
                        pricePerUnit: ticketType?.price,
                    };
                }),
            userId: user?.user_id, // Use actual user ID from Redux
        };

        // Simulate a delay or actual API call for checkout
        setTimeout(() => {
            setBuyTicketLoading(false);
            buyTicketsModalRef.current?.close(); // Close the modal
            navigate('/attendee/checkout', { state: { orderDetails } });
        }, 1000); // Simulate network delay
    };

    const handleDownloadPdf = async () => {
        if (!ticketRef.current || !eventData) {
            setMessage({ type: 'error', text: 'Event details not loaded or content not ready for download.' });
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

            // Directly access eventData.title
            pdf.save(`${eventData.title.replace(/\s/g, '_')}-details.pdf`);
            setMessage({ type: 'success', text: 'Event details downloaded successfully as PDF!' });

        } catch (downloadError: any) { // Added type for downloadError
            console.error("Error generating PDF:", downloadError);
            setMessage({ type: 'error', text: `Failed to generate PDF: ${downloadError.message || 'An unexpected error occurred.'}` });
        }
    };

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading event details...</Typography>
            </Box>
        );
    }

    // If there's an error or no event data is found after loading
    if (error || !eventData) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message.text || "Could not load event details. Please ensure the event ID is valid."}
                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/attendee/events')}>Back to Events</Button>
                </Alert>
            </Box>
        );
    }

    // Destructure data for easier access - eventData is already the top-level object
    // You no longer need to destructure `event` and `venue` if eventData itself contains these.
    // However, since your `APIEventResponseItem` *does* have nested `venue` and `ticketTypes`,
    // you can keep those destructures for clarity, or just use `eventData.propertyName`.
    // Let's keep `venue` and `ticketTypes` destructured for consistency with how you're using them below.
    const { venue, ticketTypes } = eventData;


    // Log the fetched eventData to the console
    console.log('Fetched Event Data:', eventData);

    // Fallback for fields not present in current API response
    // Directly access properties from eventData
    const eventDescription = eventData.description || "No detailed description available for this event."; // Directly access description
    // posterImageUrl and mapImageUrl are now typed in APIEventResponseItem, but might be undefined if API doesn't send them
    const eventPoster = eventData.posterImageUrl || `https://placehold.co/800x400/E0E0E0/000000?text=${encodeURIComponent(eventData.title || 'Event Image')}`; // Directly access title
    // Check your API response for 'mapImageUrl' or derive it from latitude/longitude
    const eventMapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_Maps_API_KEY&q=${eventData.latitude || 0},${eventData.longitude || 0}`; // Using lat/long from API if available
    // OR if you want a static image, you'll need the Google Static Maps API.
    // For now, if you don't have a map URL from the backend, you could use a placeholder or remove it.
    // const eventMapUrl = eventData.mapImageUrl || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8251261376826!2d36.8142345!3d-1.2825488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111816f06cfb%3A0x6b8d9c5b2a0c4f80!2sKICC!5e0!3m2!1sen!2ske!4v1719602495010!5m2!1sen!2ske`; // Original fallback

    // Speakers and FAQs are not in current APIEventResponseItem from /events endpoint.
    // They would need to be added to your API response and APIEventResponseItem type for proper display.
    const speakers: any[] = []; // Default to empty array, added type
    const faqs: any[] = [];     // Default to empty array, added type

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Hero Section */}
            <div className="hero bg-base-200 rounded-box shadow-xl overflow-hidden mb-8">
                <div className="hero-content flex-col lg:flex-row p-0">
                    <img
                        src={eventPoster}
                        className="w-full lg:w-1/2 h-64 lg:h-auto object-cover rounded-tl-box lg:rounded-bl-box lg:rounded-tr-none"
                        alt={eventData.title} // Directly access eventData.title
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/800x400/E0E0E0/000000?text=Event+Image"; }}
                    />
                    <div className="p-6 lg:p-8 w-full lg:w-1/2">
                        <h1 className="text-4xl font-bold mb-2">{eventData.title}</h1> {/* Directly access eventData.title */}
                        <p className="text-lg text-base-content/70 mb-4">By {venue?.name || 'Unknown Organizer'}</p> {/* Use venue name as organizer */}

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-base-content/80">
                                <CalendarTodayIcon className="w-5 h-5" />
                                <span>{formatDateTime(`${eventData.eventDate}T${eventData.eventTime}`)}</span> {/* Directly access eventData.eventDate/Time */}
                            </div>
                            <div className="flex items-center gap-2 text-base-content/80">
                                <AccessTimeIcon className="w-5 h-5" />
                                <span>Ends: {formatTimeOnly(`${eventData.eventDate}T${eventData.eventTime}`)}</span> {/* Assuming end time is same as start for simplicity if not provided */}
                            </div>
                            <div className="flex items-center gap-2 text-base-content/80">
                                <LocationOnIcon className="w-5 h-5" />
                                <span>{venue?.address || eventData.venueAddress || 'Venue Not Specified'}</span> {/* Corrected venue address access */}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button className="btn btn-outline btn-sm">
                                <AddAlertIcon className="w-4 h-4" /> Add to Calendar
                            </button>
                            <button className="btn btn-outline btn-sm">
                                <ShareIcon className="w-4 h-4" /> Share Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {message.text && (
                <div role="alert" className={`alert ${message.type === 'success' ? 'alert-success' : (message.type === 'info' ? 'alert-info' : 'alert-error')} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Description */}
                <div className="lg:col-span-2 card bg-base-100 shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <InfoIcon className="w-6 h-6" /> Event Description
                    </h2>
                    <p className="whitespace-pre-line text-base-content/80">
                        {eventDescription}
                    </p>
                </div>

                {/* Tickets Section (Sticky on larger screens) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 card bg-base-100 shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <ConfirmationNumberIcon className="w-6 h-6" /> Get Tickets
                        </h2>
                        <div className="space-y-4 mb-6">
                            {ticketTypes.length > 0 ? (
                                ticketTypes.map(type => (
                                    <div key={type.id} className="flex items-center justify-between border-b border-base-200 pb-2">
                                        <div>
                                            <p className="font-semibold text-lg">{type.typeName}</p> {/* Use typeName */}
                                            <p className="text-sm text-base-content/70">Available: {type.quantityAvailable}</p> {/* Use quantityAvailable */}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="btn btn-square btn-xs"
                                                onClick={() => handleQuantityChange(type.id, -1)}
                                                disabled={(ticketQuantities[type.id] || 0) === 0}
                                            >-</button>
                                            <span className="font-bold text-lg w-8 text-center">
                                                {ticketQuantities[type.id] || 0}
                                            </span>
                                            <button
                                                className="btn btn-square btn-xs"
                                                onClick={() => handleQuantityChange(type.id, 1)}
                                                disabled={(ticketQuantities[type.id] || 0) >= type.quantityAvailable}
                                            >+</button>
                                        </div>
                                        <span className="font-bold text-lg text-primary">${type.price.toLocaleString('en-KE')}</span>
                                    </div>
                                ))
                            ) : (
                                <Alert severity="info">No ticket types available for this event.</Alert>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-xl font-bold mb-4">
                            <span>Total:</span>
                            <span>${calculateTotalPrice().toLocaleString('en-KE')}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => buyTicketsModalRef.current?.showModal()}
                            disabled={calculateTotalPrice() === 0 || buyTicketLoading}
                        >
                            {buyTicketLoading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                            <ShoppingCartIcon className="w-5 h-5" /> Buy Tickets
                        </button>
                    </div>
                </div>
            </div>

            {/* Speakers Section (if available) - Will only render if `speakers` array is populated by API */}
            {speakers && speakers.length > 0 && (
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <PersonOutlineIcon className="w-6 h-6" /> Speakers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {speakers.map(speaker => (
                            <div key={speaker.id} className="card bg-base-200 shadow-sm p-4 text-center">
                                <div className="avatar mb-2">
                                    <div className="w-24 mask mask-squircle">
                                        <img src={`https://placehold.co/100x100/ADD8E6/000000?text=${speaker.name.split(' ').map(n => n[0]).join('')}`} alt={speaker.name} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{speaker.name}</h3>
                                <p className="text-sm text-base-content/70 mb-1">{speaker.title}</p>
                                <p className="text-xs text-base-content/60">{speaker.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Location/Map Section */}
            {eventMapUrl && ( // Render if map URL is available
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <LocationOnIcon className="w-6 h-6" /> Location
                    </h2>
                    <div className="rounded-lg overflow-hidden h-64 w-full">
                        <iframe
                            // Changed to use eventData.latitude and eventData.longitude if available
                            src={eventData.latitude && eventData.longitude ?
                                `https://www.google.com/maps/embed/v1/place?key=YOUR_Maps_API_KEY&q=${eventData.latitude},${eventData.longitude}` :
                                `https://www.google.com/maps/embed/v1/place?key=YOUR_Maps_API_KEY&q=${encodeURIComponent(eventData.venue?.address || eventData.venueAddress || 'Kenya')}` // Fallback to address or default to Kenya
                            }
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event Location Map"
                        ></iframe>
                    </div>
                    <p className="text-base-content/70 mt-4">{venue?.address || eventData.venueAddress || 'Venue Not Specified'}</p> {/* Corrected venue address access */}
                </div>
            )}

            {/* FAQs Section (Optional) - Will only render if `faqs` array is populated by API */}
            {faqs && faqs.length > 0 && (
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <InfoIcon className="w-6 h-6" /> FAQs
                    </h2>
                    <div className="join join-vertical w-full">
                        {faqs.map((faq, index) => (
                            <div key={index} className="collapse collapse-arrow join-item border border-base-300">
                                <input type="radio" name="my-accordion-4" defaultChecked={index === 0} />
                                <div className="collapse-title text-xl font-medium">
                                    {faq.question}
                                </div>
                                <div className="collapse-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Buy Tickets Confirmation Modal (DaisyUI) */}
            <dialog id="buy_tickets_modal" className="modal" ref={buyTicketsModalRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCartIcon className="w-6 h-6" /> Confirm Your Order
                    </h3>
                    <p className="py-4">You are about to purchase tickets for **{eventData?.title}**:</p> {/* Directly use eventData.title */}
                    <div className="overflow-x-auto mb-4">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>Ticket Type</th>
                                <th>Quantity</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ticketTypes.filter(type => ticketQuantities[type.id] > 0)
                                .map(type => {
                                    const qty = ticketQuantities[type.id];
                                    const subtotal = type.price * qty;
                                    return (
                                        <tr key={type.id}>
                                            <td>{type.typeName}</td>
                                            <td>{qty}</td>
                                            <td className="text-right">${type.price.toLocaleString('en-KE')}</td>
                                            <td className="text-right">${subtotal.toLocaleString('en-KE')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan="3" className="text-right">Total Payable:</th>
                                <th className="text-right text-lg text-primary">${calculateTotalPrice().toLocaleString('en-KE')}</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost" disabled={buyTicketLoading}>Cancel</button>
                        </form>
                        <button
                            className="btn btn-primary"
                            onClick={handleProceedToCheckout}
                            disabled={buyTicketLoading}
                        >
                            {buyTicketLoading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                            <CheckCircleOutlineIcon className="w-5 h-5" /> Proceed to Checkout
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};