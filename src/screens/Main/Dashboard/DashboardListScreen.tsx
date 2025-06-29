// src/components/dashboard/DashboardListScreen.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useBoardManagement } from '../../../hooks/useBoardManagement';
import DashboardHeader from './DashboardHeader';
import AddBoardForm from './AddBoardForm';
import BoardList from './BoardList';
import LoadingDisplay from '../LoadingDisplay';
import ErrorDisplay from '../ErrorDisplay';
import styles from '../../../styles/DashboardListScreen.module.css'


const DashboardListScreen: React.FC = () => {
    const { signOut: authSignOut, userData } = useAuth(); // Renamed signOut to avoid conflict
    const navigate = useNavigate();

    const { dashboard, setDashboard, loading, error } = useDashboardData();
    const {
        creatingBoard,
        newBoardName,
        setNewBoardName,
        handleCreateBoard,
        handleDeleteBoard,
    } = useBoardManagement({ dashboard, setDashboard });

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

    if (loading) return <LoadingDisplay />;
    if (error) return <ErrorDisplay message={error || "Ceva nasol s-a intamplat"} />;

    return (
        <div className={styles.container}>
            <DashboardHeader
                clientName={clientName} // Prioritize name from userData if available
                onSettingsClick={handleSettings}
                onLogoutClick={handleLogout}
            />
            <AddBoardForm
                newBoardName={newBoardName}
                onNewBoardNameChange={setNewBoardName}
                onCreateBoard={handleCreateBoard}
                isCreating={creatingBoard}
            />
            <main className={styles.content}>
                {dashboard && (
                    <BoardList boards={dashboard.board_list || []} onDeleteBoard={handleDeleteBoard} />
                )}
            </main>
        </div>
    );
};

export default DashboardListScreen;