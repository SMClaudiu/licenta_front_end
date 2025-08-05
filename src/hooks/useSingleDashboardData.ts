// src/hooks/useSingleDashboardData.ts
import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { DashboardDTO } from '../types/api';


export const useSingleDashboardData = (dashboardId: number) => {
    const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!dashboardId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const dash = await DashboardService.getDashboardById(dashboardId);
                dash.board_list = dash.board_list || [];
                setDashboard(dash);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard details');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [dashboardId]);

    return { dashboard, setDashboard, loading, error };
};