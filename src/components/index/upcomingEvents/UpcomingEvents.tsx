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
        <section className="py-12 bg-base-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className={"flex flex-row justify-between mt-5"}>
                    {/* Section Title */}
                    <h3 className="text-3xl font-bold text-left mb-8 text-primary">Upcoming Events</h3>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <select className="select select-bordered w-40">
                            <option disabled selected>Weekdays</option>
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                            <option>Saturday</option>
                            <option>Sunday</option>
                        </select>

                        <select className="select select-bordered w-40">
                            <option disabled selected>Event Type</option>
                            <option>One Day event</option>
                        </select>

                        <select className="select select-bordered w-40">
                            <option disabled selected>Any category</option>
                            <option>Music</option>
                            <option>Drama</option>
                        </select>
                    </div>
                </div>

                {/* Event Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-10">
                    <a href="#" className="btn btn-outline btn-primary">
                        Load More
                    </a>
                </div>
            </div>
        </section>
    );
};
