import { INewThread, IThread } from "@/interfaces/Thread";

export const defaultHighlightedThread: IThread = {
  id: "",
  imageDimension: { height: 0, width: 0 },
  top: 0,
  left: 0,
  initialComment: "",
  timeStamp: 0,
  name: "",
  color: "",
};

export const defaultNewThread : INewThread = {
  pos: {
    top: 0,
    left: 0,
  },
  comment: {
    name: "",
    value: "",
  },
  color: "gray-900",
  isHidden: true,
};
