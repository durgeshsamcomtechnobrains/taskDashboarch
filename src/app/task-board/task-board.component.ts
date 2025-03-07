import { Component, inject, OnInit } from '@angular/core';
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
import { IStatus } from '../interface/IStatus';
import { Router } from '@angular/router';

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
  statusTasksMap: { [key: string]: ITask[] } = {};
  tasks2: ITask[] = [];
  statuses2: IStatus[] = [];
  private router = inject(Router);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.initializeListingUI()
  }

  initializeListingUI() {
    this.loadTasks();
    this.loadStatus();
    this.loadColumnOrder();
  }

  loadTasks(): void {
    this.taskService.getTasks1().subscribe((data) => {
      this.tasks2 = data;
      this.updateStatusTasksMap();
    });
  }

  loadStatus(): void {
    this.taskService.getStatuses().subscribe((data) => {
      this.statuses2 = data;
      this.updateStatusTasksMap();
    });
  }

  addTask() {
    if (this.newTaskTitle && this.newTaskPriority) {
      const newTask: any = {
        id: (this.tasks2.length + 1).toString(),
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        priority: this.newTaskPriority,
        status: typeof this.selectedStatus === 'object'
        ? (this.selectedStatus as IStatus).name as ITask['status']
        : this.selectedStatus as ITask['status'],
      };
      this.taskService.createTask(newTask).subscribe((createdTask) => {
        createdTask.id = createdTask.id;
        this.tasks2.push(createdTask);
        this.initializeListingUI();
        this.closeTaskDrawer();
      });
    } else {
      alert('Please enter task title and priority.');
    }
  }

  registerUser(): void {
    this.router.navigate(['/register']);
  }

  updateStatusTasksMap() {
    this.statusTasksMap = {};
    this.statuses2.forEach(status => {
      this.statusTasksMap[status.name] = this.tasks2.filter(task => task.status === status.name);
    });
  }

  trackByTaskId(index: number, task: ITask): number {
    return task.id;
  }

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
      const taskToDuplicate = this.tasks2.find(task => task.id === this.editingTaskId);
      if (taskToDuplicate) {
        const newTask: ITask = {
          ...taskToDuplicate,
          id: this.tasks2.length + 1,
        };
        this.tasks2.push(newTask);
      }
      this.updateStatusTasksMap();
    }
  }

  closeTaskDrawer() {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = null;
    this.isDrawerOpen = false;
  }

  onColumnDrop(event: CdkDragDrop<ITask['status'][]>) {
    moveItemInArray(this.statuses2, event.previousIndex, event.currentIndex);
    this.saveColumnOrder();
  }

  saveColumnOrder() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('columnOrder', JSON.stringify(this.statuses2));
    }
  }

  loadColumnOrder() {
    if (typeof localStorage !== 'undefined') {
      const savedOrder = localStorage.getItem('columnOrder');
      if (savedOrder) {
        this.statuses2 = JSON.parse(savedOrder);
      }
    }
  }


  editingTaskId: number | null = null;

  onEditTask(taskId: number) {
    const taskToEdit = this.tasks2.find((task) => task.id === taskId);
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
    this.tasks2 = this.tasks2.filter(task => task.id !== taskId);
    this.updateStatusTasksMap();
  }

  onDrop(event: CdkDragDrop<ITask[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      movedTask.status = newStatus as ITask['status'];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.updateStatusTasksMap();
    }
  }
  addColumn() {
    const newColumnName = prompt('Enter column name:');
    if (newColumnName) {
      if (!this.statuses2.some(s => s.name == newColumnName)) {
        this.statuses2.push({ id:null, name: newColumnName});
      } else {
        alert('This column already exists!');
      }
    }
  }

  // addTask() {
  //   if (this.newTaskTitle && this.newTaskPriority) {
  //     if (this.editingTaskId !== null) {
  //       const taskIndex = this.tasks2.findIndex(task => task.id === this.editingTaskId);
  //       if (taskIndex !== -1) {
  //         this.tasks2[taskIndex] = {
  //           id: this.editingTaskId,
  //           title: this.newTaskTitle,
  //           description: this.newTaskDescription,
  //           priority: this.newTaskPriority,
  //           status: this.selectedStatus,
  //         };
  //       }
  //       this.editingTaskId = null;
  //     } else {
  //       this.tasks2.push({
  //         id: this.tasks2.length + 1,
  //         title: this.newTaskTitle,
  //         description: this.newTaskDescription,
  //         priority: this.newTaskPriority,
  //         status: this.selectedStatus,
  //       });
  //     }

  //     this.newTaskTitle = '';
  //     this.newTaskDescription = '';
  //     this.newTaskPriority = null;
  //     this.isDrawerOpen = false;
  //     this.updateStatusTasksMap();
  //   } else {
  //     alert('Please enter task title and priority.');
  //   }
  // }
}
