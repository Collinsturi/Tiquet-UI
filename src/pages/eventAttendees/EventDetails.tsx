import React, { useState, useEffect, useRef } from 'react';
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
import {useNavigate} from "react-router-dom";

// --- Dummy Data Simulation ---
// Extend dummyEvents to include more details
const dummyEvents = [
    {
        event_id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizer_id: 'org-001',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi, Kenya',
        city: 'Nairobi',
        description: `Join us for the premier technology summit of 2025! Featuring keynote speeches from industry leaders, interactive workshops, and a sprawling expo floor showcasing the latest innovations in AI, blockchain, cybersecurity, and sustainable tech. Network with fellow innovators, developers, and entrepreneurs. Don't miss this opportunity to shape the future!

Key Highlights:
- Over 100 expert speakers
- Live coding challenges
- Startup pitch competition
- Dedicated networking zones
- VR/AR immersive experiences`,
        posterImageUrl: 'https://placehold.co/800x400/ADD8E6/000000?text=Tech+Innovators+Summit+2025',
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.81050700547!2d36.81665471475399!3d-1.286389099066632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d4023c03a9%3A0xc4e5d6d8a7c2e0b!2sKICC!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske',
        ticketTypes: [
            { id: 'tkt-std', name: 'Standard Pass', price: 1500, available: 500, description: 'Access to all sessions and expo floor.' },
            { id: 'tkt-vip', name: 'VIP Pass', price: 4500, available: 50, description: 'All Standard benefits plus VIP lounge access, priority seating, and exclusive networking events.' },
            { id: 'tkt-stu', name: 'Student Pass', price: 750, available: 200, description: 'Valid student ID required. Access to all sessions and expo floor.' },
        ],
        speakers: [
            { id: 'spk-1', name: 'Dr. Anya Sharma', title: 'CEO, Future AI Labs', bio: 'Pioneering research in ethical AI development.' },
            { id: 'spk-2', name: 'Mr. Kenji Tanaka', title: 'Lead Blockchain Architect, CryptoCorp', bio: 'Expert in decentralized finance and Web3 applications.' },
            { id: 'spk-3', name: 'Ms. Zoe Davies', title: 'Head of Sustainability Tech, Green Innovations', bio: 'Driving innovation for eco-friendly solutions.' },
        ],
        faqs: [
            { question: "What are the event hours?", answer: "The event runs from 9:00 AM to 5:00 PM daily." },
            { question: "Is lunch provided?", answer: "Lunch is available for purchase from various food vendors. VIP tickets include catered lunch." }
        ]
    },
    {
        event_id: 'evt-002',
        name: 'Annual Charity Gala',
        organizer_id: 'org-002',
        startDate: '2025-10-22T18:00:00Z',
        endDate: '2025-10-22T23:00:00Z',
        location: 'Sarit Centre, Nairobi, Kenya',
        city: 'Nairobi',
        description: `An elegant evening dedicated to supporting local charities. Enjoy fine dining, live music, and a silent auction. All proceeds go directly to our beneficiary organizations working in education and health. Dress code: Black Tie.`,
        posterImageUrl: 'https://placehold.co/800x400/F08080/FFFFFF?text=Annual+Charity+Gala',
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.825227702816!2d36.78696801475394!3d-1.2778648990666324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17042a632731%3A0xb30419e5c5c9a721!2sThe%20Sarit%20Centre!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske',
        ticketTypes: [
            { id: 'tkt-reg', name: 'Regular Ticket', price: 10000, available: 150, description: 'Includes 3-course meal and entertainment.' },
            { id: 'tkt-tab', name: 'Table of 10', price: 90000, available: 10, description: 'Includes a private table for 10 guests and premium wine selection.' },
        ],
        speakers: [], // No specific speakers for a gala
        faqs: []
    }
];

const dummyOrganizers = [
    { organizer_id: 'org-001', name: 'Innovate Kenya', contactEmail: 'contact@innovatekenya.com' },
    { organizer_id: 'org-002', name: 'Charity Stars Foundation', contactEmail: 'info@charitystars.org' },
];

// For demonstration, let's pick a fixed event ID.
// In a real app, this would come from `useParams()` in React Router.
const CURRENT_EVENT_ID = 'evt-001';

// Helper function to format dates using native Date methods
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    };
    return date.toLocaleString(undefined, options);
};

const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Time';
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString(undefined, options);
};

