// navigations/AuthNavigator.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import PasswordRecoveryScreen from '../screens/Auth/PasswordRecoveryScreen';

const AuthNavigator = () => (
    <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/recover-password" element={<PasswordRecoveryScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
);

export default AuthNavigator;