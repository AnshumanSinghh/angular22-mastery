import { InjectionToken } from '@angular/core';
import { Task } from '../../shared/models/task';

export interface TaskStatusValidator{
    readonly name: string;
    /** Returns an error message, or null if the task passes this rule. */
    validate(task: Task): string | null;
}

/** multi: true -> every provider registered here gets collected into one array. */
export const TASK_STATUS_VALIDATORS = new InjectionToken<TaskStatusValidator[]>("TASK_STATUS_VALIDATORS");