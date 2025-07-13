import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerificationMutation } from '../../queries/general/AuthQuery'; // Import the new mutation hook

// Define the Yup validation schema for the verification code
const verificationSchema = yup.object().shape({
    code: yup.string()
        .matches(/^\d{6}$/, 'Verification code must be 6 digits')
        .required('Verification code is required'),
});

export const EmailVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email; // Get email from route state

    const [verificationCode, setVerificationCode] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState(false); // New state for email missing error

    // Initialize the verification mutation hook
    const [verifyEmail, { isLoading: isVerifying, isSuccess: isVerificationSuccess, isError: isVerificationError, error: verificationError, data: verificationData }] = useVerificationMutation();

    // Effect to check if email is present in state on component mount
    useEffect(() => {
        if (!email) {
            setEmailError(true);
            setMessage('No email found. Please go back to the registration page.');
        }
    }, [email]);

    useEffect(() => {
        if (message && !emailError) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, emailError]);

    // Handle successful verification
    useEffect(() => {
        if (isVerificationSuccess) {
            setMessage(verificationData?.message || 'Verification successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        }
    }, [isVerificationSuccess, verificationData, navigate]);

    // Handle verification error
    useEffect(() => {
        if (isVerificationError) {
            const errorMessage = (verificationError as any)?.data?.message || 'An error occurred during verification.';
            setMessage(errorMessage);
        }
    }, [isVerificationError, verificationError]);


    const handleChange = (e) => {
        setVerificationCode(e.target.value);
        // Clear errors for the code field as user types
        if (errors.code) {
            setErrors(prevErrors => ({ ...prevErrors, code: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) { // Prevent submission if email is missing
            return;
        }

        setErrors({});
        setMessage('');

        try {
            // Validate the form data using Yup
            await verificationSchema.validate({ code: verificationCode }, { abortEarly: false });

            await verifyEmail({ email: email, code: parseInt(verificationCode, 10) }).unwrap();

        } catch (validationErrors) {
            // If Yup validation fails, set the errors state
            const newErrors = {};
            validationErrors.inner.forEach(error => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
            setMessage('Please correct the errors above.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify Your Email</h2>

                {emailError ? (
                    <div className="text-center bg-red-100 text-red-700 p-4 rounded-md mb-6">
                        <p className="font-semibold mb-2">Error: Email not found!</p>
                        <p>It seems you landed on this page without a registered email. Please go back and register.</p>
                        <button
                            onClick={() => navigate('/login')} // Assuming '/login' is your registration/auth page
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                        >
                            Go to Registration
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-gray-600 mb-8">
                            A 6-digit verification code has been sent to <span className="font-semibold text-blue-600">{email}</span>.
                            Please enter it below to verify your account.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    name="code"
                                    value={verificationCode}
                                    onChange={handleChange}
                                    maxLength="6"
                                    className={`w-full px-4 py-3 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-center tracking-widest`}
                                    placeholder="______"
                                    aria-invalid={errors.code ? "true" : "false"}
                                    aria-describedby={errors.code ? "code-error" : undefined}
                                />
                                {errors.code && (
                                    <p id="code-error" className="mt-2 text-sm text-red-600 text-center">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            {message && (
                                <div className={`p-3 rounded-md text-center text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isVerifying || emailError} // Disable if verifying or email is missing
                            >
                                {isVerifying ? 'Verifying...' : 'Verify Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Didn't receive the code?{' '}
                            <button
                                onClick={() => {
                                    setMessage('Resending code...');
                                    // Simulate resend logic - In a real app, you'd call an API here
                                    setTimeout(() => setMessage('New code sent!'), 1500);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                            >
                                Resend Code
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export const EmailVerificationWrapper = () => {
    const location = useLocation();
    const email = location.state?.email;
    return <EmailVerification email={email} />;
};