export const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [organizer, setOrganizer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [buyTicketLoading, setBuyTicketLoading] = useState(false);

    const navigate = useNavigate();

    // Ref for the buy tickets modal
    const buyTicketsModalRef = useRef(null);

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });

                const fetchedEvent = dummyEvents.find(e => e.event_id === CURRENT_EVENT_ID);
                if (!fetchedEvent) {
                    setMessage({ type: 'error', text: 'Event not found.' });
                    setLoading(false);
                    return;
                }
                setEvent(fetchedEvent);

                const fetchedOrganizer = dummyOrganizers.find(o => o.organizer_id === fetchedEvent.organizer_id);
                setOrganizer(fetchedOrganizer);

                // Initialize ticket quantities to 0
                const initialQuantities = {};
                fetchedEvent.ticketTypes.forEach(type => {
                    initialQuantities[type.id] = 0;
                });
                setTicketQuantities(initialQuantities);

            } catch (err) {
                console.error("Failed to load event details:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load event details.' });
            } finally {
                setLoading(false);
            }
        };

        loadEventDetails();
    }, []);

    const handleQuantityChange = (ticketTypeId, change) => {
        setTicketQuantities(prev => {
            const currentQuantity = prev[ticketTypeId];
            const newQuantity = Math.max(0, currentQuantity + change); // Ensure non-negative
            // Max quantity: prevent buying more than available
            const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
            const finalQuantity = Math.min(newQuantity, ticketType.available);
            return { ...prev, [ticketTypeId]: finalQuantity };
        });
    };

    const calculateTotalPrice = () => {
        if (!event) return 0;
        let total = 0;
        event.ticketTypes.forEach(type => {
            total += type.price * (ticketQuantities[type.id] || 0);
        });
        return total;
    };

    const handleProceedToCheckout = () => {
        const totalTicketsSelected = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
        const totalPrice = calculateTotalPrice();

        if (totalTicketsSelected === 0) {
            setMessage({ type: 'error', text: 'Please select at least one ticket.' });
            return;
        }

        setMessage({ type: '', text: '' }); // Clear previous messages
        // No longer setting buyTicketLoading here, as actual purchase is on checkout page

        // Construct order details to pass to the checkout page
        const orderDetails = {
            eventId: event.event_id,
            eventName: event.name,
            eventDate: `${formatDateTime(event.startDate)} - ${formatTimeOnly(event.endDate)}`, // More specific date/time for checkout page
            eventLocation: event.location,
            totalAmount: totalPrice,
            tickets: Object.keys(ticketQuantities)
                .filter(id => ticketQuantities[id] > 0)
                .map(id => ({
                    ticketTypeId: id,
                    ticketTypeName: event.ticketTypes.find(t => t.id === id)?.name,
                    quantity: ticketQuantities[id],
                    pricePerUnit: event.ticketTypes.find(t => t.id === id)?.price,
                })),
            userId: 'user-001', // Replace with actual user ID later
        };

        // Close the modal before navigating
        buyTicketsModalRef.current?.close();

        // Navigate to the checkout page, passing orderDetails in the state
        navigate('/attendee/checkout', { state: { orderDetails } });
    };


    if (loading || event === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-4 text-lg">Loading event details...</p>
            </div>
        );
    }

    const alertClasses = message.type === 'success' ? 'alert-success' : 'alert-error';

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Hero Section */}
            <div className="hero bg-base-200 rounded-box shadow-xl overflow-hidden mb-8">
                <div className="hero-content flex-col lg:flex-row p-0">
                    <img
                        src={event.posterImageUrl}
                        className="w-full lg:w-1/2 h-64 lg:h-auto object-cover rounded-tl-box lg:rounded-bl-box lg:rounded-tr-none"
                        alt={event.name}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/E0E0E0/000000?text=Event+Image"; }}
                    />
                    <div className="p-6 lg:p-8 w-full lg:w-1/2">
                        <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
                        <p className="text-lg text-base-content/70 mb-4">By {organizer?.name || 'Unknown Organizer'}</p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-base-content/80">
                                <CalendarTodayIcon className="w-5 h-5" />
                                <span>{formatDateTime(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-base-content/80">
                                <AccessTimeIcon className="w-5 h-5" />
                                <span>Ends: {formatDateTime(event.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-base-content/80">
                                <LocationOnIcon className="w-5 h-5" />
                                <span>{event.location}</span>
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
                <div role="alert" className={`alert ${alertClasses} mb-6`}>
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
                        {event.description}
                    </p>
                </div>

                {/* Tickets Section (Sticky on larger screens) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 card bg-base-100 shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <ConfirmationNumberIcon className="w-6 h-6" /> Get Tickets
                        </h2>
                        <div className="space-y-4 mb-6">
                            {event.ticketTypes.map(type => (
                                <div key={type.id} className="flex items-center justify-between border-b border-base-200 pb-2">
                                    <div>
                                        <p className="font-semibold text-lg">{type.name}</p>
                                        <p className="text-sm text-base-content/70">{type.description}</p>
                                        <p className="text-sm text-base-content/60">Available: {type.available}</p>
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
                                            disabled={(ticketQuantities[type.id] || 0) >= type.available}
                                        >+</button>
                                    </div>
                                    <span className="font-bold text-lg text-primary">${type.price.toLocaleString('en-KE')}</span>
                                </div>
                            ))}
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

            {/* Speakers Section (if available) */}
            {event.speakers && event.speakers.length > 0 && (
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <PersonOutlineIcon className="w-6 h-6" /> Speakers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {event.speakers.map(speaker => (
                            <div key={speaker.id} className="card bg-base-200 shadow-sm p-4 text-center">
                                {/* DaisyUI's avatar component provides nice styling */}
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
            {event.mapImageUrl && (
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <LocationOnIcon className="w-6 h-6" /> Location
                    </h2>
                    <div className="rounded-lg overflow-hidden h-64 w-full">
                        <iframe
                            src={event.mapImageUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event Location Map"
                        ></iframe>
                    </div>
                    <p className="text-base-content/70 mt-4">{event.location}</p>
                </div>
            )}

            {/* FAQs Section (Optional) */}
            {event.faqs && event.faqs.length > 0 && (
                <div className="card bg-base-100 shadow-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <InfoIcon className="w-6 h-6" /> FAQs
                    </h2>
                    <div className="join join-vertical w-full">
                        {event.faqs.map((faq, index) => (
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
                    <p className="py-4">You are about to purchase tickets for **{event?.name}**:</p>
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
                            {Object.keys(ticketQuantities)
                                .filter(id => ticketQuantities[id] > 0)
                                .map(id => {
                                    const type = event.ticketTypes.find(t => t.id === id);
                                    const qty = ticketQuantities[id];
                                    const subtotal = type.price * qty;
                                    return (
                                        <tr key={id}>
                                            <td>{type.name}</td>
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