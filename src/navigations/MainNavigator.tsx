// src/navigators/MainNavigator.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardListScreen from '../screens/Main/Dashboard/DashboardListScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import BoardScreen from '../screens/Main/Board/BoardScreen';
import DashboardDetailScreen from "../screens/Main/Dashboard/DashboardDetailScreen";

const MainNavigator = () => (
    <Routes>
        {/* Route to show the list of all user dashboards */}
        <Route path="/dashboard" element={<DashboardListScreen />} />

        {/* NEW: Route to show the boards for a specific dashboard */}
        <Route path="/dashboard/:dashboardId" element={<DashboardDetailScreen />} />

        {/* Route to show the tasks for a specific board */}
        <Route path="/board/:boardId" element={<BoardScreen />} />

        <Route path="/settings" element={<SettingsScreen />} />

        {/* Default route redirects to the main dashboard list */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
);

export default MainNavigator;