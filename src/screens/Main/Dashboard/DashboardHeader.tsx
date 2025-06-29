// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import { FaCog } from 'react-icons/fa';
import styles from '../../../styles/DashboardListScreen.module.css';

interface DashboardHeaderProps {
    clientName: string;
    onSettingsClick: () => void;
    onLogoutClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
                                                             clientName,
                                                             onSettingsClick,
                                                             onLogoutClick,
                                                         }) => (
    <header className={styles.header}>
        <div className={styles.headerContent}>
            <div>
                <div className={styles.welcomeText}>Welcome back,</div>
                <div className={styles.userName}>{clientName}</div>
            </div>
            <button
                className={styles.settingsButton}
                title="Settings"
                onClick={onSettingsClick}
                aria-label="Open settings"
            >
                <FaCog />
            </button>
            <button
                className={styles.settingsButton}
                title="Logout"
                onClick={onLogoutClick}
                aria-label="Logout"
            >
                Logout
            </button>
        </div>
    </header>
);

export default DashboardHeader;