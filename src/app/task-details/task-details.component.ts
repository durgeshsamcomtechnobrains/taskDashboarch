import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/task.service';
import { ITask } from '../interface/ITask';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    AngularEditorModule,
    MatFormFieldModule
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {

  task: ITask | undefined;
  isEditing: boolean = false;
  previewUrl: string | null = null;
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '100px',
    placeholder: 'Enter task description...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['strikeThrough', 'subscript', 'superscript']],
    sanitize: false,
    customClasses: [
      {
        name: 'custom-image',
        class: 'custom-img',
        tag: 'img'
      }
    ]
  };


  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['Backlog', 'To Do', 'In Progress', 'Paused', 'Done'];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

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
    this.router.navigate(['',]);
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updateDescriptionWithAttachments() {
    if (!this.task || !this.task.description) return;
    this.task.description = this.task.description.replace(/<br\/><strong>Attached Images:<\/strong>.*<\/ul>/s, '');
    if (!this.task.attachments || this.task.attachments.length === 0) return;
    const imageFiles = this.task.attachments.filter(file => file.type?.startsWith('image/'));
    if (imageFiles.length > 0) {
      const imageList = imageFiles.map(file => `<li>${file.name}</li>`).join('');
      this.task.description += `<br/><strong>Attached Images:</strong><ul>${imageList}</ul>`;
    }
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (this.task) {
      this.task.attachments = [...(this.task.attachments || []), ...files];
      this.updateDescriptionWithAttachments();
    }
  }

  removeAttachment(fileToRemove: File) {
    if (this.task) {
      this.task.attachments = this.task.attachments?.filter(file => file !== fileToRemove);
      this.updateDescriptionWithAttachments();
    }
  }

  showPreview(file: File) {
    if (file.type.startsWith('image/')) {
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  hidePreview() {
    this.previewUrl = null;
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  openFile(file: File, event: Event) {
    event.preventDefault();
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }
}
