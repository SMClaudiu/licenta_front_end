// src/services/boardService.ts
import { BoardDTO, TaskDTO } from '../types/api';
import api from './apiClient';

export class BoardService {

    static async getAllBoards(): Promise<BoardDTO[]> {
        const { data } = await api.get('/board/getAll');
        return data;
    }

    static async getBoardById(boardId: number): Promise<BoardDTO> {
        const { data } = await api.get(`/board/getByBoardId/${boardId}`);
        return data;
    }

    static async getBoardsByDashboardId(dashboardId: number): Promise<BoardDTO[]> {
        const { data } = await api.get(`/board/getByDashboardId/${dashboardId}`);
        return data;
    }

    static async createBoard(board: Omit<BoardDTO, 'boardId'>): Promise<BoardDTO> {
        const { data } = await api.post('/board/addBoard', board);
        return data;
    }

    static async updateBoardName(boardId: number, newName: string): Promise<BoardDTO> {
        const { data } = await api.patch(`/board/updateBoardName/${boardId}?new_name=${encodeURIComponent(newName)}`);
        return data;
    }

    static async deleteBoardById(boardId: number): Promise<void> {
        await api.delete(`/board/removeById/${boardId}`);
    }

    static async deleteBoardByName(boardName: string): Promise<void> {
        await api.delete(`/board/removeByName/${encodeURIComponent(boardName)}`);
    }

    static async deleteAllBoards(): Promise<void> {
        await api.delete(`/board/removeAll`);
    }

    static async updateBoardTask(boardId: number, task: TaskDTO): Promise<BoardDTO> {
        const params = new URLSearchParams();
        params.append('taskDTO', JSON.stringify(task));
        const { data } = await api.patch(`/board/updateBoardTask/${boardId}?${params.toString()}`);
        return data;
    }
}
