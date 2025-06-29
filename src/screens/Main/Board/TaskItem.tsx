// src/components/board/TaskItem.tsx
import React from 'react';
import { TaskDTO, TaskStatus } from '../../../types/api';
import { IoCheckboxOutline, IoSquareOutline, IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import styles from '../../../styles/BoardListScreen.module.css'; // Use BoardScreen.module.css

interface TaskItemProps {
    task: TaskDTO;
    onToggleStatus: (taskId: number) => void;
    onDelete: (taskId: number) => void;
    onEdit: (task: TaskDTO) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete, onEdit }) => {
    const handleToggle = () => {

        if (task.taskId !== undefined) {
            onToggleStatus(task.taskId);
        } else {
            console.warn("TaskItem: Attempted to toggle status for task without ID", task);
        }
    };

    const handleDelete = () => {
        if (task.taskId !== undefined) {
            onDelete(task.taskId);
        } else {
            console.warn("TaskItem: Attempted to delete task without ID", task);
        }
    };

    const handleEdit = () => {
        onEdit(task); // Pass the whole task object
    };

    const taskNameOrDefault = task.name || 'Untitled Task'

    return (
        <div key={task.taskId} className={styles.taskItem} >
            <button
                className={styles.taskCheckbox}
                onClick={handleToggle}
                aria-pressed={task.status === TaskStatus.Done}
                aria-label={task.status === TaskStatus.Done ? `Mark ${taskNameOrDefault} as not done` : `Mark ${taskNameOrDefault} as done`}
            >
                {task.status === TaskStatus.Done ? (
                    <IoCheckboxOutline size={24} className={styles.taskDoneIcon} />
                ) : (
                    <IoSquareOutline size={24} className={styles.taskNotDoneIcon} />
                )}
            </button>
            {/* Make the main content area clickable for editing */}
            <div className={styles.taskContent} onClick={handleEdit} style={{cursor: 'pointer'}} title="Click to edit task">
                <h3 className={`${styles.taskName} ${task.status === TaskStatus.Done ? styles.completed : ''}`}>
                    {taskNameOrDefault}
                </h3>

                {task.description && (
                    <p className={styles.taskDescription}>{task.description}</p>
                )}
                {task.creationDate && (
                    <div className={styles.taskMeta}>
                        <span className={styles.creationDateBadge}>
                            Created: {new Date(task.creationDate).toLocaleDateString()}
                        </span>
                    </div>
                )}

                {task.dueDate && (
                    <div className={styles.taskMeta}>
                        <span className={styles.dueDateBadge}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                )}

            </div>
            <div className={styles.taskActions}>
                <button
                    className={styles.taskActionButton}
                    onClick={handleEdit}
                    aria-label={`Edit task ${taskNameOrDefault}`}
                    title="Edit task"
                >
                    <IoPencilOutline size={20} className={styles.taskEditIcon} />
                </button>
                <button
                    className={styles.taskActionButton}
                    onClick={handleDelete}
                    aria-label={`Delete task ${taskNameOrDefault}`}
                    title="Delete task"
                >
                    <IoTrashOutline size={20} className={styles.taskDeleteIcon} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;