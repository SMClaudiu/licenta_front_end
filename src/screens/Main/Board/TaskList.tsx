// src/components/board/TaskList.tsx
import React from 'react';
import { TaskDTO } from '../../../types/api';
import TaskItem from './TaskItem';
import styles from '../../../styles/BoardListScreen.module.css';
import { IoCheckboxOutline } from 'react-icons/io5';


interface TaskListProps {
    tasks: TaskDTO[];
    searchQuery: string; // To display correct empty state message
    onToggleTaskStatus: (taskId: number) => void;
    onDeleteTask: (taskId: number) => void;
    onEditTask: (taskId: TaskDTO) => void;
}

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               searchQuery,
                                               onToggleTaskStatus,
                                               onDeleteTask,
                                               onEditTask
                                           }) => {
    if (tasks.length === 0) {
        return (
            <div className={styles.emptyState}>
                <IoCheckboxOutline size={64} className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>
                    {searchQuery ? 'No tasks match your search' : 'No tasks in this board'}
                </p>
                <p className={styles.emptyStateSubtext}>
                    {searchQuery ? 'Try a different search term' : 'Add your first task to get started'}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.taskList}>
            {tasks.map((task) => (
                <TaskItem
                    key={task.taskId}
                    task={task}
                    onToggleStatus={onToggleTaskStatus}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                />
            ))}
        </div>
    );
};

export default TaskList;