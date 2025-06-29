// src/components/board/BoardScreen.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskDTO } from '../../../types/api'; // Removed LocationState as it's not used

import { useBoardData } from '../../../hooks/useBoardData';
import { useTaskOperations } from '../../../hooks/useTaskOperations';
import { useBoardScreenState } from '../../../hooks/useBoardScreenState';

import BoardHeader from './BoardHeader';
import TaskToolbar from './TaskToolbar';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import LoadingDisplay from '../LoadingDisplay'; // Assuming generic LoadingDisplay
import ErrorDisplay from '../ErrorDisplay';     // Assuming generic ErrorDisplay

import styles from '../../../styles/BoardListScreen.module.css'; // Dedicated styles for BoardScreen

const BoardScreen: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const boardIdNumber = boardId ? parseInt(boardId, 10) : 0;

    const {
        board,
        tasks,
        setTasks, // setTasks is needed by useTaskOperations
        loading: boardLoading,
        error: boardError,
        fetchBoard,
        updateBoardName,
    } = useBoardData(boardIdNumber);

    // Pass current `tasks` to useTaskOperations for optimistic updates
    const {
        toggleTaskStatus,
        deleteTask, // This is deleteTaskOperation from the hook
        addTask,    // This is addTaskOperation from the hook
        updateTask  // This is updateTaskOperation from the hook
    } = useTaskOperations(boardIdNumber, tasks, setTasks);

    const {
        searchQuery,
        setSearchQuery,
        isEditingBoardName,
        editedBoardName,
        setEditedBoardName,
        startEditingBoardName,
        cancelEditingBoardName,
        filteredTasks,
        boardStatistics,
    } = useBoardScreenState({
        initialBoardName: board?.name || '',
        tasks,
    });

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
    const [isProcessingTask, setIsProcessingTask] = useState(false);

    useEffect(() => {
        if (boardIdNumber > 0) {
            fetchBoard();
        }
    }, [boardIdNumber, fetchBoard]);

    useEffect(() => {
        if (board?.name && !isEditingBoardName) { // Update only if not actively editing
            setEditedBoardName(board.name);
        }
    }, [board?.name, setEditedBoardName, isEditingBoardName]);

    const handleSaveBoardName = async () => {
        if (!editedBoardName.trim() || editedBoardName.trim() === board?.name) {
            cancelEditingBoardName();
            return;
        }
        try {
            await updateBoardName(editedBoardName.trim());
            cancelEditingBoardName();
        } catch (err) {
            alert('Failed to update board name');
            console.error("Update board name error:", err);
        }
    };

    const handleOpenAddTaskModal = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleOpenEditTaskModal = (taskToEdit: TaskDTO) => {
        setEditingTask(taskToEdit);
        setIsTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleTaskFormSubmit = async (taskDataFromModal: Omit<TaskDTO, 'taskId'> | (Partial<Omit<TaskDTO, 'taskId'>> & { taskId: number })) => {
        setIsProcessingTask(true);
        try {
            if (editingTask && 'taskId' in taskDataFromModal && taskDataFromModal.taskId !== undefined) {
                // Editing existing task
                await updateTask(taskDataFromModal.taskId, taskDataFromModal);
            } else {
                // Adding new task - ensure it's Omit<TaskDTO, 'taskId'>
                await addTask(taskDataFromModal as Omit<TaskDTO, 'taskId'>);
            }
            handleCloseTaskModal();
        } catch (err) {
            alert(editingTask ? 'Failed to update task.' : 'Failed to add task.');
            console.error("Task form submit error:", err);
        } finally {
            setIsProcessingTask(false);
        }
    };

    if (boardLoading) return <LoadingDisplay/>;
    if (boardError && !board) return <ErrorDisplay message={boardError} />;
    if (!board && !boardLoading && boardIdNumber > 0) return <ErrorDisplay message={`Could not find board with ID ${boardIdNumber}.`} />;
    if (!boardIdNumber) return <ErrorDisplay  message="No board ID provided." />;


    return (
        <div className={styles.container}>
            {board && ( // Render header and content only if board data is available
                <>
                    <BoardHeader
                        boardName={board.name}
                        isEditingName={isEditingBoardName}
                        editedName={editedBoardName}
                        onEditedNameChange={setEditedBoardName}
                        onSaveName={handleSaveBoardName}
                        onStartEditName={startEditingBoardName} // This will use the initialName from useBoardScreenState
                        onCancelEditName={cancelEditingBoardName}
                        completedTasks={boardStatistics.completedTasks}
                        totalTasks={boardStatistics.totalTasks}
                        completionPercentage={boardStatistics.completionPercentage}
                    />

                    <TaskToolbar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onOpenAddTaskModal={handleOpenAddTaskModal}
                    />

                    <main className={styles.content}>
                        <TaskList
                            tasks={filteredTasks}
                            searchQuery={searchQuery}
                            onToggleTaskStatus={toggleTaskStatus}
                            onDeleteTask={deleteTask}
                            onEditTask={handleOpenEditTaskModal}
                        />
                    </main>
                </>
            )}

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onSubmit={handleTaskFormSubmit}
                isProcessing={isProcessingTask}
                initialTaskData={editingTask}
            />
        </div>
    );
};

export default BoardScreen;