import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from 'react-icons/md';
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/AuthStyles.css'

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();
    const { logIn } = useAuth();

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setIsLoggingIn(true);
        console.log('Login attempt with:', email);
        try {
            await logIn({ email, password });
            console.log('Login successful, navigating to dashboard');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed in LoginScreen:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleRecoverPassword = () => {
        navigate('/recover-password');
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    return (
        <div className="auth-container">
            <div className="auth-glass-card">
                <h1 className="auth-title">Login</h1>

                <form onSubmit={handleLogin} className="auth-form">
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
                        <label htmlFor="password" className="auth-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
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

                    <div className="auth-footer-row">
                        <div className="auth-checkbox-group">
                            <input
                                type="checkbox"
                                id="remember"
                                className="auth-checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember" className="auth-checkbox-label">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={handleRecoverPassword}
                            className="auth-secondary-btn"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="auth-primary-btn"
                    >
                        {isLoggingIn ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <div className="auth-divider"></div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={handleCreateAccount}
                            className="auth-secondary-btn"
                            style={{ textDecoration: 'underline', padding: 0 }}
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}