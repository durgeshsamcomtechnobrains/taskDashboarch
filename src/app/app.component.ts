import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskBoardComponent } from "./task-board/task-board.component";
import { TaskBoard2Component } from './test2/task-board2/task-board2.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskBoardComponent,TaskBoard2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Task Dashboarch';
}
