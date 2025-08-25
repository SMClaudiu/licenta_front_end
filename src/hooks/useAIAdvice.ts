import { useState, useCallback } from 'react';
import {AIAdviceService, TaskAdviceRequest, TaskAdviceResponse} from '../services/aiAdviceService';
import {UseAIAdviceReturn} from "../types/api";

export const useAIAdvice = (): UseAIAdviceReturn => {
  const [advice, setAdvice] = useState<TaskAdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = useCallback(async (taskData: TaskAdviceRequest) => {
    setLoading(true);
    setError(null);

    try {

        const response = await AIAdviceService.getTaskAdvice(taskData);

      setAdvice(response);

      if (!response.success) {
        setError(response.error || 'Failed to get AI advice');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setAdvice({
        success: false,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAdvice = useCallback(() => {
    setAdvice(null);
    setError(null);
  }, []);

  return {
    advice,
    loading,
    error,
    getAdvice,
    clearAdvice
  };
};