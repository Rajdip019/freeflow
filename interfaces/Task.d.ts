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
  activity: IActivity[];
}

export interface IActivity {
  type:
    | "comment"
    | "description"
    | "title"
    | "attachment"
    | "status"
    | "Due Date";
  user: string;
  userImageUrl: string;
  createdAt: string;
  message: string;
}
