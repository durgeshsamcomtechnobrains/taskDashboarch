import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/task.service';
import { ITask } from '../interface/ITask';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    AngularEditorModule
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {

  task: ITask | undefined;
  isEditing: boolean = false;

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '100px',
    placeholder: 'Enter task description...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['strikeThrough', 'subscript', 'superscript']]
  };


  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['Backlog', 'To Do', 'In Progress', 'Paused', 'Done'];

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const taskId = Number(params.get('id'));
      this.task = this.taskService.getTaskById(taskId);
    });
  }

  toggleEditMode() {
    this.isEditing = true;
  }

  saveChanges() {
    if (this.task) {
      this.taskService.updateTasks([...this.taskService.getTasks()]);
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }
}
