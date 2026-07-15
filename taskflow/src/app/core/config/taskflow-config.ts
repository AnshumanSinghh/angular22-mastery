import { InjectionToken } from '@angular/core';

/**
 * Beginner note: there's no class here to attach `providedIn: 'root'`
 * to — TASKFLOW_CONFIG is just a plain object shape. InjectionToken
 * gives that plain value a unique identity the injector can resolve,
 * the same way a class name normally serves as its own identity.
 */
export interface TaskFlowConfig{
    readonly maxTasksPerPage: number;
    readonly overdueDaysThreshold: number;
}

export const TASKFLOW_CONFIG = new InjectionToken<TaskFlowConfig>('TASKFLOW_CONFIG');