import type { APIEventResponseItem } from '../../../queries/general/EventQuery.ts'; // Corrected import path and type

type EventCardProps = {
    event: APIEventResponseItem; // Use the APIEventResponseItem type
};

export const CategorizedEventCard = ({ event }: EventCardProps) => {
    // Determine the price to display
    const priceDisplay = event.ticketTypes && event.ticketTypes.length > 0
        ? `KES ${event.ticketTypes[0].price.toFixed(2)}`
        : 'N/A'; // Or 'Free', depending on your event logic

    return (
        <div className="bg-white rounded-xl shadow border w-72 shrink-0 hover:shadow-lg transition-transform duration-300">
            {/* Use posterImageUrl and add an onError for placeholder */}
            <img
                src={event.posterImageUrl}
                alt={event.title || 'Event Image'}
                className="rounded-t-xl h-40 w-full object-cover"
                onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loop if placeholder also fails
                    e.currentTarget.src = `https://placehold.co/400x300/E0E0E0/000000?text=${encodeURIComponent(event.title || 'Event')}`;
                }}
            />

            <div className="p-4 text-left">
                <h4 className="text-sm font-semibold">{event.title}</h4>
                {/* Your APIEventResponseItem doesn't have an 'organizer' field directly at the top level.
                    If organizer info is nested, you'll need to access it.
                    For now, I'm commenting it out or replacing it. If 'organizerId' refers to a user,
                    you might need another query to get the organizer's name.
                    Keeping the original text for now, but be aware it might display 'Undefined'. */}
                <p className="text-xs text-gray-500 mb-2">Organized by {/*event.organizer ||*/ `Organizer ID: ${event.organizerId}`}</p>

                <div className="flex items-center text-xs text-gray-600 space-x-2 mb-1">
                    {/* Format date and time */}
                    <span>📅 {new Date(event.eventDate).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    {/* Use venueName from the flattened API response */}
                    <span>📍 {event.venueName}</span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                    {/* Format time (e.g., from "HH:MM:SS" to "HH:MM") */}
                    🕒 {event.eventTime.substring(0, 5)}
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">
                        Starts From<br />
                        <span className="text-black">{priceDisplay}</span>
                    </p>
                    <button className="btn btn-sm btn-outline btn-primary">Buy tickets</button>
                </div>
            </div>
        </div>
    );
};