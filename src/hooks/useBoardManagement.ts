// src/hooks/useBoardManagement.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardService } from '../services/dashboardService';
import { BoardDTO, DashboardDTO } from '../types/api';

interface UseBoardManagementProps {
    dashboard: DashboardDTO | null;
    setDashboard: React.Dispatch<React.SetStateAction<DashboardDTO | null>>;
}

export const useBoardManagement = ({ dashboard, setDashboard }: UseBoardManagementProps) => {
    const [creatingBoard, setCreatingBoard] = useState<boolean>(false);
    const [newBoardName, setNewBoardName] = useState<string>('');
    const navigate = useNavigate();

    const handleCreateBoard = async () => {
        if (!newBoardName.trim() || !dashboard?.dashBoardId) return;
        setCreatingBoard(true);
        try {
            const boardData = {
                name: newBoardName.trim(),
                dashboardId: dashboard.dashBoardId,
                task_list: [],
            };
            const newBoard = await DashboardService.createBoard(boardData);
            setDashboard((prev) =>
                prev ? { ...prev, board_list: [...(prev.board_list || []), newBoard] } : prev
            );
            setNewBoardName('');
            // navigate('/dashboard'); // Consider if navigation is truly needed here or handled by parent
        } catch (err: any) {
            alert(err.message || 'Failed to create board');
        } finally {
            setCreatingBoard(false);
        }
    };

    const handleDeleteBoard = async (boardId: number) => {
        if (!window.confirm('Are you sure you want to delete this board?')) return;
        try {
            await DashboardService.deleteBoard(boardId);
            setDashboard((prev) =>
                prev ? { ...prev, board_list: (prev.board_list || []).filter((b) => b.boardId !== boardId) } : prev
            );
        } catch (err: any) {
            alert(err.message || 'Failed to delete board');
        }
    };

    return {
        creatingBoard,
        newBoardName,
        setNewBoardName,
        handleCreateBoard,
        handleDeleteBoard,
    };
};