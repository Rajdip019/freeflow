import { IReviewImageData } from "./ReviewImageData";

export interface IWorkspace {
  id?: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  subscription: "free" | "basic" | "pro";
  storageUsed: number;
  createdAt: number;
  isCompleted: boolean;
  // collaborators will be a sub-collection
  // collaborators?: IUserInWorkspace[];
  // designs will be a collection called design, path -> workspace/workspace_id/design
}

export interface IUserInWorkspace {
  id: string;
  role: "owner" | "admin" | "editor" | "viewer";
  name: string;
  email: string;
  imageURL?: string;
  inviteTime: number;
  status?: "Pending" | "Accepted";
}
