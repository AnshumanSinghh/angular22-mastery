import { Injectable, signal } from "@angular/core";

/**
 * No providedIn here on purpose. This gets provided in the route config
 * itself (Module 6), so Angular creates one instance per active
 * /projects/:id route and destroys it on navigation away — the opposite
 * lifetime from NotificationStore above.
 */
@Injectable()
export class ProjectContext{
    readonly activeProjectId = signal<string | null>(null);
}