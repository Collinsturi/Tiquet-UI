import { CategorizedEventCard } from "./CategorizedEventCard.tsx";
import { useGetAllEventsQuery, type APIEventResponseItem } from '../../../queries/general/EventQuery.ts';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useMemo } from 'react';

export const CategorizedEvents = () => {
    // Fetch all upcoming events (as filtered by your EventQuery's transformResponse)
    const { data: allUpcomingEvents, isLoading, error } = useGetAllEventsQuery({});

    // Use useMemo to extract unique categories and group events by category
    const categorizedData = useMemo(() => {
        const categoriesMap: Map<string, APIEventResponseItem[]> = new Map();

        if (allUpcomingEvents) {
            allUpcomingEvents.forEach(event => {
                const eventWithImage: APIEventResponseItem = { ...event };

                if (!eventWithImage.posterImageUrl) {
                    eventWithImage.posterImageUrl = `https://placehold.co/400x300/E0E0E0/000000?text=${encodeURIComponent(event.title || 'Event Image')}`;
                }

                if (eventWithImage.category) {
                    if (!categoriesMap.has(eventWithImage.category)) {
                        categoriesMap.set(eventWithImage.category, []);
                    }
                    categoriesMap.get(eventWithImage.category)?.push(eventWithImage);
                }
            });
        }

        // Convert map to an array of objects for easier mapping in JSX
        return Array.from(categoriesMap.entries()).map(([category, events]) => ({
            category,
            // You might want to sort events here, e.g., by eventDate
            events: events,
        }));
    }, [allUpcomingEvents]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading categories and events...</Typography>
            </Box>
        );
    }

    if (error) {
        const errorMessage = (error as any)?.data?.message || 'Failed to load categories and events. Please try again later.';
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <Alert severity="error">{errorMessage}</Alert>
            </Box>
        );
    }

    if (categorizedData.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <Alert severity="info">No events found across any category at the moment.</Alert>
            </Box>
        );
    }

    return (
        <div className="py-12 px-4"> {/* Removed space-y-12 from here */}
            <h1 className="text-4xl font-bold text-center text-base-content mb-8">Explore Events by Category</h1>
            {/* Added flex container with wrap and gap for responsive layout */}
            <div className="flex flex-wrap justify-start items-start gap-8">
                {categorizedData.map((catData) => (
                    <EventCategorySection key={catData.category} category={catData.category} events={catData.events} />
                ))}
            </div>
        </div>
    );
};

const EventCategorySection = ({ category, events }: { category: string; events: APIEventResponseItem[] }) => {
    if (events.length === 0) {
        return null;
    }

    return (
        // Added responsive width classes here
        // w-full on small screens, lg:w-[calc(50%-1rem)] for two columns with gap-8 (2rem)
        <div className="w-full lg:w-[calc(50%-1rem)]"> {/* Updated width class */}
            <h2 className="text-2xl font-bold text-primary mb-4">{category}</h2>

            {/* This div remains scrollable for horizontal overflow of cards */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {events.map((event: APIEventResponseItem) => (
                    <CategorizedEventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};