// src/components/dashboard/BoardCard.tsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { BoardDTO } from '../../../types/api';
import styles from '../../../styles/DashboardListScreen.module.css';

interface BoardCardProps {
    board: BoardDTO;
    onDelete: (boardId: number) => void;
    onNavigate: (boardId: number) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onDelete, onNavigate }) => {

    const handleDeleteClick = (e: React.MouseEvent) =>{
        e.stopPropagation()
        if(board.boardId !== undefined){
            onDelete(board.boardId);
        }
    }

    const handleNavigateClick = () =>{
        if(board.boardId !==undefined){
            onNavigate(board.boardId);
        }
    }
    return (
        <div
        key={board.boardId}
        className={styles.boardCard}
        role="listitem"
        tabIndex={0}
        onClick={handleNavigateClick}
        onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') handleNavigateClick();}}
        style={{cursor : "pointer"}}
        aria-label={`Board: ${board.name}`}
    >
        <div className={styles.boardGradient}>
            <div className={styles.boardHeader}>
                <div className={styles.boardInfo}>
                    <div className={styles.boardName}>{board.name}</div>
                    <div className={styles.boardDescription}>
                        {board.task_list?.length || 0} tasks
                    </div>
                </div>
                <button
                    className={styles.deleteButton}
                    title="Delete board"
                    onClick={handleDeleteClick}
                    aria-label={`Delete board ${board.name}`}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    </div>
    );
};
export default BoardCard;