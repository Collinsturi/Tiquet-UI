import React, { useState, useEffect, useRef } from 'react'; // useRef for the dialog
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// import PayPalIcon from '@mui/icons-material/PayPal'; // Using a generic icon if PayPal specific not available
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For "Set Default"
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // For non-default state if needed, though DaisyUI handles selection

// --- Dummy Data Simulation (remains largely the same) ---
const CURRENT_USER_ID = 'user-001';

// This will be treated as the "backend" data that we can modify
let dummyUsersDb = [
    {
        user_id: 'user-001',
        name: 'Alice Attendee',
        email: 'alice.attendee@example.com',
        phone: '+254712345001',
        address: '123 Event Lane, Nairobi, Kenya',
        profilePicture: 'https://placehold.co/100x100/A0D9F0/000000?text=AA', // Placeholder image
        paymentMethods: [
            { id: 'pay-001', type: 'card', last4: '4242', brand: 'Visa', expiry: '12/26', isDefault: true },
            { id: 'pay-002', type: 'paypal', email: 'alice.p@example.com', isDefault: false },
        ]
    },
    {
        user_id: 'user-002',
        name: 'Bob Participant',
        email: 'bob.p@example.com',
        phone: '+254712345002',
        address: '456 Tech St, Mombasa, Kenya',
        profilePicture: 'https://placehold.co/100x100/F0A0D9/000000?text=BP',
        paymentMethods: []
    },
];

// Simulate fetching user profile data
const fetchUserProfile = async (userId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const user = dummyUsersDb.find(u => u.user_id === userId);
            resolve(user ? JSON.parse(JSON.stringify(user)) : null);
        }, 500);
    });
};

// Simulate updating user profile data
const updateUserProfile = async (userId, updatedData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = dummyUsersDb.findIndex(u => u.user_id === userId);
            if (index !== -1) {
                if (updatedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedData.email)) {
                    return reject(new Error("Invalid email format."));
                }
                if (updatedData.phone && !/^\+?[0-9\s-()]{7,20}$/.test(updatedData.phone)) {
                    return reject(new Error("Invalid phone number format."));
                }

                dummyUsersDb[index] = { ...dummyUsersDb[index], ...updatedData };
                console.log("Updated user profile in dummy DB:", dummyUsersDb[index]);
                resolve({ success: true, message: "Profile updated successfully!" });
            } else {
                reject(new Error("User not found."));
            }
        }, 1000);
    });
};

// Simulate payment method specific APIs
const addPaymentMethod = async (userId, newMethod) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = dummyUsersDb.find(u => u.user_id === userId);
            if (!user) return reject(new Error("User not found."));

            // Basic validation for new method
            if (newMethod.type === 'card') {
                if (!newMethod.last4 || !newMethod.brand || !newMethod.expiry) return reject(new Error("Missing card details."));
                if (!/^\d{4}$/.test(newMethod.last4)) return reject(new Error("Card last 4 must be 4 digits."));
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newMethod.expiry)) return reject(new Error("Expiry must be MM/YY."));
            } else if (newMethod.type === 'paypal') {
                if (!newMethod.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMethod.email)) return reject(new Error("Invalid PayPal email."));
            } else {
                return reject(new Error("Unsupported payment method type."));
            }

            const newId = `pay-${Date.now()}`; // Simple unique ID
            const methodToAdd = { id: newId, ...newMethod, isDefault: false };

            // If this is the first method, make it default
            if (user.paymentMethods.length === 0) {
                methodToAdd.isDefault = true;
            }

            user.paymentMethods.push(methodToAdd);
            console.log("Added payment method:", user.paymentMethods);
            resolve({ success: true, message: "Payment method added successfully!", method: methodToAdd });
        }, 800);
    });
};

const deletePaymentMethod = async (userId, methodId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = dummyUsersDb.find(u => u.user_id === userId);
            if (!user) return reject(new Error("User not found."));

            const initialLength = user.paymentMethods.length;
            user.paymentMethods = user.paymentMethods.filter(pm => pm.id !== methodId);

            if (user.paymentMethods.length < initialLength) {
                // If deleted default, set a new default if other methods exist
                if (user.paymentMethods.length > 0 && !user.paymentMethods.some(pm => pm.isDefault)) {
                    user.paymentMethods[0].isDefault = true;
                }
                console.log("Deleted payment method:", user.paymentMethods);
                resolve({ success: true, message: "Payment method deleted." });
            } else {
                reject(new Error("Payment method not found."));
            }
        }, 600);
    });
};

