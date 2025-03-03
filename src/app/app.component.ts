import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskBoardComponent } from "./task-board/task-board.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Task Dashboarch';
}
