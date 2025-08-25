import {TaskAdviceRequest, TaskAdviceResponse, PriorityRecommendation} from '../types/api';

export class AIAdviceService {
  private static readonly baseURL = (() => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:5000';
    }

    return 'http://localhost:5000';
  })();

  static async getTaskAdvice(taskData: TaskAdviceRequest): Promise<TaskAdviceResponse> {
    try {
      const response = await fetch(`${this.baseURL}/predict/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          // Auth headers if needed
          // 'Authorization': `Bearer ${getAuthToken()}`
          // not needed for now
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI advice service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async getHealthStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`,{
          method: 'GET',
            headers: {
          'Content-Type': 'application/json'
        }
    });
      return response.ok;
    } catch (e){
      console.error('AI service health check failed:', e);
      return false;
    }
  }

  static async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const isHealthy = await this.getHealthStatus();
      if (isHealthy) {
        return {
          connected: true,
          message: 'AI service is available and healthy'
        };
      } else {
        return {
          connected: false,
          message: 'AI service is not responding to health checks'
        };
      }
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static getServiceInfo(): { baseURL: string; configured: boolean } {
    return {
      baseURL: this.baseURL,
      configured: this.baseURL !== 'http://localhost:5000' // Assumes localhost is default/unconfigured
    };
  }
}

export const aiAdviceService = new AIAdviceService();
export type { TaskAdviceRequest, TaskAdviceResponse, PriorityRecommendation };
