import { SearchTemplate } from "../../shared/searchTemplate/SearchTemplate.tsx";

export const Landing = () => {
    return (
        <div className="relative">
            {/* Hero */}
            <div
                className="hero min-h-screen bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
                }}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(255, 100, 0, 0.6), rgba(255, 200, 0, 0.6), rgba(0, 100, 255, 0.6))",
                    }}
                ></div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between min-h-screen">
                    {/* Left Image */}
                    <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0">
                        <img
                            src="/src/assets/amapiano_sticker.png"
                            alt="Amapiano Event"
                            className="w-full max-w-md object-contain"
                        />
                    </div>

                    {/* Right Text */}
                    <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
                        <h1 className="text-5xl font-bold leading-tight mb-4 text-center">
                            Amapiano Groove <br /> house
                        </h1>
                        <p className="text-lg font-medium mb-6 max-w-md mx-auto lg:mx-0 text-center lg:text-center ">
                            <span className="font-bold">Come eat, Drink, Mingle, have fun</span> as Amapiano Groove house 4.0 is coming to Eldoret
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <a
                                href="#"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow transition"
                            >
                                Get Ticket
                            </a>
                            <a
                                href="#"
                                className="border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-semibold transition"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Search (lowered position for clarity) */}
            <div className="relative z-20 -mt-12 flex justify-center">
                <SearchTemplate />
            </div>
        </div>
    );
};