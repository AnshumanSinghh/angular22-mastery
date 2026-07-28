import { Component, inject, signal } from "@angular/core";
import { TaskEventBus } from "../../../core/services/task-event-bus";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


@Component({
    selector: 'app-recent-activity-panel',
    imports: [],
    templateUrl: './recent-activity-panel.html',
})

export class RecentActivityPanel {
    private readonly eventBus = inject(TaskEventBus);
    readonly activity = signal<string[]>([]);

    constructor() {
        /**
         * Manual .subscribe() — unlike toSignal() (auto-cleanup), a manual
         * subscription runs FOREVER unless explicitly stopped. If this
         * component is destroyed (user navigates away) while still
         * subscribed, the callback keeps firing on a component that no
         * longer exists — a real memory leak.
         *
         * takeUntilDestroyed() auto-unsubscribes when this component is
         * destroyed. It reads the current injection context implicitly,
         * which is why this also must be called inside the constructor —
         * same injection-context rule as effect().
         *
         * WHY manual subscribe() instead of toSignal() here: we're
         * appending to a growing history list, not just replacing a single
         * latest value — toSignal's replace-on-emit isn't the right shape
         * for accumulating history.
         */
        this.eventBus.activityLog$.pipe(takeUntilDestroyed()).subscribe((entry) => {
            this.activity.update((list) => [entry, ...list].slice(0, 5));
        });
    }
}