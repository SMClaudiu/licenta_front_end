// src/components/board/BoardHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoSettingsOutline } from 'react-icons/io5';
import EditBoardNameInput from '../Board/EditBoardInput';
import styles from '../../../styles/BoardListScreen.module.css'; // Use BoardScreen styles

interface BoardHeaderProps {
    boardName: string;
    isEditingName: boolean;
    editedName: string;
    onEditedNameChange: (name: string) => void;
    onSaveName: () => void;
    onStartEditName: () => void;
    onCancelEditName: () => void;
    completedTasks: number;
    totalTasks: number;
    completionPercentage: number;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
    boardName,
    isEditingName,
    editedName,
    onEditedNameChange,
    onSaveName,
    onStartEditName,
    onCancelEditName,
    completedTasks,
    totalTasks,
    completionPercentage,
}) => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/dashboard')}
                    aria-label="Back to dashboards"
                >
                    <IoArrowBackOutline size={24} /> {/* Removed color="#fff" for CSS to handle */}
                </button>

                <div className={styles.boardTitleSection}>
                    {isEditingName ? (
                        <EditBoardNameInput
                            value={editedName}
                            onChange={onEditedNameChange}
                            onSave={onSaveName}
                            onCancel={onCancelEditName}
                        />
                    ) : (
                        <h1 className={styles.boardTitle} onClick={onStartEditName} title="Click to edit name">
                            {boardName || 'Untitled Board'}
                        </h1>
                    )}
                    <div className={styles.boardStats}>
                        <span className={styles.statBadge}>
                            {completedTasks}/{totalTasks} tasks • {completionPercentage}% complete
                        </span>
                    </div>
                </div>

                <button className={styles.settingsButton} onClick={() => navigate('/settings')} aria-label="Settings">
                    <IoSettingsOutline size={24} /> {/* Removed color="#fff" for CSS to handle */}
                </button>
            </div>
        </header>
    );
};

export default BoardHeader;