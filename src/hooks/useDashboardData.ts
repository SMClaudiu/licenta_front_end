// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { DashboardDTO } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

export const useDashboardData = () => {
    const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!userData || !userData.clientId) {
                setError('User not authenticated or missing client ID.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const dash = await DashboardService.getDashboardByClientId(userData.clientId);
                if (!dash.board_list) {
                    dash.board_list = [];
                }
                setDashboard(dash);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [userData]);

    return { dashboard, setDashboard, loading, error };
};