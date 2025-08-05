// src/components/dashboard/AddDashboardForm.tsx
import React from 'react';
import styles from '../../../styles/AddDashboardForm.module.css';

interface AddDashboardFormProps {
    newItemName: string;
    onNewItemNameChange: (name: string) => void;
    onCreateItem: () => void;
    isCreating: boolean;
}

const AddDashboardForm: React.FC<AddDashboardFormProps> = ({
    newItemName,
    onNewItemNameChange,
    onCreateItem,
    isCreating,
}) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevents the default form submission (page reload)
        if (!newItemName.trim() || isCreating) return;
        onCreateItem();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input
                type="text"
                value={newItemName}
                onChange={(e) => onNewItemNameChange(e.target.value)}
                placeholder="Enter new dashboard name"
                className={styles.inputField}
                disabled={isCreating}
                aria-label="New dashboard name"
            />
            <button
                type="submit"
                className={styles.createButton}
                disabled={isCreating || !newItemName.trim()}
            >
                {isCreating ? 'Creating...' : 'Create Dashboard'}
            </button>
        </form>
    );
};

export default AddDashboardForm;