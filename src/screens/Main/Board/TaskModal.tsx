// src/components/board/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/BoardListScreen.module.css';
import { TaskDTO, TaskStatus } from '../../../types/api';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: Omit<TaskDTO, 'taskId'> | (Partial<Omit<TaskDTO, 'taskId'>> & { taskId: number })) => Promise<void>;
    isProcessing: boolean;
    initialTaskData?: TaskDTO | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 onSubmit,
                                                 isProcessing,
                                                 initialTaskData,
                                             }) => {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.Not_Done);
    const [dueDate, setDueDate] = useState('');
    const [name, setName] = useState('');
    const [creationDate, setCreationDate] = useState('');

    const isEditMode = !!initialTaskData && initialTaskData.taskId !== undefined;

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && initialTaskData) {
                setName(initialTaskData.name || '');
                setDescription(initialTaskData.description || '');
                setStatus(initialTaskData.status || TaskStatus.Not_Done);
                setCreationDate(initialTaskData.creationDate
                    ? new Date(initialTaskData.creationDate).toISOString().split('T')[0]: '');
                setDueDate(initialTaskData.dueDate
                    ? new Date(initialTaskData.dueDate).toISOString().split('T')[0]
                    : '');
            } else {
                setName('');
                setDescription('');
                setStatus(TaskStatus.Not_Done);
                setCreationDate('');
                setDueDate('');
            }
        }
    }, [isOpen, initialTaskData, isEditMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        if(!trimmedName){
            alert("Task name cannot be empty")
            return;
        }

        if (!trimmedDescription) {
            alert("Task description cannot be empty.");
            return;
        }

        const taskPayload = {
            name: trimmedName,
            description: trimmedDescription,
            status: status,
            creationDate: creationDate ? new Date(creationDate) : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };

        if (isEditMode && initialTaskData && initialTaskData.taskId !== undefined) {
            await onSubmit({ ...taskPayload, taskId: initialTaskData.taskId });
        } else {
            await onSubmit(taskPayload as Omit<TaskDTO, 'taskId'>);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="taskName" className={styles.modalLabel}>Name</label>
                        <input
                            id="taskName"
                            className={styles.modalInput}
                            type="text"
                            placeholder="Enter task name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus={!isEditMode || !initialTaskData?.name}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="taskDescription" className={styles.modalLabel}>Description</label>
                        <input
                            id="taskDescription"
                            className={styles.modalInput}
                            type="text"
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoFocus={!isEditMode && !!initialTaskData?.name && !initialTaskData?.description} // Autofocus only for new tasks
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="taskStatus" className={styles.modalLabel}>Status</label>
                        <select
                            id="taskStatus"
                            className={styles.modalInput} // You might want a specific class for select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                            {Object.values(TaskStatus).map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="taskCreationDate" className={styles.modalLabel}>Creation Date (Optional)</label>
                        <input
                            id="taskCreationDate"
                            className={styles.modalInput}
                            type="date"
                            value={creationDate}
                            onChange={(e) => setCreationDate(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="taskDueDate" className={styles.modalLabel}>Due Date (Optional)</label>
                        <input
                            id="taskDueDate"
                            className={styles.modalInput}
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.modalButtons}>
                        <button
                            type="button"
                            className={`${styles.modalButton} ${styles.cancelButton}`}
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${styles.modalButton} ${styles.createButton}`}
                            disabled={!description.trim() || isProcessing}
                        >
                            {isProcessing
                                ? (isEditMode ? 'Saving...' : 'Adding...')
                                : (isEditMode ? 'Save Changes' : 'Add Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;