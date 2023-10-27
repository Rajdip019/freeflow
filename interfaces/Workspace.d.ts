import { IReviewImageData } from "./ReviewImageData";
import { IUserWorkspace } from "./User";

export interface IWorkspace {
  name: string;
  description?: string;
  avatarUrl?: string;
  collaborators: IUserWorkspace[];
  subscription: "free" | "pro" | "team" | "enterprise";
  storageUsed: number;
  createdAt: number;
  isCompleted: boolean;
  // designs will be a collection called design, path -> workspace/workspace_id/design
}
