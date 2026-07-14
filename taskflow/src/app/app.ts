import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './features/tasks/ui/task-list';
import { Task } from './shared/models/task';

@Component({
  selector: 'app-root',
  //imports: [RouterOutlet],
  imports: [TaskList], // swap RouterOutlet for TaskList, temporarily
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('taskflow');

  // Hardcoded sample data just so you can see TaskCard/TaskList render.
  // This goes away in Module 7 when real data comes from an API.
  protected readonly sampleTasks: Task[] = [
    { id: '1', title: 'Set up TaskFlow repo', status: 'done' },
    { id: '2', title: 'Build TaskCard component', status: 'in-progress', assignee: 'You' },
    { id: '3', title: 'Wire up routing', status: 'todo' },
  ];
}
