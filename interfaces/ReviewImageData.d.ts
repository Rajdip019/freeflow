export interface IReviewImageData {
  id: string;
  imageName: string;
  imageDescription?: string;
  imageURL: string[];
  timeStamp: number;
  uploadedBy: string;
  uploadedByEmail: string;
  uploadedById?: string;
  size?: number;
  views?: number;
  threads?: number;
  lastUpdated: number;
  newUpdate: "New Comment" | "New Thread" | "Uploaded" | "New Version Uploaded";
  sentEmailInvites?: string[];
  isPrivate: boolean;
  currentVersion: number;
  imagePath: string[];
  // Nested Firestore documents in /reviewImages/{id}/private
  private?: {
    password?: string;
  };
}
