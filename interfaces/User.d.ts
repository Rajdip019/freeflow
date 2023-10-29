export interface IUser {
  name: string;
  email: string;
  imageURL?: string;
  createTime: number;
  linkedIn?: string;
  twitter?: string;
  // workspaces will be a sub-collection
  // workspaces?: IWorkspaceInUser[];
}

export interface IWorkspaceInUser {
  id: string;
  role: "owner" | "admin" | "editor" | "viewer";
  name: string;
  avatarUrl?: string;
}
