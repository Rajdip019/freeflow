export interface IReviewImageData {
    id? : string;
    imageName: string;
    imageURL: string;
    timeStamp: number;
    uploadedBy: string;
    uploadedById? : string;
    size? : number,
    views? : number,
    threads? : number
  }