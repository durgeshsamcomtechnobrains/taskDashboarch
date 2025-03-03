export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'To Do' | 'In Progress' | 'Paused' | 'Done';
}
