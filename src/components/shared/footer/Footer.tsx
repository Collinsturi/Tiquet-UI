export const Footer = () => {
    return (
        <>
            <footer className="footer sm:footer-horizontal bg-my-neutral text-base-content p-10">
                <aside>
                    <div className={"flex flex-row"}>
                        <img src={"src/assets/tiquet-logo-no-background.png"} className={'h-8 w-20 ml-3'}/>
                    </div>

                    <div>
                        <p className={"text-my-base-300"}>Tkti is a global self-service ticketing platform for live experiences that allows <br />
                            anyone to create, share, find and attend events that fuel their passions and enrich their lives</p>
                    </div>

                    <div className="grid grid-flow-col gap-4">
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </aside>

                <div>
                    <h6 className="footer-title text-my-base-300">Plan events</h6>

                    <ul>
                        <li className="link link-hover text-my-base-300">Create and Set up</li>
                        <li className="link link-hover mt-2 text-my-base-300">Sell tickets</li>
                        <li className="link link-hover mt-2 text-my-base-300">Online Rsvp</li>
                        <li className="link link-hover mt-2 text-my-base-300">Online Events</li>
                    </ul>
                </div>

                <div>
                    <h6 className="footer-title text-my-base-300">Tkti</h6>

                    <ul>
                        <li className="link link-hover text-my-base-300">About Us</li>
                        <li className="link link-hover mt-2 text-my-base-300">Contact us</li>
                        <li className="link link-hover mt-2 text-my-base-300">Privacy</li>
                        <li className="link link-hover mt-2 text-my-base-300">Terms</li>
                    </ul>
                </div>

                <form>
                    <h6 className="footer-title text-my-base-300">Newsletter</h6>
                    <fieldset className="w-80 text-my-base-300">
                        <label>Join our mailing list to stay in the loop with our latest Events and Concerts</label>
                        <div className="join">
                            <input
                                type="text"
                                placeholder="Enter your email address"
                                className="input input-bordered join-item" />
                            <button className="btn btn-primary join-item">Subscribe</button>
                        </div>
                    </fieldset>
                </form>
            </footer>
            <aside className="footer sm:footer-horizontal footer-center bg-my-neutral border-2 border-white text-base-content p-4">
                <p className={'text-my-base-300'}>Copyright © {new Date().getFullYear()} - All right reserved by Le Brand Extended Events</p>
            </aside>
        </>
    );
};