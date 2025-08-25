// src/services/taskService.ts
import {TaskDTO, TaskStatus} from '../types/api'; // Adjust path as needed
import api from './apiClient'; // Your configured Axios instance

export class TaskService {
    static async getAllTasksByBoardId(boardId: number): Promise<TaskDTO[]> {
        try {
            const response = await api.get<TaskDTO[]>(`/task/getAllById/${boardId}`);
            return response.data.map(task => ({
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined // Ensure dueDate is a Date object
            }));
        } catch (error) {
            console.error(`Error fetching tasks for board ${boardId}:`, error);
            throw error;
        }
    }

    static async getTaskById(taskId: number): Promise<TaskDTO> {
        try {
            const response = await api.get<TaskDTO>(`/task/getById/${taskId}`);
            return {
                ...response.data,
                dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
            };
        } catch (error) {
            console.error(`Error fetching task ${taskId}:`, error);
            throw error;
        }
    }

    static async createTask(boardId: number, taskData: Omit<TaskDTO, 'taskId'>): Promise<TaskDTO> {
        try {

            const payload = {
                ...taskData,
                name: taskData.name,
                description: taskData.description,
                status: taskData.status || TaskStatus.Not_Done,
                creationDate: taskData.creationDate ? new Date(taskData.creationDate).toISOString().split('T')[0] : undefined, // YYYY-MM-DD
                dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : undefined, // YYYY-MM-DD
            };
            const response = await api.post<TaskDTO>(`/task/addTask/${boardId}`, payload);
            console.log(response.data);
            return {
                ...response.data,

                dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
            };
        } catch (error) {
            console.error(`Error creating task for board ${boardId}:`, error);
            throw error;
        }
    }
    static async updateTaskName(taskId: number, name:string): Promise<TaskDTO>{
        try{
            const response = await api.patch<TaskDTO>(`/task/updateTaskName/${taskId}`, null,{
                params: { name }
            });
            return{
            ...response.data,
            dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
            }
        }
        catch(error){
            console.error(`Error updating task ${taskId} name: ${error} `)
            throw error;
        }
    }
    static async updateTaskDescription(taskId: number, description: string): Promise<TaskDTO> {
        try {
            const response = await api.patch<TaskDTO>(`/task/updateTaskDescription/${taskId}`, null, {
                params: { description }
            });
            return {
                ...response.data,
                dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
            };
        } catch (error) {
            console.error(`Error updating task ${taskId} description:`, error);
            throw error;
        }
    }

    static async updateTaskStatus(taskId: number, status: TaskStatus): Promise<TaskDTO> {
        try {
            const response = await api.patch<TaskDTO>(`/task/updateTaskStatus/${taskId}`
                , null, {
                params: { status }
            });
            return {
                ...response.data,
                dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
            };
        } catch (error) {
            console.error(`Error updating task ${taskId} status:`, error);
            throw error;
        }
    }

    // // You might also want an endpoint to update the due date
    // static async updateTaskDueDate(taskId: number, dueDate: Date | null ): Promise<TaskDTO> {
    //     try {
    //         const formattedDueDate = dueDate ? dueDate.toISOString().split('T')[0] : null;
    //         // Assuming your backend can handle a PATCH request to update due_date
    //         // This endpoint is not in your Java controller, so you'd need to add it.
    //         // Example:
    //         const response = await api.patch<TaskDTO>(`/task/updateTaskDueDate/${taskId}`, null, {
    //             params: { due_date: formattedDueDate }
    //         });
    //         return {
    //             ...response.data
    //             // dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined
    //         };
    //         throw new Error(`updateTaskDueDate not implemented in backend controller.`);
    //     } catch (error) {
    //         console.error(`Error updating task ${taskId} due date:`, error);
    //         throw error;
    //     }
    // }


    static async deleteTask(taskId: number): Promise<void> {
        try {
            await api.delete(`/task/removeById/${taskId}`);
        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            throw error;
        }
    }
}