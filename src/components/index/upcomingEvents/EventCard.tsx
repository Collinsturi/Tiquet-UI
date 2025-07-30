import type { EventType } from "./Event.ts";

export const EventCard: React.FC<{ event: EventType }> = ({ event }) => {
    const getMonthAbbreviation = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    };

    const getDay = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    console.log("22", event);
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto">
            {/* Event Image */}
            <img
                src={event.posterImageUrl || `https://placehold.co/512x272?text=Event+${event.id}`}
                alt={event.name}
                className="w-full h-48 object-cover"
            />

            {/* Event Info */}
            <div className="flex p-4">
                {/* Date Block */}
                <div className="text-center mr-4">
                    <p className="text-sm text-gray-500 font-medium">{getMonthAbbreviation(event.date)}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{getDay(event.date)}</p>
                </div>

                {/* Title & Description */}
                <div className="flex-1">
                    <h4 className="text-md font-semibold text-gray-900 leading-tight mb-1">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.description}</p>
                </div>
            </div>
        </div>
    );
};
