// src/screens/Main/Dashboard/DashboardDetailScreen.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSingleDashboardData } from '../../../hooks/useSingleDashboardData';
import { useBoardManagement } from '../../../hooks/useBoardManagement';
import BoardList  from './BoardList'; // Corrected relative path
import LoadingDisplay from '../LoadingDisplay'; // Corrected relative path
import ErrorDisplay from '../ErrorDisplay'; // Corrected relative path
import styles from '../../../styles/DashboardListScreen.module.css';
import AddBoardForm from './AddBoardForm'; // Corrected relative path

const DashboardDetailScreen: React.FC = () => {
    const { dashboardId } = useParams<{ dashboardId: string }>();
    const navigate = useNavigate();

    const { dashboard, setDashboard, loading, error } = useSingleDashboardData(Number(dashboardId));

    const {
        creatingBoard,
        newBoardName,
        setNewBoardName,
        handleCreateBoard,
        handleDeleteBoard,
    } = useBoardManagement({
        dashboard: dashboard,
        setDashboard: setDashboard,
    });

    if (loading) return <LoadingDisplay />;
    if (error) return <ErrorDisplay message={error} />;
    if (!dashboard) return <ErrorDisplay message="Dashboard not found." />;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
                        ← All Dashboards
                    </button>
                    <div>
                        <div className={styles.welcomeText}>Dashboard</div>
                        <div className={styles.userName}>{dashboard.name}</div>
                    </div>
                </div>
            </header>

            <AddBoardForm
                newBoardName={newBoardName}
                onNewBoardNameChange={setNewBoardName}
                onCreateBoard={handleCreateBoard}
                isCreating={creatingBoard}
            />

            <main className={styles.content}>
                <BoardList
                    boards={dashboard.board_list || []}
                    onDeleteBoard={handleDeleteBoard}
                />
            </main>
        </div>
    );
};

export default DashboardDetailScreen;