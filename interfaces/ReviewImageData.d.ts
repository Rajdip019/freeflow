export interface IReviewImage {
  id: string;
  imageName: string;
  imageDescription?: string;
  latestImageURL: string;
  latestVersion: number;
  totalSize: number;
  lastUpdated: number;
  createdAt: number;
  newUpdate:
    | "New Comment"
    | "New Thread"
    | "Uploaded"
    | "New Version Uploaded"
    | "Version Deleted";
}

export interface IReviewImageVersion {
  id: string;
  version: number;
  imageURL: string;
  timeStamp: number;
  uploadedBy: string;
  uploadedByEmail: string;
  uploadedById?: string;
  size: number;
  threads?: number;
  imagePath: string;
}
