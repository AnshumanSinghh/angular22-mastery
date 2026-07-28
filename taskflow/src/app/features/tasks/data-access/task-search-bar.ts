import { Component, Inject, signal } from "@angular/core";
import { TaskCard } from "../../../shared/components/task-card/task-card";
import { TaskSearchService } from "./task-search";
import { Task, TaskStatus } from "../../../shared/models/task";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, switchMap } from "rxjs";

@Component({
    selector: 'app-task-search-bar',
    imports: [TaskCard],
    templateUrl: '../ui/task-search-bar.html',
})

export class TaskSearchBar{
    private readonly searchService = Inject(TaskSearchService);

    readonly query = signal('');
    readonly statusFilter = signal<TaskStatus | 'all'>('all');

    /**
   * toObservable() converts a SIGNAL into an RxJS stream.
   *
   * WHY: signals have no time-based operators — there's no "wait 300ms
   * after the last write" built into signal() itself. That's what RxJS
   * is for, so we temporarily leave the signal world, do the
   * timing-sensitive work in RxJS, then come back.
   *
   * PITFALL: like effect() and viewChild(), this must run inside an
   * injection context — a component field initializer qualifies, but
   * calling it later inside a method would throw at runtime.
   */
    private readonly query$ = toObservable(this.query);
    private readonly statusFilter$ = toObservable(this.statusFilter);

    /**
     * .pipe(...) chains operators left to right, each transforming the
     * stream before it reaches the next:
     *
     * debounceTime(300)      -> wait for 300ms of silence after the last
     *                           keystroke before letting a value through.
     *                           Without this, every keystroke = a search.
     * distinctUntilChanged() -> skip if the new value equals the last one
     *                           (e.g. typed then deleted back to the same text).
     * switchMap(query => ...) -> for each debounced query, start a NEW
     *                           search. "Switch" means: if a previous
     *                           search is still in flight (our mock 400ms
     *                           delay) and a newer query arrives, the OLD
     *                           one is cancelled — this is exactly what
     *                           stops a slow, stale response from
     *                           overwriting a fresher one.
     */
    private readonly searchResults$ = this.query$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query): Observable<Task[]> => this.searchService.search(query)),
    );

    /**
   * combineLatest([a$, b$]) waits for BOTH streams to have emitted at
   * least once, then re-runs the combiner every time EITHER emits again,
   * always using the latest value from both.
   *
   * WHY here: search results and the status filter change independently
   * (typing vs. picking a dropdown) but the displayed list must react to
   * BOTH — combineLatest is "recompute using whatever's newest from each."
   */
    private readonly filteredResults$ = combineLatest([this.searchResults$, this.statusFilter$]).pipe(
        map(([tasks, status]) => (status === 'all' ? tasks : tasks.filter((t) => t.status === status))),
    );

    /**
   * toSignal() converts the stream back into a signal, so the template
   * reads it exactly like everything else — results() — no async pipe.
   *
   * PITFALL: an Observable has no value until it first emits, but a
   * signal must always be able to return SOMETHING synchronously.
   * initialValue: [] fills that gap before the first result arrives.
   * toSignal also unsubscribes automatically on component destroy —
   * unlike the manual subscription pattern coming up next.
   */
    readonly results = toSignal(this.filteredResults$, { initialValue: [] as Task[] });
    onInput(value: string): void {
        this.query.set(value);
    }
}