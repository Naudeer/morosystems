export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdDate: Date;
    completedDate: Date | null;
  }
  
  export interface CreateTaskDto {
    text: string;
  }
  
  export interface UpdateTaskDto {
    text: string;
  }