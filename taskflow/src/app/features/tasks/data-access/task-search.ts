import { Injectable } from "@angular/core";
import { Task } from "../../../shared/models/task";
import { delay, Observable, of } from "rxjs";

/** Mock search — Module 7 swaps the internals for a real HttpClient call. */
@Injectable({ providedIn: 'root' })
export class TaskSearchService { 
    private readonly allTasks: Task[] = [
        { id: '1', title: 'Set up TaskFlow repo', status: 'done' },
        { id: '2', title: 'Build TaskCard component', status: 'in-progress', assignee: 'You' },
        { id: '3', title: 'Wire up routing', status: 'todo' },
        { id: '4', title: 'Add search bar', status: 'todo' },
        { id: '5', title: 'Fix overdue badge styling', status: 'blocked', assignee: 'You' },
    ];
    
    /**
     * of(value) creates an Observable that immediately emits `value`, then
     * completes. .pipe(delay(400)) artificially waits 400ms before emitting
     * — so we can actually SEE switchMap cancel a slow, stale search below,
     * instead of it finishing too fast for the cancellation to matter.
     *
     * WHY an Observable and not a Promise: switchMap (below) can CANCEL an
     * in-flight Observable when a newer one starts. A Promise, once
     * started, cannot be cancelled — this is the real reason Angular's
     * HTTP layer and search-as-you-type patterns lean on Observables.
     */
    search(query: string): Observable<Task[]> {
        const results = this.allTasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
        return of(results).pipe(delay(400));
    }
}