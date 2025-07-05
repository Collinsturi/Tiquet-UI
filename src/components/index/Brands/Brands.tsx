export const Brands = () => {
    const brandLogos = [
        {
            name: "Google",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        },
        {
            name: "Netflix",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        },
        {
            name: "Spotify",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
        },
        {
            name: "Amazon",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        },
        {
            name: "Adobe",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Adobe_Corporate_Logo.png",
        },
        {
            name: "Microsoft",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        },
        {
            name: "Facebook",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
        },
        {
            name: "YouTube",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
        },
    ];

    return (
        <section className="py-12 px-4 bg-base-200">
            {/* Header */}
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <p className="text-2xl font-bold text-gray-800 mb-2">Join These Brands</p>
                <p className="text-gray-600">
                    We've had the pleasure of working with industry-defining brands. These are just some of them.
                </p>
            </div>

            {/* Zigzag Logo Grid */}
            <div className="grid grid-rows-2 auto-cols-auto grid-flow-col gap-10 justify-center items-center">
                {brandLogos.map((brand, index) => (
                    <div
                        key={brand.name}
                        className={`w-28 h-14 flex items-center justify-center p-2 bg-white rounded-xl shadow 
              ${index % 2 === 0 ? "row-start-1" : "row-start-2"}`}
                    >
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-full object-contain grayscale hover:grayscale-0 transition duration-300"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
