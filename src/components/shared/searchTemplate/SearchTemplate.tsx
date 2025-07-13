export const SearchTemplate = () => {
    return (
        <div className="card w-[70vw] bg-my-primary-focus shadow-xl p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Event */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold text-white">Search Event</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Amapiano Groove House"
                        className="w-full border-b border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-b-2 focus:border-white transition-all duration-200"
                    />
                </div>

                {/* Place */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold text-white">Place</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Eldoret, Kenya"
                        className="w-full border-b border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-b-2 focus:border-white transition-all duration-200"
                    />
                </div>

                {/* Time */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold text-white">Time</span>
                    </label>
                    <input
                        type="date"
                        className="w-full border-b border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-b-2 focus:border-white transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );
};