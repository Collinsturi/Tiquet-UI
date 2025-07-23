import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";
// Import APIEventResponseItem as the actual data type returned by getAllEvents
import { useGetAllEventsQuery, type APIEventResponseItem } from '../../queries/general/EventQuery.ts'; // ADJUST PATH if different from previous component

// --- Dummy Data for User Interests (since this is not from API yet) ---
const dummyUserInterests = {
    'user-001': ['Public-key contextually-based superstructure', 'Fundamental value-added projection'],
    'user-002': ['Technology', 'Music', 'Arts & Culture'],
};

// Helper function to format dates using native Date methods
const formatDateRange = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Invalid Dates';

    const startOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const endOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

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

// --- Recommendation Logic (Adapted for APIEventResponseItem structure) ---
// The 'events' parameter now directly receives APIEventResponseItem[]
const getRecommendedEvents = (user: any, events: APIEventResponseItem[], userInterests: any, filterType: string) => {
    if (!user || !events || events.length === 0) return [];

    // Add a recommendationReason property to the APIEventResponseItem type for internal use
    type RecommendedEvent = APIEventResponseItem & { recommendationReason: string };

    let recommendations: RecommendedEvent[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize 'now' to start of today for date comparison

    // Filter out past events
    // Ensure eventDate is compared correctly as a date
    const upcomingEvents = events.filter(item => {
        const eventDateString = item.eventDate; // Directly access eventDate
        const eventDateTimeString = `${eventDateString}T${item.eventTime}`;
        const eventDateObj = new Date(eventDateTimeString);
        // Ensure the event is today or in the future
        return !isNaN(eventDateObj.getTime()) && eventDateObj >= now;
    });

    // Rule 1: Based on User Interests
    const userCategoryNames = userInterests[user.user_id] || [];
    const interestBased = upcomingEvents.filter(item =>
        userCategoryNames.includes(item.category) // Directly access 'category'
    ).map(item => ({ ...item, recommendationReason: 'Based on your interests' }));

    // Rule 2: Newly Added Events (e.g., added in last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const newEvents = upcomingEvents.filter(item =>
        new Date(item.createdAt) > thirtyDaysAgo // Directly access 'createdAt'
    ).map(item => ({ ...item, recommendationReason: 'Newly added' }));

    // Combine and deduplicate recommendations based on priority
    const finalRecommendationsMap = new Map<number, RecommendedEvent>(); // Use item.id as key

    const addUnique = (eventList: RecommendedEvent[]) => {
        eventList.forEach(item => {
            if (!finalRecommendationsMap.has(item.id)) { // Directly access 'id'
                finalRecommendationsMap.set(item.id, item);
            }
        });
    };

    // Priority order for combining
    addUnique(interestBased);
    addUnique(newEvents);
    // Add all other upcoming events as general recommendations if not already added
    addUnique(upcomingEvents.map(item => ({ ...item, recommendationReason: 'General Recommendation' } as RecommendedEvent)));

    recommendations = Array.from(finalRecommendationsMap.values());

    // Apply filter type if specified
    if (filterType === 'interests') {
        recommendations = recommendations.filter(item => item.recommendationReason === 'Based on your interests');
    } else if (filterType === 'new') {
        recommendations = recommendations.filter(item => item.recommendationReason === 'Newly added');
    }
        // For 'trending' and 'nearby', since we don't have the data fields (ticketsSold, city/location)
    // from the current API response, we'll just show all upcoming events as a fallback.
    else if (filterType === 'trending' || filterType === 'nearby') {
        // You might want to implement actual trending/nearby logic here if your API provides data for it
        recommendations = upcomingEvents.map(item => ({ ...item, recommendationReason: filterType === 'trending' ? 'Trending (Fallback)' : 'Near You (Fallback)' } as RecommendedEvent));
    }


    // Sort by start date ascending
    recommendations.sort((a, b) => {
        const dateA = new Date(`${a.eventDate}T${a.eventTime}`).getTime(); // Directly access eventDate & eventTime
        const dateB = new Date(`${b.eventDate}T${b.eventTime}`).getTime(); // Directly access eventDate & eventTime
        return dateA - dateB;
    });

    return recommendations;
};