const setDefaultPaymentMethod = async (userId, methodId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = dummyUsersDb.find(u => u.user_id === userId);
            if (!user) return reject(new Error("User not found."));

            let found = false;
            user.paymentMethods = user.paymentMethods.map(pm => {
                if (pm.id === methodId) {
                    found = true;
                    return { ...pm, isDefault: true };
                }
                return { ...pm, isDefault: false }; // Unset default for others
            });

            if (found) {
                console.log("Set default payment method:", user.paymentMethods);
                resolve({ success: true, message: "Default payment method updated." });
            } else {
                reject(new Error("Payment method not found."));
            }
        }, 500);
    });
};

// --- Component Start ---
export const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({}); // Holds editable form data for profile details
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({}); // For client-side validation errors for profile details

    // State for Payment Method Dialog
    const addPaymentModalRef = useRef(null); // Ref to control DaisyUI modal
    const [newPaymentMethod, setNewPaymentMethod] = useState({ type: 'card', brand: '', last4: '', expiry: '', email: '' });
    const [paymentDialogErrors, setPaymentDialogErrors] = useState({});
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Fetch user profile on component mount
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                setLoading(true);
                setMessage({ type: '', text: '' });
                const profile = await fetchUserProfile(CURRENT_USER_ID);
                if (profile) {
                    setUserProfile(profile);
                    setFormData(profile);
                } else {
                    setMessage({ type: 'error', text: 'Could not load profile. User not found.' });
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                setMessage({ type: 'error', text: err.message || 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };
        getUserProfile();
    }, []);

    // --- Profile Editing Handlers ---
    const handleEditClick = () => {
        setIsEditing(true);
        setFormData(JSON.parse(JSON.stringify(userProfile)));
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(userProfile);
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateProfileForm = () => {
        const errors = {};
        if (!formData.name?.trim()) {
            errors.name = 'Name is required.';
        }
        if (!formData.email?.trim()) {
            errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format.';
        }
        if (formData.phone && !/^\+?[0-9\s-()]{7,20}$/.test(formData.phone)) {
            errors.phone = 'Invalid phone number format.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveClick = async () => {
        if (!validateProfileForm()) {
            setMessage({ type: 'error', text: 'Please correct the errors in the profile form.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await updateUserProfile(CURRENT_USER_ID, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            });
            if (response.success) {
                setUserProfile(prev => ({ ...prev, ...formData }));
                setIsEditing(false);
                setMessage({ type: 'success', text: response.message });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update profile.' });
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
        } finally {
            setLoading(false);
        }
    };

    // --- Payment Method Handlers ---
    const handleOpenPaymentDialog = () => {
        setNewPaymentMethod({ type: 'card', brand: '', last4: '', expiry: '', email: '' }); // Reset form
        setPaymentDialogErrors({});
        addPaymentModalRef.current?.showModal(); // Show DaisyUI modal
    };

    const handleClosePaymentDialog = () => {
        addPaymentModalRef.current?.close(); // Close DaisyUI modal
    };

    const handleNewPaymentMethodChange = (e) => {
        const { name, value } = e.target;
        setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
        if (paymentDialogErrors[name]) {
            setPaymentDialogErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validatePaymentForm = () => {
        const errors = {};
        if (newPaymentMethod.type === 'card') {
            if (!newPaymentMethod.brand?.trim()) errors.brand = 'Card brand is required.';
            if (!newPaymentMethod.last4?.trim()) {
                errors.last4 = 'Last 4 digits are required.';
            } else if (!/^\d{4}$/.test(newPaymentMethod.last4)) {
                errors.last4 = 'Must be 4 digits.';
            }
            if (!newPaymentMethod.expiry?.trim()) {
                errors.expiry = 'Expiry date is required.';
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newPaymentMethod.expiry)) {
                errors.expiry = 'Format MM/YY.';
            }
        } else if (newPaymentMethod.type === 'paypal') {
            if (!newPaymentMethod.email?.trim()) {
                errors.email = 'PayPal email is required.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPaymentMethod.email)) {
                errors.email = 'Invalid email format.';
            }
        }
        setPaymentDialogErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddPaymentMethod = async () => {
        if (!validatePaymentForm()) {
            return;
        }
        setPaymentLoading(true);
        try {
            const response = await addPaymentMethod(CURRENT_USER_ID, newPaymentMethod);
            if (response.success) {
                setUserProfile(prevProfile => {
                    const updatedMethods = [...prevProfile.paymentMethods];
                    if (updatedMethods.length === 0) { // If this is the first method, make it default
                        response.method.isDefault = true;
                    }
                    updatedMethods.push(response.method);
                    return { ...prevProfile, paymentMethods: updatedMethods };
                });
                setMessage({ type: 'success', text: response.message });
                handleClosePaymentDialog(); // Close dialog on success
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to add payment method.' });
            }
        } catch (err) {
            console.error("Error adding payment method:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to add payment method.' });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleDeletePaymentMethod = async (methodId) => {
        if (!window.confirm("Are you sure you want to delete this payment method?")) {
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await deletePaymentMethod(CURRENT_USER_ID, methodId);
            if (response.success) {
                setUserProfile(prevProfile => {
                    let updatedMethods = prevProfile.paymentMethods.filter(pm => pm.id !== methodId);
                    if (updatedMethods.length > 0 && !updatedMethods.some(pm => pm.isDefault)) {
                        updatedMethods[0].isDefault = true;
                    }
                    return { ...prevProfile, paymentMethods: updatedMethods };
                });
                setMessage({ type: 'success', text: response.message });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete payment method.' });
            }
        } catch (err) {
            console.error("Error deleting payment method:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to delete payment method.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultPaymentMethod = async (methodId) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await setDefaultPaymentMethod(CURRENT_USER_ID, methodId);
            if (response.success) {
                setUserProfile(prevProfile => {
                    const updatedMethods = prevProfile.paymentMethods.map(pm => ({
                        ...pm,
                        isDefault: pm.id === methodId
                    }));
                    return { ...prevProfile, paymentMethods: updatedMethods };
                });
                setMessage({ type: 'success', text: response.message });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to set default method.' });
            }
        } catch (err) {
            console.error("Error setting default payment method:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to set default method.' });
        } finally {
            setLoading(false);
        }
    };


    if (loading || userProfile === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-4 text-lg">Loading profile...</p>
            </div>
        );
    }

    // Determine alert type based on message type
    const alertClasses = message.type === 'success' ? 'alert-success' : 'alert-error';

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <PersonIcon className="text-4xl" /> My Profile
            </h1>
            <hr className="my-6 border-base-content/10" />

            {message.text && (
                <div role="alert" className={`alert ${alertClasses} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Profile Details Section */}
            <div className="card bg-base-100 shadow-xl p-6 mb-8 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="avatar w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary-content text-4xl overflow-hidden">
                        {userProfile.profilePicture ? (
                            <img src={userProfile.profilePicture} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{userProfile.name?.charAt(0) || 'U'}</span> // Fallback to first letter
                        )}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h2 className="text-2xl font-semibold mb-1">{userProfile.name}</h2>
                        <p className="text-base-content/70">{userProfile.email}</p>
                    </div>
                    <div>
                        {!isEditing ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleEditClick}
                                disabled={loading}
                            >
                                <EditIcon className="w-5 h-5" /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-outline btn-error"
                                    onClick={handleCancelClick}
                                    disabled={loading}
                                >
                                    <CancelIcon className="w-5 h-5" /> Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveClick}
                                    disabled={loading}
                                >
                                    {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                                    <SaveIcon className="w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-6 border-base-content/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-base-200"><PersonIcon className="w-5 h-5" /></span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleFormChange}
                                placeholder="Your full name"
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                                disabled={!isEditing || loading}
                                required
                            />
                        </label>
                        {formErrors.name && <p className="text-error text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-base-200"><EmailIcon className="w-5 h-5" /></span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleFormChange}
                                placeholder="your@email.com"
                                className={`input input-bordered w-full ${formErrors.email ? 'input-error' : ''}`}
                                disabled={!isEditing || loading}
                                required
                            />
                        </label>
                        {formErrors.email && <p className="text-error text-sm mt-1">{formErrors.email}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-base-200"><PhoneIcon className="w-5 h-5" /></span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleFormChange}
                                placeholder="+2547XXXXXXXX"
                                className={`input input-bordered w-full ${formErrors.phone ? 'input-error' : ''}`}
                                disabled={!isEditing || loading}
                            />
                        </label>
                        {formErrors.phone && <p className="text-error text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-base-200"><LocationOnIcon className="w-5 h-5" /></span>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleFormChange}
                                placeholder="123 Street, City"
                                className="input input-bordered w-full"
                                disabled={!isEditing || loading}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Payment Methods Section */}
            <div className="card bg-base-100 shadow-xl p-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <CreditCardIcon className="text-3xl" /> Payment Methods
                    </h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleOpenPaymentDialog}
                        disabled={loading || paymentLoading}
                    >
                        <AddIcon className="w-5 h-5" /> Add New
                    </button>
                </div>
                <hr className="my-4 border-base-content/10" />

                {userProfile.paymentMethods.length === 0 ? (
                    <div role="alert" className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>You have no payment methods saved. Add one to speed up checkout!</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userProfile.paymentMethods.map(method => (
                            <div key={method.id} className="card card-bordered bg-base-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {method.type === 'card' ? (
                                        <CreditCardIcon className="text-4xl text-base-content/70" />
                                    ) : (
                                        <ShoppingCartIcon />
                                        // <PayPalIcon className="text-4xl text-base-content/70" />
                                    )}
                                    <div>
                                        <h3 className="text-lg font-medium">
                                            {method.type === 'card' ? `${method.brand} **** ${method.last4}` : `PayPal (${method.email})`}
                                        </h3>
                                        {method.type === 'card' && (
                                            <p className="text-sm text-base-content/60">Expires: {method.expiry}</p>
                                        )}
                                        {method.isDefault && (
                                            <div className="badge badge-success badge-outline mt-1">Default</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!method.isDefault && (
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                            disabled={loading}
                                        >
                                            {loading && <span className="loading loading-spinner loading-sm mr-1"></span>}
                                            <CheckCircleIcon className="w-4 h-4" /> Set Default
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-square btn-outline btn-error btn-sm"
                                        onClick={() => handleDeletePaymentMethod(method.id)}
                                        disabled={loading}
                                    >
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Payment Method Modal (DaisyUI) */}
            <dialog id="add_payment_modal" className="modal" ref={addPaymentModalRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <AddIcon className="w-6 h-6" /> Add New Payment Method
                    </h3>
                    <div className="py-4 space-y-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Payment Type</span>
                            </label>
                            <select
                                className="select select-bordered"
                                name="type"
                                value={newPaymentMethod.type}
                                onChange={handleNewPaymentMethodChange}
                                disabled={paymentLoading}
                            >
                                <option value="card">Credit/Debit Card</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>

                        {newPaymentMethod.type === 'card' && (
                            <>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Card Brand (e.g., Visa, MasterCard)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={newPaymentMethod.brand}
                                        onChange={handleNewPaymentMethodChange}
                                        placeholder="Visa"
                                        className={`input input-bordered w-full ${paymentDialogErrors.brand ? 'input-error' : ''}`}
                                        disabled={paymentLoading}
                                    />
                                    {paymentDialogErrors.brand && <p className="text-error text-sm mt-1">{paymentDialogErrors.brand}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Last 4 Digits</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="last4"
                                            value={newPaymentMethod.last4}
                                            onChange={handleNewPaymentMethodChange}
                                            maxLength="4"
                                            placeholder="XXXX"
                                            className={`input input-bordered w-full ${paymentDialogErrors.last4 ? 'input-error' : ''}`}
                                            disabled={paymentLoading}
                                        />
                                        {paymentDialogErrors.last4 && <p className="text-error text-sm mt-1">{paymentDialogErrors.last4}</p>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Expiry Date (MM/YY)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={newPaymentMethod.expiry}
                                            onChange={handleNewPaymentMethodChange}
                                            maxLength="5"
                                            placeholder="MM/YY"
                                            className={`input input-bordered w-full ${paymentDialogErrors.expiry ? 'input-error' : ''}`}
                                            disabled={paymentLoading}
                                        />
                                        {paymentDialogErrors.expiry && <p className="text-error text-sm mt-1">{paymentDialogErrors.expiry}</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {newPaymentMethod.type === 'paypal' && (
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">PayPal Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newPaymentMethod.email}
                                    onChange={handleNewPaymentMethodChange}
                                    placeholder="paypal@example.com"
                                    className={`input input-bordered w-full ${paymentDialogErrors.email ? 'input-error' : ''}`}
                                    disabled={paymentLoading}
                                />
                                {paymentDialogErrors.email && <p className="text-error text-sm mt-1">{paymentDialogErrors.email}</p>}
                            </div>
                        )}
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-ghost" onClick={handleClosePaymentDialog} disabled={paymentLoading}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddPaymentMethod}
                            disabled={paymentLoading}
                        >
                            {paymentLoading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                            <SaveIcon className="w-5 h-5" /> Add Method
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};