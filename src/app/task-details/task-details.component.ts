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
  previewType: 'video' | 'image' | 'file' | 'video-thumbnail' | null = null;
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
    this.task.description = this.task.description
      .replace(/<br\/><strong>Attached Images:<\/strong>.*?<\/ul>/s, '')
      .replace(/<br\/><strong>Attached Videos:<\/strong>.*?<\/ul>/s, '')
      .replace(/<br\/><strong>Attached Files:<\/strong>.*?<\/ul>/s, '');

    if (!this.task.attachments || this.task.attachments.length === 0) return;

    const imageFiles = this.task.attachments.filter(file => file.type?.startsWith('image/'));
    const videoFiles = this.task.attachments.filter(file => file.type?.startsWith('video/'));
    const otherFiles = this.task.attachments.filter(file => !file.type?.startsWith('image/') && !file.type?.startsWith('video/'));

    let updatedDescription = this.task.description;

    if (imageFiles.length > 0) {
      const imageList = imageFiles.map(file => `<li>${file.name}</li>`).join('');
      updatedDescription += `<br/><strong>Attached Images:</strong><ul>${imageList}</ul>`;
    }

    if (videoFiles.length > 0) {
      const videoList = videoFiles.map(file => `<li>${file.name}</li>`).join('');
      updatedDescription += `<br/><strong>Attached Videos:</strong><ul>${videoList}</ul>`;
    }

    if (otherFiles.length > 0) {
      const fileList = otherFiles.map(file => `<li>${file.name}</li>`).join('');
      updatedDescription += `<br/><strong>Attached Files:</strong><ul>${fileList}</ul>`;
    }
    this.task.description = updatedDescription;
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
      this.previewType = 'image';
    } else if (file.type.startsWith('video/')) {
      this.generateVideoThumbnail(file);
    } else {
      this.previewUrl = null;
      this.previewType = 'file';
    }
  }

  generateVideoThumbnail(file: File) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.autoplay = false;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      video.currentTime = 1;
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth / 2 || 160;
      canvas.height = video.videoHeight / 2 || 90;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.previewUrl = canvas.toDataURL('image/png');
        this.previewType = 'video-thumbnail';
      }

      URL.revokeObjectURL(video.src);
    });

    video.load();
  }

  hidePreview() {
    this.previewUrl = null;
    this.previewType = null;
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
