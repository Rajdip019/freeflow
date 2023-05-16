export interface IThread {
  id: string;
  top: number;
  left: number;
  imageDimension: {
    height: number;
    width: number;
  };
  name: string;
  initialComment: string;
  timeStamp: number;
  color: string;
  version: number;
}

export interface INewThread {
  pos: {
    top: number;
    left: number;
  };
  comment: {
    name: string;
    value: string;
  };
  color: string;
  isHidden: boolean;
}
