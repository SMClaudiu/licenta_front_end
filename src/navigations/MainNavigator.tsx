
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardListScreen from '../screens/Main/Dashboard/DashboardListScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import BoardScreen from '../screens/Main/Board/BoardScreen'


const MainNavigator = () => (

    <Routes>
        {/* Define your paths for the web URL */}
        <Route path="/dashboard" element={<DashboardListScreen/>} />
        <Route path="/settings" element={<SettingsScreen/>} />
        <Route path="/board/:boardId" element={<BoardScreen/>} />

        {/* Add more Main routes */}


        <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
);

export default MainNavigator;