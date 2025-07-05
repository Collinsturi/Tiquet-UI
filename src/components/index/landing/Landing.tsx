import { SearchTemplate } from "../../shared/searchTemplate/SearchTemplate.tsx";

export const Landing = () => {
    return (
        <div className="relative">
            {/* Hero with background image and overlay */}
            <div
                className="hero min-h-screen bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
                }}
            >
                {/*<div className="hero-overlay bg-black bg-opacity-50"></div>*/}
                <div className="hero-overlay"></div>
                <div className="hero-content flex flex-row w-full z-10">
                    {/* Left image (slightly more than half) */}
                    <div className="w-[55%]">
                        <img
                            src="./src/assets/amapiano_sticker.png"
                            alt="Amapiano Event"
                            className=" w-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Right text */}
                    <div className="w-[45%] flex flex-col justify-center px-10 text-white text-center">
                        <h3 className="text-4xl font-bold mb-4">Amapiano Groove House</h3>
                        <p className="text-lg mb-6">
                            Come eat, drink, mingle, and have fun as Amapiano Groove House 4.0 comes to Eldoret.
                        </p>
                        <div className="flex space-x-4 justify-centerg">
                            <a href="#" className="bg-white text-black px-4 py-2 rounded shadow">
                                Get Ticket
                            </a>
                            <a href="#" className="border border-white text-white px-4 py-2 rounded">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>

                {/* SearchTemplate floating between this and the next section */}
                <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 z-20">
                    <SearchTemplate />
                </div>
            </div>
        </div>
    );
};
