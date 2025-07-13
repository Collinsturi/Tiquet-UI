import type {Event} from "./sample.ts";

type EventCardProps = {
    event: Event;
};

export const CategorizedEventCard = ({ event }: EventCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow border w-72 shrink-0 hover:shadow-lg transition-transform duration-300">
            <img src={event.image} alt={event.title} className="rounded-t-xl h-40 w-full object-cover" />

            <div className="p-4 text-left">
                <h4 className="text-sm font-semibold">{event.title}</h4>
                <p className="text-xs text-gray-500 mb-2">Organized by {event.organizer}</p>

                <div className="flex items-center text-xs text-gray-600 space-x-2 mb-1">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.venue}</span>
                </div>

                <div className="text-xs text-gray-600 mb-2">🕒 {event.time}</div>

                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">Starts From<br /><span className="text-black">{event.price}</span></p>
                    <button className="btn btn-sm btn-outline btn-primary">Buy tickets</button>
                </div>
            </div>
        </div>
    );
};
