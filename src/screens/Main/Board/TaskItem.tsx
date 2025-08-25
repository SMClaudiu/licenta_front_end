// src/components/board/TaskItem.tsx
import React, {useState} from 'react';
import {ExtendedTaskItemProps, TaskStatus} from '../../../types/api';
import { IoCheckboxOutline, IoSquareOutline, IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import styles from '../../../styles/BoardListScreen.module.css';
import { TaskAdviceRequest } from '../../../types/api';
import {AIAdviceButton} from "./AIAdviceButton";
import {AIAdviceModal} from "./AIAdviceModal";
import {TaskAIAdvisor} from "./TaskAiAdvisor";


const convertTaskStatusToString = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Done:
      return 'Done';
    case TaskStatus.Not_Done:
      return 'Not_Done';
    case TaskStatus.Overdue:
      return 'Overdue';
    default:
      return 'Not_Done';
  }
};

const formatDateForAI = (date?: Date | string): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  return date.toISOString();
};



 const TaskItem: React.FC<ExtendedTaskItemProps> = ({task, onToggleStatus, onDelete, onEdit, boardName, clientName, clientEmail,
}) => {


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
        onEdit(task);
    };

    const aiTaskData: TaskAdviceRequest = {
    id: task.taskId?.toString() || '',
    name: task.name,
    description: task.description,
    creation_date: formatDateForAI(task.creationDate),
    due_date: formatDateForAI(task.dueDate),
    status: convertTaskStatusToString(task.status),
    board_name: boardName,
    client_name: clientName,
    client_email: clientEmail,
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

                 <TaskAIAdvisor taskData={aiTaskData} taskName={taskNameOrDefault}>
                      {({ onClick, loading }) => (
                        <AIAdviceButton
                          onClick={onClick}
                          loading={loading}
                          size="sm"
                          variant="secondary"
                          className={styles.taskActionButton}
                        />
                      )}
                </TaskAIAdvisor>

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