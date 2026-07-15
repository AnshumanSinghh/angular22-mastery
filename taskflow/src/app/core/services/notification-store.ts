import { Injectable, signal } from "@angular/core";

export interface AppNotification {
    id: string;
    message: string;
    createdAt: Date
}

/**
 * providedIn: 'root' -> exactly one instance, app-wide. This is the
 * "core/ = one, forever" example from earlier, now real: any feature
 * can inject and read this, but features never import each other
 * directly — they only share through core.
 */
@Injectable({ providedIn: 'root' })
export class NotificationStore{
    private readonly _notifications = signal<AppNotification[]>([]);
    readonly notifications = this._notifications.asReadonly();

    push(message: string): void {
        this._notifications.update((list) => [...list, {id: crypto.randomUUID(), message, createdAt: new Date() }])
    }

    dismiss(id: string): void {
        this._notifications.update((list) => list.filter((n) => n.id != id));
    }
}
