import { useState, FormEvent } from 'react'; // Added FormEvent
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Local loading state for the button
    const navigate = useNavigate();
    const { logIn } = useAuth();

    const handleLogin = async (event: FormEvent) => { // Added event and type
        event.preventDefault(); // Prevent default form submission if wrapped in <form>
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setIsLoggingIn(true);
        console.log('Login attempt with:', email);
        try {
            await logIn({ email, password });

            // If signIn is successful, userData in AuthContext is updated.
            // App.tsx will switch to MainNavigator.
            // Now navigate to a default route WITHIN MainNavigator.
            console.log('Login successful, navigating to dashboard');
            navigate('/dashboard'); // Or '/' if your MainNavigator default is just '/'
        } catch (error) {
            // The signIn function in AuthContext should throw an error if login fails.
            // The alert is likely already handled in AuthContext's signIn.
            // If not, or if you want specific UI updates here:
            console.error('Login failed in LoginScreen:', error);
            // alert('Login failed. Please check your credentials or try again.'); // Already handled by context potentially
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
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
            }}
        >
            <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                {/* Wrap inputs and button in a form for better semantics and submission handling */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="mb-6 relative"> {/* Increased mb for better spacing */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button" // Important: prevent form submission
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-8 right-3 text-gray-500 focus:outline-none" // Adjusted top due to label
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit" // Changed to type submit
                        disabled={isLoggingIn} // Disable button while logging in
                        className="w-full bg-blue-600 text-white rounded-md p-3 font-semibold
                         hover:bg-blue-700 transition mb-4 disabled:opacity-50">
                        {isLoggingIn ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="text-center space-y-2">
                    <button type="button" onClick={handleRecoverPassword} className="text-blue-700 underline text-sm">
                        Forgot Password?
                    </button>
                    <button type="button" onClick={handleCreateAccount} className="text-gray-700 underline text-sm">
                        Create a New Account
                    </button>
                </div>
            </div>
        </div>
    );
}