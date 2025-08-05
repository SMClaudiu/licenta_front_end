// src/hooks/useDashboardManagement.ts
import { useState, useCallback } from 'react';
import { DashboardService } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';
import { DashboardDTO } from '../types/api';

interface UseDashboardManagementProps {
    items: DashboardDTO[];
    setItems: React.Dispatch<React.SetStateAction<DashboardDTO[]>>;
}

/**
 * Encapsulates the logic for creating and deleting dashboards.
 */
export const useDashboardManagement = ({ items, setItems }: UseDashboardManagementProps) => {
    const { userData } = useAuth();
    const [newItemName, setNewItemName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateItem = useCallback(async () => {
        if (!newItemName.trim() || !userData?.clientId) return;

        setIsCreating(true);
        setError(null);

        try {
            const newDashboardData = { dashBoardName: newItemName, clientId: userData.clientId };
            const createdDashboard = await DashboardService.createDashboard(newDashboardData);
            setItems((prevItems) => [...prevItems, createdDashboard]);
            setNewItemName('');
        } catch (err: any) {
            setError(err.message || 'Failed to create dashboard.');
        } finally {
            setIsCreating(false);
        }
    }, [newItemName, userData, setItems]);

    /**
     * Deletes an item using an optimistic update. The UI is updated instantly
     * and reverted only if the subsequent API call fails.
     */
    const handleDeleteItem = useCallback(async (dashboardId: number) => {
        const originalItems = [...items];

        // Optimistically update UI for a responsive feel.
        setItems((prevItems) => prevItems.filter((item) => item.dashBoardId !== dashboardId));
        setIsDeleting(dashboardId);
        setError(null);

        try {
            await DashboardService.deleteDashboard(dashboardId);
        } catch (err: any) {
            // Revert UI on API failure.
            setError(err.message || 'Failed to delete. The item has been restored.');
            setItems(originalItems);
        } finally {
            setIsDeleting(null);
        }
    }, [items, setItems]);

    return {
        newItemName,
        setNewItemName,
        isCreating,
        isDeleting,
        error,
        handleCreateItem,
        handleDeleteItem,
    };
};