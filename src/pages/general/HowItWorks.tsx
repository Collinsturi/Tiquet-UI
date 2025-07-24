import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const HowItWorks = () => {
    return (
        // Apply base-200 background and font-sans from custom theme
        <div className="min-h-screen flex flex-col bg-[var(--color-my-base-200)] font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:px-8 lg:px-12">
                {/* Apply primary text color */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--color-my-primary)] mb-10 mt-6 animate-fade-in-down">
                    How Tkti Works
                </h1>

                {/* Apply base-content text color */}
                <p className="text-lg text-center text-[var(--color-my-base-content)] max-w-3xl mx-auto mb-12">
                    Whether you're looking for an unforgettable experience or planning your next big event,
                    Tkti makes the process simple and seamless. Here's how our platform works for everyone.
                </p>

                <div className="space-y-16 max-w-5xl mx-auto">

                    {/* How It Works for Attendees */}
                    <section>
                        {/* Applay secondary text color */}
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-my-secondary)] text-center mb-8">For Attendees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Step 1: Discover Events */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">1. Discover Events</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Browse thousands of events by category, date, location, or keyword. Our powerful search and
                                        recommendation engine helps you find exactly what you're looking for, from concerts and sports
                                        to workshops and conferences.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2: Select Tickets */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M12 9V6m0 4v4m0 4v2M9 5v2m0 4v2m0 4v2M3 7h18M3 17h18M6 21h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">2. Select & Secure</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Choose your preferred ticket type and quantity. Our secure checkout process ensures your
                                        personal and payment information is protected. We offer various payment methods for your convenience.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3: Enjoy the Event */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">3. Enjoy the Event!</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Receive your e-tickets directly to your email or Tkti account. Present them at the venue
                                        (digital or print-out) and get ready to immerse yourself in an unforgettable live experience!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works for Organizers */}
                    <section>
                        {/* Apply secondary text color */}
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-my-secondary)] text-center mb-8">For Organizers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Step 1: Create Your Event */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">1. Create Your Event</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Easily set up your event page with comprehensive details, captivating images, and flexible
                                        ticket types. Our intuitive interface makes event creation a breeze, getting you ready to sell in minutes.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2: Manage Tickets & Sales */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v2m-2-4v4m0-8h4m0 0v4m0 4h4m0-8h4m0 0v4M3 7l6-3 6 3 6-3V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">2. Manage & Promote</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Utilize our robust tools to manage ticket inventory, set pricing tiers, and track sales in real-time.
                                        Promote your event with integrated marketing features and easy sharing options.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3: Gain Insights & Payout */}
                            {/* Apply base-100 background, base-300 border */}
                            <div className="card bg-[var(--color-my-base-100)] shadow-xl border border-[var(--color-my-base-300)] rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="card-body items-center text-center p-6">
                                    {/* Apply primary text color for icon */}
                                    <div className="text-[var(--color-my-primary)] mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M18 14H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    {/* Apply primary text color for title */}
                                    <h3 className="card-title text-2xl font-semibold mb-2 text-[var(--color-my-primary)]">3. Insights & Payout</h3>
                                    {/* Apply base-content text color */}
                                    <p className="text-[var(--color-my-base-content)] text-justify">
                                        Access detailed analytics and reports to understand your audience and optimize future events.
                                        Receive timely and secure payouts for your ticket sales directly to your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    {/* Apply info background and base-content text for the alert */}
                    <div className="alert shadow-lg mt-12 text-center max-w-4xl mx-auto bg-[var(--color-my-info)] text-[var(--color-my-base-content)]">
                        <div>
                            {/* Apply current stroke color from parent */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Ready to get started? Join Tkti today and experience the difference!</span>
                            {/* Apply base-content background and info text for the button */}
                            <a href="#" className="btn btn-sm ml-4 rounded-md bg-[var(--color-my-base-content)] text-[var(--color-my-info)] hover:bg-[var(--color-my-base-300)] hover:text-[var(--color-my-primary)]">Sign Up Now</a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
