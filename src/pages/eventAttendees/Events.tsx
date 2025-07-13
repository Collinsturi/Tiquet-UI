import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ExploreIcon from '@mui/icons-material/Explore';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// --- Dummy Data Simulation ---
const CURRENT_USER_ID = 'user-001';
const CURRENT_USER_LOCATION = 'Nairobi'; // Simulated user's city

const dummyUsers = [
    { user_id: 'user-001', name: 'Alice Attendee', email: 'alice.attendee@example.com' },
    { user_id: 'user-002', name: 'Bob Participant', email: 'bob.p@example.com' },
];

// Define event categories
const dummyCategories = [
    { id: 'cat-tech', name: 'Technology' },
    { id: 'cat-music', name: 'Music' },
    { id: 'cat-food', name: 'Food & Drink' },
    { id: 'cat-charity', name: 'Charity' },
    { id: 'cat-arts', name: 'Arts & Culture' },
];

// User interests - these would typically come from user profiles or inferred behavior
const dummyUserInterests = {
    'user-001': ['cat-tech', 'cat-food'],
    'user-002': ['cat-music', 'cat-arts'],
};

// Events data with added fields for recommendation logic (matching the details page structure)
const dummyEvents = [
    {
        event_id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizer_id: 'org-001',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'KICC, Nairobi, Kenya',
        city: 'Nairobi',
        category_id: 'cat-tech',
        posterImageUrl: 'https://placehold.co/400x200/ADD8E6/000000?text=Tech+Summit',
        ticketsSold: 1500, // For popularity
        views: 5000, // For popularity
        creationDate: '2025-01-01T00:00:00Z', // For freshness
        description: `Join us for the premier technology summit of 2025! Featuring keynote speeches from industry leaders, interactive workshops, and a sprawling expo floor showcasing the latest innovations in AI, blockchain, cybersecurity, and sustainable tech.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8251261376826!2d36.8142345!3d-1.2825488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111816f06cfb%3A0x6b8d9c5b2a0c4f80!2sKICC!5e0!3m2!1sen!2ske!4v1719602495010!5m2!1sen!2ske',
        ticketTypes: [], speakers: [], faqs: [] // Minimal for list view, full details on details page
    },
    {
        event_id: 'evt-002',
        name: 'Annual Charity Gala',
        organizer_id: 'org-002',
        startDate: '2025-10-22T18:00:00Z',
        endDate: '2025-10-22T23:00:00Z',
        location: 'Sarit Centre, Nairobi, Kenya',
        city: 'Nairobi',
        category_id: 'cat-charity',
        posterImageUrl: 'https://placehold.co/400x200/F08080/FFFFFF?text=Charity+Gala',
        ticketsSold: 800,
        views: 2500,
        creationDate: '2025-02-01T00:00:00Z',
        description: `An elegant evening dedicated to supporting local charities. Enjoy fine dining, live music, and a silent auction.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8893979313936!2d36.7909015!3d-1.2464197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f170bf0e2a3b1%3A0x88f2b7f0c1c8a1e1!2sThe%20Sarit%20Centre!5e0!3m2!1sen!2ske!4v1719602555627!5m2!1sen!2ske',
        ticketTypes: [], speakers: [], faqs: []
    },
    {
        event_id: 'evt-003',
        name: 'Nairobi Street Food Festival',
        organizer_id: 'org-001',
        startDate: '2025-09-20T10:00:00Z',
        endDate: '2025-09-21T20:00:00Z',
        location: 'Kasarani Stadium, Nairobi, Kenya',
        city: 'Nairobi',
        category_id: 'cat-food',
        posterImageUrl: 'https://placehold.co/400x200/F5DEB3/000000?text=Food+Fest',
        ticketsSold: 2000,
        views: 7000,
        creationDate: '2025-07-01T00:00:00Z', // More recent
        description: `Indulge in a culinary journey at the largest street food festival in Nairobi! Discover diverse cuisines, local delicacies, and gourmet treats from various vendors.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.176472421303!2d36.8834608!3d-1.1852899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3f5080e2271d%3A0x280e72c842325c8!2sMoi%20International%20Sports%20Centre%20(MISC)%20Kasarani!5e0!3m2!1sen!2ske!4v1719602604859!5m2!1sen!2ske',
        ticketTypes: [], speakers: [], faqs: []
    },
    {
        event_id: 'evt-004',
        name: 'Future Tech Expo 2026',
        organizer_id: 'org-001',
        startDate: '2026-03-01T09:00:00Z',
        endDate: '2026-03-03T17:00:00Z',
        location: 'Exhibition Grounds, Nairobi, Kenya',
        city: 'Nairobi',
        category_id: 'cat-tech',
        posterImageUrl: 'https://placehold.co/400x200/A2D9CE/000000?text=Future+Expo',
        ticketsSold: 300,
        views: 1000,
        creationDate: '2025-06-15T00:00:00Z',
        description: `Explore tomorrow's technology today! This expo features groundbreaking innovations in robotics, VR/AR, and sustainable energy.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8251261376826!2d36.8142345!3d-1.2825488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111816f06cfb%3A0x6b8d9c5b2a0c4f80!2sKICC!5e0!3m2!1sen!2ske!4v1719602495010!5m2!1sen!2ske', // Re-using KICC map for simplicity
        ticketTypes: [], speakers: [], faqs: []
    },
    {
        event_id: 'evt-005',
        name: 'Kisumu Jazz Night',
        organizer_id: 'org-002',
        startDate: '2025-09-05T19:00:00Z',
        endDate: '2025-09-05T23:00:00Z',
        location: 'The Waterfront, Kisumu, Kenya',
        city: 'Kisumu', // Different city
        category_id: 'cat-music',
        posterImageUrl: 'https://placehold.co/400x200/E6E6FA/000000?text=Jazz+Night',
        ticketsSold: 400,
        views: 1200,
        creationDate: '2025-05-10T00:00:00Z',
        description: `An evening of soulful jazz music by Lake Victoria. Featuring local and international artists.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.580436897258!2d34.7570415!3d-0.1065799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b5e28a556852f%3A0x446e1e3e70d49a75!2sThe%20Waterfront%20Mall%20Kisumu!5e0!3m2!1sen!2ske!4v1719602641018!5m2!1sen!2ske',
        ticketTypes: [], speakers: [], faqs: []
    },
    {
        event_id: 'evt-006',
        name: 'Art Exhibition: New Horizons',
        organizer_id: 'org-001',
        startDate: '2025-11-01T10:00:00Z',
        endDate: '2025-11-30T17:00:00Z',
        location: 'National Museum, Nairobi, Kenya',
        city: 'Nairobi',
        category_id: 'cat-arts',
        posterImageUrl: 'https://placehold.co/400x200/DDA0DD/000000?text=Art+Expo',
        ticketsSold: 100,
        views: 300,
        creationDate: '2025-08-05T00:00:00Z', // Most recent
        description: `Discover contemporary Kenyan art at this month-long exhibition showcasing new talent and established artists.`,
        mapImageUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.823902347957!2d36.8143928!3d-1.2841443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111816f06cfb%3A0x6b8d9c5b2a0c4f80!2sKICC!5e0!3m2!1sen!2ske!4v1719602495010!5m2!1sen!2ske', // Re-using KICC map, assuming near museum
        ticketTypes: [], speakers: [], faqs: []
    },
];

// Helper function to format dates using native Date methods
const formatDateRange = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Invalid Dates';

    const startOptions = { month: 'short', day: 'numeric' };
    const endOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedStartDate = startDate.toLocaleDateString(undefined, startOptions);
    const formattedStartTime = startDate.toLocaleTimeString(undefined, endOptions);
    const formattedEndTime = endDate.toLocaleTimeString(undefined, endOptions);

    if (startDate.toDateString() === endDate.toDateString()) {
        return `${formattedStartDate} ${formattedStartTime} - ${formattedEndTime}`;
    } else {
        const formattedEndDate = endDate.toLocaleDateString(undefined, startOptions);
        return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`;
    }
};

