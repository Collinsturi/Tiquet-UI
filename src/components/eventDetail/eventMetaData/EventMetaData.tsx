export const EventMetaData = () => {
    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                {/* Left Section: Price and Tickets */}
                <div className="card w-full lg:w-1/2 bg-base-100 shadow-xl p-6">
                    <div className="card-body p-0">
                        <h2 className="card-title text-3xl font-bold mb-4">Price & Tickets</h2>

                        {/* Individual Ticket Types */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-lg font-semibold">Regular</span>
                                <span className="text-xl font-bold">$15.00</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-lg font-semibold">VIP</span>
                                <span className="text-xl font-bold">$30.00</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-lg font-semibold">Early Bird</span>
                                <span className="text-xl font-bold">$10.00</span>
                            </div>
                        </div>

                        {/* Buy Tickets Button */}
                        <button className="btn btn-primary btn-block text-lg py-3 rounded-lg">
                            Buy Tickets
                        </button>
                    </div>
                </div>

                {/* Right Section: Event Information */}
                <div className="card w-full lg:w-1/2 bg-base-100 shadow-xl p-6">
                    <div className="card-body p-0">
                        <h2 className="card-title text-3xl font-bold mb-4">Event Information</h2>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Date & Time</h3>
                            <p className="text-gray-700 text-lg">
                                Saturday, 28 February 2025 <br />
                                7:00 PM - 11:00 PM GMT+2
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Location</h3>
                            <p className="text-gray-700 text-lg">
                                The Groove House, <br />
                                123 Music Lane, <br />
                                Harmony City, HV 12345
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Organizer</h3>
                            <p className="text-gray-700 text-lg">EMB Events</p>
                        </div>

                        {/* Contact Organizer Button */}
                        <button className="btn btn-outline btn-block text-lg py-3 rounded-lg mt-4">
                            Contact Organizer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};