import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { TASK_STATUS_VALIDATORS, TaskStatusValidator } from './core/tokens/task-status-validators';
import { TASKFLOW_CONFIG } from './core/config/taskflow-config';

const blockedNeedsAssignee: TaskStatusValidator = {
  name: 'blocked-requires-assignee',
  validate: (t) => (t.status === 'blocked' && !t.assignee ? 'Blocked tasks must have an assignee' : null),
};

const doneBeforeDueDate: TaskStatusValidator = {
  name: 'done-before-due-date',
  validate: (t) => (t.status === 'done' && !!t.dueDate && t.dueDate > new Date() ? 'Marked done before its due date' : null),
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: TASKFLOW_CONFIG, useValue: { maxTasksPerPage: 25, overdueDaysThreshold: 0 } },
    { provide: TASK_STATUS_VALIDATORS, useValue: blockedNeedsAssignee, multi: true },
    { provide: TASK_STATUS_VALIDATORS, useValue: doneBeforeDueDate, multi: true },
  ]
};
