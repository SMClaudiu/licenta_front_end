// src/components/board/TaskAIAdvisor.tsx

import React, { useState } from 'react';
import { useAIAdvice } from '../../../hooks/useAIAdvice';
import { AIAdviceModal } from './AIAdviceModal';
import { TaskAdviceRequest } from '../../../types/api';

interface TaskAIAdvisorProps {
  taskData: TaskAdviceRequest;
  taskName: string;
  children: (props: { onClick: () => void; loading: boolean }) => React.ReactNode;
}

export const TaskAIAdvisor: React.FC<TaskAIAdvisorProps> = ({ taskData, taskName, children }) => {
  const [showModal, setShowModal] = useState(false);
  const { advice, loading, getAdvice } = useAIAdvice();

  const handleGetAdvice = async () => {
    await getAdvice(taskData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>

      {children({ onClick: handleGetAdvice, loading })}

      {showModal && advice && (
        <AIAdviceModal
          advice={advice}
          onClose={handleCloseModal}
          taskName={taskName}
        />
      )}
    </>
  );
};