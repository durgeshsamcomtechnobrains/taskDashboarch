import { Injectable } from '@angular/core';
import { ITask } from '../interface/ITask';
import { IStatus } from '../interface/IStatus';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksUrl = 'assets/tasks.json';
  private statusesUrl = 'assets/statuses.json';
  private tasks: ITask[] = [];
  private istatus: IStatus[] = [];

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.tasksUrl);
  }

  getStatuses(): Observable<IStatus[]> {
    return this.http.get<IStatus[]>(this.statusesUrl);
  }

  // updateTask(updatedTask: ITask): Observable<ITask> {
  //   const index = this.tasks.findIndex(task => task.id === updatedTask.id);
  //   if (index !== -1) {
  //     this.tasks[index] = updatedTask;
  //   }
  //   return of(updatedTask);
  // }
}
