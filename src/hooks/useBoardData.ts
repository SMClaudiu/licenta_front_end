// src/hooks/useBoardData.ts
import { useState, useCallback } from 'react';
import { BoardDTO, TaskDTO } from '../types/api';
import { BoardService } from '../services/boardService';

export const useBoardData = (boardId: number) => {
    const [board, setBoard] = useState<BoardDTO | null>(null);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [loading, setLoading] = useState(false); // Initialize to true if fetching on mount
    const [error, setError] = useState<string | null>(null);

    const fetchBoard = useCallback(async () => {
        if (!boardId || boardId <= 0) { // More robust check
            setError("Invalid Board ID provided for fetching.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const boardData = await BoardService.getBoardById(boardId);
            console.log('Board data received in useBoardData:', boardData);
            setBoard(boardData);
            setTasks(boardData.task_list || []);
        } catch (err) {
            console.error('Error fetching board in useBoardData:', err);
            const message = err instanceof Error ? err.message : 'Failed to fetch board';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    const updateBoardName = useCallback(async (newName: string) => {
        if (!boardId || boardId <= 0 || !board) {
            console.error("Cannot update board name: Invalid boardId or board data missing.");
            return; // Or throw an error
        }
        const originalBoard = { ...board }; // For potential rollback

        // Optimistic UI Update
        setBoard(prevBoard => prevBoard ? { ...prevBoard, name: newName } : null);

        try {
            const updatedBoardFromAPI = await BoardService.updateBoardName(boardId, newName);
            setBoard(updatedBoardFromAPI); // Sync with the source of truth
        } catch (err) {
            console.error('Error updating board name in useBoardData:', err);
            setBoard(originalBoard); // Rollback
            alert('Failed to update board name. Please try again.');
            // throw err; // Optionally re-throw
        }
    }, [boardId, board, setBoard]); // Added board and setBoard

    return {
        board,
        setBoard, // Keep if other parts of app might set it (e.g. after creation)
        tasks,
        setTasks,
        loading,
        error,
        fetchBoard,
        updateBoardName,
    };
};