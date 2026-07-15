import { Component, input, computed, inject, effect } from '@angular/core';
import { Task } from '../../models/task';
import { NotificationStore } from '../../../core/services/notification-store';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';
import { OverdueHighlight } from '../../directives/overdue-highlight';

@Component({
    selector: 'app-task-card',
    imports: [RelativeDatePipe, OverdueHighlight],
    templateUrl: './task-card.html',
    styleUrl: './task-card.scss',
})

export class TaskCard{
    private readonly notifications = inject(NotificationStore);

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

    /**
     * Beginner note: effect() must be created inside an "injection
     * context" — the constructor is the safe place. Calling effect()
     * later, e.g. inside a click handler, throws at runtime unless you
     * pass an explicit Injector. Cleanup is automatic: when this
     * component is destroyed, Angular tears the effect down too —
     * no manual ngOnDestroy needed for this.
     */
    constructor() {
        effect(() => {
            if (this.isOverdue()) {
                this.notifications.push(`"${this.task().title}" is overdue`)
            }
        });
    }
}