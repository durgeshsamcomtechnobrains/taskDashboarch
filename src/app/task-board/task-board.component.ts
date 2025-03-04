import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from '../task/task.component';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITask } from '../interface/ITask';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskComponent, DragDropModule, MatIconModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent {
  isDrawerOpen = false;
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskPriority: ITask['priority'] | null = null;
  selectedStatus: ITask['status'] = 'To Do';
  statuses: ITask['status'][] = [ 'Backlog','To Do','In Progress','Paused','Done',];
  tasks: ITask[] = [
    {
      id: 1,
      title: 'Task Management Dashboard',
      description: 'Build UI for task board',
      priority: 'High',
      status: 'To Do',
    },
    {
      id: 2,
      title: 'Fix API Integration',
      description: 'Resolve API errors',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Add Sorting & Filtering',
      description: 'Implement sorting & filters',
      priority: 'Low',
      status: 'Backlog',
    },
  ];

  openTaskDrawer(status: string) {
    this.selectedStatus = status as ITask['status'];
    this.isDrawerOpen = true;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = null;
    this.editingTaskId = null;
  }

  closeTaskDrawer() {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = null;
    this.isDrawerOpen = false;
  }

  getTasksByStatus(status: string): ITask[] {
    return this.tasks.filter((task) => task.status === status);
  }

  editingTaskId: number | null = null;

  onEditTask(taskId: number) {
    const taskToEdit = this.tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      this.editingTaskId = taskToEdit.id;
      this.newTaskTitle = taskToEdit.title;
      this.newTaskDescription = taskToEdit.description;
      this.newTaskPriority = taskToEdit.priority;
      this.selectedStatus = taskToEdit.status;
      this.isDrawerOpen = true;
    }
  }

  onDeleteTask(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

    onDrop(event: CdkDragDrop<ITask[]>, newStatus: ITask['status']) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      movedTask.status = newStatus;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  addColumn() {
    const newColumnName = prompt('Enter column name:');
    if (newColumnName) {
      if (!this.statuses.includes(newColumnName as ITask['status'])) {
        this.statuses.push(newColumnName as ITask['status']);
      } else {
        alert('This column already exists!');
      }
    }
  }

  addTask() {
    if (this.newTaskTitle && this.newTaskPriority) {
      if (this.editingTaskId !== null) {
        const taskIndex = this.tasks.findIndex(
          (task) => task.id === this.editingTaskId
        );
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = {
            id: this.editingTaskId,
            title: this.newTaskTitle,
            description: this.newTaskDescription,
            priority: this.newTaskPriority,
            status: this.selectedStatus,
          };
        }
        this.editingTaskId = null;
      } else {
        this.tasks.push({
          id: this.tasks.length + 1,
          title: this.newTaskTitle,
          description: this.newTaskDescription,
          priority: this.newTaskPriority,
          status: this.selectedStatus,
        });
      }

      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.newTaskPriority = null;
      this.isDrawerOpen = false;
    } else {
      alert('Please enter task title and priority.');
    }
  }
}
