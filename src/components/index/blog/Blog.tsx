import { BlogCard } from "./BlogCard.tsx";

export const Blog = () => {
    return (
        <section className="py-12 bg-base-100 text-center px-4">
            {/* Heading */}
            <div className="max-w-2xl mx-auto mb-8">
                <p className="text-3xl font-bold text-primary mb-2">Blog</p>
                <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                <BlogCard
                    image="https://images.unsplash.com/photo-1581093588401-40bcb6b15a83"
                    title="6 Strategies to Find Your Conference Keynote and Other Speakers"
                    description="Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah."
                    author="Jhon Doe"
                    date="12 Mar"
                />
                <BlogCard
                    image="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
                    title="How Successfully Used Paid Marketing to Drive Incremental Ticket Sales"
                    description="Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah."
                    author="Jhon Doe"
                    date="12 Mar"
                />
                <BlogCard
                    image="https://images.unsplash.com/photo-1593642532973-d31b6557fa68"
                    title="Introducing Workspaces: Work smarter, not harder with new navigation"
                    description="Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah."
                    author="Jhon Doe"
                    date="12 Mar"
                />
            </div>

            {/* Load More */}
            <div className="mt-10">
                <a
                    href="#"
                    className="btn btn-outline btn-primary px-6"
                >
                    Load More
                </a>
            </div>
        </section>
    );
};
