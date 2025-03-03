import { Component } from '@angular/core';
import { ITask } from '../interface/ITask';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    DragDropModule,
    HttpClientModule
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  statuses: string[] = ['Backlog', 'To Do', 'In Progress', 'Paused', 'Done'];

  tasks: ITask[] = [
    { id: 1, title: 'Task Management Dashboard', description: 'Build UI for task board', priority: 'High', status: 'To Do' },
    { id: 2, title: 'Fix API Integration', description: 'Resolve API errors', priority: 'Medium', status: 'In Progress' },
    { id: 3, title: 'Add Sorting & Filtering', description: 'Implement sorting & filters', priority: 'Low', status: 'Backlog' }
  ];

  getTasksByStatus(status: string): ITask[] {
    return this.tasks.filter(task => task.status === status);
  }

  onEditTask(taskId: number) {
    console.log('Edit Task:', taskId);
  }

  onDeleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  onDrop(event: CdkDragDrop<ITask[]>, newStatus: string) {
    console.log('event: ', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      movedTask.status = newStatus as ITask['status'];
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
