import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const About = () => {
    return (
        // Apply base-200 background and font-sans from custom theme
        <div className="min-h-screen flex flex-col bg-[var(--color-my-base-200)] font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:px-8 lg:px-12">
                {/* Apply primary text color */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--color-my-primary)] mb-10 mt-6 animate-fade-in-down">
                    About Tiquet
                </h1>

                {/* Apply base-content text color */}
                <p className="text-lg text-center text-[var(--color-my-base-content)] max-w-3xl mx-auto mb-12">
                    Welcome to Tiquet, your premier destination for discovering and experiencing unforgettable events.
                    We believe in the power of live experiences to connect people and create lasting memories.
                </p>

                <div className="space-y-12 max-w-4xl mx-auto">

                    {/* Our Mission Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg">
                        <div className="card-body p-8">
                            {/* Apply secondary text color */}
                            <h2 className="card-title text-3xl font-bold text-[var(--color-my-secondary)] mb-4 text-center">Our Mission</h2>
                            {/* Apply base-content text color */}
                            <p className="text-[var(--color-my-base-content)] text-lg text-justify">
                                At Tiquet, our mission is to simplify the event ticketing process for both organizers and attendees.
                                We strive to provide a seamless, secure, and user-friendly platform that empowers event creators
                                to reach a wider audience and helps individuals easily find and secure tickets to their favorite concerts,
                                festivals, sports events, theatrical performances, and more. We are committed to fostering vibrant
                                communities through shared live experiences.
                            </p>
                        </div>
                    </div>

                    {/* Our Story Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg">
                        <div className="card-body p-8">
                            {/* Apply secondary text color */}
                            <h2 className="card-title text-3xl font-bold text-[var(--color-my-secondary)] mb-4 text-center">Our Story</h2>
                            {/* Apply base-content text color */}
                            <p className="text-[var(--color-my-base-content)] text-lg text-justify">
                                Tiquet was founded in 2025 by a team of passionate event-goers and tech enthusiasts
                                who recognized the need for a more efficient and reliable ticketing solution.
                                Frustrated by complex booking processes and hidden fees, we set out to build a platform
                                that prioritizes transparency, ease of use, and a commitment to genuine event experiences.
                                Since then, Tiquet has grown into a trusted name, connecting millions of users with thousands
                                of incredible events worldwide.
                            </p>
                        </div>
                    </div>

                    {/* Our Values Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg">
                        <div className="card-body p-8">
                            {/* Apply secondary text color */}
                            <h2 className="card-title text-3xl font-bold text-[var(--color-my-secondary)] mb-4 text-center">Our Values</h2>
                            {/* Apply base-content text color */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--color-my-base-content)] text-lg">
                                <div className="flex items-start gap-3">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-my-primary)] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {/* Apply primary text color for bold text */}
                                    <p><span className="font-semibold text-[var(--color-my-primary)]">Reliability:</span> Ensuring a secure and dependable platform for every ticket transaction.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-my-primary)] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {/* Apply primary text color for bold text */}
                                    <p><span className="font-semibold text-[var(--color-my-primary)]">Innovation:</span> Continuously enhancing our technology to offer the best user experience.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-my-primary)] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 15v2m-2 2h4" />
                                    </svg>
                                    {/* Apply primary text color for bold text */}
                                    <p><span className="font-semibold text-[var(--color-my-primary)]">Community:</span> Connecting people through shared passions and memorable moments.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-my-primary)] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L3 12l5.714-2.143L13 3z" />
                                    </svg>
                                    {/* Apply primary text color for bold text */}
                                    <p><span className="font-semibold text-[var(--color-my-primary)]">Transparency:</span> Clear pricing and policies with no hidden surprises for our users.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Tiquet Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg">
                        <div className="card-body p-8">
                            {/* Apply secondary text color */}
                            <h2 className="card-title text-3xl font-bold text-[var(--color-my-secondary)] mb-4 text-center">Why Choose Tiquet?</h2>
                            {/* Apply base-content text color */}
                            <ul className="list-disc list-inside space-y-3 text-[var(--color-my-base-content)] text-lg pl-4">
                                {/* Apply primary text color for strong text */}
                                <li><strong className="text-[var(--color-my-primary)]">Vast Selection:</strong> Access to a wide array of events, from local gigs to major international festivals.</li>
                                <li><strong className="text-[var(--color-my-primary)]">Easy Booking:</strong> Our intuitive interface ensures a quick and hassle-free ticket purchase experience.</li>
                                <li><strong className="text-[var(--color-my-primary)]">Secure Transactions:</strong> State-of-the-art security measures to protect your personal and payment information.</li>
                                <li><strong className="text-[var(--color-my-primary)]">Dedicated Support:</strong> Our customer service team is always ready to assist you.</li>
                                <li><strong className="text-[var(--color-my-primary)]">Organizer Friendly:</strong> Powerful tools for event organizers to manage their events and ticket sales effectively.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Call to Action */}
                    {/* Apply success background and base-content text for the alert */}
                    <div className="alert shadow-lg mt-12 text-center max-w-4xl mx-auto bg-[var(--color-my-success)] text-[var(--color-my-base-content)]">
                        <div>
                            {/* Apply current stroke color from parent */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>Ready to discover your next great experience? Start browsing events on Tiquet today!</span>
                            {/* Apply base-content background and success text for the button */}
                            <a href="#" className="btn btn-sm ml-4 rounded-md bg-[var(--color-my-base-content)] text-[var(--color-my-success)] hover:bg-[var(--color-my-base-300)] hover:text-[var(--color-my-primary)]">Explore Events</a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
