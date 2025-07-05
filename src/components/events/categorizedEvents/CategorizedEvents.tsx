import { CategorizedEventCard } from "./CategorizedEventCard.tsx";
import {categorizedEvents} from "./sample.ts";

export const CategorizedEvents = () => {
    return (
        <div className="py-12 px-4 space-y-12">
            {categorizedEvents.map((cat) => (
                <div key={cat.category}>
                    <h2 className="text-2xl font-bold text-primary mb-4">{cat.category}</h2>

                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                        {cat.events.map((event) => (
                            <CategorizedEventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
