import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';
  private tasksSubject = new BehaviorSubject<any[]>(this.getStoredTasks());
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTasks(search?: string, status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      tap(tasks => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.tasksSubject.next(tasks);
      })
    );
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task).pipe(
      tap(newTask => {
        const tasks = this.tasksSubject.value;
        this.tasksSubject.next([newTask, ...tasks]);
        localStorage.setItem('tasks', JSON.stringify(this.tasksSubject.value));
      })
    );
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => {
        const tasks = this.tasksSubject.value.map(t => t._id === id ? updatedTask : t);
        this.tasksSubject.next(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      })
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const tasks = this.tasksSubject.value.filter(t => t._id !== id);
        this.tasksSubject.next(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      })
    );
  }

  private getStoredTasks(): any[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  getTasksSnapshot(): any[] {
    return this.tasksSubject.value;
  }
}