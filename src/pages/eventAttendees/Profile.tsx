import React, { useState, useEffect, useRef } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

// Removed dummyUsersDb and simulated API calls as data will come from Redux

export const Profile = () => {
    const user = useSelector((state: RootState) => state.user.user); // Get user from Redux store

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true); // Start as loading if user isn't immediately available
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({});

    // Fetch user profile from Redux on component mount or when 'user' from Redux changes
    useEffect(() => {
        if (user) {
            setUserProfile(user);
            setFormData(user); // Initialize formData with user's current data
            setLoading(false);
        } else {
            // Handle case where user might not be logged in or data is not yet in Redux
            setMessage({ type: 'error', text: 'User profile not available. Please log in.' });
            setLoading(false);
        }
    }, [user]); // Depend on the 'user' object from Redux

    // --- Profile Editing Handlers ---
    const handleEditClick = () => {
        setIsEditing(true);
        // Ensure we're working with a deep copy to prevent direct state modification before saving
        setFormData(JSON.parse(JSON.stringify(userProfile)));
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(userProfile); // Revert to original profile data
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
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
            // In a real application, you would dispatch an action to update the user profile in Redux
            // For now, we'll simulate a successful update and directly update local state
            // Example: dispatch(updateUserProfile(formData));
            console.log("Simulating profile update with:", formData);
            // Simulate API call success
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUserProfile(prev => ({ ...prev, ...formData })); // Update local state with new data
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

        } catch (err) {
            console.error("Error saving profile:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
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
                            <img src={userProfile.profilePicture} alt={userProfile.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{userProfile.first_name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h2 className="text-2xl font-semibold mb-1">{userProfile.first_name} {userProfile.last_name}</h2>
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
                                value={`${formData.first_name || ''} ${formData.last_name || ''}`}
                                onChange={handleFormChange}
                                placeholder="Your full name"
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                                disabled={!isEditing || loading}
                                required
                            />
                        </label>
                        {formErrors.first_name && <p className="text-error text-sm mt-1">{formErrors.first_name}</p>}
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

        </div>
    );
};