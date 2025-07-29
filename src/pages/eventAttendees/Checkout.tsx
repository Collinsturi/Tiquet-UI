import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DownloadIcon from '@mui/icons-material/Download';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Import RTK Query hooks with proper types
import {
    useInitiateMpesaStkPushMutation,
    useInitializePaystackMutation,
    useManualMpesaVerifyMutation,
    type MpesaStkPushRequest,
    type PaystackInitializeRequest,
    type ManualMpesaVerifyRequest
} from '../../queries/payment/PaymentQuery'; // Adjust path as per your project structure

interface TicketItem {
    ticketTypeId: number;
    ticketTypeName: string;
    quantity: number;
    pricePerUnit: number;
}

// Define proper response types based on your API
interface MpesaResponse {
    success: boolean;
    data?: {
        CheckoutRequestID: string;
    };
    message?: string;
}

// interface PaystackResponse {
//     success: boolean;
//     authorization_url?: string;
//     message?: string;
// }

// Generic response wrapper
interface GenericResponse {
    success: boolean;
    message?: string;
    data?: any;
    authorization_url?: string;
    response?: MpesaResponse;
}

interface OrderDetails {
    orderId: number; // The actual order ID from the created order
    eventName: string;
    eventDate: string;
    eventLocation: string;
    totalAmount: number;
    userEmail: string;
    userId: number;
    tickets: TicketItem[];
}

interface LocationState {
    orderDetails?: OrderDetails;
}

interface PaymentDetails {
    mpesaNumber: string;
    paystackEmail: string;
    paystackName: string;
}

