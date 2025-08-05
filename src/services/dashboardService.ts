// src/services/dashboardService.ts
import { DashboardDTO, BoardDTO } from '../types/api';
import api from './apiClient';

export class DashboardService {

    /**
     * Fetches all dashboards for a given client ID.
     * Assumes the backend endpoint returns an array of dashboards: DashboardDTO[].
     */
    static async getDashboardsByClientId(clientId: number): Promise<DashboardDTO[]> {
        try {
            // This endpoint is assumed to return a list of dashboards.
            const response = await api.get(`/dashboard/findByClientId/${clientId}`);
            // An empty array is a valid response for a user with no dashboards.
            return response.data || [];
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to fetch dashboards');
        }
    }

    static async getDashboardById(dashboardId: number): Promise<DashboardDTO> {
        try {
            const response = await api.get(`/dashboard/findByDashBoardId/${dashboardId}`);
            if (!response.data) {
                throw new Error('Dashboard not found.');
            }
            return response.data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to fetch dashboard details');
        }
    }


    static async createDashboard(dashboardData: { dashBoardName: string, clientId: number }): Promise<DashboardDTO> {
        try {
            const { data } = await api.post(`/dashboard/saveDashboard`, dashboardData);
            return data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to create dashboard');
        }
    }


    static async deleteDashboard(dashboardId: number): Promise<void> {
        try {
            await api.delete(`/dashboard/removeById/${dashboardId}`);
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to delete dashboard');
        }
    }

    static async createBoard(boardData: Omit<BoardDTO, 'boardId'>): Promise<BoardDTO> {
        try {
            const { data } = await api.post(`/board/addBoard`, boardData);
            return data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to create board');
        }
    }

    static async deleteBoard(boardId: number): Promise<void> {
        try {
            await api.delete(`/board/removeById/${boardId}`);
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to delete board');
        }
    }

    public static _handleApiError(error: any, defaultMessage: string): never {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || defaultMessage;
            console.error(`API Error ${status}: ${message}`);
            throw new Error(message);
        } else if (error.request) {
            console.error('No response received:', error.message);
            throw new Error('No response from server');
        } else {
            console.error('Unexpected error:', error);
            throw new Error(defaultMessage);
        }
    }
}