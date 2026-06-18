import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() editingTaskId: string | null = null;
  @Output() onTaskCreated = new EventEmitter<void>();
  @Output() onTaskUpdated = new EventEmitter<void>();
  @Output() onFormClosed = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit() {
    this.initForm();
    if (this.editingTaskId) {
      this.loadTask();
    }
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['Medium'],
      dueDate: [''],
      status: ['To-do']
    });
  }

  loadTask() {
    const tasks = this.taskService.getTasksSnapshot();
    const task = tasks.find(t => t._id === this.editingTaskId);
    if (task) {
      this.form.patchValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const formData = {
      ...this.form.value,
      dueDate: this.form.value.dueDate ? new Date(this.form.value.dueDate) : null
    };

    const request = this.editingTaskId
      ? this.taskService.updateTask(this.editingTaskId, formData)
      : this.taskService.createTask(formData);

    request.subscribe({
      next: () => {
        if (this.editingTaskId) {
          this.onTaskUpdated.emit();
        } else {
          this.onTaskCreated.emit();
        }
      },
      error: (err) => {
        this.error = err.error.message || 'An error occurred';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.onFormClosed.emit();
  }
}