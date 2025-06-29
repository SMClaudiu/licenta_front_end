import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClientDTO } from '../../types/api';
import { IoArrowBack, IoPencil, IoClose, IoCheckmark, IoEyeOffOutline, IoEyeOutline, IoLogOutOutline, IoTrashOutline } from 'react-icons/io5';
import styles from  '../../styles/SettingsScreen.module.css';
import { useAuth } from '../../contexts/AuthContext';
import {changeClientPassword, deleteClientAccount, updateClientField} from "../../services/settingsService";


const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut: contextSignOut, userData: authContextUser, updatedAuthUserData } = useAuth(); // Get signOut from context

    const [user, setUser] = useState<ClientDTO | undefined>(() => {
        const initialUserFromState = (location.state as any)?.user;
        return authContextUser || initialUserFromState;
    });

    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Example preferences - replace with actual state management if needed
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        if ((!user || user.clientId !== authContextUser?.clientId) && authContextUser) setUser(authContextUser);
        else if ( !authContextUser && !((location.state as any)?.user) && !user){

            console.error("User data not available for settings screen. Potentially redirecting.");
            navigate('/login');
        }
    }, [authContextUser, user, location.state]);

    const startEditing = (field: string, currentValue: string | undefined) => {
        setEditingField(field);
        setTempValue(currentValue || '');
    };

    const cancelEditing = () => {
        setEditingField(null);
        setTempValue('');
    };

    const saveField = async (field: 'name' | 'email' | 'phoneNumber') => {
        if (!user || user.clientId == undefined){
            window.alert('Error: User ID not found or user data not fully loaded');
            return;
        }

        const trimmedTempValue = tempValue.trim();

        if (user[field] === tempValue.trim()) {
            setEditingField(null);
            setTempValue('');
            return;
        }
        if (!tempValue.trim()){
            window.alert('Error: Please enter a valid value');
            return;
        }

        const oldUser = { ...user };
        setUser(oldUser =>{
            if (!oldUser) return undefined;
            return{
                ... oldUser,
                [field]: trimmedTempValue,
            };
        });
        setEditingField(null);
        setTempValue('');
        try {
            const updatedUser = await updateClientField(user.clientId, field, tempValue.trim());
            setUser(updatedUser);
            setEditingField(null);
            setTempValue('');
            if(updatedAuthUserData) updatedAuthUserData(updatedUser);
            window.alert(`Success: ${field} updated successfully`);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            window.alert(`Error: Failed to update ${field}. Please try again.`);
        }
    };

    const changePassword = async (event: FormEvent) => {
        event.preventDefault();

        if (!newPassword || !confirmPassword) {
            window.alert('Error: Please fill in new password and confirm password fields');
            return;
        }
        if (newPassword !== confirmPassword) {

            window.alert('Error: New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            window.alert('Error: Password must be at least 8 characters long');
            return;
        }
        if (!user?.clientId) {
            window.alert('Error: User ID not found');
            return;
        }

        try {
            await changeClientPassword(user.clientId, oldPassword, newPassword);
            setOldPassword(oldPassword);
            setNewPassword(newPassword);
            setConfirmPassword(newPassword);
            window.alert('Success: Password updated successfully');
        } catch (error) {
            console.log("oldPassowrd: ")
            console.log(oldPassword)
            console.log("newPassword: ")
            console.log(newPassword)
            console.error('Error updating password:', error);
            window.alert('Error: Failed to update password. Please try again.');
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await contextSignOut();
            navigate('/login', { replace: true });
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {

            try {
                console.log("Deleting process started...")
                if (!user?.clientId) {
                    window.alert('Error: User ID not found');
                    return;
                }

                await deleteClientAccount(user.clientId);
                setUser(undefined);
                await contextSignOut();
                console.log("User deleted succesfully");
                navigate('/login', { replace: true });
                return;
            } catch (error) {
                console.error('Error deleting account:', error);
                window.alert('Error: Failed to delete account. Please try again.');
            }
        }
    };
    const renderEditableField = (
        label: string,
        fieldKey: keyof Pick<ClientDTO, 'name' | 'email' | 'phoneNumber'>, // Ensure fieldKey is a valid key
        value: string | undefined,
        inputType: 'text' | 'email' | 'tel' = 'text'
    ) => {
        const isEditing = editingField === fieldKey;
        return (
            <div className={styles.settingItem}>
                <label className={styles.settingLabel}>{label}</label>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <input
                            type={inputType}
                            className={styles.editInput}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.editButtons}>
                            <button type="button" className={`${styles.editButton} ${styles.cancelButton}`} onClick={cancelEditing} aria-label="Cancel edit">
                                <IoClose size={16} />
                            </button>
                            <button type="button" className={`${styles.editButton} ${styles.saveButton}`} onClick={() => saveField(fieldKey)} aria-label="Save changes">
                                <IoCheckmark size={16} color="#fff" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button type="button" className={styles.fieldContainer} onClick={() => startEditing(fieldKey, value)}>
                        <span className={styles.settingValue}>{value || 'N/A'}</span>
                        <IoPencil size={16} className={styles.editIcon} />
                    </button>
                )}
            </div>
        );
    };

    if (!user) {
        return (
            <div className={`${styles.container} ${styles.centerContent}`}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading user data or user not found...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <button type="button" className={styles.backButton} onClick={() => navigate(-1)} aria-label="Go back">
                        <IoArrowBack size={24} color="#fff" />
                    </button>
                    <h1 className={styles.headerTitle}>Settings</h1>
                    <div className={styles.placeholder} /> {/* For spacing */}
                </div>
            </header>

            <main className={styles.content}>
                {/* Profile Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Profile Information</h2>
                    <div className={styles.sectionContent}>
                        {renderEditableField('Name', 'name', user.name)}
                        {renderEditableField('Email', 'email', user.email, 'email')}
                        {renderEditableField('Phone Number', 'phoneNumber', user.phoneNumber, 'tel')}
                    </div>
                </section>

                {/* Password Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Change Password</h2>
                    <form className={styles.sectionContent} onSubmit={changePassword}>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.passwordInput}
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            {/* Eye icon usually placed inside or next to input */}
                        </div>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.passwordInput}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.passwordInput}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(!showPassword)} aria-label="Show/hide password">
                                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                            </button>
                        </div>
                        <button type="submit" className={styles.changePasswordButton}>
                            Change Password
                        </button>
                    </form>
                </section>

                {/* Preferences Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Preferences</h2>
                    <div className={styles.sectionContent}>
                        <div className={styles.preferenceItem}>
                            <div className={styles.preferenceInfo}>
                                <label htmlFor="darkModeSwitch" className={styles.preferenceLabel}>Dark Mode</label>
                                <p className={styles.preferenceDescription}>Toggle dark theme appearance</p>
                            </div>
                            <label className={styles.switch}>
                                <input id="darkModeSwitch" type="checkbox" checked={isDarkMode} onChange={(e) => setIsDarkMode(e.target.checked)} />
                                <span className={`${styles.slider} ${styles.round}`}></span>
                            </label>
                        </div>
                        <div className={styles.preferenceItem}>
                            <div className={styles.preferenceInfo}>
                                <label htmlFor="notificationsSwitch" className={styles.preferenceLabel}>Push Notifications</label>
                                <p className={styles.preferenceDescription}>Receive notifications about tasks and updates</p>
                            </div>
                            <label className={styles.switch}>
                                <input id="notificationsSwitch" type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                                <span className={`${styles.slider} ${styles.round}`}></span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Account Actions */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account Actions</h2>
                    <div className={styles.sectionContent}>
                        <button type="button" className={styles.actionButton} onClick={handleLogout}>
                            <IoLogOutOutline size={20} className={styles.actionIconLogout} />
                            <span className={styles.actionTextLogout}>Logout</span>
                        </button>
                        <button type="button" className={`${styles.actionButton} ${styles.dangerButton}`} onClick={handleDeleteAccount}>
                            <IoTrashOutline size={20} className={styles.actionIconDelete} />
                            <span className={styles.actionTextDelete}>Delete Account</span>
                        </button>
                    </div>
                </section>

                {/* App Info */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account Information</h2>
                    <div className={styles.sectionContent}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>User ID:</span>
                            <span className={styles.infoValue}>{user.clientId}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Email:</span>
                            <span className={styles.infoValue}>{user.email}</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsScreen;