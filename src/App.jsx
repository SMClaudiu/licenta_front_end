// src/App.tsx
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import MainNavigator from './navigations/MainNavigator'; // Assuming you have this
import AuthNavigator from './navigations/AuthNavigator';

const LoadingScreen = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading application state...
    </div>
);

function App() {
    const { userData, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <LoadingScreen />;

    }
    return (
        <>
            {userData ? <MainNavigator /> : <AuthNavigator />}
        </>
    );
}

export default App;