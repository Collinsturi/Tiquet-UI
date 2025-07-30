import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginUserMutation, useRegisterUserMutation } from '../../queries/general/AuthQuery.ts';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { loginSuccess } from '../../queries/general/ApplicationUserSlice.ts';

// Define your backend's base URL
    const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://tique-1dxi.onrender.com/api';

export const Auth = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();
    // New state for selected role in registration form
    const [selectedRole, setSelectedRole] = useState('event_attendee'); // Default role
    // New state for address
    const [address, setAddress] = useState('');
    // State for modal visibility
    const [showAddressModal, setShowAddressModal] = useState(false);


    // State for form handling and messages
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formMessage, setFormMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // For overall form submission status

    // RTK Query hooks
    const [loginUser, { isLoading: isLoginLoading}] = useLoginUserMutation();
    const [registerUser, { isLoading: isRegisterLoading}] = useRegisterUserMutation();

    // Yup validation schema for login
    const loginSchema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    // Yup validation schema for registration - Added role and address validation
    const registerSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        contactPhone: yup.string().required('Phone Number is required'),
        email: yup.string().trim().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
        role: yup.string().oneOf(['event_attendee', 'organizer'], 'Invalid role selected').required('Role is required'),
        address: yup.string().nullable().notRequired() // Address is optional for registration
    });

    const dispatch = useDispatch();

    const clearFields = () => {
        setErrors({});
        setFormMessage('');
        setSelectedRole('event_attendee'); // Reset role when switching views or clearing fields
        setAddress(''); // Clear address field
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setFormMessage('');
        setIsSubmitting(true);

        const email = (e.target as HTMLFormElement).email.value.trim();
        const password = (e.target as HTMLFormElement).password.value;

        console.log("Email entered:", `"${email}"`);

        const values = { email, password };

        try {

            await loginSchema.validate(values, { abortEarly: false });


            const res = await loginUser(values).unwrap();

            const userPayload = {
                token: res.token,
                user: {
                    user_id: res.user.user_id,
                    first_name: res.user.first_name,
                    last_name: res.user.last_name,
                    email: res.user.email,
                    role: res.user.role,
                    // profilePicture: res.user.profilePicture
                }
            };

            dispatch(loginSuccess(userPayload));
            // localStorage.setItem('user', JSON.stringify(userPayload));

            setFormMessage('Login successful!');
            clearFields();

            const role = res.user.role;
            if (role === 'organizer') navigate('/organizer');
            else if (role === 'check_in_staff') navigate('/staff');
            else if (role === 'event_attendee') navigate('/attendee');
            else navigate('/attendee'); // fallback redirection

        } catch (err: any) {
            if (err.inner) {
                const fieldErrors: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    if (e.path) {
                        fieldErrors[e.path] = e.message;
                    }
                });
                setErrors(fieldErrors);
                setFormMessage('Please correct the form errors.');
            }
            else if (err?.data?.message) {
                setFormMessage(err.data.message);
                console.error('API Error:', err.data);
            } else {
                setFormMessage('An unexpected error occurred.');
                console.error('General Error:', err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle the actual registration submission
    const submitRegistration = async (finalAddress: string | null) => {
        setIsSubmitting(true); // Set submitting true when starting registration
        setFormMessage(''); // Clear any previous messages

        // Re-gather values from the form, using the finalAddress from modal interaction
        const form = document.getElementById('registration-form') as HTMLFormElement;
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const contactPhone = form.phoneNumber.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const role = selectedRole; // Use selected role from state

        const values = {
            firstName,
            lastName,
            contactPhone,
            email,
            password,
            confirmPassword,
            role,
            ...(finalAddress ? { address: finalAddress } : {}) // Only include if it has a value
        };

        try {
            // Validate again, including the final address value
            await registerSchema.validate(values, { abortEarly: false });

            await registerUser(values).unwrap();

            setFormMessage('Registration successful!');
            clearFields();
            setIsLoginView(true); // Automatically switch to login view after successful registration
            navigate('/verify-email', { state: { email } });

        } catch (err: any) {
            if (err.inner) {
                const fieldErrors: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    if (e.path) {
                        fieldErrors[e.path] = e.message;
                    }
                });
                setErrors(fieldErrors);
                setFormMessage('Please correct the form errors.');
            }
            else if (err?.data?.message) {
                setFormMessage(err.data.message);
                console.error("Registration failed:", err.data);
            } else {
                setFormMessage('An unexpected error occurred during registration.');
                console.error('General Error:', err);
            }
        } finally {
            setIsSubmitting(false); // Set submitting false after registration attempt
            setShowAddressModal(false); // Close modal on submission attempt
        }
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setFormMessage('');
        setIsSubmitting(true); // Set submitting true when starting the process

        const form = e.target as HTMLFormElement;
        const userAddress = form.address.value; // Get current address value from form

        // If address is empty, show the modal
        if (!userAddress) {
            setShowAddressModal(true);
            setIsSubmitting(false); // Release submitting state for the main form while modal is open
            return;
        }

        // If address is filled, proceed directly
        await submitRegistration(userAddress);
    };

    // Handle Google OAuth - redirect to backend endpoint
    const handleGoogleOAuth = () => {
        console.log("Initiating Google OAuth...");
        // Redirect to your backend's Google OAuth initiation endpoint
        window.location.href = `${BASE_URL}/auth/google`;
    };

    // Effect to handle OAuth callback from backend
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const firstName = params.get('firstName');
        const lastName = params.get('lastName');
        const email = params.get('email');
        const role = params.get('role');
        const error = params.get('error');

        if (token && userId && firstName && lastName && email && role) {
            const userPayload = {
                token,
                user: {
                    user_id: parseInt(userId),
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    role: role
                }
            };
            dispatch(loginSuccess(userPayload));
            setFormMessage('Login successful via Google!');
            // Clean up the URL
            navigate(window.location.pathname, { replace: true });

            // Redirect based on role
            if (role === 'admin') navigate('/platformAdmin');
            else if (role === 'check_in_staff') navigate('/staff');
            else if (role === 'event_attendee') navigate('/attendee');
            else navigate('/attendee'); // fallback redirection

        } else if (error) {
            setFormMessage(`Google authentication failed: ${error.replace(/_/g, ' ')}`);
            // Clean up the URL
            navigate(window.location.pathname, { replace: true });
        }
    }, [dispatch, navigate]);


    return (
        // Apply base-200 background and font-sans from custom theme
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-my-base-200)] p-4 font-sans">
            {/* Apply base-100 background, base-300 border, and enhanced shadow */}
            <div className="w-full max-w-md bg-[var(--color-my-base-100)] shadow-2xl border border-[var(--color-my-base-300)] rounded-lg p-6 md:p-8 space-y-6">
                {/* Apply neutral background with padding and rounded corners */}
                <div className={"bg-[var(--color-my-neutral)] p-4 rounded-md"}>
                    {/* Apply neutral-content text color and subtle hover effect for the link */}
                    <h5 className={"text-center font-light text-[var(--color-my-neutral-content)]"}>
                        <NavLink to={'/'} className="inline-block transition-transform duration-300 hover:scale-105">
                            {/* Image for Tkti logo */}
                            <img src={"https://res.cloudinary.com/dd9wneqwy/image/upload/v1753822651/tiquet-logo-no-background_qsli2u.png"} alt="Tkti Logo" className="mx-auto h-12 w-auto object-contain" />
                        </NavLink>
                    </h5>
                </div>
                {/* Apply primary text color */}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-[var(--color-my-primary)]">
                    {isLoginView ? 'Welcome Back' : 'Create an Account'}
                </h1>

                <div className="flex justify-center mb-6">
                    <button
                        // Apply primary background/content for active, ghost for inactive, and smooth transitions
                        className={`btn ${isLoginView ? 'bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]' : 'bg-transparent text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-300)]'} mr-4 transition-colors duration-300`}
                        onClick={() => {
                            setIsLoginView(true);
                            clearFields(); // Clear messages/errors when switching views
                        }}
                    >
                        Login
                    </button>
                    <button
                        // Apply secondary background/content for active, ghost for inactive, and smooth transitions
                        className={`btn ${!isLoginView ? 'bg-[var(--color-my-secondary)] text-[var(--color-my-secondary-content)] hover:bg-[var(--color-my-secondary-focus)]' : 'bg-transparent text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-300)]'} transition-colors duration-300`}
                        onClick={() => {
                            setIsLoginView(false);
                            clearFields(); // Clear messages/errors when switching views
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Display form messages with consistent padding and rounded corners */}
                {formMessage && (
                    <div className={`alert ${formMessage.includes('successful') ? 'bg-[var(--color-my-success)]' : 'bg-[var(--color-my-error)]'} shadow-lg mb-4 text-[var(--color-my-base-content)] rounded-md py-3 px-4`}>
                        <div>
                            <span>{formMessage}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleOAuth}
                        // Apply primary outline styles with focus ring
                        className="btn btn-outline w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center border-[var(--color-my-primary)] text-[var(--color-my-primary)] hover:bg-[var(--color-my-primary)] hover:text-[var(--color-my-primary-content)] focus:ring focus:ring-[var(--color-my-primary)] focus:ring-opacity-50"
                        disabled={isLoginLoading || isRegisterLoading || isSubmitting}
                    >
                        {/* Google SVG Icon */}
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.24 10.284V14.4H18.444C18.267 15.429 17.65 16.514 16.82 17.291C16.033 18.068 15.035 18.665 13.91 19.043L13.905 19.046L13.91 19.043C12.785 19.421 11.558 19.61 10.285 19.61C6.21 19.61 2.76 16.29 2.76 12.21C2.76 8.13 6.21 4.81 10.285 4.81C12.193 4.81 13.882 5.487 15.222 6.754L18.09 3.886C16.14 2.052 13.36 1 10.285 1C4.61 1 0 5.61 0 12.21C0 18.81 4.61 23.41 10.285 23.41C13.36 23.41 16.14 22.368 18.09 20.534C20.04 18.7 21.095 16.06 21.095 12.21C21.095 11.59 21.028 10.96 20.9 10.38L12.24 10.284Z" fill="#EA4335"/>
                            <path d="M23.41 12.21C23.41 11.59 23.343 10.96 23.215 10.38L14.555 10.284V14.4H20.759C20.582 15.429 19.965 16.514 19.135 17.291C18.348 18.068 17.35 18.665 16.225 19.043L16.22 19.046L16.225 19.043C15.1 19.421 13.873 19.61 12.6 19.61C8.525 19.61 5.075 16.29 5.075 12.21C5.075 8.13 8.525 4.81 12.6 4.81C14.508 4.81 16.197 5.487 17.537 6.754L20.405 3.886C18.455 2.052 15.675 1 12.6 1C6.935 1 2.325 5.61 2.325 12.21C2.325 18.81 6.935 23.41 12.6 23.41C15.675 23.41 18.455 22.368 20.405 20.534C22.355 18.7 23.41 16.06 23.41 12.21Z" fill="#4285F4"/>
                            <path d="M2.76 12.21C2.76 8.13 6.21 4.81 10.285 4.81C12.193 4.81 13.882 5.487 15.222 6.754L18.09 3.886C16.14 2.052 13.36 1 10.285 1C4.61 1 0 5.61 0 12.21C0 18.81 4.61 23.41 10.285 23.41C11.558 23.41 12.785 23.221 13.91 22.843L13.905 22.846L13.91 22.843C15.035 22.465 16.033 21.868 16.82 21.091C17.65 20.314 18.267 19.229 18.444 18.2H12.24V14.4H18.444C18.267 15.429 17.65 16.514 16.82 17.291C16.033 18.068 15.035 18.665 13.91 19.043L13.905 19.046L13.91 19.043C12.785 19.421 11.558 19.61 10.285 19.61C6.21 19.61 2.76 16.29 2.76 12.21Z" fill="#FBBC05"/>
                            <path d="M12.24 10.284V14.4H18.444C18.267 15.429 17.65 16.514 16.82 17.291C16.033 18.068 15.035 18.665 13.91 19.043L13.905 19.046L13.91 19.043C12.785 19.421 11.558 19.61 10.285 19.61C6.21 19.61 2.76 16.29 2.76 12.21C2.76 8.13 6.21 4.81 10.285 4.81C12.193 4.81 13.882 5.487 15.222 6.754L18.09 3.886C16.14 2.052 13.36 1 10.285 1C4.61 1 0 5.61 0 12.21C0 18.81 4.61 23.41 10.285 23.41C13.36 23.41 16.14 22.368 18.09 20.534C20.04 18.7 21.095 16.06 21.095 12.21C21.095 11.59 21.028 10.96 20.9 10.38L12.24 10.284Z" fill="#34A853"/>
                        </svg>
                        Sign in with Google
                    </button>
                    {/* Removed the "Sign in with Microsoft" button */}
                </div>

                {/* Apply base-content/70 for divider text */}
                <div className="divider text-[var(--color-my-base-content)]/70">OR</div>

                {isLoginView ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your_email@example.com"
                                // Apply primary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-primary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-primary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.email ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.email && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                // Apply primary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-primary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-primary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.password ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.password && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.password}</p>}
                        </div>

                        <label className="label">
                            {/* Apply primary text color for link */}
                            <a href="#" className="label-text-alt link link-hover text-sm text-[var(--color-my-primary)]">
                                Forgot password?
                            </a>
                        </label>

                        <button
                            type="submit"
                            // Apply primary background/content, hover states, and focus ring
                            className="btn w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] focus:ring focus:ring-[var(--color-my-primary)] focus:ring-opacity-50"
                            disabled={isLoginLoading || isSubmitting}
                        >
                            {isLoginLoading || isSubmitting ? 'Logging In...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-6" id="registration-form"> {/* Added id="registration-form" */}
                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">First Name</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.firstName ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.firstName && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.lastName ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.lastName && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+1234567890"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.contactPhone ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.contactPhone && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.contactPhone}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your_email@example.com"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.email ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.email && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.password ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.password && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="label">
                                {/* Apply base-content text color */}
                                <span className="label-text text-[var(--color-my-base-content)]">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                // Apply secondary border, base-content text, error border, and focus ring
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.confirmPassword ? 'border-[var(--color-my-error)]' : ''}`}
                                required
                            />
                            {/* Apply error text color */}
                            {errors.confirmPassword && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* New Address Field */}
                        <div>
                            <label className="label">
                                <span className="label-text text-[var(--color-my-base-content)]">Address (Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Your full address"
                                className={`input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.address ? 'border-[var(--color-my-error)]' : ''}`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {errors.address && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Role Selection Dropdown */}
                        <div>
                            <label className="label">
                                <span className="label-text text-[var(--color-my-base-content)]">Register as</span>
                            </label>
                            <select
                                name="role"
                                className={`select select-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50 ${errors.role ? 'border-[var(--color-my-error)]' : ''}`}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
                            >
                                <option value="event_attendee">Event Attendee</option>
                                <option value="organizer">Organizer</option>
                            </select>
                            {errors.role && <p className="text-[var(--color-my-error)] text-sm mt-1">{errors.role}</p>}
                        </div>

                        <button
                            type="submit"
                            // Conditional styling for loading state
                            className={`btn w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
                                ${isRegisterLoading || isSubmitting
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Muted gray when loading
                                : 'bg-[var(--color-my-secondary)] text-[var(--color-my-secondary-content)] hover:bg-[var(--color-my-secondary-focus)]'
                            }
                                focus:ring focus:ring-[var(--color-my-secondary)] focus:ring-opacity-50`}
                            disabled={isRegisterLoading || isSubmitting}
                        >
                            {isRegisterLoading || isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="modal modal-open">
                    <div className="modal-box bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] shadow-lg rounded-lg p-6">
                        <h3 className="font-bold text-lg text-[var(--color-my-primary)] mb-4">Why We Ask for Your Address</h3>
                        <p className="py-4">
                            Providing your address helps us show you events happening close to your location,
                            making it easier for you to discover and attend events relevant to you.
                            You can always add or update it later in your profile settings.
                        </p>
                        <div className="form-control w-full mb-4">
                            <label className="label">
                                <span className="label-text text-[var(--color-my-base-content)]">Your Address (Optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your address here..."
                                className="input input-bordered w-full rounded-md border-[var(--color-my-secondary)] text-[var(--color-my-base-content)] focus:border-[var(--color-my-secondary-focus)] focus:ring focus:ring-[var(--color-my-accent)] focus:ring-opacity-50"
                                value={address} // Bind to the address state
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={isSubmitting} // Disable input while submitting
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                className={`btn rounded-md
                                    ${isSubmitting
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-[var(--color-my-secondary)] text-[var(--color-my-secondary-content)] hover:bg-[var(--color-my-secondary-focus)]'
                                }`}
                                onClick={() => submitRegistration(address || null)} // Pass current address (or null if empty)
                                disabled={isSubmitting} // Disable button while submitting
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Proceeding...
                                    </>
                                ) : (
                                    'Proceed with Registration'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;
