import React from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="footer p-10 bg-my-neutral text-my-neutral-content flex flex-col sm:flex-row sm:justify-between items-start gap-8">
                {/* Company Info / Brand Section */}
                <aside className="flex flex-col items-start sm:w-1/3">
                    <div className="flex items-center mb-4">
                        <img src={"src/assets/tiquet-logo-no-background.png"} alt="Tiquet Logo" className={'h-10 w-24 mr-2'}/>
                    </div>
                    <p className={"text-my-neutral-content/80 text-sm mb-4"}>
                        Tiquet is a global self-service ticketing platform for live experiences that allows <br />
                        anyone to create, share, find and attend events that fuel their passions and enrich their lives.
                    </p>
                    <div className="grid grid-flow-col gap-4">
                        {/* Social Media Icons */}
                        <a href="#" aria-label="Twitter" className="text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="YouTube" className="text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook" className="text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </aside>

                {/* Navigation Links - Plan Events */}
                <nav className="sm:w-1/6">
                    <h6 className="footer-title text-my-neutral-content/90">Plan Events</h6>
                    <ul>
                        <li><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Create and Set up</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Sell tickets</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Online RSVP</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Online Events</a></li>
                    </ul>
                </nav>

                {/* Navigation Links - Tiquet */}
                <nav className="sm:w-1/6">
                    <h6 className="footer-title text-my-neutral-content/90">Tiquet</h6>
                    <ul>
                        <li><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">About Us</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Contact us</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Privacy Policy</a></li>
                        <li className="mt-2"><a className="link link-hover text-my-neutral-content/70 hover:text-my-primary transition-colors duration-200">Terms of Service</a></li>
                    </ul>
                </nav>

                {/* Newsletter Signup */}
                <form className="sm:w-1/3">
                    <h6 className="footer-title text-my-neutral-content/90">Newsletter</h6>
                    <fieldset className="w-full text-my-neutral-content/70">
                        <label className="label">
                            <span className="label-text text-my-neutral-content/70">Join our mailing list to stay in the loop with our latest Events and Concerts.</span>
                        </label>
                        <div className="join w-full">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="input input-bordered join-item w-full bg-my-base-100 text-my-base-content"
                                aria-label="Email for newsletter"
                            />
                            <button className="btn btn-primary join-item">Subscribe</button>
                        </div>
                    </fieldset>
                </form>
            </footer>

            {/* Copyright Section */}
            <aside className="footer footer-center p-4 bg-my-base-200 text-my-base-content">
                <p className={'text-my-base-content/70 text-sm'}>
                    Copyright © {currentYear} - All rights reserved by Watukutu Events.
                </p>
            </aside>
        </>
    );
};