
export interface LoginRequest {
    email: string;
    password: string;
}


export interface LocationState {
    board?: BoardDTO; // The board object might be passed
}


export interface LoginResponse {
    token: string;
    client: ClientDTO;
}

export interface SigninRequest{
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
}


export interface ClientDTO {
    clientId: number; // Usually present in responses, optional in requests like addClient
    name: string;
    email: string;
    phoneNumber: string;
    password?: string; // Should ideally not be sent back to client after login/get, but present for add/update
}

export enum TaskStatus {
    Done = 'Done',
    Not_Done = 'Not_Done',
    Overdue = 'Overdue',
}

export interface TaskDTO {
    taskId: number;
    name: string;
    description: string;
    status: TaskStatus;
    creationDate?: Date | string;
    dueDate?: Date | string;
}

export interface BoardDTO {
    boardId?: number;
    name: string;
    task_list?: TaskDTO[];
    dashboardId?: number;
}

export interface DashboardDTO {
    dashBoardId: number;
    name: string;
    client: ClientDTO;
    board_list: BoardDTO[];
}

export interface ApiError {
    message: string;
    status?: number;
}
