import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const Contact = () => {
    return (
        // Apply base-200 background and font-sans from custom theme
        <div className="min-h-screen flex flex-col bg-[var(--color-my-base-200)] font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:px-8 lg:px-12">
                {/* Apply primary text color */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--color-my-primary)] mb-10 mt-6 animate-fade-in-down">
                    Contact Us
                </h1>

                {/* Apply base-content text color */}
                <p className="text-lg text-center text-[var(--color-my-base-content)] max-w-3xl mx-auto mb-12">
                    Have questions, feedback, or need assistance? Our team is here to help!
                    Please feel free to reach out to us using any of the methods below.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Contact Form Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="flex-1 bg-[var(--color-my-base-100)] rounded-lg shadow-xl p-8 border border-[var(--color-my-base-300)]">
                        {/* Apply secondary text color */}
                        <h2 className="text-3xl font-bold text-[var(--color-my-secondary)] mb-6 text-center">Send Us a Message</h2>
                        <form className="space-y-6">
                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label">
                                    {/* Apply base-content text color */}
                                    <span className="label-text text-[var(--color-my-base-content)]">Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    // Apply base-100 background, base-300 border, base-content text
                                    className="input input-bordered w-full rounded-md bg-[var(--color-my-base-100)] border-[var(--color-my-base-300)] text-[var(--color-my-base-content)]"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    {/* Apply base-content text color */}
                                    <span className="label-text text-[var(--color-my-base-content)]">Your Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    // Apply base-100 background, base-300 border, base-content text
                                    className="input input-bordered w-full rounded-md bg-[var(--color-my-base-100)] border-[var(--color-my-base-300)] text-[var(--color-my-base-content)]"
                                    required
                                />
                            </div>

                            {/* Subject Input */}
                            <div className="form-control">
                                <label className="label">
                                    {/* Apply base-content text color */}
                                    <span className="label-text text-[var(--color-my-base-content)]">Subject</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Regarding an event ticket"
                                    // Apply base-100 background, base-300 border, base-content text
                                    className="input input-bordered w-full rounded-md bg-[var(--color-my-base-100)] border-[var(--color-my-base-300)] text-[var(--color-my-base-content)]"
                                    required
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="form-control">
                                <label className="label">
                                    {/* Apply base-content text color */}
                                    <span className="label-text text-[var(--color-my-base-content)]">Your Message</span>
                                </label>
                                <textarea
                                    // Apply base-100 background, base-300 border, base-content text
                                    className="textarea textarea-bordered h-32 rounded-md bg-[var(--color-my-base-100)] border-[var(--color-my-base-300)] text-[var(--color-my-base-content)]"
                                    placeholder="Type your message here..."
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="form-control mt-8">
                                <button
                                    type="submit"
                                    // Apply primary background, primary-content text, and hover states
                                    className="btn btn-lg w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Details Section */}
                    {/* Apply base-100 background, base-300 border */}
                    <div className="flex-1 bg-[var(--color-my-base-100)] rounded-lg shadow-xl p-8 border border-[var(--color-my-base-300)] flex flex-col justify-between">
                        <div>
                            {/* Apply secondary text color */}
                            <h2 className="text-3xl font-bold text-[var(--color-my-secondary)] mb-6 text-center">Our Contact Details</h2>

                            {/* Apply base-content text color */}
                            <div className="space-y-6 text-[var(--color-my-base-content)] text-lg">
                                {/* Email Address */}
                                <div className="flex items-center gap-4">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-my-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-17 0a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Email Us:</p>
                                        {/* Apply info color for link */}
                                        <a href="mailto:support@tkti.com" className="link link-hover text-[var(--color-my-info)] break-words">
                                            support@tkti.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="flex items-center gap-4">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-my-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Call Us:</p>
                                        {/* Apply info color for link */}
                                        <a href="tel:+1234567890" className="link link-hover text-[var(--color-my-info)]">
                                            +2547 0000 000
                                        </a>
                                    </div>
                                </div>

                                {/* Physical Address */}
                                <div className="flex items-center gap-4">
                                    {/* Apply primary text color for icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-my-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Visit Our Office:</p>
                                        {/* Apply base-content text color */}
                                        <address className="not-italic text-[var(--color-my-base-content)]">
                                            123 Event Avenue,<br/>
                                            Suite 456,<br/>
                                            Cityville, State, 12345<br/>
                                            Country
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links Placeholder */}
                        <div className="mt-8 text-center">
                            {/* Apply primary text color */}
                            <h3 className="text-xl font-semibold mb-4 text-[var(--color-my-primary)]">Connect With Us:</h3>
                            <div className="flex justify-center gap-4">
                                {/* Facebook Icon (Inline SVG) */}
                                <a href="#" className="btn btn-circle btn-outline text-2xl bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] border-[var(--color-my-primary)] hover:bg-[var(--color-my-primary-focus)] hover:border-[var(--color-my-primary-focus)]" aria-label="Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.588-1.333h2.412v-3h-3.473c-4.045 0-5.527 1.164-5.527 4.667v2.333z"/></svg>
                                </a>
                                {/* Twitter Icon (Inline SVG) */}
                                <a href="#" className="btn btn-circle btn-outline text-2xl bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] border-[var(--color-my-primary)] hover:bg-[var(--color-my-primary-focus)] hover:border-[var(--color-my-primary-focus)]" aria-label="Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.426 0-6.22 2.795-6.22 6.22 0 .486.055.96.162 1.414-5.176-.259-9.75-2.73-12.898-6.472-.534.918-.846 1.988-.846 3.139 0 2.152 1.096 4.053 2.766 5.164-.808-.025-1.56-.246-2.22-.614v.08c0 3.016 2.138 5.534 4.978 6.096-.518.141-1.06.215-1.616.215-.397 0-.78-.038-1.154-.11 0 2.16 1.72 3.962 4.075 4.01-.707.554-1.59 1.03-2.553 1.234-1.047.217-2.127.322-3.232.322-.21 0-.417-.013-.623-.038 2.21 1.42 4.84 2.25 7.66 2.25 9.196 0 14.23-7.61 14.23-14.23 0-.194-.005-.388-.013-.582.973-.7 1.81-1.56 2.47-2.54z"/></svg>
                                </a>
                                {/* Instagram Icon (Inline SVG) */}
                                <a href="#" className="btn btn-circle btn-outline text-2xl bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] border-[var(--color-my-primary)] hover:bg-[var(--color-my-primary-focus)] hover:border-[var(--color-my-primary-focus)]" aria-label="Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-0.148 3.252-1.691 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.07c-3.251-0.148-4.771-1.691-4.919-4.919-0.058-1.265-0.069-1.645-0.069-4.849s0.012-3.584.07-4.85c0.148-3.252 1.691-4.771 4.919-4.919 1.266-0.057 1.645-0.069 4.849-0.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-0.059 1.281-0.073 1.689-0.073 4.948s0.014 3.668 0.072 4.947c0.2 4.358 2.618 6.78 6.98 6.98 1.281 0.058 1.689 0.073 4.948 0.073s3.668-0.014 4.947-0.072c4.354-0.2 6.782-2.618 6.979-6.98 0.059-1.28.073-1.689.073-4.948s-0.014-3.667-0.072-4.947c-0.196-4.354-2.617-6.78-6.979-6.98-1.281-0.059-1.69-0.073-4.949-0.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4c0 2.208-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                {/* Add more social media icons as needed */}
                            </div>
                            {/* Apply base-content text color */}
                            <p className="text-sm text-[var(--color-my-base-content)] mt-4">
                                Follow us on social media for the latest updates and event announcements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Apply info background and base-content text for the alert */}
                <div className="alert shadow-lg mt-12 text-center max-w-4xl mx-auto bg-[var(--color-my-info)] text-[var(--color-my-base-content)]">
                    <div>
                        {/* Apply current stroke color from parent */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>
                            Our support team typically responds within 24-48 business hours. Thank you for your patience!
                        </span>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
