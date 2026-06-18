import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: any[], searchTerm: string, statusFilter: string): any[] {
    if (!tasks) return [];

    let filtered = tasks;

    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }
}