import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { Subject } from "rxjs/internal/Subject";

@Injectable({providedIn:'root'})
export class TaskEventBus{
    /**
     * Subject: a short-lived "a task was just created" pulse, used to
     * trigger a one-off UI animation. PITFALL: if nothing is subscribed
     * at the exact moment .next() fires, that event is lost forever —
     * fine here (a missed animation is harmless), but would be a real
     * bug for anything the app depends on reliably receiving.
     */
    // 1. SUBJECT = LIVE RADIO 📻
    // Holds NO memory. If a component isn't listening the exact millisecond 
    // .next() fires, it misses the event completely. Best for: One-off UI actions/animations.
    private readonly taskCreatedSource = new Subject<string>();

    // .asObservable() exposes a READ-ONLY stream — consumers can subscribe
    // but can't call .next() themselves, since that stays private on
    // *Source. Same boundary idea as .asReadonly() on signals (Module 4).
    readonly taskCreated$ = this.taskCreatedSource.asObservable();


    /**
   * BehaviorSubject: "which task is currently selected." Needs an
   * initial value (null = nothing selected) because, unlike Subject,
   * anyone subscribing must get a value IMMEDIATELY, even before any
   * selection has ever happened.
   */
    // 2. BEHAVIORSUBJECT = DIGITAL CLOCK ⏱️
    // Always holds ONE current value. Requires an initial default value. 
    // Late subscribers instantly get the most recent value. Best for: Current app state (e.g., selected item).
    private readonly selectTaskIdSource = new BehaviorSubject<string | null>(null);
    readonly selectedTaskId$ = this.selectTaskIdSource.asObservable();


    /**
   * ReplaySubject(5): an in-memory "recent activity" feed. A panel
   * opened well after the app started should still see the last 5
   * events — exactly what plain Subject could NOT give us.
   */
    // 3. REPLAYSUBJECT = DVR / SECURITY CAMERA 📹
    // Holds a HISTORY of past values (e.g., last 5 events). 
    // Late subscribers instantly get a playback of that history. Best for: Activity logs / audit trails.
    private readonly activityLogSource = new ReplaySubject<string>(5);
    readonly activityLog$ = this.activityLogSource.asObservable();

    notifyTaskCreated(taskId: string): void {
        this.taskCreatedSource.next(taskId);
        this.activityLogSource.next(`TaskId: ${taskId} created.`)
    }

    selectTask(taskId: string | null): void {
        this.selectTaskIdSource.next(taskId);
    }
}