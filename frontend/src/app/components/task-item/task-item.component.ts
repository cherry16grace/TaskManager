import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task: any;
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<void>();

  deleting = false;

  constructor(private taskService: TaskService) {}

  edit() {
    this.onEdit.emit(this.task._id);
  }

  delete() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleting = true;
      this.taskService.deleteTask(this.task._id).subscribe({
        next: () => {
          this.onDelete.emit();
        },
        error: () => {
          this.deleting = false;
        }
      });
    }
  }

  // ✅ FIXED - Now accepts Event
  updateStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.taskService.updateTask(this.task._id, { ...this.task, status }).subscribe();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'To-do': '#ff9800',
      'In Progress': '#2196f3',
      'Completed': '#4caf50'
    };
    return colors[status] || '#999';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'Low': '#4caf50',
      'Medium': '#ff9800',
      'High': '#f44336'
    };
    return colors[priority] || '#999';
  }
}