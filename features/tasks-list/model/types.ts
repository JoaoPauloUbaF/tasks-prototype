export type TaskMetadata = {
  contextLabel?: string;
  dueDateFormatted?: string; // e.g., "Tue, 26 Aug"
  dueAt?: number; // epoch millis
  overdue: boolean;
};

export type Task = {
  id: string;
  title: string;
  metadata: TaskMetadata;
};

export function formatDueDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    // Fallback
    return `${date.toDateString()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}

export function buildTask(
  params: {
    id: string;
    title: string;
    contextLabel?: string;
    due?: Date | null;
  }
): Task {
  const now = new Date();
  const due = params.due ?? null;
  const overdue = !!due && due.getTime() < now.getTime();
  return {
    id: params.id,
    title: params.title,
    metadata: {
      contextLabel: params.contextLabel,
      dueDateFormatted: due ? formatDueDate(due) : undefined,
      dueAt: due ? due.getTime() : undefined,
      overdue,
    },
  };
}

