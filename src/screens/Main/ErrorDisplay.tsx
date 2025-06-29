// src/components/dashboard/ErrorDisplay.tsx
import React from 'react';
import styles from '../../styles/DashboardListScreen.module.css';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div className={styles.centerContent}>
        <p style={{ color: 'red' }}>{message}</p>
    </div>
);

export default ErrorDisplay;