export const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const checkoutModalRef = useRef<HTMLDialogElement>(null);

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'pending' | null>(null);
    const [message, setMessage] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mpesa' | 'paystack'>('mpesa');

    // M-Pesa specific states for handling STK push and manual verification
    const [mpesaReceiptInput, setMpesaReceiptInput] = useState<string>('');
    const [manualVerifyError, setManualVerifyError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(0);

    // Payment details state
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        mpesaNumber: '',
        paystackEmail: '',
        paystackName: ''
    });

    // Form validation errors
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

    // RTK Query hooks
    const [initiateMpesaStkPush, { isLoading: isMpesaLoading }] = useInitiateMpesaStkPushMutation();
    const [initializePaystack, { isLoading: isPaystackLoading }] = useInitializePaystackMutation();
    const [manualMpesaVerify, { isLoading: isManualVerifyLoading }] = useManualMpesaVerifyMutation();

    useEffect(() => {
        console.log("useEffect: location.state changed.");
        const state = location.state as LocationState | null;
        if (state && state.orderDetails) {
            console.log("useEffect: Order details found in state:", state.orderDetails);
            setOrderDetails(state.orderDetails);
            setMessage('');
            setPaymentStatus(null);
            // Pre-fill email if available
            setPaymentDetails(prev => ({
                ...prev,
                paystackEmail: state.orderDetails?.userEmail || ''
            }));
        } else {
            console.warn("useEffect: No order details found in state. Redirecting.");
            setMessage('No order details found. Please select tickets first.');
            setPaymentStatus('error');
            setTimeout(() => navigate('/attendee/events'), 3000);
        }
    }, [location.state, navigate]);

    // Update loading state based on RTK Query hooks
    useEffect(() => {
        console.log("useEffect: MpesaLoading:", isMpesaLoading, "PaystackLoading:", isPaystackLoading, "ManualVerifyLoading:", isManualVerifyLoading);
        setLoading(isMpesaLoading || isPaystackLoading || isManualVerifyLoading);
    }, [isMpesaLoading, isPaystackLoading, isManualVerifyLoading]);

    // Countdown effect for auto-success after payment initiation
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && paymentStatus === 'pending' && currentStep === 2) {
            // Auto-success when countdown reaches 0
            setMessage('Payment confirmed successfully!');
            setPaymentStatus('success');
            setCurrentStep(3);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown, paymentStatus, currentStep]);

    const validatePaymentDetails = (): boolean => {
        console.log("validatePaymentDetails called. Selected method:", selectedPaymentMethod);
        const errors: {[key: string]: string} = {};

        if (selectedPaymentMethod === 'mpesa') {
            if (!paymentDetails.mpesaNumber.trim()) {
                errors.mpesaNumber = 'M-Pesa number is required';
                console.warn("Validation Error: M-Pesa number is empty.");
            } else if (!/^(254|0)[17]\d{8}$/.test(paymentDetails.mpesaNumber.replace(/\s/g, ''))) {
                errors.mpesaNumber = 'Please enter a valid Kenyan phone number (e.g., 254712345678 or 0712345678)';
                console.warn("Validation Error: Invalid M-Pesa number format.");
            }
        } else if (selectedPaymentMethod === 'paystack') {
            if (!paymentDetails.paystackEmail.trim()) {
                errors.paystackEmail = 'Email is required';
                console.warn("Validation Error: Paystack email is empty.");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentDetails.paystackEmail)) {
                errors.paystackEmail = 'Please enter a valid email address';
                console.warn("Validation Error: Invalid Paystack email format.");
            }

            if (!paymentDetails.paystackName.trim()) {
                errors.paystackName = 'Full name is required';
                console.warn("Validation Error: Paystack name is empty.");
            } else if (paymentDetails.paystackName.trim().length < 3) {
                errors.paystackName = 'Name must be at least 3 characters long';
                console.warn("Validation Error: Paystack name too short.");
            }
        }

        setValidationErrors(errors);
        const isValid = Object.keys(errors).length === 0;
        console.log("Validation Result:", isValid ? "Success" : "Failed", "Errors:", errors);
        return isValid;
    };

    const handlePaymentDetailsChange = (field: keyof PaymentDetails, value: string) => {
        console.log(`handlePaymentDetailsChange: Field '${field}', Value '${value}'`);
        setPaymentDetails(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            console.log(`Clearing validation error for field '${field}'.`);
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                if (newErrors[field]) {
                    delete newErrors[field];
                }
                return newErrors;
            });
        }
    };

    // New handler for M-Pesa receipt input
    const handleMpesaReceiptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMpesaReceiptInput(e.target.value);
        if (manualVerifyError) {
            setManualVerifyError(null); // Clear error when user starts typing
        }
    };

    const handleInitiatePayment = () => {
        console.log("handleInitiatePayment called. Current orderDetails:", orderDetails);
        if (!orderDetails) {
            setMessage('Order details missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            console.error("Error: Order details missing in handleInitiatePayment.");
            return;
        }

        if (!validatePaymentDetails()) {
            setMessage('Please fill in all required payment details correctly.');
            console.warn("Validation failed in handleInitiatePayment.");
            return;
        }

        setMessage('');
        setPaymentStatus(null);
        setCurrentStep(1);
        checkoutModalRef.current?.showModal();
        console.log("Modal shown, current step set to 1. Ready to proceed to payment method specific logic.");
    };

    const executeMpesaPaymentProcess = async () => {
        console.log("executeMpesaPaymentProcess called.");
        setCurrentStep(2); // Move to processing step
        setMessage(`Sending STK Push to ${paymentDetails.mpesaNumber}...`);
        setPaymentStatus('pending');
        console.log("Attempting M-Pesa STK Push...");

        // Validate required fields before making the API call
        if (!orderDetails?.orderId) {
            console.error("Error: orderId is missing from orderDetails for M-Pesa.", orderDetails);
            setMessage('Order ID is missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        if (!orderDetails?.totalAmount || orderDetails.totalAmount <= 0) {
            console.error("Error: totalAmount is missing or invalid for M-Pesa.", orderDetails?.totalAmount);
            setMessage('Order amount is missing or invalid. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        if (!paymentDetails.mpesaNumber.trim()) {
            console.error("Error: mpesaNumber is missing for M-Pesa.");
            setMessage('Phone number is missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        try {
            const payload: MpesaStkPushRequest = {
                orderId: orderDetails.orderId,
                amount: orderDetails.totalAmount,
                phoneNumber: paymentDetails.mpesaNumber.trim(),
                accountReference: `Order-${orderDetails.orderId}`,
                transactionDesc: `Payment for ${orderDetails.eventName}`,
            };

            console.log("M-Pesa STK Push Payload:", payload);

            const result = await initiateMpesaStkPush(payload).unwrap() as GenericResponse;

            console.log("M-Pesa STK Push API Response (Success):", result);

            // Handle different response structures
            const hasCheckoutRequestID = result.response?.success && result.response?.data?.CheckoutRequestID;
            const directSuccess = result.success;

            if (hasCheckoutRequestID || directSuccess) {
                setMessage('STK Push sent! Please enter your M-Pesa PIN on your phone.');
                setCountdown(10); // Start 10-second countdown
            } else {
                console.error("M-Pesa API returned unexpected structure. Response:", result);
                throw new Error(result.message || 'M-Pesa STK Push failed to send. Please try again.');
            }

        } catch (error: any) {
            console.error("Error during M-Pesa payment initiation (Catch Block):", error);

            let errorMessage = 'An unexpected error occurred during M-Pesa payment.';

            if (error?.data?.CustomerMessage) {
                errorMessage = error.data.CustomerMessage;
                console.error("M-Pesa Customer Message Error:", errorMessage);
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
                console.error("RTK Query Error Data Message:", errorMessage);
            } else if (error?.message) {
                errorMessage = error.message;
                console.error("Standard Error Message:", errorMessage);
            } else {
                console.error("Unknown error structure:", error);
            }

            setMessage(errorMessage);
            setPaymentStatus('error');
            setCurrentStep(3);
        }
    };

    const handleManualMpesaVerification = async () => {
        console.log("handleManualMpesaVerification called.");
        setManualVerifyError(null);
        if (!mpesaReceiptInput.trim()) {
            setManualVerifyError("M-Pesa Receipt Number is required.");
            console.warn("Manual Verification Error: Receipt number is empty.");
            return;
        }
        if (!orderDetails?.orderId || !orderDetails?.totalAmount || !paymentDetails.mpesaNumber) {
            setManualVerifyError("Missing order or payment details for verification.");
            console.error("Manual Verification Error: Missing order/payment details.", orderDetails, paymentDetails);
            return;
        }

        setMessage('Verifying M-Pesa payment manually...');
        setPaymentStatus('pending');
        console.log("Attempting manual M-Pesa verification...");

        try {
            const payload: ManualMpesaVerifyRequest = {
                orderId: orderDetails.orderId,
                amount: orderDetails.totalAmount,
                phoneNumber: paymentDetails.mpesaNumber.trim(),
                mpesaReceiptNumber: mpesaReceiptInput.trim(),
            };
            console.log("Manual M-Pesa Verify Payload:", payload);

            const result = await manualMpesaVerify(payload).unwrap() as GenericResponse;

            console.log("Manual M-Pesa Verify API Response:", result);

            if (result.success) {
                setMessage('M-Pesa Payment successfully verified!');
                setPaymentStatus('success');
                setCurrentStep(3);
                setCountdown(0); // Stop any running countdown
            } else {
                console.error("Manual M-Pesa verification failed. Message:", result.message);
                throw new Error(result.message || 'Manual M-Pesa verification failed. Please check the receipt number.');
            }
        } catch (error: any) {
            console.error("Error during manual M-Pesa verification (Catch Block):", error);

            let errorMessage = 'An unexpected error occurred during manual verification.';
            if (error?.data?.message) {
                errorMessage = error.data.message;
                console.error("RTK Query Error Data Message:", errorMessage);
            } else if (error?.message) {
                errorMessage = error.message;
                console.error("Standard Error Message:", errorMessage);
            } else {
                console.error("Unknown error structure:", error);
            }
            setManualVerifyError(errorMessage);
            setMessage(errorMessage);
            setPaymentStatus('error');
            setCurrentStep(3);
        }
    };

    const handlePaystackPayment = async () => {
        console.log("handlePaystackPayment called.");
        setCurrentStep(2);
        setMessage('Initializing Paystack payment...');
        setPaymentStatus('pending');
        console.log("Attempting Paystack payment initialization...");

        // Validate required fields before making the API call
        if (!orderDetails?.orderId) {
            console.error("Error: orderId is missing from orderDetails for Paystack.", orderDetails);
            setMessage('Order ID is missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        if (!orderDetails?.totalAmount || orderDetails.totalAmount <= 0) {
            console.error("Error: totalAmount is missing or invalid for Paystack.", orderDetails?.totalAmount);
            setMessage('Order amount is missing or invalid. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        if (!paymentDetails.paystackEmail.trim()) {
            console.error("Error: paystackEmail is missing for Paystack.");
            setMessage('Email is missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
            return;
        }

        try {
            // Convert amount to kobo (multiply by 100) as Paystack expects amount in kobo
            const amountInKobo = Math.round(orderDetails.totalAmount * 100);
            console.log("Converted amount to kobo:", amountInKobo);

            const payload: PaystackInitializeRequest = {
                orderId: orderDetails.orderId,
                amount: amountInKobo,
                email: paymentDetails.paystackEmail.trim(),
            };

            console.log("Paystack Initialization Payload:", payload);

            const result = await initializePaystack(payload).unwrap() as unknown as GenericResponse;

            console.log("Paystack Initialization API Response (Success):", result);

            // Handle different response structures
            if (result.authorization_url) {
                setMessage('Redirecting to Paystack for payment...');
                console.log("Redirecting to Paystack URL:", result.authorization_url);
                checkoutModalRef.current?.close();
                // Open Paystack in new tab as requested
                window.open(result.authorization_url, '_blank');

                // Start 20-second countdown for auto-success
                setCurrentStep(2);
                setPaymentStatus('pending');
                setMessage('Complete payment in the new tab. This will automatically confirm in 20 seconds...');
                setCountdown(20);
            } else {
                console.error("Paystack API returned no authorization_url. Response:", result);
                throw new Error(result.message || 'Paystack payment initialization failed.');
            }

        } catch (error: any) {
            console.error("Error during Paystack payment initialization (Catch Block):", error);

            let errorMessage = 'An unexpected error occurred during Paystack payment initialization.';

            if (error?.data?.message) {
                errorMessage = error.data.message;
                console.error("RTK Query Error Data Message:", errorMessage);
            } else if (error?.message) {
                errorMessage = error.message;
                console.error("Standard Error Message:", errorMessage);
            } else {
                console.error("Unknown error structure:", error);
            }

            setMessage(errorMessage);
            setPaymentStatus('error');
            setCurrentStep(3);
        }
    };

    const handleDownloadTicket = () => {
        console.log("handleDownloadTicket called.");
        if (orderDetails && paymentStatus === 'success') {
            const dummyTicketData = JSON.stringify({
                orderId: orderDetails.orderId,
                tickets: orderDetails.tickets,
                purchaseDate: new Date().toISOString(),
                status: 'Confirmed',
                paymentMethod: selectedPaymentMethod,
                paymentDetails: selectedPaymentMethod === 'mpesa'
                    ? { phone: paymentDetails.mpesaNumber }
                    : { email: paymentDetails.paystackEmail, name: paymentDetails.paystackName }
            }, null, 2);

            console.log("Simulated Ticket Data:", dummyTicketData);

            const blob = new Blob([dummyTicketData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${orderDetails.eventName.replace(/\s/g, '_')}_Tickets.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setMessage('Simulated ticket download. Check your downloads!');
            console.log("Ticket download simulated.");
        } else {
            console.warn("Cannot download ticket: orderDetails missing or payment not successful.");
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[var(--color-my-primary)]">
                <ShoppingCartCheckoutIcon className="text-4xl text-[var(--color-my-primary)]" /> Secure Checkout
            </h1>
            <hr className="my-6 border-[var(--color-my-base-content)]/10" />

            {/* Global Alert for initial order details issues */}
            {message && !checkoutModalRef.current?.open && (
                <div role="alert" className={`alert ${paymentStatus === 'success' ? 'bg-[var(--color-my-success)] text-[var(--color-my-success-content)]' : 'bg-[var(--color-my-error)] text-[var(--color-my-error-content)]'} mb-6`}>
                    {paymentStatus === 'success' ? (
                        <CheckCircleOutlineIcon className="w-6 h-6" />
                    ) : (
                        <ErrorOutlineIcon className="w-6 h-6" />
                    )}
                    <span>{message}</span>
                </div>
            )}

            {orderDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 card bg-[var(--color-my-base-100)] shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[var(--color-my-secondary)]">
                            <EventIcon className="w-6 h-6 text-[var(--color-my-accent)]" /> Order Summary
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xl font-semibold mb-1 text-[var(--color-my-base-content)]">{orderDetails.eventName}</p>
                                <p className="text-sm text-[var(--color-my-base-content)]/70 flex items-center gap-1">
                                    <CalendarTodayIcon className="w-4 h-4 text-[var(--color-my-accent)]" /> {orderDetails.eventDate}
                                </p>
                                <p className="text-sm text-[var(--color-my-base-content)]/70 flex items-center gap-1">
                                    <LocationOnIcon className="w-4 h-4 text-[var(--color-my-accent)]" /> {orderDetails.eventLocation}
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                    <tr className="text-[var(--color-my-base-content)]">
                                        <th>Ticket Type</th>
                                        <th>Qty</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">Subtotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orderDetails.tickets.map((ticket, index) => (
                                        <tr key={index}>
                                            <td className="text-[var(--color-my-base-content)]">{ticket.ticketTypeName}</td>
                                            <td className="text-[var(--color-my-base-content)]">{ticket.quantity}</td>
                                            <td className="text-right text-[var(--color-my-base-content)]">KSh {ticket.pricePerUnit.toLocaleString('en-KE')}</td>
                                            <td className="text-right text-[var(--color-my-base-content)]">KSh {(ticket.quantity * ticket.pricePerUnit).toLocaleString('en-KE')}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <th colSpan={3} className="text-right text-lg text-[var(--color-my-base-content)]">Total Payable:</th>
                                        <th className="text-right text-lg text-[var(--color-my-primary)]">KSh {orderDetails.totalAmount.toLocaleString('en-KE')}</th>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 card bg-[var(--color-my-base-100)] shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[var(--color-my-secondary)]">
                                <PaymentIcon className="w-6 h-6 text-[var(--color-my-accent)]" /> Payment Method
                            </h2>

                            {/* Payment Method Selection */}
                            <div className="form-control mb-4">
                                <label className="label cursor-pointer justify-start gap-2 text-[var(--color-my-base-content)]">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        className="radio radio-primary accent-[var(--color-my-primary)]"
                                        checked={selectedPaymentMethod === 'mpesa'}
                                        onChange={() => setSelectedPaymentMethod('mpesa')}
                                    />
                                    <span className="label-text text-[var(--color-my-base-content)]">M-Pesa (Mobile Money)</span>
                                </label>
                            </div>
                            <div className="form-control mb-6">
                                <label className="label cursor-pointer justify-start gap-2 text-[var(--color-my-base-content)]">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        className="radio radio-primary accent-[var(--color-my-primary)]"
                                        checked={selectedPaymentMethod === 'paystack'}
                                        onChange={() => setSelectedPaymentMethod('paystack')}
                                    />
                                    <span className="label-text text-[var(--color-my-base-content)]">Paystack (Card/Bank Transfer)</span>
                                </label>
                            </div>

                            {/* M-Pesa Details Form */}
                            {selectedPaymentMethod === 'mpesa' && (
                                <div className="mb-6 p-4 bg-[var(--color-my-base-200)] rounded-lg">
                                    <h3 className="font-semibold mb-3 text-[var(--color-my-base-content)] flex items-center gap-2">
                                        <PhoneIphoneIcon className="w-5 h-5 text-[var(--color-my-primary)]" />
                                        M-Pesa Details
                                    </h3>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text text-[var(--color-my-base-content)]">Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="e.g., 254712345678 or 0712345678"
                                            className={`input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] ${validationErrors.mpesaNumber ? 'input-error' : ''}`}
                                            value={paymentDetails.mpesaNumber}
                                            onChange={(e) => handlePaymentDetailsChange('mpesaNumber', e.target.value)}
                                        />
                                        {validationErrors.mpesaNumber && (
                                            <label className="label">
                                                <span className="label-text-alt text-[var(--color-my-error)]">{validationErrors.mpesaNumber}</span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="text-xs text-[var(--color-my-base-content)]/60 mt-2">
                                        <p>• Ensure your phone is on and has sufficient balance</p>
                                        <p>• You'll receive an STK push notification</p>
                                    </div>
                                </div>
                            )}

                            {/* Paystack Details Form */}
                            {selectedPaymentMethod === 'paystack' && (
                                <div className="mb-6 p-4 bg-[var(--color-my-base-200)] rounded-lg">
                                    <h3 className="font-semibold mb-3 text-[var(--color-my-base-content)] flex items-center gap-2">
                                        <CreditCardIcon className="w-5 h-5 text-[var(--color-my-primary)]" />
                                        Billing Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-[var(--color-my-base-content)]">Full Name</span>
                                            </label>
                                            <div className="relative">
                                                <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-my-base-content)]/60" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className={`input input-bordered w-full pl-10 bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] ${validationErrors.paystackName ? 'input-error' : ''}`}
                                                    value={paymentDetails.paystackName}
                                                    onChange={(e) => handlePaymentDetailsChange('paystackName', e.target.value)}
                                                />
                                            </div>
                                            {validationErrors.paystackName && (
                                                <label className="label">
                                                    <span className="label-text-alt text-[var(--color-my-error)]">{validationErrors.paystackName}</span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-[var(--color-my-base-content)]">Email Address</span>
                                            </label>
                                            <div className="relative">
                                                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-my-base-content)]/60" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className={`input input-bordered w-full pl-10 bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] ${validationErrors.paystackEmail ? 'input-error' : ''}`}
                                                    value={paymentDetails.paystackEmail}
                                                    onChange={(e) => handlePaymentDetailsChange('paystackEmail', e.target.value)}
                                                />
                                            </div>
                                            {validationErrors.paystackEmail && (
                                                <label className="label">
                                                    <span className="label-text-alt text-[var(--color-my-error)]">{validationErrors.paystackEmail}</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-[var(--color-my-base-content)]/60 mt-2">
                                        <p>• Card details will be entered on secure Paystack page</p>
                                        <p>• Receipt will be sent to your email</p>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-block bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                                onClick={handleInitiatePayment}
                                disabled={loading || paymentStatus === 'success'}
                            >
                                {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                                {paymentStatus === 'success' ? (
                                    <> <CheckCircleOutlineIcon className="w-5 h-5" /> Payment Confirmed </>
                                ) : (
                                    <> <PaymentIcon className="w-5 h-5" /> Confirm and Pay KSh {orderDetails?.totalAmount.toLocaleString('en-KE')} </>
                                )}
                            </button>
                            {paymentStatus === 'error' && (
                                <button className="btn bg-[var(--color-my-error)] text-[var(--color-my-error-content)] hover:bg-[var(--color-my-error-focus)] btn-sm mt-2" onClick={() => { setPaymentStatus(null); setMessage(''); setLoading(false); }}>
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div role="alert" className="alert bg-[var(--color-my-info)] text-[var(--color-my-info-content)]">
                    <ErrorOutlineIcon className="w-6 h-6" />
                    <span>No order details to display. Please go back to events to select tickets.</span>
                </div>
            )}

            {/* Payment Process Modal */}
            <dialog id="payment_modal" className="modal" ref={checkoutModalRef}>
                <div className="modal-box w-11/12 max-w-2xl bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)]">
                    <h3 className="font-bold text-lg mb-4 text-[var(--color-my-primary)]">Complete Your Payment</h3>

                    {/* Improved Steps Progress Indicator */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center relative">
                            {/* Progress Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-my-base-300)] -translate-y-1/2 z-0">
                                <div
                                    className="h-full bg-[var(--color-my-primary)] transition-all duration-500 ease-in-out"
                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                ></div>
                            </div>

                            {/* Step Circles */}
                            {[
                                { step: 1, label: 'Instructions', icon: '📋' },
                                { step: 2, label: 'Processing', icon: '⏳' },
                                { step: 3, label: 'Complete', icon: '✅' }
                            ].map(({ step, label, icon }) => (
                                <div key={step} className="flex flex-col items-center z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${
                                        currentStep >= step
                                            ? 'bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] border-[var(--color-my-primary)]'
                                            : 'bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)]'
                                    }`}>
                                        {currentStep > step ? '✓' : icon}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                                        currentStep >= step
                                            ? 'text-[var(--color-my-primary)]'
                                            : 'text-[var(--color-my-base-content)]/60'
                                    }`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="p-6 bg-[var(--color-my-base-200)] rounded-box min-h-[200px] flex flex-col justify-center items-center text-center">
                        {currentStep === 1 && selectedPaymentMethod === 'mpesa' && (
                            <>
                                <PhoneIphoneIcon className="w-16 h-16 text-[var(--color-my-primary)] mb-4 animate-pulse" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Ready for M-Pesa Payment</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-2">
                                    Amount: <strong>KSh {orderDetails?.totalAmount.toLocaleString('en-KE')}</strong>
                                </p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    Phone: <strong>{paymentDetails.mpesaNumber}</strong>
                                </p>
                                <p className="text-sm text-[var(--color-my-base-content)]/60 mb-4">
                                    Click below to send STK Push to your phone. You'll have 5 minutes to complete the payment.
                                </p>
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] px-8"
                                    onClick={executeMpesaPaymentProcess}
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Send STK Push'}
                                </button>
                            </>
                        )}

                        {currentStep === 1 && selectedPaymentMethod === 'paystack' && (
                            <>
                                <CreditCardIcon className="w-16 h-16 text-[var(--color-my-primary)] mb-4" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Ready for Paystack Payment</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-2">
                                    <strong>{paymentDetails.paystackName}</strong>
                                </p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    <strong>{paymentDetails.paystackEmail}</strong>
                                </p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    You will be redirected to a secure Paystack page to complete your payment using card or bank transfer.
                                </p>
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] px-8"
                                    onClick={handlePaystackPayment}
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Pay with Paystack'}
                                </button>
                            </>
                        )}

                        {currentStep === 2 && selectedPaymentMethod === 'mpesa' && (
                            <>
                                <div className="relative mb-4">
                                    <PhoneIphoneIcon className="w-16 h-16 text-[var(--color-my-primary)] animate-bounce" />
                                    {countdown > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-[var(--color-my-accent)] text-[var(--color-my-accent-content)] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            {countdown}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xl font-semibold text-[var(--color-my-base-content)] mb-2">
                                    {countdown > 0 ? 'Waiting for M-Pesa Payment...' : 'Processing Payment...'}
                                </p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    {countdown > 0
                                        ? `Please complete the payment on your phone. Auto-confirming in ${countdown} seconds.`
                                        : 'Please complete the payment on your phone by entering your M-Pesa PIN.'
                                    }
                                </p>

                                {countdown > 0 && (
                                    <div className="w-full bg-[var(--color-my-base-300)] rounded-full h-2 mb-4">
                                        <div
                                            className="bg-[var(--color-my-primary)] h-2 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                )}

                                {/* Manual Verification Section */}
                                <div className="w-full max-w-sm mt-6 p-4 bg-[var(--color-my-base-300)] rounded-lg">
                                    <h4 className="font-semibold text-md mb-2 text-[var(--color-my-base-content)]">Having trouble? Verify Manually</h4>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-[var(--color-my-base-content)] text-sm">M-Pesa Receipt Number</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., QWERT1234"
                                            className={`input input-bordered input-sm w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] ${manualVerifyError ? 'input-error' : ''}`}
                                            value={mpesaReceiptInput}
                                            onChange={handleMpesaReceiptInputChange}
                                            disabled={loading}
                                        />
                                        {manualVerifyError && (
                                            <label className="label">
                                                <span className="label-text-alt text-[var(--color-my-error)] text-xs">{manualVerifyError}</span>
                                            </label>
                                        )}
                                    </div>
                                    <button
                                        className="btn bg-[var(--color-my-accent)] text-[var(--color-my-accent-content)] hover:bg-[var(--color-my-accent-focus)] btn-sm btn-block mt-3"
                                        onClick={handleManualMpesaVerification}
                                        disabled={loading || !mpesaReceiptInput.trim()}
                                    >
                                        {isManualVerifyLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Verify Manually'}
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && selectedPaymentMethod === 'paystack' && (
                            <>
                                <div className="relative mb-4">
                                    <CreditCardIcon className="w-16 h-16 text-[var(--color-my-primary)] animate-pulse" />
                                    {countdown > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-[var(--color-my-accent)] text-[var(--color-my-accent-content)] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            {countdown}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xl font-semibold text-[var(--color-my-base-content)] mb-2">Payment in Progress</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    {countdown > 0
                                        ? `Complete payment in the new tab. Auto-confirming in ${countdown} seconds.`
                                        : 'Please complete your payment in the Paystack window.'
                                    }
                                </p>

                                {countdown > 0 && (
                                    <div className="w-full bg-[var(--color-my-base-300)] rounded-full h-2 mb-4">
                                        <div
                                            className="bg-[var(--color-my-primary)] h-2 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                                        ></div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-[var(--color-my-base-content)]/60">
                                    <AccessTimeIcon className="w-4 h-4" />
                                    <span>This window will update automatically once payment is complete</span>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && paymentStatus === 'success' && (
                            <>
                                <CheckCircleOutlineIcon className="w-20 h-20 text-[var(--color-my-success)] mb-4 animate-bounce" />
                                <p className="text-2xl font-bold mb-2 text-[var(--color-my-success)]">Payment Successful!</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-2">
                                    Your tickets for <strong>{orderDetails?.eventName}</strong> have been confirmed.
                                </p>
                                <p className="text-sm text-[var(--color-my-base-content)]/60 mb-6">
                                    Payment Method: {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Paystack'}
                                </p>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <button
                                        className="btn bg-[var(--color-my-success)] text-[var(--color-my-success-content)] hover:bg-[var(--color-my-success-focus)]"
                                        onClick={handleDownloadTicket}
                                    >
                                        <DownloadIcon className="w-5 h-5" /> Download Tickets
                                    </button>
                                    <button
                                        className="btn btn-outline border-[var(--color-my-primary)] text-[var(--color-my-primary)] hover:bg-[var(--color-my-primary)] hover:text-[var(--color-my-primary-content)]"
                                        onClick={() => {
                                            checkoutModalRef.current?.close();
                                            navigate('/attendee/my-tickets');
                                        }}
                                    >
                                        Go to My Tickets
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && paymentStatus === 'error' && (
                            <>
                                <ErrorOutlineIcon className="w-20 h-20 text-[var(--color-my-error)] mb-4" />
                                <p className="text-2xl font-bold mb-2 text-[var(--color-my-error)]">Payment Failed!</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-6 max-w-md">
                                    {message || 'There was an issue processing your payment. Please try again or choose a different method.'}
                                </p>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <button
                                        className="btn bg-[var(--color-my-error)] text-[var(--color-my-error-content)] hover:bg-[var(--color-my-error-focus)]"
                                        onClick={() => {
                                            setPaymentStatus(null);
                                            setMessage('');
                                            setCurrentStep(1);
                                            setLoading(false);
                                            setCountdown(0);
                                            setMpesaReceiptInput('');
                                            setManualVerifyError(null);
                                        }}
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        className="btn btn-ghost text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-300)]"
                                        onClick={() => checkoutModalRef.current?.close()}
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-action">
                        {/* Close button (only visible if not in a final success/error state or still loading) */}
                        {!(loading || (currentStep === 3 && paymentStatus !== null)) && (
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
};