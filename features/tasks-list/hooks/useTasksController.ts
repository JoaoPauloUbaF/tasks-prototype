import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Task } from '../model/types';
import { useTasksStore } from '../model/store';

export type UseTasksController = {
  tasks: Task[];
  completeTask: (id: string) => void;
  undoLast: () => void;
  dismissUndo: () => void;
  lastCompleted?: Task | null;
};

export function useTasksController(): UseTasksController {
  const tasks = useTasksStore((s) => s.tasks);
  const setTasks = useTasksStore((s) => s.setTasks);
  const seedDefault = useTasksStore((s) => s.seedDefault);

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

  return useMemo(
    () => ({ tasks, completeTask, undoLast, dismissUndo, lastCompleted }),
    [tasks, completeTask, undoLast, dismissUndo, lastCompleted]
  );
}

