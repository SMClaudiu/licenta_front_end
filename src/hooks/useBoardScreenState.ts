// src/hooks/useBoardScreenState.ts
import { useState, useMemo, useEffect as ReactUseEffect } from 'react'; // Renamed to avoid conflict
import { TaskDTO, TaskStatus } from '../types/api';

interface UseBoardScreenStateProps {
    initialBoardName?: string;
    tasks: TaskDTO[];
}

export const useBoardScreenState = ({ initialBoardName = '', tasks }: UseBoardScreenStateProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    // Modal state is now managed in BoardScreen directly for editingTask context
    // const [showTaskModal, setShowTaskModal] = useState(false);
    // const [newTaskName, setNewTaskName] = useState(''); // This will be part of TaskModal's internal state

    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [editedBoardName, setEditedBoardName] = useState(initialBoardName);

    // Sync editedBoardName when initialBoardName (from fetched board) changes
    ReactUseEffect(() => {
        if (!isEditingBoardName) { // Only update if not currently editing
            setEditedBoardName(initialBoardName);
        }
    }, [initialBoardName, isEditingBoardName]);


    const filteredTasks = useMemo(() =>
        tasks.filter(task =>
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ), [tasks, searchQuery]);

    const boardStatistics = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter(t => t.status === TaskStatus.Done).length;
        return {
            totalTasks: total,
            completedTasks: done,
            completionPercentage: total > 0 ? Math.round((done / total) * 100) : 0,
        };
    }, [tasks]);

    const startEditingBoardName = () => {
        setEditedBoardName(initialBoardName); // Initialize with current board name
        setIsEditingBoardName(true);
    };
    const cancelEditingBoardName = () => setIsEditingBoardName(false);

    return {
        searchQuery,
        setSearchQuery,
        // Modal states and new task name will be handled by BoardScreen and TaskModal
        isEditingBoardName,
        // setIsEditingBoardName, // Controlled by start/cancel
        editedBoardName,
        setEditedBoardName,
        startEditingBoardName,
        cancelEditingBoardName,
        filteredTasks,
        boardStatistics,
    };
};