import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col bg-base-200 font-sans">
             <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:px-8 lg:px-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-10 mt-6 animate-fade-in-down">
                    Contact Us
                </h1>

                <p className="text-lg text-center text-base-content max-w-3xl mx-auto mb-12">
                    Have questions, feedback, or need assistance? Our team is here to help!
                    Please feel free to reach out to us using any of the methods below.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Contact Form Section */}
                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl p-8 border border-base-300">
                        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Send Us a Message</h2>
                        <form className="space-y-6">
                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content">Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full rounded-md"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content">Your Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    className="input input-bordered w-full rounded-md"
                                    required
                                />
                            </div>

                            {/* Subject Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content">Subject</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Regarding an event ticket"
                                    className="input input-bordered w-full rounded-md"
                                    required
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content">Your Message</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32 rounded-md"
                                    placeholder="Type your message here..."
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="form-control mt-8">
                                <button type="submit" className="btn btn-primary btn-lg w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Details Section */}
                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl p-8 border border-base-300 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Our Contact Details</h2>

                            <div className="space-y-6 text-base-content text-lg">
                                {/* Email Address */}
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-17 0a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Email Us:</p>
                                        <a href="mailto:support@tkti.com" className="link link-hover text-info-content break-words">
                                            support@tkti.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Call Us:</p>
                                        <a href="tel:+1234567890" className="link link-hover text-info-content">
                                            +2547 0000 000
                                        </a>
                                    </div>
                                </div>

                                {/* Physical Address */}
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Visit Our Office:</p>
                                        <address className="not-italic text-base-content">
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
                            <h3 className="text-xl font-semibold mb-4 text-primary">Connect With Us:</h3>
                            <div className="flex justify-center gap-4">
                                <a href="#" className="btn btn-circle btn-primary btn-outline text-2xl" aria-label="Facebook">
                                    <i className="fab fa-facebook-f"></i> {/* Font Awesome icon */}
                                </a>
                                <a href="#" className="btn btn-circle btn-primary btn-outline text-2xl" aria-label="Twitter">
                                    <i className="fab fa-twitter"></i> {/* Font Awesome icon */}
                                </a>
                                <a href="#" className="btn btn-circle btn-primary btn-outline text-2xl" aria-label="Instagram">
                                    <i className="fab fa-instagram"></i> {/* Font Awesome icon */}
                                </a>
                                {/* Add more social media icons as needed */}
                            </div>
                            <p className="text-sm text-base-content mt-4">
                                Follow us on social media for the latest updates and event announcements.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="alert alert-info shadow-lg mt-12 text-center max-w-4xl mx-auto">
                    <div>
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
