import { Injectable } from "@angular/core";
import { delay, forkJoin, Observable, of } from "rxjs";

export interface DashboardSummary {
    totalTasks: number;
    overdueCount: number;
    activeProjects: number;
}

/**
 * forkJoin runs multiple Observables in PARALLEL (same concurrency as
 * mergeMap) but waits for ALL of them to complete, then emits ONE
 * combined result containing everything together.
 *
 * WHY here over three separate subscriptions: the dashboard needs all
 * three numbers before it can render anything meaningful — a
 * half-loaded dashboard (2 of 3 stats) isn't useful, so "load the
 * dashboard" is treated as one unit of work.
 *
 * PITFALL: if even ONE source errors, forkJoin immediately errors too
 * and NONE of the results come through — one bad source takes down
 * the whole combined result.
 */
@Injectable({providedIn: 'root'})
export class DashboardSummaryService {
    private totalTasks(): Observable<number> { return of(42).pipe(delay(200)) }
    private overdueCount(): Observable<number> { return of(5).pipe(delay(350)); }
    private activeProjects(): Observable<number> { return of(7).pipe(delay(150)); }

    loadSummary(): Observable<DashboardSummary> {
        return forkJoin({
            totalTasks: this.totalTasks(),
            overdueCount: this.overdueCount(),
            activeProjects: this.activeProjects(),
        });
    }
}