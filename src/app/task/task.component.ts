import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITask } from '../interface/ITask';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: ITask;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  getPriorityClass(priority: string) {
    return {
      'low': priority === 'Low',
      'medium': priority === 'Medium',
      'high': priority === 'High'
    };
  }

  onEdit() {
    this.edit.emit(this.task.id);
  }

  onDelete() {
    this.delete.emit(this.task.id);
  }
}
