// src/components/dashboard/LoadingDisplay.tsx
import React from 'react';
import styles from '../../styles/DashboardListScreen.module.css';



const LoadingDisplay: React.FC = () => (
    <div className={`${styles.container} ,${styles.centerContent}`}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Loading dashboard...</div>
    </div>
);

export default LoadingDisplay;