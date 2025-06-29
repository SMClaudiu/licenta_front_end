// src/components/dashboard/AddBoardForm.tsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import styles from '../../../styles/DashboardListScreen.module.css';

interface AddBoardFormProps {
    newBoardName: string;
    onNewBoardNameChange: (name: string) => void;
    onCreateBoard: () => void;
    isCreating: boolean;
}

const AddBoardForm: React.FC<AddBoardFormProps> = ({
                                                       newBoardName,
                                                       onNewBoardNameChange,
                                                       onCreateBoard,
                                                       isCreating,
                                                   }) => (
    <section className={styles.searchContainer}>
        <div className={styles.searchBar}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="New board name..."
                value={newBoardName}
                onChange={(e) => onNewBoardNameChange(e.target.value)}
                disabled={isCreating}
            />
            <button
                className={styles.addButton}
                onClick={onCreateBoard}
                disabled={isCreating || newBoardName.trim() === ''}
                aria-label="Add new board"
                title="Add new board"
            >
                <FaPlus />
            </button>
        </div>
    </section>
);

export default AddBoardForm;