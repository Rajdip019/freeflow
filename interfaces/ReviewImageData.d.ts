export interface IReviewImageData {
  id: string;
  imageName: string;
  imageURL: string;
  timeStamp: number;
  uploadedBy: string;
  uploadedByEmail: string;
  uploadedById?: string;
  size?: number;
  views?: number;
  threads?: number;
  lastUpdated: number;
  newUpdate: "New Comment" | "New Thread" | "Uploaded";
  sentEmailInvites?: string[];
  isPrivate: boolean;
  // Nested Firestore documents in /reviewImages/{id}/private
  private?: {
    password?: string;
  };
}
