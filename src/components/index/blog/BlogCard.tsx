type BlogCardProps = {
    image: string;
    title: string;
    description: string;
    author: string;
    date: string;
};

export const BlogCard = ({ image, title, description, author, date }: BlogCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-sm">
            {/* Blog Image */}
            <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-xl" />

            {/* Blog Content */}
            <div className="p-4">
                <h5 className="text-md font-semibold text-gray-900 mb-2 leading-snug">{title}</h5>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{description}</p>
                <p className="text-xs text-left text-gray-400">{date} – {author}</p>
            </div>
        </div>
    );
};