// --- Recommendation Logic (from previous request, remains the same) ---
const getRecommendedEvents = (user, events, userInterests, userLocation, filterType = 'all') => {
    if (!user) return [];

    let recommendations = [];
    const now = new Date();

    // Filter out past events
    const upcomingEvents = events.filter(event => new Date(event.endDate) > now);

    // Rule 1: Based on User Interests
    const userCategoryIds = userInterests[user.user_id] || [];
    const interestBased = upcomingEvents.filter(event =>
        userCategoryIds.includes(event.category_id)
    ).map(event => ({ ...event, recommendationReason: 'Based on your interests' }));

    // Rule 2: Trending/Popular Events (e.g., top 3 by ticketsSold)
    const trending = [...upcomingEvents]
        .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0))
        .slice(0, 3) // Get top 3
        .map(event => ({ ...event, recommendationReason: 'Trending' }));

    // Rule 3: Newly Added Events (e.g., added in last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const newEvents = upcomingEvents.filter(event =>
        new Date(event.creationDate) > thirtyDaysAgo
    ).map(event => ({ ...event, recommendationReason: 'Newly added' }));

    // Rule 4: Geographic Proximity (Simplified: same city)
    const nearbyEvents = upcomingEvents.filter(event =>
        event.city && event.city.toLowerCase() === userLocation.toLowerCase()
    ).map(event => ({ ...event, recommendationReason: 'Near you' }));

    // Combine and deduplicate recommendations based on priority
    const finalRecommendationsMap = new Map();

    const addUnique = (eventList) => {
        eventList.forEach(event => {
            if (!finalRecommendationsMap.has(event.event_id)) {
                finalRecommendationsMap.set(event.event_id, event);
            }
        });
    };

    // Priority order for combining
    // Ensure "My Interests" events appear first if they also qualify for other categories
    addUnique(interestBased);
    addUnique(trending);
    addUnique(newEvents);
    addUnique(nearbyEvents);

    recommendations = Array.from(finalRecommendationsMap.values());

    // Apply filter type if specified (for toggle buttons)
    if (filterType === 'interests') {
        recommendations = recommendations.filter(e => e.recommendationReason === 'Based on your interests');
    } else if (filterType === 'trending') {
        recommendations = recommendations.filter(e => e.recommendationReason === 'Trending');
    } else if (filterType === 'new') {
        recommendations = recommendations.filter(e => e.recommendationReason === 'Newly added');
    } else if (filterType === 'nearby') {
        recommendations = recommendations.filter(e => e.recommendationReason === 'Near you');
    }
    // If 'all' or no specific filter, return the combined list.

    // Sort by relevance (e.g., put interest-based first, then trending, then new, then nearby, then general upcoming)
    // For now, let's keep it simple: sort by start date ascending
    recommendations.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return recommendations;
};


