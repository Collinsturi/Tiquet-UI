import { EventCard } from "./EventCard.tsx";
import type { EventType } from "./Event.ts";

export const UpcomingEvents = () => {
    const events: EventType[] = [
        {
            id: 1,
            name: 'Summer Music Festival',
            date: '2025-08-10',
            location: 'Central Park',
            description: 'Enjoy live music from various artists under the summer sky. A perfect day out for the family!',
        },
        {
            id: 2,
            name: 'Tech Innovation Summit',
            date: '2025-09-05',
            location: 'Convention Center',
            description: 'Explore the latest in technology with industry leaders and innovative startups.',
        },
        {
            id: 3,
            name: 'Art Exhibition Grand Opening',
            date: '2025-10-01',
            location: 'City Art Gallery',
            description: 'Witness breathtaking art pieces from renowned local and international artists.',
        },
        {
            id: 4,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 5,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 6,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 7,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 8,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 9,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 10,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 11,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
        {
            id: 12,
            name: 'Community Fun Run',
            date: '2025-11-15',
            location: 'Riverside Trail',
            description: 'Join us for a healthy and fun run benefiting local charities. All ages and fitness levels welcome!',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* Heading + Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h3 className="text-4xl font-extrabold text-left text-my-secondary font-display">Upcoming Events</h3>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-0">
                        <select className="bg-gray-100 text-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none">
                            <option disabled selected>Weekdays</option>
                            <option>Monday</option>
                            <option>Tuesday</option>
                        </select>
                        <select className="bg-gray-100 text-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none">
                            <option disabled selected>Event Type</option>
                            <option>One Day event</option>
                        </select>
                        <select className="bg-gray-100 text-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none">
                            <option disabled selected>Any Category</option>
                            <option>Music</option>
                            <option>Drama</option>
                        </select>
                    </div>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-10">
                    <button className="px-6 py-2 border-2 border-my-secondary text-my-primary font-semibold rounded-full hover:bg-primary hover:text-black transition">
                        Load More
                    </button>
                </div>
            </div>
        </section>
    );
};
