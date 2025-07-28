import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import { SigninRequest } from "../../types/api";
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/AuthStyles.css'

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSignup = async (event: FormEvent) => {
        event.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill all required fields.');
            return;
        }

        const signinData: SigninRequest = {
            name,
            email,
            phoneNumber: phoneNumber || undefined,
            password
        };

        setIsSigningUp(true);
        try {
            await auth.signUp(signinData);
            console.log("SignupScreen " + JSON.stringify(signinData));
            alert('Account created successfully! Redirecting to your dashboard.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred while signing up.');
        } finally {
            setIsSigningUp(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-glass-card">
                <h1 className="auth-title">Create Account</h1>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="name" className="auth-label">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="auth-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                        <MdPerson className="auth-input-icon" />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="email" className="auth-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                        <MdEmail className="auth-input-icon" />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="phone" className="auth-label">
                            Phone Number (Optional)
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            className="auth-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                        />
                        <MdPhone className="auth-input-icon" />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password" className="auth-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="auth-password-toggle"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSigningUp}
                        className="auth-primary-btn"
                    >
                        {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <div className="auth-divider"></div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="auth-secondary-btn"
                            style={{ textDecoration: 'underline', padding: 0 }}
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}