import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import {NavLink} from "react-router-dom";

export const Auth = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    // const navigate = useNavigate();

    const handleGoogleOAuth = () => {
        console.log("Initiating Google OAuth...");
        // window.location.href = "YOUR_GOOGLE_AUTH_ENDPOINT";
    };

    const handleMicrosoftOAuth = () => {
        console.log("Initiating Microsoft OAuth...");
        // window.location.href = "YOUR_MICROSOFT_AUTH_ENDPOINT";
    };

    const handleLogin = (e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log("Attempting login with:", { email, password });
    };

    const handleRegister = (e: any) => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const phoneNumber = e.target.phoneNumber.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            console.error("Passwords do not match!");
            return;
        }

        console.log("Attempting registration with:", { firstName, lastName, phoneNumber, email, password });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 font-sans">
            <div className="w-full max-w-md bg-base-100 shadow-xl border border-base-300 rounded-lg p-6 md:p-8 space-y-6">
                <div className={"bg-neutral"}>
                    <h5 className={"text-center font-light"}><NavLink to={'/'}>Tkti</NavLink></h5>
                </div>
                <h1 className="text-4xl font-extrabold text-center mb-4 text-primary">
                    {isLoginView ? 'Welcome Back' : 'Create an Account'}
                </h1>

                <div className="flex justify-center mb-6">
                    <button
                        className={`btn ${isLoginView ? 'btn-primary' : 'btn-ghost'} mr-4`}
                        onClick={() => setIsLoginView(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`btn ${!isLoginView ? 'btn-secondary' : 'btn-ghost'}`}
                        onClick={() => setIsLoginView(false)}
                    >
                        Register
                    </button>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleOAuth}
                        className="btn btn-outline btn-primary w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                        Sign in with Google
                    </button>
                    <button
                        onClick={handleMicrosoftOAuth}
                        className="btn btn-outline btn-info w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                        Sign in with Microsoft
                    </button>
                </div>

                <div className="divider text-base-content/70">OR</div>

                {isLoginView ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your_email@example.com"
                                className="input input-bordered input-primary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="input input-bordered input-primary w-full rounded-md"
                                required
                            />
                        </div>

                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover text-sm text-primary">
                                Forgot password?
                            </a>
                        </label>

                        <button
                            type="submit"
                            className="btn btn-primary w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">First Name</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+1234567890"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your_email@example.com"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                className="input input-bordered input-secondary w-full rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-secondary w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Register
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;
