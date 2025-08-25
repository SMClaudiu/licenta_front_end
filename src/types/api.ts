
export interface LoginRequest {
    email: string;
    password: string;
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

export interface TaskAdviceRequest {
  id: string;
  name: string;
  description: string;
  creation_date?: string;
  due_date?: string;
  board_name?: string;
  client_name?: string;
  client_email?: string;
  status?: string;
}

export interface PriorityRecommendation {
  level: 'High' | 'Medium' | 'Low';
  message: string;
  estimated_days: number;
}

export interface TaskAdviceResponse {
  success: boolean;
  advice?: {
    status_prediction: string;
    confidence_score: number;
    estimated_completion: number;
    priority_recommendation: PriorityRecommendation;
    actionable_suggestions: string[];
    risk_factors: string[];
    optimization_tips: string[];
    next_steps: string[];
  };
  metadata?: {
    generated_at: string;
    model_version: string;
  };
  error?: string;
}

export interface UseAIAdviceReturn {
  advice: TaskAdviceResponse | null;
  loading: boolean;
  error: string | null;
  getAdvice: (taskData: TaskAdviceRequest) => Promise<void>;
  clearAdvice: () => void;
}

export interface AIAdviceButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export interface TaskAdvicePanel {
    taskData: Partial<TaskDTO>;
    isVisible: boolean;
}

export interface AIAdviceModalProps {
  advice: TaskAdviceResponse;
  onClose: () => void;
  taskName: string;
}

export interface TaskItemProps {
    task: TaskDTO;
    onToggleStatus: (taskId: number) => void;
    onDelete: (taskId: number) => void;
    onEdit: (task: TaskDTO) => void;
}

export interface ExtendedTaskItemProps extends TaskItemProps {
  boardName?: string;
  clientName?: string;
  clientEmail?: string;
}