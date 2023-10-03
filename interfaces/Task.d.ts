export interface ITaskData {
  task_id?: string;
  uid: string;
  title: string;
  description?: string;
  status: undefined | "In Progress" | "To Do" | "Done" | "Cancelled";
  assignee?: string;
  dueDate?: string;
  attachment?: string;
  createdAt: number;
}
