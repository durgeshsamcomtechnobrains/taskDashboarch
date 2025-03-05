import { Component, OnInit } from '@angular/core';
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
import { TaskService } from '../services/task.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskComponent,
    DragDropModule,
    MatIconModule,
    AngularEditorModule,
    HttpClientModule
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
  isDrawerOpen = false;
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskPriority: ITask['priority'] | null = null;
  selectedStatus: ITask['status'] = 'To Do';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadColumnOrder();
    this.tasks = this.taskService.getTasks();
  }

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

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '100px',
    placeholder: 'Task Description',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['subscript', 'superscript']],
  };

  openTaskDrawer(status: string) {
    this.selectedStatus = status as ITask['status'];
    this.isDrawerOpen = true;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = null;
    this.editingTaskId = null;
  }

  DuplicateTask() {
    if (this.editingTaskId !== null) {
      const taskToDuplicate = this.tasks.find(task => task.id === this.editingTaskId);
      if (taskToDuplicate) {
        const newTask: ITask = {
          ...taskToDuplicate,
          id: this.tasks.length + 1,
        };
        this.tasks.push(newTask);
      }
    }
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

  onColumnDrop(event: CdkDragDrop<ITask['status'][]>) {
    moveItemInArray(this.statuses, event.previousIndex, event.currentIndex);
    this.saveColumnOrder();
  }

  saveColumnOrder() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('columnOrder', JSON.stringify(this.statuses));
    }
  }

  loadColumnOrder() {
    if (typeof localStorage !== 'undefined') {
      const savedOrder = localStorage.getItem('columnOrder');
      if (savedOrder) {
        this.statuses = JSON.parse(savedOrder);
      }
    }
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
