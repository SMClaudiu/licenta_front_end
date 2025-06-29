// screens/Auth/PasswordRecoveryScreen.tsx
import React, { useState, FormEvent } from 'react'; // Added FormEvent for form submission
import { useNavigate } from 'react-router-dom'; // For web navigation


// Assuming you have some global CSS or will create a CSS module for styling
// For simplicity, some styles are inline, but ideally, use CSS classes.
// If you ARE using Tailwind CSS in Vite, the className props will work.

export default function PasswordRecoveryScreen() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handlePasswordReset = (event: FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        if (!email.trim()) {
            alert('Please enter your email address.'); // Replaced Alert.alert
            return;
        }

        // TODO: Add password recovery API logic here
        // Example:
        // try {
        //   await sendPasswordRecoveryEmail(email);
        //   alert('Check your email. A password reset link has been sent to your email address.');
        //   navigate('/login'); // Navigate after successful API call
        // } catch (error) {
        //   console.error("Password recovery failed:", error);
        //   alert('Failed to send recovery email. Please try again.');
        // }
        console.log('Sending recovery email to:', email);
        alert( // Replaced Alert.alert
            'Check your email. A password reset link has been sent to your email address.'
        );
        navigate('/login'); // Navigate to the login route defined in your AuthNavigator
    };

    return (
        <div // Replaced ImageBackground, styling for background image
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1520975698519-59c0aaeead43?auto=format&fit=crop&w=800&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // className="flex-1 justify-center px-6" -> these are Tailwind-like classes
                // For web, you'd achieve this with CSS:
                minHeight: '100vh', // flex-1 equivalent for full height
                display: 'flex',
                alignItems: 'center', // justify-center (Tailwind's justify-center is for main axis, align-items for cross axis in flex col)
                justifyContent: 'center', // if you want content centered horizontally
                paddingLeft: '1.5rem', // px-6
                paddingRight: '1.5rem', // px-6
                backgroundColor: 'rgba(0,0,0,0.6)', // Overlay to darken the background
            }}
        >
            {/* Replaced View with div, applied Tailwind-like styles via inline or CSS classes */}
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // bg-white bg-opacity-90
                    borderRadius: '0.5rem', // rounded-lg
                    padding: '1.5rem', // p-6
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', // shadow-lg
                    width: '100%',
                    maxWidth: '400px' // Example max width for the form container
                }}
            >
                {/* Use a form element for semantic HTML and better accessibility */}
                <form onSubmit={handlePasswordReset}>
                    <h1 // Replaced Text, using h1 for semantic screen title
                        style={{
                            fontSize: '1.875rem', // text-3xl
                            fontWeight: 'bold', // font-bold
                            marginBottom: '1rem', // mb-4
                            textAlign: 'center', // text-center
                            color: '#1f2937', // text-gray-800
                        }}
                    >
                        Recover Password
                    </h1>
                    <p // Replaced Text
                        style={{
                            textAlign: 'center', // text-center
                            color: '#4b5563', // text-gray-600
                            marginBottom: '1.5rem', // mb-6
                        }}
                    >
                        Enter your email address and we’ll send you a link to reset your
                        password.
                    </p>

                    <input // Replaced TextInput
                        type="email" // keyboardType="email-address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        // autoCapitalize="none" is default for type="email"
                        // className="border border-gray-300 rounded-md p-3 mb-6"
                        style={{
                            border: '1px solid #d1d5db', // border border-gray-300
                            borderRadius: '0.375rem', // rounded-md
                            padding: '0.75rem', // p-3
                            marginBottom: '1.5rem', // mb-6
                            width: '100%', // Ensure it takes full width of its container
                            boxSizing: 'border-box'
                        }}
                        required // Good practice for required fields
                    />

                    <button // Replaced TouchableOpacity
                        type="submit" // Important for form submission
                        // className="bg-blue-600 rounded-md p-3 mb-4"
                        style={{
                            backgroundColor: '#2563eb', // bg-blue-600
                            borderRadius: '0.375rem', // rounded-md
                            padding: '0.75rem', // p-3
                            marginBottom: '1rem', // mb-4
                            width: '100%',
                            color: 'white', // text-white
                            textAlign: 'center', // text-center
                            fontWeight: '600', // font-semibold
                            fontSize: '1.125rem', // text-lg
                            cursor: 'pointer', // Make it look clickable
                            border: 'none'
                        }}
                    >
                        Send Reset Link
                    </button>

                    <button // Replaced TouchableOpacity, using button for semantic action
                        type="button" // Important to prevent form submission
                        onClick={() => navigate('/login')} // Use navigate hook
                        // className="text-gray-700 text-center underline"
                        style={{
                            color: '#374151', // text-gray-700
                            textAlign: 'center',
                            textDecoration: 'underline',
                            background: 'none',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}