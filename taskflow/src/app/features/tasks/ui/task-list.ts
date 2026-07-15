import { Component, ElementRef, input, viewChild } from "@angular/core";
import { TaskCard } from "../../../shared/components/task-card/task-card";
import { Task } from "../../../shared/models/task";

@Component({
    selector: 'app-task-list',
    imports: [TaskCard],
    templateUrl: './task-list.html',
})
export class TaskList{
    /** Parent-owned data for now — becomes a resource() straight from the API in Module 7. */
    readonly tasks = input<Task[]>([]);

   /**
   * viewChild() creates a SIGNAL that holds a reference to an element
   * tagged in the template with a matching template reference variable
   * (see #listContainer in task-list.html — that's what the string
   * 'listContainer' below is pointing at).
   *
   * WHY a signal instead of a plain property: the element doesn't exist
   * yet when this class is first constructed — Angular hasn't rendered
   * the template. A signal lets this stay "empty" (undefined) until
   * rendering happens, then automatically becomes available once it does.
   *
   * PITFALL: don't assume this always has a value. If you read it too
   * early (e.g. in the constructor, before the template renders), it
   * returns undefined — which is exactly why scrollToTop() below uses
   * a safety check instead of assuming it's always there. 
   * 
   * 
   * Pitfall worth internalizing: this only finds elements declared
   * directly in THIS component's own template — not elements inside
   * a @for loop, because each loop iteration is its own separate
   * embedded view. If you needed a reference to every TaskCard
   * instance rendered by the loop, you'd reach for viewChildren()
   * instead, which does understand repeated views. Here we're just
   * targeting the single, static container — so viewChild() is correct.
   */
    private readonly listContainer = viewChild<ElementRef<HTMLElement>>('listContainer');
    // 💡 CONCEPT: Signal-based View Query (viewChild)
    // WHAT: Finds the template element tagged `#listContainer` and wraps it in a typed `ElementRef`.
    // WHY & LOGIC: Returns a read-only (`private readonly`) Signal. `ElementRef<HTMLElement>` is the type 
    // you get back once you unwrap it; `ElementRef` wraps the real DOM element while `HTMLElement` tells 
    // TypeScript it is a generic HTML element. Call it as a function `this.listContainer()` to read the value.

    
    /**
     * Smoothly scrolls the task list container back to the top.
     *
     * this.listContainer()  -> calling the signal like a function reads
     *                           its current value (this is how ALL signals
     *                           are read, not just viewChild's).
     * ?.                     -> "optional chaining": if the signal's value
     *                           is undefined, stop here and do nothing,
     *                           instead of crashing the app.
     * .nativeElement         -> unwraps Angular's ElementRef wrapper to get
     *                           the real, plain browser DOM element.
     * .scrollIntoView(...)   -> a normal built-in browser method, nothing
     *                           Angular-specific — { behavior: 'smooth' }
     *                           just animates the scroll instead of jumping.
     */
    scrollToTop(): void{
        this.listContainer()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
}