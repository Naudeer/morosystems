export const ADD_TASK = 'ADD_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface TasksState {
  tasks: Task[];
}

interface AddTaskAction {
  type: typeof ADD_TASK;
  payload: Task;
}

interface ToggleTaskAction {
  type: typeof TOGGLE_TASK;
  payload: number;
}

interface DeleteTaskAction {
  type: typeof DELETE_TASK;
  payload: number;
}

export type TaskActionTypes = AddTaskAction | ToggleTaskAction | DeleteTaskAction;
