import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, buildTask } from './types';

export type TaskFilter = 'all' | 'today' | 'overdue';

export type TasksState = {
  tasks: Task[];
  setTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
  seedDefault: () => void;
  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;
};

const storage = createJSONStorage(() => AsyncStorage);

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',
      setFilter: (f) => set({ filter: f }),
      setTasks: (updater) =>
        set((state) => ({
          tasks: typeof updater === 'function' ? (updater as (prev: Task[]) => Task[])(state.tasks) : (updater as Task[]),
        })),
      seedDefault: () => {
        const { tasks } = get();
        if (tasks.length) return;
        const seed: Task[] = [];
        set({ tasks: seed });
      },
    }),
    {
      name: 'tasks-store-v1',
      storage,
      partialize: (state) => ({ tasks: state.tasks, filter: state.filter }),
    }
  )
);

