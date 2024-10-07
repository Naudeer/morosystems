import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../interfaces/task';
import TaskService from '../api/TaskService';

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null
};

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TaskService.getTasks();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTask = createAsyncThunk<Task, { text: string }, { rejectValue: string }>(
  'tasks/addTask',
  async ({ text }, { rejectWithValue }) => {
    try {
      const response = await TaskService.createTask({ text });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTask = createAsyncThunk<Task, { id: string; text: string }, { rejectValue: string }>(
  'tasks/updateTask',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await TaskService.updateTask(id, { text });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await TaskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const completeTask = createAsyncThunk<Task, string, { rejectValue: string }>(
  'tasks/completeTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await TaskService.completeTask(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const incompleteTask = createAsyncThunk<Task, string, { rejectValue: string }>(
  'tasks/incompleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await TaskService.incompleteTask(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(incompleteTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default tasksSlice.reducer;