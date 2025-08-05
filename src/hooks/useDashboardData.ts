// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { DashboardDTO } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

export const useDashboardData = () => {
    // State now holds an array of dashboards
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchDashboards = async () => {
            if (!userData || !userData.clientId) {
                setError('User not authenticated or missing client ID.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                // Fetch the list of dashboards
                const fetchedDashboards = await DashboardService.getDashboardsByClientId(userData.clientId);
                setDashboards(fetchedDashboards);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboards');
            } finally {
                setLoading(false);
            }
        };

        if (userData?.clientId) {
            fetchDashboards();
        }
    }, [userData]);

    // Return the dashboards array and its setter
    return { dashboards, setDashboards, loading, error };
};