import { SearchTemplate } from "../../shared/searchTemplate/SearchTemplate.tsx";
import { useNavigate } from "react-router-dom";

const featuredEvents = [
    {
        id: 1,
        image: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    },
    {
        id: 2,
        image: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    },
    {
        id: 3,
        image: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    },
    {
        id: 4,
        image: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    },
];

export const Featured = () => {
    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* Carousel */}
            <div className="carousel w-full">
                {featuredEvents.map((event, index) => (
                    <div
                        key={event.id}
                        id={`slide${index + 1}`}
                        className="carousel-item relative w-full"
                    >
                        <img
                            src={event.image}
                            alt={`Event ${event.id}`}
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="w-full cursor-pointer"
                        />
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a
                                href={`#slide${index === 0 ? featuredEvents.length : index}`}
                                className="btn btn-circle"
                            >
                                ❮
                            </a>
                            <a
                                href={`#slide${index === featuredEvents.length - 1 ? 1 : index + 2}`}
                                className="btn btn-circle"
                            >
                                ❯
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* SearchTemplate "hanging" between sections */}
            <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 z-10">
                <SearchTemplate />
            </div>
        </div>
    );
};
