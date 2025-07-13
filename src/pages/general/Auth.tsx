import { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginUserMutation, useRegisterUserMutation } from '../../queries/general/AuthQuery.ts';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { loginSuccess } from '../../queries/general/ApplicationUserSlice.ts';

export const Auth = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();

    // State for form handling and messages
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formMessage, setFormMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // For overall form submission status

    // RTK Query hooks
    const [loginUser, { isLoading: isLoginLoading, isSuccess: isLoginSuccess, error: loginError, data: loginData }] = useLoginUserMutation();
    const [registerUser, { isLoading: isRegisterLoading, isSuccess: isRegisterSuccess, error: registerError, data: registerData }] = useRegisterUserMutation();

    // Yup validation schema for login
    const loginSchema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    // Yup validation schema for registration
    const registerSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        contactPhone: yup.string().required('Phone Number is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const dispatch = useDispatch();

    const clearFields = () => {
        setErrors({});
        setFormMessage('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setFormMessage('');
        setIsSubmitting(true);

        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;

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
                    role: res.user.role
                }
            };

            dispatch(loginSuccess(userPayload));
            // localStorage.setItem('user', JSON.stringify(userPayload));

            setFormMessage('Login successful!');
            clearFields();

            const role = res.user.role;
            if (role === 'admin') navigate('/platformAdmin');
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setFormMessage('');
        setIsSubmitting(true);

        const firstName = (e.target as HTMLFormElement).firstName.value;
        const lastName = (e.target as HTMLFormElement).lastName.value;
        const contactPhone = (e.target as HTMLFormElement).phoneNumber.value;
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        const confirmPassword = (e.target as HTMLFormElement).confirmPassword.value;

        const values = { firstName, lastName, contactPhone, email, password, confirmPassword };

        try {
            await registerSchema.validate(values, { abortEarly: false });

            await registerUser({ firstName, lastName, contactPhone, email, password }).unwrap();

            // setFormMessage("Registration successful! Please log in.");
            // clearFields();
            // setIsLoginView(true);

            navigate('/verify-email', { state: { email } });

        } catch (err: any) {
            // Handle Yup validation errors
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
            // Handle RTK Query / network errors
            else if (err?.data?.message) {
                setFormMessage(err.data.message);
                console.error("Registration failed:", err.data);
            } else {
                setFormMessage('An unexpected error occurred during registration.');
                console.error('General Error:', err);
            }
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    // Removed the redundant useEffect for isLoginSuccess as handleLogin handles success directly.

    // Handle Google OAuth - this often involves redirecting to Google, then handling a callback
    const handleGoogleOAuth = () => {
        console.log("Initiating Google OAuth...");
        // This is typically handled by directing the user to a Google OAuth URL,
        // and then Google redirects back to your application with a 'code'
        // which you then send to your backend for token exchange.
        // For simplicity, this might be a direct link to your backend's OAuth initiation endpoint
        // window.location.href = `${BASE_URL}/api/auth/google`; // Example
        setFormMessage("Google OAuth not implemented in this demo.");
    };

    const handleMicrosoftOAuth = () => {
        console.log("Initiating Microsoft OAuth...");
        // window.location.href = `${BASE_URL}/api/auth/microsoft`; // Example
        setFormMessage("Microsoft OAuth not implemented in this demo.");
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
                        onClick={() => {
                            setIsLoginView(true);
                            clearFields(); // Clear messages/errors when switching views
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`btn ${!isLoginView ? 'btn-secondary' : 'btn-ghost'}`}
                        onClick={() => {
                            setIsLoginView(false);
                            clearFields(); // Clear messages/errors when switching views
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Display form messages */}
                {formMessage && (
                    <div className={`alert ${formMessage.includes('successful') ? 'alert-success' : 'alert-error'} shadow-lg mb-4`}>
                        <div>
                            <span>{formMessage}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleOAuth}
                        className="btn btn-outline btn-primary w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        disabled={isLoginLoading || isRegisterLoading || isSubmitting}
                    >
                        Sign in with Google
                    </button>
                    <button
                        onClick={handleMicrosoftOAuth}
                        className="btn btn-outline btn-info w-full text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        disabled={isLoginLoading || isRegisterLoading || isSubmitting}
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
                                className={`input input-bordered input-primary w-full rounded-md ${errors.email ? 'input-error' : ''}`}
                                required
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className={`input input-bordered input-primary w-full rounded-md ${errors.password ? 'input-error' : ''}`}
                                required
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                        </div>

                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover text-sm text-primary">
                                Forgot password?
                            </a>
                        </label>

                        <button
                            type="submit"
                            className="btn btn-primary w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isLoginLoading || isSubmitting}
                        >
                            {isLoginLoading || isSubmitting ? 'Logging In...' : 'Login'}
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
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.firstName ? 'input-error' : ''}`}
                                required
                            />
                            {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.lastName ? 'input-error' : ''}`}
                                required
                            />
                            {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+1234567890"
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.phoneNumber ? 'input-error' : ''}`}
                                required
                            />
                            {errors.phoneNumber && <p className="text-error text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your_email@example.com"
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.email ? 'input-error' : ''}`}
                                required
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.password ? 'input-error' : ''}`}
                                required
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text text-base-content">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                className={`input input-bordered input-secondary w-full rounded-md ${errors.confirmPassword ? 'input-error' : ''}`}
                                required
                            />
                            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-secondary w-full text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isRegisterLoading || isSubmitting}
                        >
                            {isRegisterLoading || isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;
