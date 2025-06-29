import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import {SigninRequest} from "../../types/api";
import {useAuth} from '../../contexts/AuthContext'

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            alert('Please fill all required fields.');
            return;
        }

        const signinData: SigninRequest = {
            name,
            email,
            phoneNumber: phoneNumber || undefined,
            password
        }
        try {
            await auth.signUp(signinData);
            console.log("SignupScreen " + signinData)
            alert('Account created successfully! Redirecting to your dashboard.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred while signing up.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number (optional)"
                    type="tel"
                    className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="relative mb-4">
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 text-gray-500"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                    </button>
                </div>

                <button
                    onClick={handleSignup}
                    className="w-full bg-green-600 text-white rounded-md p-3 mb-4 font-semibold hover:bg-green-700 transition"
                >
                    Sign Up
                </button>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full text-center text-gray-700 underline text-sm"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
