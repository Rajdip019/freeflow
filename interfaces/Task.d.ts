export interface ITaskData {
  uid: string;
  title: string;
  description?: string;
  status: undefined | "In Progress" | "To Do" | "Done" | "Cancelled";
  assignee?: string;
  dueDate?: string;
  attachment?: string;
  createdAt: number;
}
