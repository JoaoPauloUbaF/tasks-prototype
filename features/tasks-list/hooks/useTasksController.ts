import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Task } from '../model/types';
import { useTasksStore } from '../model/store';

export type UseTasksController = {
  tasks: Task[]; // filtered
  completeTask: (id: string) => void;
  undoLast: () => void;
  dismissUndo: () => void;
  lastCompleted?: Task | null;
};

export function useTasksController(): UseTasksController {
  const tasksAll = useTasksStore((s) => s.tasks);
  const setTasks = useTasksStore((s) => s.setTasks);
  const seedDefault = useTasksStore((s) => s.seedDefault);
  const filter = useTasksStore((s) => s.filter);

  const [lastCompleted, setLastCompleted] = useState<Task | null>(null);
  const undoBuffer = useRef<{ task: Task; index: number } | null>(null);

  useEffect(() => {
    // Seed initial data on first use
    seedDefault();
  }, [seedDefault]);

  const completeTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        if (index === -1) return prev;
        const task = prev[index];
        undoBuffer.current = { task, index };
        setLastCompleted(task);
        const next = prev.slice();
        next.splice(index, 1);
        return next;
      });
    },
    [setTasks]
  );

  const undoLast = useCallback(() => {
    if (!undoBuffer.current) return;
    setTasks((prev) => {
      const { task, index } = undoBuffer.current!;
      const next = prev.slice();
      const insertAt = Math.min(index, next.length);
      next.splice(insertAt, 0, task);
      return next;
    });
    setLastCompleted(null);
    undoBuffer.current = null;
  }, [setTasks]);

  const dismissUndo = useCallback(() => {
    setLastCompleted(null);
    undoBuffer.current = null;
  }, []);

  const tasks = useMemo(() => {
    if (filter === 'all') return tasksAll;
    if (filter === 'overdue') return tasksAll.filter((t) => t.metadata.overdue);
    if (filter === 'today') {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
      const start = new Date(y, m, d).getTime();
      const end = new Date(y, m, d + 1).getTime();
      return tasksAll.filter((t) => typeof t.metadata.dueAt === 'number' && t.metadata.dueAt! >= start && t.metadata.dueAt! < end);
    }
    return tasksAll;
  }, [tasksAll, filter]);

  return useMemo(
    () => ({ tasks, completeTask, undoLast, dismissUndo, lastCompleted }),
    [tasks, completeTask, undoLast, dismissUndo, lastCompleted]
  );
}

