// src/components/dashboard/BoardList.tsx
import React from 'react';
import { BoardDTO } from '../../../types/api';
import BoardCard from './BoardCard';
import styles from '../../../styles/DashboardListScreen.module.css';
import {useNavigate} from "react-router-dom";

interface BoardListProps {
    boards: BoardDTO[];
    onDeleteBoard: (boardId: number) => void;
}

const BoardList: React.FC<BoardListProps> = ({ boards, onDeleteBoard }) => {
    const navigate = useNavigate();

    const handleNavigateToBoard = (boardId: number) =>{
            navigate(`/board/${boardId}`)
    }

    if (boards.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>No boards yet</p>
                <p className={styles.emptyStateSubtext}>Create a board to get started!</p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            {boards.map((board) => (
                <BoardCard key={board.boardId}
                           board={board}
                           onDelete={onDeleteBoard}
                           onNavigate={handleNavigateToBoard}/>
            ))}
        </div>
    );
};

export default BoardList;