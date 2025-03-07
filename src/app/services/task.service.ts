import { Injectable } from '@angular/core';
import { ITask } from '../interface/ITask';
import { IStatus } from '../interface/IStatus';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRegisterUser } from '../interface/IRegisterUser';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksapiUrl = 'http://localhost:3000/tasks';
  private statusapiUrl = 'http://localhost:3000/statuses';
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getTasks1(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.tasksapiUrl);
  }

  getTaskById(taskId: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.tasksapiUrl}/${taskId}`);
  }

  // Fetch all status
  getStatuses(): Observable<IStatus[]> {
    return this.http.get<IStatus[]>(this.statusapiUrl);
  }

  updateTask1(task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.tasksapiUrl}/${task.id}`, task, this.httpOptions);
  }

  createTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.tasksapiUrl, task, this.httpOptions);
  }

  registerUser(user: IRegisterUser): Observable<IRegisterUser> {
    return this.http.post<IRegisterUser>(this.apiUrl, user, this.httpOptions);
  }

  getUsers(): Observable<IRegisterUser[]> {
    return this.http.get<IRegisterUser[]>(this.apiUrl);
  }

}
