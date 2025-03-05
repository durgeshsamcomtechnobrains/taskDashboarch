import { Injectable } from '@angular/core';
import { ITask } from '../interface/ITask';
import { IStatus } from '../interface/IStatus';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSource = new BehaviorSubject<ITask[]>([
    {
      id: 1,
      title: 'Task Management Dashboard',
      description: 'Build UI for task board',
      priority: 'High',
      status: 'To Do',
    },
    {
      id: 2,
      title: 'Fix API Integration',
      description: 'Resolve API errors',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Add Sorting & Filtering',
      description: 'Implement sorting & filters',
      priority: 'Low',
      status: 'Backlog',
    },
  ]);

  tasks$ = this.tasksSource.asObservable();

  constructor() {}

  getTasks(): ITask[] {
    return this.tasksSource.getValue();
  }

  getTaskById(taskId: number): ITask | undefined {
    return this.getTasks().find(task => task.id === taskId);
  }

  updateTasks(newTasks: ITask[]) {
    this.tasksSource.next(newTasks);
  }
}
