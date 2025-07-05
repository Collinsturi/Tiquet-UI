export const SearchTemplate = () => {
    return (
        <div className="card w-[70vw] bg-base-100 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Event */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Search Event</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Amapiano Groove House"
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Place */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Place</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Eldoret, Kenya"
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Time */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Time</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Any date"
                        className="input input-bordered w-full"
                    />
                </div>
            </div>
        </div>
    );
};
