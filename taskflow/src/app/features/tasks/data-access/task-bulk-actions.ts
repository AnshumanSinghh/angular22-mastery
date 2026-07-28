import { Injectable } from "@angular/core";
import { concatMap, delay, exhaustMap, from, mergeMap, Observable, ObservableLike, of } from "rxjs";
import { Task } from "../../../shared/models/task";

/**
 * Three "map to a new Observable per item" operators — what actually
 * distinguishes them is their CONCURRENCY rule, not just their names:
 *
 * mergeMap   -> runs ALL inner Observables in PARALLEL, results arrive
 *               in whatever order they finish. Use when order doesn't
 *               matter and speed does.
 * concatMap  -> runs inner Observables ONE AT A TIME, strictly in
 *               order — the next doesn't even start until the previous
 *               finishes. Use when sequencing matters.
 * exhaustMap -> IGNORES new emissions entirely while one is already in
 *               flight. Use for "prevent a duplicate action while one
 *               is already running," e.g. stopping a double-click.
 */
@Injectable({ providedIn: 'root' })
export class TaskBulkAction{

    private deleteOne(taskId: string): Observable<string> {
        return of(taskId).pipe(delay(300)); // mock "API call"
    }

    private saveOne(task: Task): Observable<Task> {
        return of(task).pipe(delay(600));
    }

    /** mergeMap: load detail for several selected tasks at once — order genuinely doesn't matter. */
    loadDetailsForSelected(taskIds: string[]): Observable<string> {
        return from(taskIds).pipe(mergeMap((id) => this.deleteOne(id)));
    }

    /**
   * concatMap: delete tasks strictly one after another. WHY not
   * mergeMap: if a real backend processes deletes out of order, a UI
   * showing "deleting task 3 of 5" would desync from reality —
   * sequencing here is a correctness requirement, not just style.
   */
    deleteSequentially(taskIds: string[]): Observable<string>{
        return from(taskIds).pipe(concatMap((id) => this.deleteOne(id)));
    }

    /**
   * exhaustMap: guards a Save button. If save() fires again while the
   * previous save is still in flight, exhaustMap silently drops the
   * second trigger instead of firing an overlapping request. PITFALL:
   * this only protects this exact stream from rapid re-triggers — it's
   * not a substitute for also disabling the button visually.
   */
    saveGuarded(task$: Observable<Task>): Observable<Task> {
        return task$.pipe(exhaustMap((task) => this.saveOne(task)));
    }
}