import { Component, input } from "@angular/core";
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
}