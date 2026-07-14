import { Component, input, computed } from '@angular/core';
import { Task } from '../../models/task';

@Component({
    selector: 'app-task-card',
    imports: [],
    templateUrl: './task-card.html',
    styleUrl: './task-card.scss',
})

export class TaskCard{
    /** Required — a card with no task behind it doesn't mean anything.
     * 
     * input() and input.required() functions automatically create a Signal. 
     */
    readonly task = input.required<Task>();

    /**
   * Derived state, not stored state. Recomputes only when `task` changes,
   * never on unrelated re-renders — that's the whole point of computed().
   */
    readonly isOverdue = computed(() => {
        // reading Signal task ==> `task()`
        const t = this.task();

        return !!t.dueDate && t.dueDate < new Date() && t.status !== 'done';
    })
}