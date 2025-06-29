// src/components/board/EditBoardNameInput.tsx
import React from 'react';
import styles from '../../../styles/BoardListScreen.module.css';

interface EditBoardNameInputProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const EditBoardNameInput: React.FC<EditBoardNameInputProps> = ({
    value,
    onChange,
    onSave,
    onCancel,
}) => {
    return (
        <div className={styles.editNameContainer}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onSave} // Save on blur
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent form submission if nested
                        onSave();
                    }
                    if (e.key === 'Escape') onCancel();
                }}
                className={styles.editNameInput}
                autoFocus
            />
        </div>
    );
};

export default EditBoardNameInput;