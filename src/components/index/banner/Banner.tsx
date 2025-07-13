export const Banner = () => {
    return (
        <div className="relative bg-my-accent-focus rounded-xl ml-10 mr-20 shadow-lg md:overflow-visible overflow-hidden flex flex-col md:flex-row items-center p-6 animate-fade-in-up transition-all duration-700">
            {/* Popping Icon */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 -mt-12 md:-mt-16 -ml-4 md:ml-0">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6515/6515765.png"
                    alt="Create Event Icon"
                    className="w-full h-full object-contain drop-shadow-xl"
                />
            </div>

            {/* Text Content */}
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left  flex flex-row justify-between flex-1">
                <div className={"flex flex-col"}>
                    <h4 className="text-2xl font-semibold text-gray-800 mb-2">Make Your Own Event</h4>
                    <p className="text-white mb-4">
                        Host your next big moment — concert, meetup, or fun run. Start now!
                    </p>
                    <a href="#" className="btn btn-primary w-[40%]">
                        Create Events
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-6 mr-10 flex flex-col md:flex-row gap-50 justify-center md:justify-start text-sm text-gray-500">
                    <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-gray-800">2.5K+</p>
                        <p className={"text-white"}>Events Hosted</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-gray-800">50K+</p>
                        <p className={"text-white"}>Attendees</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-gray-800">120+</p>
                        <p className={"text-white"}>Partners</p>
                    </div>
                </div>
            </div>
        </div>
    );
};