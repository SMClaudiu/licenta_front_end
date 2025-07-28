// src/main.tsx (Vite default entry point)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // IMPORTANT
import { AuthProvider } from './contexts/AuthContext'; // CHECK PATH & IMPORTANT

// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    console.error("Failed to find the root element with ID 'root'. React app can't be mounted.");
    document.body.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Error: Root element not found.</div>';
}