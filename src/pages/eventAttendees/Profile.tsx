import { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";

// Import RTK Query hook and type
import { useGetUserDetailsQuery, type ApplicationUser } from '../../queries/general/AuthQuery.ts';
import React from 'react'; // Import React for SyntheticEvent

export const Profile = () => {
    const user = useSelector((state: RootState) => state.user.user); // Get user from Redux store
    const userId = user?.user_id; // Get the user ID from your Redux state

    // Use the RTK Query hook to fetch user details
    const {
        data: fetchedProfileData, // Renamed to avoid conflict with local state
        isLoading: isQueryLoading,
        isFetching: isQueryFetching, // isFetching can be used to indicate background refetches
        isError: isQueryError,
        error: queryError,
        refetch // Allows manual refetching
    } = useGetUserDetailsQuery(userId!, {
        skip: !userId, // Skip the query if userId is not available
    });

    console.log(fetchedProfileData)
    const [userProfile, setUserProfile] = useState<ApplicationUser | undefined>();
    // Changed formData type to Partial<ApplicationUser> to allow for partial objects
    const [formData, setFormData] = useState<Partial<ApplicationUser>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Effect to initialize editable data when fetchedProfileData is loaded
    useEffect(() => {
        if (fetchedProfileData) {
            setUserProfile(fetchedProfileData);
            setFormData(fetchedProfileData); // Initialize formData with user's current data
        } else if (!isQueryLoading && !isQueryFetching && !fetchedProfileData && userId) {
            // If query finished loading and no data, and userId exists, it's an error/no profile
            setMessage({ type: 'error', text: 'User profile not found or failed to load.' });
        }
    }, [fetchedProfileData, isQueryLoading, isQueryFetching, userId]);

    // Effect to handle errors from the query
    useEffect(() => {
        if (isQueryError) {
            console.error("Failed to fetch profile data:", queryError);
            setMessage({ type: 'error', text: (queryError as any)?.data?.message || 'Failed to load profile data.' });
        }
    }, [isQueryError, queryError]);

    // --- Profile Editing Handlers ---
    const handleEditClick = () => {
        setIsEditing(true);
        // Ensure we're working with a deep copy to prevent direct state modification before saving
        // Also ensure userProfile is not undefined
        setFormData(JSON.parse(JSON.stringify(userProfile || {})));
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Revert to original profile data, providing an empty object if userProfile is undefined
        setFormData(userProfile || {});
        setFormErrors({});
        setMessage({ type: '', text: '' });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Directly update formData, as it's now Partial<ApplicationUser>
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
        const errors: { [key: string]: string } = {};
        // Use optional chaining for formData properties
        if (!formData.firstName?.trim()) {
            errors.firstName = 'First Name is required.';
        }
        if (!formData.lastName?.trim()) {
            errors.lastName = 'Last Name is required.';
        }
        if (!formData.email?.trim()) {
            errors.email = 'Email is required.';
        } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format.';
        }
        if (formData.contactPhone && !/^\+?[0-9\s-()]{7,20}$/.test(formData.contactPhone)) {
            errors.contactPhone = 'Invalid phone number format.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveClick = async () => {
        if (!validateProfileForm()) {
            setMessage({ type: 'error', text: 'Please correct the errors in the profile form.' });
            return;
        }

        setMessage({ type: '', text: '' });
        // Simulate saving data to backend
        console.log("Simulating profile update with:", formData);
        try {
            // In a real application, you would dispatch an action to update the user profile in Redux
            // For now, we'll simulate a successful update and directly update local state
            // Example: dispatch(updateUserProfile(formData));
            await new Promise(resolve => setTimeout(resolve, 1000));

            // After simulated successful save, update local state and refetch from backend
            // Ensure userProfile is updated with the new formData, and cast formData to ApplicationUser if all required fields are present
            setUserProfile(prev => ({ ...(prev || {}), ...formData } as ApplicationUser)); // Cast to ApplicationUser if it's guaranteed to be complete
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            refetch(); // Refetch to ensure local state is in sync with server

        } catch (err: any) {
            console.error("Error saving profile:", err);
            setMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
        }
    };

    // Show loading spinner if fetching initial data or refetching
    if (isQueryLoading || isQueryFetching || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-my-base-200)]">
                <span className="loading loading-spinner loading-lg text-[var(--color-my-primary)]"></span>
                <p className="ml-4 text-lg text-[var(--color-my-base-content)]">Loading profile...</p>
            </div>
        );
    }

    const alertClasses = message.type === 'success' ? 'bg-[var(--color-my-success)] text-[var(--color-my-success-content)]' : 'bg-[var(--color-my-error)] text-[var(--color-my-error-content)]';

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[var(--color-my-primary)]">
                <PersonIcon className="text-4xl text-[var(--color-my-primary)]" /> My Profile
            </h1>
            <hr className="my-6 border-[var(--color-my-base-300)]" />

            {message.text && (
                <div role="alert" className={`alert ${alertClasses} mb-6`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Profile Details Section */}
            <div className="card bg-[var(--color-my-base-100)] shadow-xl p-6 mb-8 max-w-3xl mx-auto ">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="avatar w-24 h-24 rounded-full bg-[var(--color-my-primary)]/20 flex items-center justify-center text-[var(--color-my-primary-content)] text-4xl overflow-hidden border-2 border-[var(--color-my-primary)]">
                        {userProfile.profilePicture ? (
                            <img src={userProfile.profilePicture} alt={userProfile.firstName} className="w-full h-full object-cover" />
                        ) : (
                            <span>{userProfile.firstName?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h2 className="text-2xl font-semibold mb-1 text-[var(--color-my-base-content)]">{userProfile.firstName} {userProfile.lastName}</h2>
                        <p className="text-[var(--color-my-base-content)]/70">{userProfile.email}</p>
                    </div>
                    <div>
                        {!isEditing ? (
                            <button
                                className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                                onClick={handleEditClick}
                                disabled={isQueryLoading || isQueryFetching}
                            >
                                <EditIcon className="w-5 h-5" /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-outline border-[var(--color-my-error)] text-[var(--color-my-error)] hover:bg-[var(--color-my-error)] hover:text-[var(--color-my-error-content)]"
                                    onClick={handleCancelClick}
                                    disabled={isQueryLoading || isQueryFetching}
                                >
                                    <CancelIcon className="w-5 h-5" /> Cancel
                                </button>
                                <button
                                    className="btn bg-[var(--color-my-primary)] text-[var(--color-my-primary-content)] hover:bg-[var(--color-my-primary-focus)]"
                                    onClick={handleSaveClick}
                                    disabled={isQueryLoading || isQueryFetching}
                                >
                                    {(isQueryLoading || isQueryFetching) && <span className="loading loading-spinner loading-sm mr-2"></span>}
                                    <SaveIcon className="w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-6 border-[var(--color-my-base-300)]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[var(--color-my-base-content)]">First Name</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]"><PersonIcon className="w-5 h-5" /></span>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName || ''}
                                onChange={handleFormChange}
                                placeholder="Your first name"
                                className={`input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)] ${formErrors.firstName ? 'border-[var(--color-my-error)]' : ''}`}
                                disabled={!isEditing || isQueryLoading || isQueryFetching}
                                required
                            />
                        </label>
                        {formErrors.firstName && <p className="text-[var(--color-my-error)] text-sm mt-1">{formErrors.firstName}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[var(--color-my-base-content)]">Last Name</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]"><PersonIcon className="w-5 h-5" /></span>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName || ''}
                                onChange={handleFormChange}
                                placeholder="Your last name"
                                className={`input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)] ${formErrors.lastName ? 'border-[var(--color-my-error)]' : ''}`}
                                disabled={!isEditing || isQueryLoading || isQueryFetching}
                                required
                            />
                        </label>
                        {formErrors.lastName && <p className="text-[var(--color-my-error)] text-sm mt-1">{formErrors.lastName}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[var(--color-my-base-content)]">Email Address</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]"><EmailIcon className="w-5 h-5" /></span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleFormChange}
                                placeholder="your@email.com"
                                className={`input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)] ${formErrors.email ? 'border-[var(--color-my-error)]' : ''}`}
                                disabled={!isEditing || isQueryLoading || isQueryFetching}
                                required
                            />
                        </label>
                        {formErrors.email && <p className="text-[var(--color-my-error)] text-sm mt-1">{formErrors.email}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[var(--color-my-base-content)]">Phone Number</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]"><PhoneIcon className="w-5 h-5" /></span>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone || ''}
                                onChange={handleFormChange}
                                placeholder="+2547XXXXXXXX"
                                className={`input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)] ${formErrors.contactPhone ? 'border-[var(--color-my-error)]' : ''}`}
                                disabled={!isEditing || isQueryLoading || isQueryFetching}
                            />
                        </label>
                        {formErrors.contactPhone && <p className="text-[var(--color-my-error)] text-sm mt-1">{formErrors.contactPhone}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[var(--color-my-base-content)]">Address</span>
                        </label>
                        <label className="input-group">
                            <span className="bg-[var(--color-my-base-200)] text-[var(--color-my-base-content)]"><LocationOnIcon className="w-5 h-5" /></span>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleFormChange}
                                placeholder="123 Street, City"
                                className="input input-bordered w-full bg-[var(--color-my-base-100)] text-[var(--color-my-base-content)] border-[var(--color-my-base-300)]"
                                disabled={!isEditing || isQueryLoading || isQueryFetching}
                            />
                        </label>
                    </div>
                </div>
            </div>

        </div>
    );
};
