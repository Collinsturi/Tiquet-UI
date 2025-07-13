export const EventTicketDetails = () => {
    return (
        <div className="container mx-auto px-8 py-4"> {/* Added px-8 and py-4 for consistent spacing */}
            <div className="bg-white rounded-box shadow-xl p-6 flex flex-wrap justify-around items-center gap-6">
                {/* Early Bird Ticket */}
                <div className="flex flex-col items-center text-center p-2">
                    {/* Placeholder for the icon. You might replace this with a real icon (e.g., from Heroicons or a custom SVG) */}
                    <span className="text-3xl text-blue-600 mb-2">☑️</span>
                    <span className="text-xl font-semibold mb-1 text-gray-800">Early Bird</span>
                    <span className="text-2xl font-bold text-gray-900">Kshs. 1500</span>
                </div>

                {/* Regular Ticket */}
                <div className="flex flex-col items-center text-center p-2">
                    <span className="text-3xl text-blue-600 mb-2">☑️</span>
                    <span className="text-xl font-semibold mb-1 text-gray-800">Regular</span>
                    <span className="text-2xl font-bold text-gray-900">Kshs. 2000</span>
                </div>

                {/* VIP Ticket */}
                <div className="flex flex-col items-center text-center p-2">
                    <span className="text-3xl text-blue-600 mb-2">☑️</span>
                    <span className="text-xl font-semibold mb-1 text-gray-800">VIP</span>
                    <span className="text-2xl font-bold text-gray-900">Kshs. 5000</span>
                </div>

                {/* Gate Ticket */}
                <div className="flex flex-col items-center text-center p-2">
                    <span className="text-3xl text-blue-600 mb-2">☑️</span>
                    <span className="text-xl font-semibold mb-1 text-gray-800">Gate</span>
                    <span className="text-2xl font-bold text-gray-900">Kshs. 3000</span>
                </div>
            </div>
        </div>
    );
};