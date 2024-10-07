import axios, { AxiosInstance } from 'axios';
import { CreateTaskDto, Task, UpdateTaskDto } from '../interfaces/task';

class TaskService {
  private api: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080/') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getTasks(): Promise<Task[]> {
    const response = await this.api.get<Task[]>('/tasks');
    return response.data;
  }

  async getCompletedTasks(): Promise<Task[]> {
    const response = await this.api.get<Task[]>('/tasks/completed');
    return response.data;
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const response = await this.api.post<Task>('/tasks', taskData);
    return response.data;
  }

  async updateTask(taskId: string, taskData: UpdateTaskDto): Promise<Task> {
    const response = await this.api.post<Task>(`/tasks/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}`);
  }

  async completeTask(taskId: string): Promise<Task> {
    const response = await this.api.post<Task>(`/tasks/${taskId}/complete`);
    return response.data;
  }

  async incompleteTask(taskId: string): Promise<Task> {
    const response = await this.api.post<Task>(`/tasks/${taskId}/incomplete`);
    return response.data;
  }
}

export default new TaskService();