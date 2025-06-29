// src/components/board/TaskToolbar.tsx
import React from 'react';
import { IoSearchOutline, IoAdd } from 'react-icons/io5';
import styles from '../../../styles/BoardListScreen.module.css';

interface TaskToolbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenAddTaskModal: () => void;
}

const TaskToolbar: React.FC<TaskToolbarProps> = ({
                                                     searchQuery,
                                                     onSearchChange,
                                                     onOpenAddTaskModal,
                                                 }) => {
    return (
        <>
            <div className={styles.searchContainer}>
                <div className={styles.searchBar}>
                    <IoSearchOutline size={20} className={styles.searchIcon} />
                    <input
                        type="search"
                        className={styles.searchInput}
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.sectionHeader}> {/* Moved Add button here for better grouping with title */}
                <h2 className={styles.sectionTitle}>Tasks</h2>
                <button className={styles.addButton} onClick={onOpenAddTaskModal} aria-label="Add new task">
                    <IoAdd size={24} /> {/* Removed color="#fff" for CSS to handle */}
                </button>
            </div>
        </>
    );
};

export default TaskToolbar;