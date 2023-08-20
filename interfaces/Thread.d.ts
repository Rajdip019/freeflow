export interface IReview {
  id: string;
  name: string;
  initialComment: string;
  timeStamp: number;
  version: number;
  imageURL: string;
}

export interface INewComment {
  name: string;
  value: string;
}