// --- Component Start ---
export const AttendeeEvents = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    // Use RTK Query to fetch all events
    // The data received here will be APIEventResponseItem[]
    const { data: allEventsData, isLoading, error } = useGetAllEventsQuery({});

    // console.log('Raw API Data:', allEventsData); // Log the raw data from RTK Query

    // The state now holds `RecommendedEvent[]` where RecommendedEvent is APIEventResponseItem with `recommendationReason`
    const [recommendedEvents, setRecommendedEvents] = useState< (APIEventResponseItem & { recommendationReason: string })[]>([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filterType, setFilterType] = useState('all');

    // Effect to process fetched events into recommendations
    useEffect(() => {
        if (!user) {
            setMessage({ type: 'error', text: 'User not found. Please log in.' });
            setRecommendedEvents([]);
            return;
        }

        if (isLoading) {
            setMessage({ type: '', text: '' });
            return;
        }

        if (error) {
            const apiErrorMessage = (error as any)?.data?.message || 'Failed to load events. Please try again later.';
            setMessage({ type: 'error', text: apiErrorMessage });
            setRecommendedEvents([]);
            return;
        }

        // Ensure allEventsData is not null/undefined and is an array before processing
        if (allEventsData && Array.isArray(allEventsData) && allEventsData.length > 0) {
            const recommendations = getRecommendedEvents(user, allEventsData, dummyUserInterests, filterType);
            // console.log('Processed Recommendations:', recommendations); // Log processed recommendations
            setRecommendedEvents(recommendations);
            if (recommendations.length === 0) {
                setMessage({ type: 'info', text: 'No events found matching your current filters or preferences. This might be because all events are in the past, or no events match your selected criteria.' });
            } else {
                setMessage({ type: '', text: '' });
            }
        } else if (allEventsData && Array.isArray(allEventsData) && allEventsData.length === 0) {
            setMessage({ type: 'info', text: 'No events are currently available.' });
            setRecommendedEvents([]);
        }

    }, [user, allEventsData, filterType, isLoading, error]);

    const handleFilterChange = (newFilter: string) => {
        setFilterType(newFilter);
    };

    const handleViewDetails = (eventId: number) => {
        navigate(`/attendee/events/${eventId}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Finding events for you...</Typography>
            </Box>
        );
    }

    // If no user is logged in
    if (!user) {
        return (
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    User not found. Please log in to view events.
                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/login')}>Go to Login</Button>
                </Alert>
            </Box>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <ExploreIcon className="text-4xl" /> Events Just For You
            </h1>
            <hr className="my-6 border-base-content/10" />

            {message.text && (
                <div role="alert" className={`alert ${message.type === 'info' ? 'alert-info' : 'alert-error'} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="card bg-base-100 shadow-xl p-4 mb-8 flex flex-wrap justify-center items-center gap-2">
                <span className="font-semibold text-lg mr-4">Show Me:</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        <AutoAwesomeIcon className="w-5 h-5 mr-1" /> All Recommendations
                    </button>
                    <button
                        className={`btn ${filterType === 'interests' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleFilterChange('interests')}
                        disabled={!user || !dummyUserInterests[user.user_id] || dummyUserInterests[user.user_id].length === 0}
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
                    recommendedEvents.map(item => (
                        <div key={item.id} className="card bg-base-100 shadow-xl overflow-hidden flex flex-col"> {/* Directly use item.id */}
                            <figure className="h-40 w-full overflow-hidden">
                                <img
                                    src={item.posterImageUrl || `https://placehold.co/400x200/E0E0E0/000000?text=Event+Image`} // Directly use item.posterImageUrl
                                    alt={item.title} // Directly use item.title
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/400x200/E0E0E0/000000?text=Event+Image"; }}
                                />
                            </figure>
                            <div className="card-body p-4 flex-grow">
                                <h2 className="card-title text-lg mb-2 line-clamp-2">{item.title}</h2> {/* Directly use item.title */}
                                <div className="badge badge-primary badge-outline text-xs mb-2">
                                    <AutoAwesomeIcon className="w-4 h-4 mr-1" /> {item.recommendationReason}
                                </div>
                                <p className="text-sm text-base-content/70 flex items-center gap-1 mb-1">
                                    <CalendarTodayIcon className="w-4 h-4" />
                                    {formatDateRange(`${item.eventDate}T${item.eventTime}`, `${item.eventDate}T${item.eventTime}`)} {/* Directly use item.eventDate and item.eventTime */}
                                </p>
                                <p className="text-sm text-base-content/70 flex items-center gap-1">
                                    <LocationOnIcon className="w-4 h-4" />
                                    {item.venue?.address || item.venueAddress || 'Venue Not Specified'} {/* Corrected venue access */}
                                </p>
                            </div>
                            <div className="card-actions justify-end p-4 pt-0">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleViewDetails(item.id)}
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
                        <button className="btn btn-secondary mt-4" onClick={() => navigate('/events')}>Browse All Events</button>
                    </div>
                )}
            </div>
        </div>
    );
};