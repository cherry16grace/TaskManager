import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks$ = this.taskService.tasks$;
  user: any;
  searchTerm = '';
  statusFilter = 'All';
  showForm = false;
  editingTaskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.searchTerm, this.statusFilter === 'All' ? '' : this.statusFilter)
      .subscribe({
        error: (err) => {
          if (err.status === 401) {
            this.logout();
          }
        }
      });
  }

onSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.searchTerm = value;
  this.loadTasks();
}

  onFilterChange(status: string) {
    this.statusFilter = status;
    this.loadTasks();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingTaskId = null;
  }

  onTaskCreated() {
    this.showForm = false;
    this.loadTasks();
  }

  onEditTask(id: string) {
    this.editingTaskId = id;
    this.showForm = true;
  }

  onTaskUpdated() {
    this.showForm = false;
    this.editingTaskId = null;
    this.loadTasks();
  }

  onTaskDeleted() {
    this.loadTasks();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTaskStats() {
    const tasks = this.taskService.getTasksSnapshot();
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'To-do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length
    };
  }
}