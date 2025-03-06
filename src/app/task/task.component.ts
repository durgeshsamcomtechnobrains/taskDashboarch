import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ITask } from '../interface/ITask';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  priorityClass: string = '';
  sanitizedDescription!: SafeHtml;
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.priorityClass = this.getPriorityClass(this.task.priority);
      this.sanitizedDescription = this.sanitizeHtml(this.task.description);
    }
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'low';
      case 'Medium':
        return 'medium';
      case 'High':
        return 'high';
      default:
        return '';
    }
  }

  openDrawer() {
    this.edit.emit(this.task.id);
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/task', this.task.id]);
  }

  onDelete() {
    this.delete.emit(this.task.id);
  }
}
