import { Routes } from '@angular/router';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

export const routes: Routes = [
  { path: '', component: TaskBoardComponent },
  { path: 'task/:id', component: TaskDetailsComponent }
];
