// src/components/dashboard/DashboardGrid.tsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { DashboardDTO } from '../../../types/api';
import styles from '../../../styles/DashboardGrid.module.css';

interface DashboardGridProps {
    dashboards: DashboardDTO[];
    onDashboardClick: (dashboardId: number) => void;
    onDeleteDashboard: (dashboardId: number) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    dashboards,
    onDashboardClick,
    onDeleteDashboard,
}) => {
    const handleDeleteClick = (event: React.MouseEvent, dashboardId: number) => {
        event.stopPropagation(); // Prevents the click from triggering the parent's onClick (navigation)
        onDeleteDashboard(dashboardId);
    };

    if (dashboards.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h3>You have no dashboards yet.</h3>
                <p>Use the form above to create your first one.</p>
            </div>
        );
    }

    return (
        <div className={styles.gridContainer}>
            {dashboards.map((dashboard) => (
                <div
                    key={dashboard.dashBoardId}
                    className={styles.dashboardCard}
                    onClick={() => onDashboardClick(dashboard.dashBoardId)}
                    tabIndex={0} // Makes the div focusable
                    aria-label={`Open dashboard ${dashboard.name}`}
                >
                    <h3 className={styles.dashboardName}>{dashboard.name}</h3>
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDeleteClick(e, dashboard.dashBoardId)}
                        aria-label={`Delete dashboard ${dashboard.name}`}
                        title="Delete Dashboard"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DashboardGrid;