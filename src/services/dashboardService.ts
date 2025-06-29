// src/services/dashboardService.ts
import { DashboardDTO, BoardDTO } from '../types/api';
import api from './apiClient';

export class DashboardService {

    static async getDashboardByClientId(clientId: number): Promise<DashboardDTO> {
        try {
            const response = await api.get(`/dashboard/findByClientId/${clientId}`);
            if (!response.data || Object.keys(response.data).length === 0) {
                console.log("Response is " + response.data)
                throw new Error('Dashboard not found for client.');
            }
            return response.data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to fetch dashboard');
        }
    }

    static async createDashboard(dashboard: Omit<DashboardDTO, 'dashBoardId'>): Promise<DashboardDTO> {
        try {
            const { data } = await api.patch(`/dashboard/saveDashboard`, dashboard);
            return data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to create dashboard');
        }
    }

    static async createBoard(boardData: Omit<BoardDTO, 'boardId'>): Promise<BoardDTO> {
        try {
            const { data } = await api.post(`/board/addBoard`, boardData);
            return data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to create board');
            return error;
        }
    }

    static async deleteBoard(boardId: number): Promise<void> {
        try {
            await api.delete(`/board/removeById/${boardId}`);
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to delete board');
        }
    }

    static async updateBoardName(boardId: number, newName: string): Promise<BoardDTO> {
        try {
            const { data } = await api.patch(`/board/updateBoardName/${boardId}?new_name=${encodeURIComponent(newName)}`);
            return data;
        } catch (error: any) {
            DashboardService._handleApiError(error, 'Failed to update board name');
        }
    }

    public static _handleApiError(error: any, defaultMessage: string): never {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || defaultMessage;
            console.error('API Error ${status}: ${message}');
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
