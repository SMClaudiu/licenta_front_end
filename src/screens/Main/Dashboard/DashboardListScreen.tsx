// src/components/dashboard/DashboardListScreen.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useDashboardManagement } from '../../../hooks/useDashboardManagement';
import DashboardHeader from './DashboardHeader';
import AddDashboardForm from './AddDashboardForm';
import DashboardGrid from './DashboardGrid';
import LoadingDisplay from '../LoadingDisplay';
import ErrorDisplay from '../ErrorDisplay';
import styles from '../../../styles/DashboardListScreen.module.css';

const DashboardListScreen: React.FC = () => {
    const { signOut: authSignOut, userData } = useAuth();
    const navigate = useNavigate();

    const { dashboards, setDashboards, loading, error } = useDashboardData();
    const {
        isCreating,
        newItemName,
        setNewItemName,
        handleCreateItem,
        handleDeleteItem,
    } = useDashboardManagement({ items: dashboards, setItems: setDashboards });

    const clientName = userData?.name || "User";

    const handleLogout = async () => {
        try {
            await authSignOut();
            navigate('/login', { replace: true });
        } catch (error: any) {
            alert(error.message || 'Logout failed');
        }
    };

    const handleSettings = () => {
        navigate('/settings', { replace: true });
    };

    const handleDashboardClick = (dashboardId: number) => {
        navigate(`/dashboard/${dashboardId}`);
    };

    if (loading) return <LoadingDisplay />;
    if (error) return <ErrorDisplay message={error || "Something went wrong"} />;

    return (
        <div className={styles.container}>
            <DashboardHeader
                clientName={clientName}
                onSettingsClick={handleSettings}
                onLogoutClick={handleLogout}
            />
            <AddDashboardForm
                newItemName={newItemName}
                onNewItemNameChange={setNewItemName}
                onCreateItem={handleCreateItem}
                isCreating={isCreating}
            />
            <main className={styles.content}>
                <DashboardGrid
                    dashboards={dashboards || []}
                    onDashboardClick={handleDashboardClick}
                    onDeleteDashboard={handleDeleteItem}
                />
            </main>
        </div>
    );
};

export default DashboardListScreen;