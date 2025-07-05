export const EventDescription = () => {
    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section: Event Details */}
                <div>
                    <h1 className="text-5xl font-bold mb-4 font-serif">Amapiano Groove house</h1>
                    <p className="text-lg text-gray-700 mb-6">By EMB Events</p>

                    {/* Tags */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎵</span> {/* Music Icon */}
                            <span className="text-lg">Music</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌳</span> {/* Outdoor Icon */}
                            <span className="text-lg">Outdoor</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎉</span> {/* Entertainment Icon */}
                            <span className="text-lg">Entertainment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎧</span> {/* Amapiano Icon (example) */}
                            <span className="text-lg">Amapiano</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                        pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean
                        sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
                        massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
                        sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    </p>

                    <button className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none">
                        <span className="text-lg mr-1">Read more</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Right Section: Google Maps Placeholder */}
                <div className="flex justify-center items-start">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63835.55081898098!2d37.015681!3d-0.3982789!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828665d3e73316b%3A0xd7ef0cab59f91695!2sChaka%20Ranch!5e0!3m2!1sen!2ske!4v1750619587155!5m2!1sen!2ske"
                        width="600" height="450"  loading="lazy"
                        className="rounded-lg shadow-lg w-full"
                        referrerPolicy="no-referrer-when-downgrade">

                    </iframe>
                </div>
            </div>
        </div>
    );
};