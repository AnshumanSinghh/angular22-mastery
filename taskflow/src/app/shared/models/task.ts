/**
 * The lifecycle states a task moves through. A union, not an enum —
 * keeps it a plain string at runtime, which is what the API will send.
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';

/** Core task shape used across the app. Pitfall: keep this in sync with the API DTO once M7 wires up HTTP. */
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Date;
  assignee?: string;
}