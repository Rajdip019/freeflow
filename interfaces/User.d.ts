export interface IUser {
  name: string;
  email: string;
  imageURL?: string;
  createTime: number;
  linkedIn?: string;
  twitter?: string;
  workspaces: IUserWorkspace[];
}

export interface IUserWorkspace {
  id: string;
  role: "owner" | "admin" | "editor" | "viewer";
}
