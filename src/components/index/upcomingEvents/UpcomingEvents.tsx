import { EventCard } from "./EventCard.tsx";
import type { EventType } from "./Event.ts";
import { useGetAllEventsQuery, type APIEventResponseItem } from "../../../queries/general/EventQuery.ts"; // Import APIEventResponseItem
import { useState } from "react";

export const UpcomingEvents = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    const { data: apiEvents, error, isLoading, isFetching } = useGetAllEventsQuery({
        page,
        limit,
        category: selectedCategory,
    });

    console.log(apiEvents);

    // Helper to map API data to EventType expected by EventCard
    // This function now directly takes an APIEventResponseItem
    const mapApiEventToEventType = (apiEvent: APIEventResponseItem): EventType => {
        return {
            id: apiEvent.id,
            name: apiEvent.title,
            date: apiEvent.eventDate,
            location: apiEvent.venueName || apiEvent.venue.name, // Use venueName from top-level or nested
            description: apiEvent.description,
            posterImageUrl: apiEvent.posterImageUrl
        };
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value === "Any category" ? undefined : event.target.value;
        setSelectedCategory(category);
        setPage(1); // Reset to first page when category changes
    };

    if (isLoading && !isFetching) {
        return (
            <section className="py-12 bg-base-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-primary mt-2">Loading events...</p>
                </div>
            </section>
        );
    }

    if (error) {
        console.error("Error fetching events:", error);
        return (
            <section className="py-12 bg-base-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-error">Error loading events. Please try again later.</p>
                </div>
            </section>
        );
    }


    const displayedEvents: EventType[] = apiEvents?.map(mapApiEventToEventType) || [];


    return (
        <section className="py-12 bg-base-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className={"flex flex-row justify-between mt-5"}>
                    <h3 className="text-3xl font-bold text-left mb-8 text-primary">Upcoming Events</h3>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <select className="select select-bordered w-40" disabled>
                            <option disabled selected>Weekdays</option>
                            {/* ... */}
                        </select>

                        <select className="select select-bordered w-40" disabled>
                            <option disabled selected>Event Type</option>
                            {/* ... */}
                        </select>

                        <select
                            className="select select-bordered w-40"
                            onChange={handleCategoryChange}
                            value={selectedCategory || "Any category"}
                        >
                            <option value="Any category">Any category</option>
                            <option value="Conference">Conference</option>
                            <option value="Music">Music</option>
                            <option value="Root">Root</option>
                            <option value="Sports">Sports</option>
                            <option value="Education">Education</option>
                            <option value="Food & Drink">Food & Drink</option>
                            <option value="Technology">Technology</option>
                            <option value="TEstCategory">TEstCategory</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-info">
                            No upcoming events found.
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-10">
                    {/* Only show load more if we got a full page of results, suggesting more might be available */}
                    {apiEvents && apiEvents.length === limit && (
                        <button
                            onClick={handleLoadMore}
                            className={`btn btn-outline btn-primary ${isFetching ? 'loading' : ''}`}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};