// --- Component Start ---
export const AttendeeEvents = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filterType, setFilterType] = useState('all'); // 'all', 'interests', 'trending', 'new', 'nearby'

    // Simulate fetching user and events data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });

                const currentUser = dummyUsers.find(u => u.user_id === CURRENT_USER_ID);
                if (!currentUser) {
                    setMessage({ type: 'error', text: 'User not found. Please log in.' });
                    setLoading(false);
                    return;
                }
                setUser(currentUser);
                setEvents(dummyEvents); // In a real app, this would be `fetchEvents()`

            } catch (err) {
                console.error("Failed to load events data:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load event information.' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Recalculate recommendations when filters or source data changes
    useEffect(() => {
        if (user && events.length > 0) {
            const recommendations = getRecommendedEvents(user, events, dummyUserInterests, CURRENT_USER_LOCATION, filterType);
            setRecommendedEvents(recommendations);
        }
    }, [user, events, filterType]); // Recalculate if user, events, or filterType changes

    const handleFilterChange = (newFilter) => {
        setFilterType(newFilter);
    };

    const handleViewDetails = (eventId) => {
        navigate(`/attendee/events/${eventId}`); // Navigate to the event details page
    };

    if (loading || user === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-4 text-lg">Finding events for you...</p>
            </div>
        );
    }

    const alertClasses = message.type === 'success' ? 'alert-success' : 'alert-error';

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <ExploreIcon className="text-4xl" /> Events Just For You
            </h1>
            <hr className="my-6 border-base-content/10" />

            {message.text && (
                <div role="alert" className={`alert ${alertClasses} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="card bg-base-100 shadow-xl p-4 mb-8 flex flex-wrap justify-center items-center gap-2">
                <span className="font-semibold text-lg mr-4">Show Me:</span>
                <div className="flex flex-wrap gap-2">
                    {/* Replaced input with button elements */}
                    <button
                        className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        <AutoAwesomeIcon className="w-5 h-5 mr-1" /> All Recommendations
                    </button>
                    <button
                        className={`btn ${filterType === 'interests' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('interests')}
                        disabled={!dummyUserInterests[CURRENT_USER_ID] || dummyUserInterests[CURRENT_USER_ID].length === 0}
                    >
                        <StarsIcon className="w-5 h-5 mr-1" /> My Interests
                    </button>
                    <button
                        className={`btn ${filterType === 'trending' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('trending')}
                    >
                        <TrendingUpIcon className="w-5 h-5 mr-1" /> Trending
                    </button>
                    <button
                        className={`btn ${filterType === 'new' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('new')}
                    >
                        <NewReleasesIcon className="w-5 h-5 mr-1" /> New
                    </button>
                    <button
                        className={`btn ${filterType === 'nearby' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('nearby')}
                    >
                        <LocationOnIcon className="w-5 h-5 mr-1" /> Near Me
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedEvents.length > 0 ? (
                    recommendedEvents.map(event => (
                        <div key={event.event_id} className="card bg-base-100 shadow-xl overflow-hidden flex flex-col">
                            <figure className="h-40 w-full overflow-hidden">
                                <img
                                    src={event.posterImageUrl}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/E0E0E0/000000?text=Event+Image"; }}
                                />
                            </figure>
                            <div className="card-body p-4 flex-grow">
                                <h2 className="card-title text-lg mb-2 line-clamp-2">{event.name}</h2>
                                <div className="badge badge-primary badge-outline text-xs mb-2">
                                    <AutoAwesomeIcon className="w-4 h-4 mr-1" /> {event.recommendationReason}
                                </div>
                                <p className="text-sm text-base-content/70 flex items-center gap-1 mb-1">
                                    <CalendarTodayIcon className="w-4 h-4" />
                                    {formatDateRange(event.startDate, event.endDate)}
                                </p>
                                <p className="text-sm text-base-content/70 flex items-center gap-1">
                                    <LocationOnIcon className="w-4 h-4" />
                                    {event.location}
                                </p>
                            </div>
                            <div className="card-actions justify-end p-4 pt-0">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleViewDetails(event.event_id)}
                                >
                                    <EventIcon className="w-4 h-4" /> View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <div role="alert" className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No events found matching your current filters or preferences. Try adjusting your interests or exploring different categories!</span>
                        </div>
                        <button className="btn btn-secondary mt-4">Browse All Events</button> {/* Placeholder for link */}
                    </div>
                )}
            </div>
        </div>
    );
};