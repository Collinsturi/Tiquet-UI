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
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { usePaystackPayment} from 'react-paystack';

interface TicketItem {
    ticketTypeName: string;
    quantity: number;
    pricePerUnit: number;
}

type PaystackCustomField = {
    display_name: string;
    variable_name: string;
    value: string;
};

type PaystackMetadata = {
    custom_fields: PaystackCustomField[];
};

type PaystackProps = {
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
    metadata?: PaystackMetadata;
};


interface OrderDetails {
    eventName: string;
    eventDate: string;
    eventLocation: string;
    totalAmount: number;
    userEmail: string;
    eventId: string;
    tickets: TicketItem[];
}

interface LocationState {
    orderDetails?: OrderDetails;
}

const generateDummyQRCode = (ticketDetails: OrderDetails): string => {
    const data = JSON.stringify(ticketDetails);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
};

export const Checkout = () => {
    // Remove generic type from useLocation - it's not needed in newer versions
    const location = useLocation();
    const navigate = useNavigate();
    const checkoutModalRef = useRef<HTMLDialogElement>(null);

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // Fix the type to include 'success' in the union
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
    const [message, setMessage] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mpesa' | 'paystack'>('mpesa');

    // Paystack configuration with proper typing
    const paystackConfig: PaystackProps = {
        reference: (new Date()).getTime().toString(),
        email: orderDetails?.userEmail || 'customer@example.com',
        amount: orderDetails?.totalAmount ? Math.round(orderDetails.totalAmount * 100) : 0,
        publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Paystack Public Key
        metadata: {
            custom_fields: [
                {
                    display_name: "Order ID",
                    variable_name: "order_id",
                    value: orderDetails?.eventId || 'N/A'
                }
            ]
        }
    };

    // Initialize Paystack hook
    const initializePaystackPayment = usePaystackPayment(paystackConfig);

    useEffect(() => {
        // Cast the location.state to our expected type
        const state = location.state as LocationState | null;
        if (state && state.orderDetails) {
            setOrderDetails(state.orderDetails);
            setMessage('');
            setPaymentStatus(null);
        } else {
            setMessage('No order details found. Please select tickets first.');
            setPaymentStatus('error');
            setTimeout(() => navigate('/attendee/events'), 3000);
        }
    }, [location.state, navigate]);

    const handleInitiatePayment = () => {
        if (!orderDetails) {
            setMessage('Order details missing. Cannot proceed with payment.');
            setPaymentStatus('error');
            return;
        }
        setMessage('');
        setPaymentStatus(null);
        setCurrentStep(1);
        checkoutModalRef.current?.showModal();
    };

    const executeMpesaPaymentProcess = async () => {
        setLoading(true);
        setCurrentStep(2);
        setMessage('Waiting for M-Pesa payment confirmation...');

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const paymentSuccessful = Math.random() > 0.1;

            if (paymentSuccessful) {
                setMessage('M-Pesa Payment successful! Your tickets have been confirmed.');
                setPaymentStatus('success');
                setCurrentStep(3);
            } else {
                throw new Error('M-Pesa Payment failed. Please try a different method or try again.');
            }

        } catch (error: any) {
            setMessage(error.message || 'An unexpected error occurred during M-Pesa payment.');
            setPaymentStatus('error');
            setCurrentStep(3);
        } finally {
            setLoading(false);
        }
    };

    const handlePaystackPayment = () => {
        setLoading(true);
        checkoutModalRef.current?.close();

        initializePaystackPayment({
            onSuccess: (response: any) => {
                console.log('Paystack Success:', response);
                setMessage('Paystack Payment successful! Your tickets have been confirmed.');
                setPaymentStatus('success');
                setCurrentStep(3);
                setLoading(false);
            },
            onClose: () => {
                console.log('Paystack Closed');
                setMessage('Paystack payment was interrupted. Please try again.');
                setPaymentStatus('error');
                setCurrentStep(1);
                setLoading(false);
                checkoutModalRef.current?.showModal();
            },
            // Remove onLoad as it's not supported in the current version
            // onLoad: () => {
            //     setMessage('Redirecting to Paystack...');
            // },
        });
    };

    const handleDownloadTicket = () => {
        if (orderDetails && paymentStatus === 'success') {
            const dummyTicketData = JSON.stringify({
                eventId: orderDetails.eventId,
                tickets: orderDetails.tickets,
                purchaseDate: new Date().toISOString(),
                status: 'Confirmed'
            }, null, 2);

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

                            <button
                                className="btn btn-block bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                                onClick={handleInitiatePayment}
                                disabled={loading || paymentStatus === 'success'}
                            >
                                {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                                {paymentStatus === 'success' ? (
                                    <> <CheckCircleOutlineIcon className="w-5 h-5" /> Payment Confirmed </>
                                ) : (
                                    <> <PaymentIcon className="w-5 h-5" /> Confirm and Pay KSh {orderDetails.totalAmount.toLocaleString('en-KE')} </>
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
                    <div className="overflow-x-auto mb-6">
                        <ul className="steps w-full">
                            <li className={`step ${currentStep >= 1 ? 'step-primary text-[var(--color-my-primary)]' : 'text-[var(--color-my-base-content)]'}`}>Instructions</li>
                            <li className={`step ${currentStep >= 2 ? 'step-primary text-[var(--color-my-primary)]' : 'text-[var(--color-my-base-content)]'}`}>Confirmation</li>
                            <li className={`step ${currentStep >= 3 ? 'step-primary text-[var(--color-my-primary)]' : 'text-[var(--color-my-base-content)]'}`}>Tickets</li>
                        </ul>
                    </div>

                    {/* Step Content */}
                    <div className="p-4 bg-[var(--color-my-base-200)] rounded-box min-h-[150px] flex flex-col justify-center items-center text-center">
                        {currentStep === 1 && selectedPaymentMethod === 'mpesa' && (
                            <>
                                <PhoneIphoneIcon className="w-16 h-16 text-[var(--color-my-primary)] mb-4 animate-bounce-slow" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Check Your Phone for M-Pesa STK Push</p>
                                <p className="text-[var(--color-my-base-content)]/80">
                                    A payment request for **KSh {orderDetails?.totalAmount.toLocaleString('en-KE')}** has been sent to your registered M-Pesa number.
                                    Please **enter your M-Pesa PIN** on your phone to complete the payment.
                                </p>
                                <p className="text-sm text-[var(--color-my-base-content)]/60 mt-2">
                                    (This request expires in 5 minutes. If you don't receive it, click "Retry").
                                </p>
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] mt-4"
                                    onClick={executeMpesaPaymentProcess}
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'I have entered my PIN'}
                                </button>
                                <button
                                    className="btn btn-ghost text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-300)] btn-sm mt-2"
                                    onClick={() => { console.log('Simulating STK Push retry...'); }}
                                    disabled={loading}
                                >
                                    Retry STK Push
                                </button>
                            </>
                        )}

                        {currentStep === 1 && selectedPaymentMethod === 'paystack' && (
                            <>
                                <CreditCardIcon className="w-16 h-16 text-[var(--color-my-primary)] mb-4" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Proceed to Paystack</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    You will be redirected to a secure Paystack page to complete your payment using card or bank transfer.
                                </p>
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] mt-4"
                                    onClick={handlePaystackPayment}
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Pay with Paystack'}
                                </button>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <span className="loading loading-spinner loading-lg text-[var(--color-my-primary)] mb-4"></span>
                                <p className="text-xl font-semibold text-[var(--color-my-base-content)]">Processing Payment...</p>
                                <p className="text-[var(--color-my-base-content)]/80">
                                    Please do not close this window. We are confirming your payment. This may take a moment.
                                </p>
                            </>
                        )}

                        {currentStep === 3 && paymentStatus === 'success' && (
                            <>
                                <CheckCircleOutlineIcon className="w-16 h-16 text-[var(--color-my-success)] mb-4" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Payment Successful!</p>
                                <p className="text-[var(--color-my-base-content)]/80 mb-4">
                                    Your tickets for **{orderDetails?.eventName}** have been confirmed.
                                    You can view and download them below.
                                </p>
                                {orderDetails && (
                                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                                        <QrCode2Icon className="w-32 h-32 mx-auto text-[var(--color-my-base-content)]" />
                                        <img src={generateDummyQRCode(orderDetails)} alt="QR Code" className="w-32 h-32 mx-auto" />
                                        <p className="text-sm text-[var(--color-my-base-content)]/70 mt-2">Scan this code at the event entrance.</p>
                                    </div>
                                )}
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)] mt-4"
                                    onClick={handleDownloadTicket}
                                >
                                    <DownloadIcon className="w-5 h-5 mr-2" /> Download Ticket
                                </button>
                                <button
                                    className="btn bg-[var(--color-my-secondary)] text-[var(--color-my-secondary-content)] hover:bg-[var(--color-my-secondary-focus)] mt-2"
                                    onClick={() => {
                                        checkoutModalRef.current?.close();
                                        navigate('/attendee/My-tickets');
                                    }}
                                >
                                    Go to My Tickets
                                </button>
                            </>
                        )}

                        {currentStep === 3 && paymentStatus === 'error' && (
                            <>
                                <ErrorOutlineIcon className="w-16 h-16 text-[var(--color-my-error)] mb-4" />
                                <p className="text-xl font-semibold mb-2 text-[var(--color-my-base-content)]">Payment Failed</p>
                                <p className="text-[var(--color-my-base-content)]/80">
                                    {message || 'There was an issue processing your payment. Please try again.'}
                                </p>
                                <button
                                    className="btn bg-[var(--color-my-error)] text-[var(--color-my-error-content)] hover:bg-[var(--color-my-error-focus)] mt-4"
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setPaymentStatus(null);
                                        setMessage('');
                                    }}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="btn btn-ghost text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-300)] mt-2"
                                    onClick={() => {
                                        checkoutModalRef.current?.close();
                                        navigate('/attendee/events');
                                    }}
                                >
                                    Cancel & Return to Events
                                </button>
                            </>
                        )}
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            {(!loading && paymentStatus !== 'success' && currentStep !== 2) && (
                                <button className="btn bg-[var(--color-my-base-300)] text-[var(--color-my-base-content)] hover:bg-[var(--color-my-base-content)] hover:text-[var(--color-my-base-100)]" onClick={() => setCurrentStep(0)}>Close</button>
                            )}
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};