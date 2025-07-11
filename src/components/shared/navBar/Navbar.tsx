import {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Adjust this threshold based on when you want the frosting to appear.
            // If you want it frosted from the start over the hero, you might use 0 or a very small number.
            const isScrolled = window.scrollY > 50; // Changed to a smaller value for earlier frosting
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <>
            {/* Navbar */}
            <nav className={`navbar fixed w-full z-20 transition-all duration-300 flex py-4
    ${scrolled
                ? 'bg-white/50 backdrop-blur-lg shadow-md'
                : 'bg-transparent'
            }`}>

            <div className="flex-none lg:hidden">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        {/* Ensure these icons contrast with the background */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={`inline-block h-6 w-6 stroke-current ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 items-center">
                    <NavLink to={"/"} className="btn-ghost text-xl">
                        {/* You might want to have a different logo for scrolled state for better visibility */}
                        <img
                            src={"src/assets/tiquet-logo-no-background.png"}
                            alt={"Logo"}
                            className={`h-8 w-20 ml-3 ${scrolled ? 'filter grayscale-0' : 'filter brightness-200'}`} // Example: make logo brighter when not scrolled, normal when scrolled
                        />
                    </NavLink>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex p-3">
                    <ul className="flex flex-row gap-8 items-center">
                        <li><NavLink to="/events" className={scrolled ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" : "border-white text-white hover:bg-white hover:text-black"}>Events</NavLink></li>
                        <li><NavLink to="/how-it-works" className={scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-200"}>How it works</NavLink></li>
                        <li><NavLink to="/about" className={scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-200"}>About</NavLink></li>
                        <li><NavLink to="/contact" className={scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-200"}>Contact</NavLink></li>
                        <li><NavLink to="/legal" className={scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-200"}>Legal</NavLink></li>
                        <li>
                            <a className={`border-2  p-2 rounded-md ${scrolled ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" : "border-white text-white hover:bg-white hover:text-black"}`} href="/login">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Blur Overlay (for mobile menu) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-10" // Slightly more opaque and blurred
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar Menu (mobile) */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-base-200 shadow-lg z-30 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="text-xl font-bold">Menu</span>
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <ul className="flex flex-col p-4 space-y-4">
                    <li><NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink></li>
                    <li><NavLink to="/how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</NavLink></li>
                    <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
                    <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
                    <li><NavLink to="/legal" onClick={() => setIsMenuOpen(false)}>Legal</NavLink></li>
                    <li>
                        <a className="border-2 p-2 rounded-md" href="/login" onClick={() => setIsMenuOpen(false)}>Login</a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;